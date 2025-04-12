import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  Alert,
  Layout,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useAuthContext } from '../../../../context/AuthContext';
import { LoginCredentials } from '../../../../types/auth.types';

const { Title } = Typography;
const { Content } = Layout;

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoginLoading, loginError } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // Get redirect path and message from location state
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';
  const message = state?.message || '';

  const onFinish = async (values: LoginCredentials) => {
    try {
      await login(values);
      // On successful login, navigate to the redirect path
      navigate(from, { replace: true });
    } catch (err: any) {
      // Error is handled by the auth hook and displayed below
      console.error('Login failed', err);
    }
  };

  // Logo component
  const Logo = () => (
    <svg
      className="app-logo"
      xmlns="http://www.w3.org/2000/svg"
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="#722ed1" // Ant Design primary purple color
    >
      <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
    </svg>
  );

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5', // Ant Design background color
      }}
    >
      <Content
        style={{
          padding: '0 24px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <Card
          bordered={false}
          style={{
            boxShadow:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Logo />
            <Title level={2} style={{ marginTop: 16 }}>
              Sign in to your account
            </Title>
          </div>

          {/* Success message from registration */}
          {message && (
            <Alert
              message={message}
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          {/* Error message */}
          {loginError && (
            <Alert
              message={
                loginError instanceof Error
                  ? loginError.message
                  : 'An error occurred during login. Please try again.'
              }
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            form={form}
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email address"
                disabled={isLoginLoading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                disabled={isLoginLoading}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Link to="/forgot-password" style={{ color: '#722ed1' }}>
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoginLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#722ed1', // Ant Design purple
                  borderColor: '#722ed1',
                }}
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;
