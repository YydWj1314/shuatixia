'use client';
// Client components,
import {
  LogoutOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Dropdown, Input, theme } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GlobalFooter from '@/components/GlobalFooter';
import './index.css';
import { menus } from '../../../config/menu';

// Serach bar
const SearchInput = () => {
  const { token } = theme.useToken();
  return (
    <div
      key="SearchOutlined"
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        marginInlineEnd: 24,
        border: '1px solid black',
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Input
        prefix={
          <SearchOutlined
            style={{
              color: '#d9d9d9',
            }}
          />
        }
        placeholder="Search"
        variant="borderless"
      />
    </div>
  );
};

interface Props {
  children: React.ReactNode;
}

export default function BasicLayout({ children }: Props) {
  const pathname = usePathname(); // get current route

  return (
    <div id="test-pro-layout">
      <ProLayout
        title="ShuaTiXia"
        layout="top"
        contentWidth="Fixed"
        logo={
          <Image src="/assets/logo.svg" alt="logo" height={32} width={32} />
        }
        prefixCls="my-prefix"
        location={{ pathname }}
        token={{
          header: {
            colorBgMenuItemSelected: '#f5f5f5',
          },
        }}
        siderMenuType="group"
        menu={{ collapsedShowGroupTitle: true }}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: 'Dnaiel',
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      icon: <UserOutlined />,
                      label: 'Profile',
                    },

                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: 'Logout',
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={(props) => {
          // if (props.isMobile) return [];
          return [<SearchInput />];
        }}
        // header rendering
        headerTitleRender={(logo, title, _) => {
          return (
            <a href="https://www.mianshiya.com" target="_blank">
              {logo}
              {title}
            </a>
          );
        }}
        footerRender={(props) => {
          return <GlobalFooter />;
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        // menu item
        menuDataRender={() => {
          return menus;
        }}
        // define menu rendering
        menuItemRender={(item, dom) => (
          <Link href={item.path || '/'}>{dom}</Link>
        )}
      >
        {children}
      </ProLayout>
    </div>
  );
}
