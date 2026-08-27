'use client';

import { useEffect, useState } from 'react';
import ParticleText from './ParticleText/ParticleText';

export const PALETTE_PREVIEWS = {  'olive-violet': {
    label: '暗龙胆紫 · 苹果绿',
    base: '#22202E',
    highlight: '#BACF65',
    accent: '#BEC936',
    paper: '#6B8E23',
    ink: '#22202E',
    blue: '#BACF65',
    lime: '#BEC936',
    yellow: '#BACF65'
  },
  'wisteria-ochre': {
    label: '姚黄 · 紫藤萝',
    base: '#D0DEAA',
    highlight: '#B8A5D2',
    accent: '#B8A5D2',
    paper: '#8076A3',
    ink: '#D0DEAA',
    blue: '#9B8AE8',
    lime: '#D0DEAA',
    yellow: '#B8A5D2'
  },
  'zi-teng-luo': {
    label: '紫藤萝 · 轻盈编辑感',
    base: '#5D3A6F',
    highlight: '#9B8AE8',
    accent: '#8A4B9C',
    blue: '#8076A3',
    yellow: '#D8B0D8'
  },
  'wei-zi': {
    label: '魏紫 · 东方浓郁感',
    base: '#411C35',
    highlight: '#C06F98',
    accent: '#7E1671',
    blue: '#8A6E8B',
    yellow: '#D8B0C8'
  },
  'dian-lan': {
    label: '靛蓝 · AI 科技感',
    base: '#1C0D1A',
    highlight: '#9B8AE8',
    accent: '#4B0082',
    blue: '#8076A3',
    yellow: '#D1B3FF'
  }
};

const DEFAULT_THEME = {
  base: '#1A1C1A',
  highlight: '#E55C45',
  accent: '#E55C45',
  blue: '#71AFE0',
  yellow: '#E7BE39'
};

function getThemeKey() {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('theme');
  return value && PALETTE_PREVIEWS[value] ? value : null;
}

export default function PalettePreview({ className, ...props }) {
  const [themeKey, setThemeKey] = useState(null);
  const theme = themeKey ? PALETTE_PREVIEWS[themeKey] : DEFAULT_THEME;

  useEffect(() => {
    const applyTheme = () => {
      const nextKey = getThemeKey();
      setThemeKey(nextKey);
      const root = document.documentElement;
      if (nextKey) {
        const selected = PALETTE_PREVIEWS[nextKey];
        root.dataset.palettePreview = nextKey;
        root.style.setProperty('--paper', selected.paper || '#f5f2e9');
        root.style.setProperty('--ink', selected.ink || '#1a1c1a');
        root.style.setProperty('--coral', selected.accent || '#e55c45');
        root.style.setProperty('--blue', selected.blue || '#71afe0');
        root.style.setProperty('--lime', selected.lime || '#d8fa48');
        root.style.setProperty('--yellow', selected.yellow || '#e7be39');
      } else {
        delete root.dataset.palettePreview;
        ['--paper', '--ink', '--coral', '--blue', '--lime', '--yellow'].forEach(name => root.style.removeProperty(name));
      }
    };

    applyTheme();
    window.addEventListener('popstate', applyTheme);
    return () => {
      window.removeEventListener('popstate', applyTheme);
      delete document.documentElement.dataset.palettePreview;
    };
  }, []);

  return (
    <ParticleText
      {...props}
      className={className}
      color={theme.base}
      highlightColor={theme.highlight}
    />
  );
}


