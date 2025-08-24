'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import {
  Card,
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

export default function BanksPage() {
  return (
    <div>
      <Row className="my-banks" align="middle" wrap={false}>
        <Card title="收藏的题库">bank1</Card>
      </Row>
      <Row className="my-questions">
        <Card title="标记过的题目">bank1</Card>
      </Row>
    </div>
  );
}
