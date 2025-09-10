import React from 'react';
import { Typography, Card, Row, Col, Statistic, Space } from 'antd';
import { 
  DashboardOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  WarningOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SimpleDashboard: React.FC = () => {
  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 标题区域 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '40px 20px',
        color: 'white'
      }}>
        <DashboardOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
        <Title level={1} style={{ color: 'white', margin: '0 0 16px 0' }}>
          📊 Anker销售预测系统
        </Title>
        <Text style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
          🚀 欢迎使用Anker智能销售预测系统
        </Text>
        <div style={{ marginTop: '20px' }}>
          <Text style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            智能分析 • 精准预测 • 高效管理
          </Text>
        </div>
      </div>

      {/* 功能概览卡片 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <CheckCircleOutlined 
              style={{ 
                fontSize: '32px', 
                color: '#52c41a',
                marginBottom: '12px'
              }} 
            />
            <Statistic
              title="已完成预测"
              value={12}
              suffix="项"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <ClockCircleOutlined 
              style={{ 
                fontSize: '32px', 
                color: '#1890ff',
                marginBottom: '12px'
              }} 
            />
            <Statistic
              title="进行中"
              value={8}
              suffix="项"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <WarningOutlined 
              style={{ 
                fontSize: '32px', 
                color: '#faad14',
                marginBottom: '12px'
              }} 
            />
            <Statistic
              title="待处理"
              value={3}
              suffix="项"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <DashboardOutlined 
              style={{ 
                fontSize: '32px', 
                color: '#722ed1',
                marginBottom: '12px'
              }} 
            />
            <Statistic
              title="总计项目"
              value={23}
              suffix="项"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作区域 */}
      <div style={{ marginTop: '40px' }}>
        <Card 
          title="🎯 快速开始"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  选择左侧菜单开始使用各项功能
                </Text>
                <div style={{ marginTop: '20px' }}>
                  <Space direction="vertical" size="small">
                    <Text>📝 PN快速填写 - 快速录入销售预测数据</Text>
                    <Text>📊 PDT预测 - 产品预测分析</Text>
                    <Text>📋 PN数据 - 查看和管理PN数据</Text>
                    <Text>⚙️ 预测收集 - 配置预测模板</Text>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default SimpleDashboard;