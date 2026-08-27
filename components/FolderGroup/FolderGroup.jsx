'use client';

import { useState } from 'react';
import Folder from '../Folder/Folder';
import './FolderGroup.css';

// 一个「文件架」入口：左侧文件夹开合，右侧文字备注，
// 点击后展开该分组下的卡片为纵向排列。
export default function FolderGroup({
  color,
  index,
  title,
  note,
  meta,
  papers = [],
  children,
  defaultOpen = false
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen(prev => !prev);

  return (
    <div className={`folder-group ${open ? 'is-open' : ''}`}>
      <div
        className="folder-group__trigger"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={`folder-panel-${index}`}
        onClick={toggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <div className="folder-group__visual">
          <Folder color={color} size={1.15} items={papers} open={open} onToggle={toggle} />
        </div>
        <div className="folder-group__copy">
          <p className="folder-group__eyebrow">
            <span style={{ background: color }} />{index} · {title}
          </p>
          <h3 className="folder-group__note">{note}</h3>
          <span className="folder-group__meta">{meta} · 点按展开</span>
        </div>
        <i className="folder-group__chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </i>
      </div>

      <div className="folder-group__panel" id={`folder-panel-${index}`}>
        <div className="folder-group__inner">{children}</div>
      </div>
    </div>
  );
}
