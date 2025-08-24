'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Button, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './login.css';

/**
 * Login page
 * @returns
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  type LoginValues = { user_account: string; password: string };

  async function onFinish(values: LoginValues) {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        message.error(data.error || '登录失败');
        return;
      }
      message.success('登录成功');
      router.replace('/');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-main">
      <Card
        className="login-main-card"
        title={
          <div className="login-header">
            <span>Login</span>
          </div>
        }
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="user_account"
            label="Account"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Email address" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Passowrd"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Button htmlType="submit" type="primary" block loading={loading}>
            Submit
          </Button>
          <div className="login-main-bottom">
            <div> Sign in</div>
            <div>Forget password?</div>
          </div>
        </Form>
      </Card>
    </main>
  );
}
