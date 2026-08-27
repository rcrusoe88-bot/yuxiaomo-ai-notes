/* eslint-disable react/no-unknown-property */
'use client';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './HeroMascot.css';

// 图片宽高比（高 / 宽），用于在 3D 平面里不拉伸地还原坐姿人物。
const IMG_ASPECT = 1536 / 1024;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function MascotItem({ src, animate = true }) {
  const group = useRef();
  const texture = useTexture(src);
  const mouse = useRef({ x: 0, y: 0 });

  // 画布是 pointer-events:none，无法拿到局部 pointer，因此监听 window 的指针。
  useEffect(() => {
    if (!animate) return undefined;
    const onMove = e => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [animate]);

  // 让透明贴图按 sRGB 采样，避免颜色发灰。
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g || !animate) return;
    const targetRotY = mouse.current.x * 0.22;
    const targetRotX = -mouse.current.y * 0.1;
    const t = Math.min(1, delta * 4);
    g.rotation.y += (targetRotY - g.rotation.y) * t;
    g.rotation.x += (targetRotX - g.rotation.x) * t;
  });

  const planeW = 1.6;
  const planeH = planeW * IMG_ASPECT;

  return (
    <Float
      enabled={animate}
      speed={2.2}
      rotationIntensity={animate ? 0.1 : 0}
      floatIntensity={animate ? 0.7 : 0}
      floatingRange={[-0.05, 0.09]}
    >
      <group ref={group} position={[0, 0.02, 0]}>
        <mesh>
          <planeGeometry args={[planeW, planeH]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </group>
      <ContactShadows
        position={[0, -planeH / 2 + 0.01, 0.015]}
        opacity={0.42}
        scale={3.4}
        blur={2.8}
        far={1.6}
        resolution={256}
        color="#1a1c1a"
      />
    </Float>
  );
}

export default function HeroMascot({ src, className = '' }) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [pos, setPos] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReduced = e => setReduced(e.matches);
    window.addEventListener('resize', checkMobile);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    motion?.addEventListener('change', checkReduced);
    return () => {
      window.removeEventListener('resize', checkMobile);
      motion?.removeEventListener('change', checkReduced);
    };
  }, []);

  // 把人物锚到右下角 caption 文字正上方：脚底轻压住文字顶部，像参考站宇航员坐在卡片上。
  useEffect(() => {
    const wrap = wrapRef.current;
    const parent = wrap?.closest('.hero-caption');
    if (!wrap || !parent) return undefined;

    const apply = () => {
      const vu = window.innerWidth;
      const pRect = parent.getBoundingClientRect();
      const mascotW = isMobile
        ? clamp(vu * 0.19, 58, 82)
        : clamp(vu * 0.08, 112, 150);
      const mascotH = mascotW * IMG_ASPECT;
      // 人物水平居中于 caption 文字块，脚底向文字顶部压入一点，产生“坐在上面”的错觉。
      const centerX = pRect.width * 0.5;
      const overlap = mascotH * 0.12;
      setPos({
        left: centerX - mascotW / 2 - (isMobile ? 0 : 26),
        top: overlap - mascotH,
        width: mascotW,
        height: mascotH
      });
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(parent);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, [isMobile]);

  // 外层定位 div 必须始终渲染，否则 ref 无法挂载，useEffect 也就找不到父级 caption。
  // pos 未就绪时用 visibility 隐藏，避免 0 尺寸闪烁，就绪后再套用真实定位。
  const style = pos
    ? {
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: `${pos.width}px`,
        height: `${pos.height}px`
      }
    : { visibility: 'hidden' };

  return (
    <div ref={wrapRef} className={`hero-mascot ${className}`} style={style} aria-hidden="true">
      {isMobile ? (
        <img className="hero-mascot__img" src={src} alt="" loading="eager" />
      ) : (
        <Canvas
          className="hero-mascot__canvas"
          camera={{ position: [0, 0, 4.4], fov: 32 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <MascotItem src={src} animate={!reduced} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
