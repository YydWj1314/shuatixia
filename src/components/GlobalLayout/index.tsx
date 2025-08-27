'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { User } from '@/types/Users';
import {
  Layout,
  Menu,
  Dropdown,
  Row,
  Col,
  Button,
  Input,
  Space,
  theme,
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { layoutStyles as s } from './layoutStyles';
import Banner from '../Banner';

const { Header, Content, Footer } = Layout;

type Props = { children: React.ReactNode };

const menus = [
  { key: '/', label: <Link href="/">Home</Link> },
  { key: '/my-banks', label: <Link href="/my-banks">MyBanks</Link> },
  { key: '/questions', label: <Link href="/questions">Questions</Link> },
];

export default function BasicLayout({ children }: Props) {
  const pathname = usePathname(); // get current url
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { token } = theme.useToken();
  const year = new Date().getFullYear();

  // 拉 session 用户
  const refresh = useCallback(async () => {
    try {
      // GET requeset
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) return setUser(null);
      const data = await res.json().catch(() => ({}));
      setUser(data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh(); // 路由变化时拉 /api/auth/userMe
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
        await fetch('/api/auth/logout', {
          // logout api
          method: 'DELETE',
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
    <Row
      aria-hidden
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{
        ...s.searchBox,
        border: `1px solid ${token.colorBorder}`,
      }}
    >
      <Input
        style={s.searchInput}
        prefix={<SearchOutlined style={{ color: token.colorTextQuaternary }} />}
        placeholder="Search"
        variant="borderless"
      />
    </Row>
  );

  return (
    <>
      <Layout>
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
          <Row gutter={[12, 12]} align="middle" wrap={false}>
            <Col>
              <SearchInput /> {/* 搜索框内部仍是 width:100% */}
            </Col>

            <Col>
              {!user || !user.user_role ? (
                <Button
                  type="primary"
                  shape="round"
                  icon={<UserOutlined />}
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              ) : user.user_role === 'admin' ? (
                <Dropdown.Button
                  menu={{ items: adminItems }}
                  icon={<DownOutlined />}
                >
                  {user.user_name ?? 'Admin'}
                </Dropdown.Button>
              ) : (
                <Dropdown.Button menu={{ items: commonItems }}>
                  <Space>{user.user_name ?? '无名侠客'}</Space>
                </Dropdown.Button>
              )}
            </Col>
          </Row>
        </Header>
      </Layout>

      {/* Banner */}
      <Banner></Banner>

      {/* Content */}
      <Layout style={s.layout}>
        {/* 内容区（自适应撑开） */}
        <Content style={s.content}>
          <div style={s.contentInner}>{children}</div>
        </Content>

        {/* 底部（贴底） */}
        <Footer style={s.footer}>
          <div>© {year} Made with curiosity, patience & love</div>
          <div>by yyd</div>
        </Footer>
      </Layout>
    </>
  );
}
