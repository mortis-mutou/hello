import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, HeartOutlined } from '@ant-design/icons';
import { useUserStore } from '../../stores/userStore';

const { Title, Text } = Typography;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const { register } = useUserStore();
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; email: string; password: string }) => {
        setLoading(true);
        try {
            await register(values.username, values.email, values.password);
            message.success('注册成功！请登录');
            navigate('/login');
        } catch (error: any) {
            message.error(error.response?.data?.error || '注册失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundImage: 'url("https://storage.moegirl.org.cn/moegirl/commons/1/12/%E5%94%90%E8%A3%85%E5%B0%8F%E8%8F%B2.png!/fw/200?v=20240208211716")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }} />
            
            <Card style={{ width: 400, borderRadius: 16, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <HeartOutlined style={{ fontSize: 48, color: '#ff69b4' }} />
                    <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>加入我们</Title>
                    <Text type="secondary">注册成为塔菲粉丝</Text>
                </div>

                <Form name="register" onFinish={onFinish} autoComplete="off" size="large">
                    <Form.Item
                        name="username"
                        rules={[
                            { required: true, message: '请输入用户名' },
                            { min: 3, message: '用户名至少3个字符' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="邮箱" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            { min: 6, message: '密码至少6个字符' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            loading={loading}
                            style={{ 
                                backgroundColor: '#ff69b4', 
                                borderColor: '#ff69b4',
                                color: 'white'
                            }}
                        >
                            注册
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login">已有账号？立即登录</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}