import { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Button, List, Space, message, Empty, Modal, Input, Upload } from 'antd';
import { UserOutlined, MailOutlined, EditOutlined, LogoutOutlined, HeartOutlined, MessageOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useUserStore } from '../../stores/userStore';
import { userAPI } from '../../api/user';
import { postAPI, Post } from '../../api/post';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function Profile() {
    const { user, logout, setUser } = useUserStore();
    const [myPosts, setMyPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editSignature, setEditSignature] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMyPosts();
            setEditUsername(user.username);
            setEditSignature(user.signature || '');
            setEditAvatar(user.avatar_url || '');
        }
    }, [user]);

    const fetchMyPosts = async () => {
        setLoading(true);
        try {
            const res = await postAPI.getPosts(1, 10);
            const postsData = res.data?.data || [];
            const userPosts = postsData.filter((post: Post) => post.user_id === user?.id);
            setMyPosts(userPosts);
        } catch (error) {
            console.error('获取我的帖子失败', error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = () => {
        if (!user) return;
        setEditUsername(user.username);
        setEditSignature(user.signature || '');
        setEditAvatar(user.avatar_url || '');
        setEditModalVisible(true);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        if (!editUsername.trim()) {
            message.warning('用户名不能为空');
            return;
        }
        setSaving(true);
        try {
            const res = await userAPI.updateProfile({
                username: editUsername.trim(),
                signature: editSignature.trim(),
                avatar_url: editAvatar.trim() || undefined,
            });
            if (res.data?.user) {
                setUser(res.data.user);
                message.success('资料更新成功！');
                setEditModalVisible(false);
            }
        } catch (error: any) {
            message.error(error?.response?.data?.error || '更新失败，请稍后重试');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange: UploadProps['onChange'] = (info) => {
        if (info.file) {
            const fakeUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(editUsername || 'user')}`;
            setEditAvatar(fakeUrl);
            message.info('头像已更换为示例头像');
        }
    };

    const defaultAvatarOptions = [
        'https://api.dicebear.com/7.x/bottts/svg?seed=taffy1',
        'https://api.dicebear.com/7.x/bottts/svg?seed=taffy2',
        'https://api.dicebear.com/7.x/bottts/svg?seed=taffy3',
        'https://api.dicebear.com/7.x/bottts/svg?seed=taffy4',
        'https://api.dicebear.com/7.x/bottts/svg?seed=taffy5',
    ];

    if (!user) {
        return null;
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* 个人信息卡片 */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Avatar src={user.avatar_url} size={80} icon={<UserOutlined />} />
                    <div style={{ flex: 1 }}>
                        <Title level={3} style={{ marginBottom: 4 }}>{user.username}</Title>
                        <Text type="secondary">{user.signature || '永雏塔菲赛高！'}</Text>
                        <div style={{ marginTop: 12 }}>
                            <Space>
                                <Text><MailOutlined /> {user.email}</Text>
                                <Text>👑 {user.role === 'admin' ? '管理员' : '普通粉丝'}</Text>
                            </Space>
                        </div>
                    </div>
                    <Space direction="vertical">
                        <Button icon={<EditOutlined />} onClick={openEditModal}>编辑资料</Button>
                        <Button danger icon={<LogoutOutlined />} onClick={logout}>退出登录</Button>
                    </Space>
                </div>
            </Card>

            {/* 统计卡片 */}
            <Card style={{ marginBottom: 24 }}>
                <Space size={48} split="|">
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ marginBottom: 0, color: '#ff69b4' }}>{myPosts.length}</Title>
                        <Text type="secondary">我的帖子</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ marginBottom: 0, color: '#ff69b4' }}>0</Title>
                        <Text type="secondary">获得的点赞</Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ marginBottom: 0, color: '#ff69b4' }}>{dayjs(user.created_at).format('YYYY-MM-DD')}</Title>
                        <Text type="secondary">加入日期</Text>
                    </div>
                </Space>
            </Card>

            {/* 编辑资料弹窗 */}
            <Modal
                title="编辑个人资料"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={handleSaveProfile}
                confirmLoading={saving}
                okText="保存"
                cancelText="取消"
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* 当前头像 */}
                    <div style={{ textAlign: 'center' }}>
                        <Avatar src={editAvatar || user.avatar_url} size={100} icon={<UserOutlined />} />
                        <div style={{ marginTop: 12 }}>
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleAvatarChange}
                            >
                                <Button icon={<UploadOutlined />}>更换头像</Button>
                            </Upload>
                        </div>
                    </div>

                    {/* 快速头像选择 */}
                    <div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>快速选择头像</Text>
                        <Space>
                            {defaultAvatarOptions.map((url, idx) => (
                                <Avatar
                                    key={idx}
                                    src={url}
                                    size={40}
                                    style={{
                                        cursor: 'pointer',
                                        border: editAvatar === url ? '2px solid #ff69b4' : '2px solid transparent',
                                    }}
                                    onClick={() => setEditAvatar(url)}
                                />
                            ))}
                        </Space>
                    </div>

                    {/* 用户名 */}
                    <div>
                        <Text style={{ display: 'block', marginBottom: 4 }}>用户名</Text>
                        <Input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="请输入用户名"
                            maxLength={20}
                            showCount
                        />
                    </div>

                    {/* 个性签名 */}
                    <div>
                        <Text style={{ display: 'block', marginBottom: 4 }}>个性签名</Text>
                        <Input.TextArea
                            value={editSignature}
                            onChange={(e) => setEditSignature(e.target.value)}
                            placeholder="介绍一下自己吧~"
                            maxLength={100}
                            showCount
                            rows={3}
                        />
                    </div>

                    {/* 头像URL手工输入 */}
                    <div>
                        <Text style={{ display: 'block', marginBottom: 4 }}>或直接输入头像链接</Text>
                        <Input
                            value={editAvatar}
                            onChange={(e) => setEditAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>
                </Space>
            </Modal>

            {/* 我的帖子 */}
            <Card title="我的帖子">
                <List
                    loading={loading}
                    dataSource={myPosts}
                    renderItem={(post) => (
                        <List.Item
                            actions={[
                                <Space key="likes">
                                    <HeartOutlined /> {post.like_count}
                                </Space>,
                                <Space key="replies">
                                    <MessageOutlined /> {post.reply_count}
                                </Space>,
                            ]}
                        >
                            <List.Item.Meta
                                title={<Link to={`/post/${post.id}`}>{post.title}</Link>}
                                description={
                                    <Space split="·">
                                        <Text type="secondary">{dayjs(post.created_at).format('YYYY-MM-DD HH:mm')}</Text>
                                        <Text type="secondary">{post.view_count} 浏览</Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
                {myPosts.length === 0 && !loading && (
                    <Empty description="还没有发布过帖子，快去发布吧！" />
                )}
            </Card>
        </div>
    );
}