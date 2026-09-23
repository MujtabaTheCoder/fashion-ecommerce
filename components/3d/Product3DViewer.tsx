"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sparkles, Box, Sun, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import type { DetailedProduct } from "@/lib/data/mockProducts";

type MaterialFinish = "gold" | "platinum" | "emerald" | "obsidian" | "pearl";

export function Product3DViewer({ product }: { product: DetailedProduct }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [materialFinish, setMaterialFinish] = useState<MaterialFinish>("gold");
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState<"studio" | "sunset" | "neon">("studio");

  const meshRef = useRef<THREE.Mesh | THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0e0d);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 5);
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

    // Lights
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    lightsGroup.add(ambient);

    const key = new THREE.DirectionalLight(0xfff3e0, 3.5);
    key.position.set(4, 5, 5);
    lightsGroup.add(key);

    const fill = new THREE.DirectionalLight(0xb0c4de, 2.0);
    fill.position.set(-4, -2, -3);
    lightsGroup.add(fill);

    const rim = new THREE.PointLight(0xffd700, 3.0, 10);
    rim.position.set(0, 3, 2);
    lightsGroup.add(rim);

    // Build 3D Geometry based on product.model3dType
    let geom: THREE.BufferGeometry;
    const type = product.model3dType;

    if (type === "ring") {
      geom = new THREE.TorusGeometry(1.2, 0.35, 40, 100);
    } else if (type === "watch") {
      geom = new THREE.CylinderGeometry(1.3, 1.3, 0.35, 64);
    } else if (type === "sunglasses") {
      geom = new THREE.TorusKnotGeometry(1.0, 0.28, 128, 32, 2, 3);
    } else if (type === "bag") {
      geom = new THREE.BoxGeometry(1.8, 1.4, 0.9, 10, 10, 10);
    } else if (type === "gem") {
      geom = new THREE.IcosahedronGeometry(1.35, 0);
    } else {
      geom = new THREE.DodecahedronGeometry(1.3, 0);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xdfb15b,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geom, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Add subtle ground pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.1, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1918,
      roughness: 0.8,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.8;
    scene.add(pedestal);

    // Pointer Drag Interaction for 360 rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isDragging || !meshRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      meshRef.current.rotation.y += deltaX * 0.01;
      meshRef.current.rotation.x += deltaY * 0.01;
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
        Math.min(8.0, cameraRef.current.position.z + e.deltaY * 0.005),
      );
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging && meshRef.current) {
        meshRef.current.rotation.y += 0.012;
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
      geom.dispose();
      material.dispose();
      pedestalGeo.dispose();
      pedestalMat.dispose();
    };
  }, [product]);

  // Update finish material
  useEffect(() => {
    if (!materialRef.current) return;
    const mat = materialRef.current;
    mat.wireframe = isWireframe;

    if (materialFinish === "gold") {
      mat.color.setHex(0xdfb15b);
      mat.metalness = 0.95;
      mat.roughness = 0.15;
      mat.transmission = 0.0;
      mat.clearcoat = 1.0;
    } else if (materialFinish === "platinum") {
      mat.color.setHex(0xd4d8de);
      mat.metalness = 0.98;
      mat.roughness = 0.1;
      mat.transmission = 0.0;
      mat.clearcoat = 1.0;
    } else if (materialFinish === "emerald") {
      mat.color.setHex(0x059669);
      mat.metalness = 0.1;
      mat.roughness = 0.05;
      mat.transmission = 0.8;
      mat.ior = 1.8;
    } else if (materialFinish === "obsidian") {
      mat.color.setHex(0x18181b);
      mat.metalness = 0.4;
      mat.roughness = 0.3;
      mat.transmission = 0.0;
      mat.clearcoat = 0.8;
    } else if (materialFinish === "pearl") {
      mat.color.setHex(0xfaf5eb);
      mat.metalness = 0.2;
      mat.roughness = 0.1;
      mat.transmission = 0.15;
      mat.clearcoat = 1.0;
    }
  }, [materialFinish, isWireframe]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
    }
    if (meshRef.current) {
      meshRef.current.rotation.set(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.5, cameraRef.current.position.z - 0.6);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(8.0, cameraRef.current.position.z + 0.6);
    }
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0e0d] text-white">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className="h-[340px] w-full cursor-grab active:cursor-grabbing sm:h-[440px]"
      />

      {/* Floating 3D Controls Overlays */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase backdrop-blur-md">
          3D Studio Studio · {product.model3dType.toUpperCase()}
        </span>
      </div>

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
          onClick={resetCamera}
          title="Reset Position"
          className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Studio Bar Controls Bottom */}
      <div className="border-t border-white/10 bg-black/70 p-4 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Material Finishes */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-wider text-white/60 uppercase">
              Finish:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: "gold", name: "18K Gold", color: "#dfb15b" },
                { id: "platinum", name: "Platinum", color: "#d4d8de" },
                { id: "emerald", name: "Emerald", color: "#059669" },
                { id: "obsidian", name: "Obsidian", color: "#18181b" },
                { id: "pearl", name: "Pearl", color: "#faf5eb" },
              ].map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setMaterialFinish(finish.id as MaterialFinish)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all ${
                    materialFinish === finish.id
                      ? "border border-amber-400 bg-amber-400/20 text-amber-200"
                      : "border border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/30"
                    style={{ backgroundColor: finish.color }}
                  />
                  <span>{finish.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                autoRotate
                  ? "border border-amber-400/50 bg-amber-400/20 text-amber-300"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? "animate-spin" : ""}`} />
              Auto Spin
            </button>

            <button
              onClick={() => setIsWireframe(!isWireframe)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors ${
                isWireframe
                  ? "border border-amber-400/50 bg-amber-400/20 text-amber-300"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              Wireframe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
