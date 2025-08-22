'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { Layout, Menu, Dropdown, Button, Input, Space, theme } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { layoutStyles as s } from './layoutStyles';

const { Header, Content, Footer } = Layout;

type User = {
  id: number;
  username?: string;
  role: 'user' | 'admin' | string;
  account?: string;
} | null;

type Props = { children: React.ReactNode };

const menus = [
  { key: '/', label: <Link href="/">首页</Link> },
  { key: '/exam', label: <Link href="/exam">刷题</Link> },
  { key: '/banks', label: <Link href="/banks">题库</Link> },
];

export default function BasicLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User>(null);
  const { token } = theme.useToken();
  const year = new Date().getFullYear();

  // 拉 session 用户
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) return setUser(null);
      const data = await res.json().catch(() => ({}));
      setUser(data?.user ?? null);
      console.log(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh(); // 路由变化时拉 /api/auth/me
  }, [pathname, refresh]);

  // 登录后通用菜单
  const commonItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push('/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: async () => {
        console.log('log out async function is activetd ');
        await fetch('/api/auth/logout', {
          // logout api
          method: 'POST',
          credentials: 'include',
        });
        setUser(null);
        router.replace('/login');
      },
    },
  ];

  // 管理员菜单
  const adminItems: MenuProps['items'] = [
    { key: 'dashboard', label: 'Admin', onClick: () => router.push('/admin') },
    { type: 'divider' },
    { key: 'Logout', label: 'Admin' },
  ];

  // 顶部右侧搜索输入
  const SearchInput = () => (
    <div
      aria-hidden
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{ ...s.searchBox, border: `1px solid ${token.colorBorder}` }}
    >
      <Input
        style={s.searchInput}
        prefix={<SearchOutlined style={{ color: token.colorTextQuaternary }} />}
        placeholder="Search"
        variant="borderless"
      />
    </div>
  );

  return (
    <Layout style={s.layout}>
      {/* 顶部栏 */}
      <Header style={s.header}>
        {/* 左：Logo + Title */}
        <Link href="/" style={s.brand}>
          <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
          <span style={s.brandTitle}>ShuaTiXia</span>
        </Link>

        {/* 中：导航菜单 */}
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menus}
          theme="light"
          style={s.menu}
        />

        {/* 右：搜索 + 登录/头像 */}
        <Space size="middle">
          <SearchInput />
          {!user || !user.role ? (
            <Button
              type="primary"
              shape="round"
              icon={<UserOutlined />}
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
          ) : user.role === 'admin' ? (
            <Dropdown.Button
              menu={{ items: adminItems }}
              icon={<DownOutlined />}
            >
              {user.username ?? 'Admin'}
            </Dropdown.Button>
          ) : (
            <Dropdown.Button menu={{ items: commonItems }}>
              <Space>{user.username ?? '无名侠客'}</Space>
            </Dropdown.Button>
          )}
        </Space>
      </Header>

      {/* 内容区（自适应撑开） */}
      <Content style={s.content}>
        <div style={s.contentInner}>{children}</div>
      </Content>

      {/* 底部（贴底） */}
      <Footer style={s.footer}>
        <div>© {year} Made with love</div>
        <div>by yyd</div>
      </Footer>
    </Layout>
  );
}
