import type { CSSProperties } from 'react';

type Styles = Record<string, CSSProperties>;

export const layoutStyles: Styles = {
  layout: { minHeight: '100vh' },
  header: {
    background: '#fff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottom: '1px solid #f0f0f0',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    textDecoration: 'none',
  },
  brandTitle: { fontWeight: 700, color: '#000', fontSize: 18 },
  menu: {
    flex: 1,
    minWidth: 40,
    background: 'transparent',
    borderBottom: 'none',
  },
  content: { flex: 1, padding: 24, background: '#f5f6f8' }, // 元素间间距},
  contentInner: { maxWidth: 1200, margin: '0 auto' },
  footer: {
    textAlign: 'center',
    background: '#fff',
    borderTop: '1px solid #f0f0f0',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #d9d9d9',
    borderRadius: 8,
  },
  searchInput: {},
};
