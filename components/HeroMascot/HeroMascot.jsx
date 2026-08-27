'use client';
import { useEffect, useRef, useState } from 'react';
import './HeroMascot.css';

const DEFAULT_ASPECT = 1536 / 1024;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// 在浏览器端实时抠除绿幕和浅色背景，让 MP4 人物自然融入页面背景。
const removeBackground = (context, width, height) => {
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;
  const total = width * height;
  const isTransparent = index => pixels[index + 3] === 0;
  const isGreen = index => {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    return green > 70 && green - Math.max(red, blue) > 18;
  };

  // 先去掉绿幕，并顺手压低人物边缘的绿色溢色。
  for (let index = 0; index < pixels.length; index += 4) {
    if (!isGreen(index)) continue;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const strength = clamp((green - Math.max(red, blue) - 18) / 72, 0, 1);
    pixels[index + 3] = Math.round(pixels[index + 3] * (1 - strength));
    pixels[index + 1] = Math.min(green, Math.round((red + blue) / 2 + 30));
  }

  // 从画面边缘向内 flood fill，只透明化与外边相连的浅色中性背景。
  // 这样能去掉视频自带的白色外框和浅色内框，同时尽量保留人物身上的白色细节。
  const visited = new Uint8Array(total);
  const stack = [];
  const isLightBackground = pixel => {
    const index = pixel * 4;
    if (isTransparent(index)) return false;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const luminance = (red + green + blue) / 3;
    return luminance > 178 && max - min < 58;
  };
  const add = pixel => {
    if (pixel < 0 || pixel >= total || visited[pixel] || !isLightBackground(pixel)) return;
    visited[pixel] = 1;
    stack.push(pixel);
  };

  for (let x = 0; x < width; x += 1) {
    add(x);
    add((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y += 1) {
    add(y * width);
    add(y * width + width - 1);
  }

  while (stack.length) {
    const pixel = stack.pop();
    const index = pixel * 4;
    pixels[index + 3] = 0;
    const x = pixel % width;
    if (x > 0) add(pixel - 1);
    if (x < width - 1) add(pixel + 1);
    if (pixel >= width) add(pixel - width);
    if (pixel < total - width) add(pixel + width);
  }

  context.putImageData(frame, 0, 0);
};

export default function HeroMascot({ src, poster, className = '' }) {
  // 首帧固定 false（SSR/CSR 一致），真实值在 effect 中按视口宽度计算。
  const [isMobile, setIsMobile] = useState(false);
  const [aspect, setAspect] = useState(DEFAULT_ASPECT);
  const [pos, setPos] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: true });
    let stopped = false;
    let started = false;
    let animationFrame;
    let videoFrame;

    const draw = () => {
      if (stopped) return;
      if (video.videoWidth && video.videoHeight && video.readyState >= 2) {
        // 人物实际显示宽度只有 ~220px（retina 取 2x），440 已足够清晰；
        // 更小的画布能显著降低每帧 getImageData + flood fill 的成本。
        const renderWidth = Math.min(video.videoWidth, 440);
        const renderHeight = Math.round(renderWidth * video.videoHeight / video.videoWidth);
        if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
          canvas.width = renderWidth;
          canvas.height = renderHeight;
          setAspect(video.videoHeight / video.videoWidth);
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        removeBackground(context, canvas.width, canvas.height);
      }

      if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
        videoFrame = video.requestVideoFrameCallback(draw);
      } else {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const start = () => {
      // loadedmetadata 与 canplay 可能先后到达，只允许启动一条绘制链。
      if (started) return;
      started = true;
      if (video.videoWidth && video.videoHeight) {
        setAspect(video.videoHeight / video.videoWidth);
      }
      video.play().catch(() => undefined);
      draw();
    };

    video.addEventListener('loadedmetadata', start);
    video.addEventListener('canplay', start, { once: true });
    if (video.readyState >= 1) start();

    return () => {
      stopped = true;
      video.removeEventListener('loadedmetadata', start);
      video.removeEventListener('canplay', start);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (videoFrame && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(videoFrame);
    };
  }, [src]);

  // 把视频人物锚到右下角 caption 文字正上方，并适当放大突出人物。
  useEffect(() => {
    const wrap = wrapRef.current;
    const parent = wrap?.closest('.hero-caption');
    if (!wrap || !parent) return undefined;

    const apply = () => {
      const vu = window.innerWidth;
      const pRect = parent.getBoundingClientRect();
      const mascotW = isMobile
        ? clamp(vu * 0.28, 88, 130)
        : clamp(vu * 0.115, 160, 220);
      const mascotH = mascotW * aspect;
      const centerX = pRect.width * 0.5;
      const overlap = mascotH * 0.1;
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
  }, [aspect, isMobile]);

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
      <video
        ref={videoRef}
        className="hero-mascot__source"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
      />
      <canvas ref={canvasRef} className="hero-mascot__canvas" />
    </div>
  );
}
