'use client';

import { useState } from 'react';
import Link from 'next/link';
import './PillNav.css';

const isExternalLink = href =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

const isRouterLink = href => href && !isExternalLink(href);

function InteractiveNavLink({ item, active }) {
  const className = `interactive-hover-button${active ? ' is-active' : ''}`;
  const content = (
    <>
      <span className="interactive-hover-button__default">
        <span className="interactive-hover-button__dot" aria-hidden="true" />
        <span className="interactive-hover-button__label">{item.label}</span>
      </span>
      <span className="interactive-hover-button__hover" aria-hidden="true">
        <span>{item.label}</span>
        <span className="interactive-hover-button__arrow">→</span>
      </span>
    </>
  );

  if (isRouterLink(item.href)) {
    return (
      <Link
        href={item.href}
        className={className}
        aria-current={active ? 'page' : undefined}
        aria-label={item.ariaLabel || item.label}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={item.href}
      className={className}
      aria-current={active ? 'page' : undefined}
      aria-label={item.ariaLabel || item.label}
    >
      {content}
    </a>
  );
}

export default function PillNav({ items, activeHref, className = '' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="主页导航">
        <div className="pill-nav-items desktop-only">
          <ul className="pill-list">
            {items.map(item => (
              <li key={item.href}>
                <InteractiveNavLink item={item} active={activeHref === item.href} />
              </li>
            ))}
          </ul>
        </div>

        <button
          className="mobile-menu-button mobile-only"
          type="button"
          onClick={() => setIsMobileMenuOpen(open => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-mobile-menu"
          aria-label={isMobileMenuOpen ? '收起导航菜单' : '展开导航菜单'}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div
        className={`mobile-menu-popover mobile-only${isMobileMenuOpen ? ' is-open' : ''}`}
        id="primary-mobile-menu"
      >
        <ul className="mobile-menu-list">
          {items.map(item => (
            <li key={item.href}>
              {isRouterLink(item.href) ? (
                <Link
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                  aria-current={activeHref === item.href ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
