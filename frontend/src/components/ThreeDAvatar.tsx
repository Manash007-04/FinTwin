"use client";

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarMood } from '../types';

function Model({ url, mood }: { url: string; mood: AvatarMood }) {
    const { scene } = useGLTF(url);
    const group = useRef<THREE.Group>(null);

    // Apply some mood-based visuals
    useFrame((state) => {
        if (!group.current) return;

        // Idle movement
        const t = state.clock.getElapsedTime();
        if (mood === 'stressed') {
            group.current.rotation.y = Math.sin(t * 10) * 0.05; // Shaking
        } else if (mood === 'happy') {
            group.current.position.y = Math.sin(t * 2) * 0.1; // Bouncing
        }
    });

    return <primitive ref={group} object={scene} scale={2} position={[0, -2, 0]} />;
}

export default function ThreeDAvatar({ mood }: { mood: AvatarMood }) {
    const modelUrl = "https://models.readyplayer.me/698b25c3378169941779439b.glb";

    const moodColors = {
        happy: "#94A378",     // Sage (Positive)
        stressed: "#D1855C",  // Terracotta (Warning)
        tired: "#2D3C59",     // Deep Navy (Tired/Dark)
        neutral: "#E5BA41"    // Gold (Default/Active)
    };

    return (
        <div className="w-64 h-64 relative group cursor-grab active:cursor-grabbing">
            {/* Glow behind 3D model */}
            <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-1000"
                style={{ backgroundColor: moodColors[mood] }}
            />

            <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color={moodColors[mood]} />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Suspense fallback={null}>
                            <Model url={modelUrl} mood={mood} />
                        </Suspense>
                    </Float>
                </PresentationControls>

                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                <Environment preset="city" />
            </Canvas>

            {/* Emotion Indicator Overlay */}
            <div className="absolute bottom-2 right-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-ftp-primary border border-white/20 shadow-sm uppercase tracking-tighter pointer-events-none">
                3D STATUS: {mood}
            </div>
        </div>
    );
}
