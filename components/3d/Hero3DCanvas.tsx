"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11100e, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Group for mouse interaction
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Luxury Gold Torus Knot (Sculptural Ring)
    const torusGeometry = new THREE.TorusKnotGeometry(1.6, 0.42, 180, 40, 2, 3);
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe5c158,
      emissive: 0x1a1205,
      roughness: 0.15,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });
    const torusKnot = new THREE.Mesh(torusGeometry, goldMaterial);
    mainGroup.add(torusKnot);

    // 2. Inner Gem Octahedron
    const gemGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const gemMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x042f2e,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 2.2,
      thickness: 1.2,
      transparent: true,
      opacity: 0.9,
    });
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    mainGroup.add(gem);

    // 3. Orbiting Gold Rings
    const orbitRingGeo1 = new THREE.TorusGeometry(2.8, 0.03, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf5d77f,
      metalness: 0.9,
      roughness: 0.2,
    });
    const orbitRing1 = new THREE.Mesh(orbitRingGeo1, ringMat);
    orbitRing1.rotation.x = Math.PI / 3;
    mainGroup.add(orbitRing1);

    const orbitRingGeo2 = new THREE.TorusGeometry(3.3, 0.02, 16, 100);
    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, ringMat);
    orbitRing2.rotation.y = Math.PI / 4;
    orbitRing2.rotation.x = -Math.PI / 5;
    mainGroup.add(orbitRing2);

    // 4. Floating Luxury Light Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
      particleScales[i / 3] = Math.random() * 0.06 + 0.02;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xf3dfa2,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd1, 3.5);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x50c878, 2.5);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const goldPointLight = new THREE.PointLight(0xf59e0b, 3, 15);
    goldPointLight.position.set(0, 0, 3);
    scene.add(goldPointLight);

    // Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 1.5;
      targetRotationX = y * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop with Viewport & Tab Visibility Guards
    let animationFrameId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth easing
      mouseX += (targetRotationX - mouseX) * 0.05;
      mouseY += (targetRotationY - mouseY) * 0.05;

      mainGroup.rotation.x = mouseX + Math.sin(elapsedTime * 0.4) * 0.12;
      mainGroup.rotation.y = mouseY + elapsedTime * 0.25;

      torusKnot.rotation.z = Math.cos(elapsedTime * 0.3) * 0.15;
      gem.rotation.y = -elapsedTime * 0.6;
      gem.rotation.x = elapsedTime * 0.4;

      orbitRing1.rotation.z = elapsedTime * 0.15;
      orbitRing2.rotation.z = -elapsedTime * 0.12;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting) && !document.hidden;
        if (isVisible && !animationFrameId) {
          clock.start();
          animate();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(container);

    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
        if (!animationFrameId) {
          clock.start();
          animate();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      torusGeometry.dispose();
      goldMaterial.dispose();
      gemGeometry.dispose();
      gemMaterial.dispose();
      orbitRingGeo1.dispose();
      orbitRingGeo2.dispose();
      ringMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full cursor-grab active:cursor-grabbing sm:h-[460px] lg:h-[540px]"
    >
      {/* Subtle overlay badge */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
        <span className="text-[11px] font-medium tracking-wider text-amber-200 uppercase">
          Interactive 3D Space · Move Cursor
        </span>
      </div>
    </div>
  );
}
