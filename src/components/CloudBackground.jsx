"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const BALLOON_COUNT = 40; // Optimized for mobile

function InstancedBalloons({ geometry }) {
  const meshRef = useRef();

  // Initialize instance data
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < BALLOON_COUNT; i++) {
      temp.push({
        speed: 0.005 + Math.random() * 0.015,
        rotX: (Math.random() - 0.5) * 0.008,
        rotY: (Math.random() - 0.5) * 0.012,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 180,
          (Math.random() - 0.5) * 100 + 10,
          (Math.random() - 0.5) * 80 - 10,
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ),
        scale: 0.35 + Math.random() * 0.15,
      });
    }
    return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Update data
      p.pos.x -= p.speed;
      p.pos.y += Math.sin(time + p.pos.x * 0.1) * 0.015;
      p.rotation.x += p.rotX;
      p.rotation.y += p.rotY;

      if (p.pos.x < -110) {
        p.pos.x = 110;
        p.pos.y = (Math.random() - 0.5) * 100 + 10;
      }

      // Apply to instance
      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rotation);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, BALLOON_COUNT]}>
      <meshStandardMaterial
        color="#ff2e2e"
        roughness={0.1}
        metalness={0.1}
        emissive="#ff0000"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

function InstancedBirds() {
  const meshRef = useRef();
  const BIRD_COUNT = 10;

  const birds = useMemo(() => {
    const temp = [];
    for (let i = 0; i < BIRD_COUNT; i++) {
      temp.push({
        speed: 0.04 + Math.random() * 0.1,
        wingPhase: Math.random() * Math.PI * 2,
        flapSpeed: 4 + Math.random() * 4,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 120,
          Math.random() * 60 - 10,
          -80 - Math.random() * 40,
        ),
      });
    }
    return temp;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([-0.5, 0, 0, 0, 0, 0, 0.5, 0, 0]);
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geo;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    birds.forEach((b, i) => {
      b.pos.x += b.speed;
      if (b.pos.x > 110) b.pos.x = -110;

      const flap = Math.sin(time * b.flapSpeed + b.wingPhase) * 0.2;

      // This is a simplified bird - for performance we won't animate internal geometry of instances
      // instead we use a simple rolling animation to simulate flap if needed or keep it static
      dummy.position.copy(b.pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, BIRD_COUNT]}>
      <lineBasicMaterial color="#333333" />
    </instancedMesh>
  );
}

function SceneContent() {
  const { camera } = useThree();

  const heartGeometry = useMemo(() => {
    const heartShape = new THREE.Shape();
    const x = 0,
      y = 0;
    heartShape.moveTo(x + 2.5, y + 2.5);
    heartShape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
    heartShape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    heartShape.bezierCurveTo(x - 3, y + 5.5, x - 1, y + 7.7, x + 2.5, y + 9.5);
    heartShape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 5.5, x + 8, y + 3.5);
    heartShape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    heartShape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    const extrudeSettings = {
      depth: 0.3,
      curveSegments: 16,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 1.2,
      bevelThickness: 1.2,
    };

    const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geo.center();
    geo.rotateX(Math.PI);
    geo.scale(0.45, 0.45, 0.45);
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    camera.position.x = Math.sin(time * 0.1) * 3;
    camera.lookAt(0, 5, -20);
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 8, 50]}
        fov={50}
        far={1000}
      />
      <color attach="background" args={["#FDF2F5"]} />
      <fog attach="fog" args={["#FDF2F5", 20, 200]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[40, 40, -20]} intensity={1.5} />
      <InstancedBalloons geometry={heartGeometry} />
      {/* Keeping Birds as separate components for individual geometry animation if needed, or use static lines */}
      <InstancedBirds />
    </>
  );
}

export default function CloudBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]} // Capped for performance
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
