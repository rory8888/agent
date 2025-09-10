import React from 'react';
import { Card, Statistic, Row, Col, Typography, Progress, Space, Tag } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  MinusOutlined,
  DollarCircleOutlined,
  AimOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { KPIMetric } from '../types';

const { Text } = Typography;

interface KPICardProps {
  data: KPIMetric;
  loading?: boolean;
}

const iconMap = {
  'dollar-circle': DollarCircleOutlined,
  'aim': AimOutlined,
  'trophy': TrophyOutlined,
  'rise': RiseOutlined,
};

const KPICard: React.FC<KPICardProps> = ({ data, loading = false }) => {
  const { title, value, unit, trend, trendValue, target, icon = 'dollar-circle', color = '#1890ff' } = data;
  
  const IconComponent = iconMap[icon as keyof typeof iconMap] || DollarCircleOutlined;
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MinusOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#52c41a';
      case 'down':
        return '#f5222d';
      default:
        return '#faad14';
    }
  };

  const getProgressPercent = () => {
    if (!target || typeof value !== 'number') return 0;
    return Math.min((value / target) * 100, 100);
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    return val.toLocaleString();
  };

  return (
    <Card 
      loading={loading}
      hoverable
      style={{ 
        height: '160px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Row align="middle" justify="space-between">
        <Col span={16}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
              {title}
            </Text>
            
            <Statistic
              value={formatValue(value)}
              suffix={unit}
              valueStyle={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: color,
                lineHeight: 1.2
              }}
            />
            
            <Space align="center" size={8}>
              <Tag 
                icon={getTrendIcon()} 
                color={getTrendColor()}
                style={{ margin: 0, fontSize: '11px', padding: '2px 6px' }}
              >
                {trendValue ? `${Math.abs(trendValue)}%` : '0%'}
              </Tag>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                vs 上期
              </Text>
            </Space>
          </Space>
        </Col>
        
        <Col span={8} style={{ textAlign: 'right' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <div style={{ 
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto'
            }}>
              <IconComponent style={{ fontSize: '24px', color: color }} />
            </div>
            
            {target && typeof value === 'number' && (
              <div style={{ width: '100%' }}>
                <Progress
                  percent={getProgressPercent()}
                  showInfo={false}
                  strokeColor={{
                    '0%': color,
                    '100%': color,
                  }}
                  trailColor="#f0f0f0"
                  strokeWidth={6}
                  style={{ margin: 0 }}
                />
                <Text 
                  type="secondary" 
                  style={{ fontSize: '10px', display: 'block', textAlign: 'center', marginTop: '4px' }}
                >
                  目标: {target.toLocaleString()}{unit}
                </Text>
              </div>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default KPICard;