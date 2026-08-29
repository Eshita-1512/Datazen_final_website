import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function getBrainRadius(phi: number, theta: number) {
  let r = 1.0;
  
  // 1. Elongate front-to-back (Z-axis). 
  // theta=PI/2 is +Z (front), theta=3PI/2 is -Z (back)
  r *= 1.0 + 0.35 * Math.pow(Math.sin(theta), 2);

  // 2. Flatten the bottom
  if (phi > Math.PI / 2) {
    r *= 1.0 - 0.4 * Math.pow(Math.cos(phi), 2);
  }

  // 3. Longitudinal fissure (split left and right hemispheres)
  // Left/Right is the X axis. X is 0 when cos(theta) = 0.
  const distToFissure = Math.abs(Math.cos(theta)); 
  r -= 0.2 * Math.exp(-distToFissure * 15);

  // 4. Cerebellum (bulge at bottom back)
  // Back is -Z (theta = 3PI/2), bottom is phi = 3PI/4
  const bx = 0;
  const by = Math.cos(3*Math.PI/4); 
  const bz = Math.sin(3*Math.PI/4) * Math.sin(3*Math.PI/2);
  
  const px = Math.sin(phi) * Math.cos(theta);
  const py = Math.cos(phi);
  const pz = Math.sin(phi) * Math.sin(theta);
  
  const distToCerebellum = Math.sqrt((px-bx)**2 + (py-by)**2 + (pz-bz)**2);
  if (distToCerebellum < 0.6) {
    r += 0.1 * (1 - distToCerebellum/0.6);
  }

  // 5. Brainstem
  const distToStem = Math.sqrt((px-0)**2 + (pz - -0.3)**2); 
  if (phi > Math.PI - 0.5 && distToStem < 0.3) {
    r += 0.4 * (1 - distToStem/0.3);
  }

  // 6. Surface folds (Gyri and Sulci)
  const folds = 0.04 * Math.sin(phi * 22) * Math.sin(theta * 22) + 
                0.02 * Math.sin(phi * 35) * Math.cos(theta * 35);
  r += folds;

  return r;
}

export default function Brain3D() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const { positions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    
    // Decreased dot count to 600 as requested
    for (let i = 0; i < 600; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1); 

      const r = getBrainRadius(phi, theta);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      pts.push(new THREE.Vector3(x, y, z));
    }

    const lines: number[] = [];
    // Connect nodes to form a continuous neural network structure
    for (let i = 0; i < pts.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < pts.length; j++) {
        const dist = pts[i].distanceTo(pts[j]);
        // Tighter connection radius since the brain is a parametric surface
        if (dist < 0.35 && connections < 4) {
          lines.push(pts[i].x, pts[i].y, pts[i].z);
          lines.push(pts[j].x, pts[j].y, pts[j].z);
          connections++;
        }
      }
    }

    const positionsArray = new Float32Array(pts.length * 3);
    for(let i = 0; i < pts.length; i++) {
      positionsArray[i*3] = pts[i].x;
      positionsArray[i*3+1] = pts[i].y;
      positionsArray[i*3+2] = pts[i].z;
    }

    return { 
      positions: positionsArray, 
      linePositions: new Float32Array(lines) 
    };
  }, []);

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Much more pronounced mouse movement tracking
      targetRotation.current.y = (pointer.x * Math.PI) / 1.5; 
      targetRotation.current.x = (-pointer.y * Math.PI) / 2; 

      groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * delta * 5;
      groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * delta * 5;
      
      // Floating effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
  });

  return (
    // Scaled for a perfect size in the viewport
    <group ref={groupRef} scale={[1.5, 1.5, 1.5]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.03} 
          color="#4a0505" 
          transparent 
          opacity={0.8} 
          sizeAttenuation 
          blending={THREE.AdditiveBlending} 
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#3a0505" 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending} 
        />
      </lineSegments>
    </group>
  )
}
