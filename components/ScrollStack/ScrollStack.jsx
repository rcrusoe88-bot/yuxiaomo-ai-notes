'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  smoothScroll = true,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const lenisRafRef = useRef(null);
  const scrollRafRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const cardTopsRef = useRef([]);
  const endTopRef = useRef(0);
  const lastTransformsRef = useRef(new Map());

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller.scrollTop,
        containerHeight: scroller.clientHeight,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  // 在一次布局快照中测量所有卡片的文档绝对位置，之后滚动帧只读缓存，
  // 绝不在每帧调用 getBoundingClientRect() 触发同步布局。
  // 用 offsetTop 链路计算布局位置（不受 transform 影响），避免 measure 在卡片
  // 已被动画位移后再触发时把 translateY 算进缓存，导致切换跳动。
  const computeTop = useCallback(el => {
    let top = el.offsetTop;
    let parent = el.offsetParent;
    while (parent) {
      top += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return top;
  }, []);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = cardsRef.current;
    if (!cards.length) return;

    cards.forEach((card, i) => {
      cardTopsRef.current[i] = computeTop(card);
    });
    const end = scroller.querySelector('.scroll-stack-end');
    endTopRef.current = end ? computeTop(end) : 0;
  }, [computeTop]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = endTopRef.current;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardTopsRef.current[i];
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jTriggerStart = cardTopsRef.current[j] - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) {
          blur = Math.max(0, (topCardIndex - i) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : 'none';
        if (card.style.transform !== transform) card.style.transform = transform;
        if (card.style.webkitTransform !== transform) card.style.webkitTransform = transform;
        if (card.style.filter !== filter) card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData
  ]);

  // rAF 节流：同一帧内多次 scroll 事件只合并成一次更新。
  const scheduleUpdate = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  const handleScroll = useCallback(() => {
    scheduleUpdate();
  }, [scheduleUpdate]);

  const setupLenis = useCallback(() => {
    if (!smoothScroll) return undefined;

    let lenis;
    if (useWindowScroll) {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        lenisRafRef.current = requestAnimationFrame(raf);
      };
      lenisRafRef.current = requestAnimationFrame(raf);
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertia: 0.6
      });

      lenis.on('scroll', handleScroll);

      const raf = time => {
        lenis.raf(time);
        lenisRafRef.current = requestAnimationFrame(raf);
      };
      lenisRafRef.current = requestAnimationFrame(raf);
    }

    lenisRef.current = lenis;
    return lenis;
  }, [handleScroll, useWindowScroll, smoothScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    cardTopsRef.current = new Array(cards.length).fill(0);
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    // 原生滚动（窗口或容器、未开启平滑）统一走 rAF 调度。
    let nativeCleanup;
    if (useWindowScroll && !smoothScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      nativeCleanup = () => window.removeEventListener('scroll', handleScroll);
    } else if (!useWindowScroll && !smoothScroll && scroller) {
      scroller.addEventListener('scroll', handleScroll, { passive: true });
      nativeCleanup = () => scroller.removeEventListener('scroll', handleScroll);
    }

    // 初始测量 + 布局就绪后先应用一次。
    measure();
    updateCardTransforms();

    // 尺寸变化（图片加载、断点、内容增减）会改变卡片绝对位置，需要重测缓存。
    let resizeCleanup;
    if (useWindowScroll) {
      const onResize = () => {
        measure();
        updateCardTransforms();
      };
      window.addEventListener('resize', onResize);
      resizeCleanup = () => window.removeEventListener('resize', onResize);
    }

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measure();
        updateCardTransforms();
      });
      resizeObserver.observe(scroller.querySelector('.scroll-stack-inner'));
      cards.forEach(card => resizeObserver.observe(card));
    }

    return () => {
      if (nativeCleanup) nativeCleanup();
      if (resizeCleanup) resizeCleanup();
      if (resizeObserver) resizeObserver.disconnect();
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      if (lenisRafRef.current) {
        cancelAnimationFrame(lenisRafRef.current);
        lenisRafRef.current = null;
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardTopsRef.current = [];
      endTopRef.current = 0;
      transformsCache.clear();
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    smoothScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms,
    handleScroll,
    measure
  ]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* 最后一张卡释放干净 */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
