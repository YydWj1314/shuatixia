import type { CSSProperties } from 'react';

type Styles = Record<string, CSSProperties>;

export const layoutStyles: Styles = {
  layout: { minHeight: '100vh' },
  header: {
    background: '#fff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 40,
    paddingRight: 40,
    borderBottom: '1px solid #f0f0f0',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  brandTitle: { fontWeight: 600, color: '#000' },
  menu: {
    flex: 1,
    minWidth: 0,
    background: 'transparent',
    borderBottom: 'none',
  },
  content: { flex: 1, padding: 24, background: '#f5f6f8' },
  contentInner: { maxWidth: 1200, margin: '0 auto' },
  footer: {
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    paddingInline: 8,
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    height: 32,
  },
  searchInput: { width: 220 },
};
