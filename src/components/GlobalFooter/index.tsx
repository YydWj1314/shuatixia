'use client';

import './index.css';

export default function GlobalFooter() {
  const year = new Date().getFullYear();
  return (
    <div
      className="global-footer"
      style={{
        textAlign: 'center',
        paddingBlockStart: 12,
      }}
    >
      <div>© {year} Made with love</div>
      <div>by yyd</div>
    </div>
  );
}
