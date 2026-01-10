'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const HologramGlobe = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const outerMeshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
        if (outerMeshRef.current) {
            outerMeshRef.current.rotation.y -= 0.002;
            outerMeshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
        }
    });

    return (
        <group>
            {/* Core Sphere */}
            <Sphere args={[1.8, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#00C2D9"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            {/* Outer Glow Sphere */}
            <Sphere args={[2.2, 32, 32]} ref={outerMeshRef}>
                <meshStandardMaterial
                    color="#8A2BE2"
                    wireframe
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </Sphere>

            {/* Particles around */}
            <points>
                <sphereGeometry args={[3, 64, 64]} />
                <pointsMaterial
                    color="#1E90FF"
                    size={0.02}
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                />
            </points>

            {/* Ambient Light */}
            <ambientLight intensity={0.5} />

            {/* Directional Light */}
            <directionalLight position={[10, 10, 5]} intensity={1} color="#00C2D9" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8A2BE2" />
        </group>
    );
};
