"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sparkles, ZoomIn, ZoomOut, RefreshCw, Check } from "lucide-react";

export type ShirtCustomizerState = {
  fabric: "silk" | "oxford" | "wool" | "linen" | "velvet";
  collar: "camp" | "spread" | "mandarin" | "classic";
  colorHex: string;
  colorName: string;
  monogram: string;
  buttons: "pearl" | "horn" | "gold" | "matte";
};

type Shirt3DViewerProps = {
  customization: ShirtCustomizerState;
  onCustomizationChange?: (updated: Partial<ShirtCustomizerState>) => void;
};

export function Shirt3DViewer({
  customization,
  onCustomizationChange,
}: Shirt3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const shirtGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const collarMeshRef = useRef<THREE.Mesh | null>(null);
  const buttonsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121110);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 4.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd1, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcfd8dc, 2.0);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 2.5);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Shirt Group
    const shirtGroup = new THREE.Group();
    shirtGroupRef.current = shirtGroup;
    scene.add(shirtGroup);

    // 1. Torso / Shirt Body Mesh
    const bodyGeometry = new THREE.CylinderGeometry(0.9, 1.05, 2.2, 32);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(customization.colorHex),
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xffffff),
    });
    bodyMaterialRef.current = bodyMaterial;

    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = -0.2;
    shirtGroup.add(bodyMesh);

    // 2. Shoulders & Sleeves
    const leftSleeveGeo = new THREE.CylinderGeometry(0.32, 0.28, 1.5, 24);
    const leftSleeve = new THREE.Mesh(leftSleeveGeo, bodyMaterial);
    leftSleeve.position.set(-1.15, 0.25, 0);
    leftSleeve.rotation.z = Math.PI / 5.5;
    shirtGroup.add(leftSleeve);

    const rightSleeveGeo = new THREE.CylinderGeometry(0.32, 0.28, 1.5, 24);
    const rightSleeve = new THREE.Mesh(rightSleeveGeo, bodyMaterial);
    rightSleeve.position.set(1.15, 0.25, 0);
    rightSleeve.rotation.z = -Math.PI / 5.5;
    shirtGroup.add(rightSleeve);

    // 3. Collar Mesh
    const collarGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 40, Math.PI * 1.8);
    const collarMesh = new THREE.Mesh(collarGeo, bodyMaterial);
    collarMesh.position.set(0, 0.95, 0.05);
    collarMesh.rotation.x = Math.PI / 2.3;
    collarMeshRef.current = collarMesh;
    shirtGroup.add(collarMesh);

    // 4. Center Placket & Mother-of-Pearl Buttons
    const placketGeo = new THREE.BoxGeometry(0.16, 2.0, 0.04);
    const placketMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(customization.colorHex),
      roughness: 0.4,
    });
    const placket = new THREE.Mesh(placketGeo, placketMat);
    placket.position.set(0, -0.15, 0.98);
    shirtGroup.add(placket);

    const buttonsGroup = new THREE.Group();
    buttonsGroupRef.current = buttonsGroup;
    shirtGroup.add(buttonsGroup);

    const buttonGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.02, 16);
    const buttonMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbfbfb,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
    });

    for (let i = 0; i < 5; i++) {
      const btn = new THREE.Mesh(buttonGeo, buttonMat);
      btn.position.set(0, 0.6 - i * 0.38, 1.01);
      btn.rotation.x = Math.PI / 2;
      buttonsGroup.add(btn);
    }

    // 5. Studio Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.1, 40);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1f1d1b,
      roughness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.5;
    scene.add(pedestal);

    // Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isDragging || !shirtGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      shirtGroupRef.current.rotation.y += deltaX * 0.01;
      shirtGroupRef.current.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    // Wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(
        2.5,
        Math.min(7.0, cameraRef.current.position.z + e.deltaY * 0.004),
      );
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging && shirtGroupRef.current) {
        shirtGroupRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      collarGeo.dispose();
      placketGeo.dispose();
      placketMat.dispose();
      buttonGeo.dispose();
      buttonMat.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
    };
  }, []);

  // Update material on customization change
  useEffect(() => {
    if (!bodyMaterialRef.current) return;
    const mat = bodyMaterialRef.current;
    mat.color.set(customization.colorHex);

    if (customization.fabric === "silk") {
      mat.roughness = 0.18;
      mat.metalness = 0.1;
      mat.clearcoat = 0.7;
      mat.sheen = 1.0;
      mat.sheenRoughness = 0.2;
    } else if (customization.fabric === "oxford") {
      mat.roughness = 0.65;
      mat.metalness = 0.0;
      mat.clearcoat = 0.0;
      mat.sheen = 0.2;
    } else if (customization.fabric === "wool") {
      mat.roughness = 0.85;
      mat.metalness = 0.0;
      mat.clearcoat = 0.0;
      mat.sheen = 0.5;
    } else if (customization.fabric === "linen") {
      mat.roughness = 0.75;
      mat.metalness = 0.02;
      mat.clearcoat = 0.1;
      mat.sheen = 0.15;
    } else if (customization.fabric === "velvet") {
      mat.roughness = 0.45;
      mat.metalness = 0.15;
      mat.clearcoat = 0.3;
      mat.sheen = 1.2;
      mat.sheenRoughness = 0.5;
    }
  }, [customization]);

  const resetView = () => {
    if (cameraRef.current) cameraRef.current.position.set(0, 0, 4.6);
    if (shirtGroupRef.current) shirtGroupRef.current.rotation.set(0, 0, 0);
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.5, cameraRef.current.position.z - 0.5);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(7.0, cameraRef.current.position.z + 0.5);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#121110] text-white">
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="h-[360px] w-full cursor-grab active:cursor-grabbing sm:h-[460px]"
      />

      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-black/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
          3D Bespoke Shirt Atelier · {customization.fabric.toUpperCase()}
        </span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur-md">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset Camera"
          className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Bar Auto-spin toggle */}
      <div className="flex items-center justify-between border-t border-white/10 bg-black/60 px-5 py-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-white/60">Color:</span>
          <span className="font-semibold text-white">{customization.colorName}</span>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
            autoRotate
              ? "border border-amber-400/50 bg-amber-400/20 text-amber-300"
              : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <RotateCw className={`h-3 w-3 ${autoRotate ? "animate-spin" : ""}`} />
          Auto Rotate 360°
        </button>
      </div>
    </div>
  );
}
