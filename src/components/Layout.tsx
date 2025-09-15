import React, { useState } from 'react';
import { Layout, Menu, Typography, Space, Avatar, Badge } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  EditOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '数据总览',
    },
    // {
    //   key: '/forecast-entry',
    //   icon: <EditOutlined />,
    //   label: '预测填报',
    // },
    {
      key: '/pn-fast-entry',
      icon: <ThunderboltOutlined />,
      label: 'PN快速填写',
    },
    {
      key: '/pn-audit',
      icon: <AuditOutlined />,
      label: 'PN审核',
    },
    {
      key: '/pdt-forecast',
      icon: <AuditOutlined />,
      label: 'PDT预测',
    },
    {
      key: '/pn-data',
      icon: <TableOutlined />,
      label: 'PN数据',
    },
    {
      key: '/forecast-template',
      icon: <SettingOutlined />,
      label: '预测收集',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
        width={240}
      >
        <div style={{ 
          padding: collapsed ? '16px 12px' : '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Space align="center">
            <div style={{
              width: '40px',
              height: '32px',
              background: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px'
            }}>
              <img 
                src={window.location.hostname === 'localhost' ? '/anker-logo.jpg' : '/agent/anker-logo.jpg'}
                alt="Anker Logo" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }}
              />
            </div>
            {!collapsed && (
              <div>
                <Title level={5} style={{ color: 'white', margin: 0, fontSize: '16px' }}>
                  Anker销售预测系统
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>
                  Sales Forecast Platform
                </Text>
              </div>
            )}
          </Space>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: 'transparent',
            border: 'none',
            marginTop: '16px'
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
          position: 'relative'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            height: '100%'
          }}>
            <Space align="center">
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  style: { fontSize: '18px', cursor: 'pointer' },
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
              <div style={{ marginLeft: 16 }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  {new Date().toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </Text>
              </div>
            </Space>

            <Space align="center">
              <Badge count={5} size="small">
                <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
              </Badge>
              
              <Space style={{ cursor: 'pointer', padding: '8px' }}>
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }} 
                  icon={<UserOutlined />} 
                  size="small"
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text strong style={{ fontSize: '14px', lineHeight: 1.2 }}>
                    管理员
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.2 }}>
                    系统管理员
                  </Text>
                </div>
              </Space>
            </Space>
          </div>
        </Header>

        <Content style={{ 
          margin: 0,
          minHeight: 'calc(100vh - 64px)',
          background: '#f5f5f5'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;