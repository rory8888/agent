import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Button, Space, Tag, 
  Steps, Timeline, Statistic, Progress, Alert, 
  Table, Input, Select, Tabs, Divider, Avatar,
  Badge, Switch, Tooltip, List
} from 'antd';
import {
  RightOutlined, CheckCircleOutlined, CloseCircleOutlined,
  TableOutlined, RocketOutlined, BulbOutlined,
  UserOutlined, ClockCircleOutlined, TeamOutlined,
  TrendingUpOutlined, ThunderboltOutlined,
  ExclamationCircleOutlined, FileTextOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ComparisonDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('traditional');
  const [demoMode, setDemoMode] = useState<'overview' | 'workflow' | 'features'>('overview');

  // 传统方式的问题点
  const traditionalProblems = [
    {
      title: '手动录入效率低',
      description: '每个SKU需要手动填写6个月预测数据，350个SKU需要大量时间',
      severity: 'high',
      impact: '工作效率低下，容易出错'
    },
    {
      title: '缺乏智能建议',
      description: '无法基于历史数据提供预测建议，完全依赖人工经验',
      severity: 'high',
      impact: '预测准确性难以保证'
    },
    {
      title: '协作流程复杂',
      description: '需要在飞书表格间来回切换，版本管理困难',
      severity: 'medium',
      impact: '团队协作效率低'
    },
    {
      title: '数据分析能力弱',
      description: '缺乏可视化分析，难以发现趋势和异常',
      severity: 'medium',
      impact: '决策缺乏数据支撑'
    }
  ];

  // 智能工作台的优势
  const smartAdvantages = [
    {
      title: 'AI智能预测',
      description: '基于历史销售数据自动生成预测建议，准确率提升30%',
      benefit: '大幅提升预测准确性',
      icon: <BulbOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: '任务导向流程',
      description: '将复杂的表格填写转换为简单的任务确认流程',
      benefit: '工作效率提升60%',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: '实时协作',
      description: '团队成员实时看到进度，自动流转到下一环节',
      benefit: '协作效率提升50%',
      icon: <TeamOutlined style={{ color: '#722ed1' }} />
    },
    {
      title: '智能分析',
      description: '自动识别异常数据，提供改进建议和趋势分析',
      benefit: '决策质量显著提升',
      icon: <TrendingUpOutlined style={{ color: '#fa8c16' }} />
    }
  ];

  // 工作流程对比
  const traditionalWorkflow = [
    { title: '打开飞书表格', description: '查找对应的预测表格文件', time: '2分钟', status: 'process' },
    { title: '逐行填写数据', description: '手动输入350个SKU的6个月预测', time: '4小时', status: 'process' },
    { title: '人工检查错误', description: '逐行检查数据合理性', time: '30分钟', status: 'process' },
    { title: '提交审核', description: '发送给上级审核', time: '5分钟', status: 'process' },
    { title: '反复修改', description: '根据反馈修改数据', time: '1小时', status: 'error' }
  ];

  const smartWorkflow = [
    { title: '查看个人任务', description: 'AI自动分配待预测SKU', time: '10秒', status: 'finish' },
    { title: '确认AI建议', description: '基于历史数据的智能预测建议', time: '30分钟', status: 'finish' },
    { title: '智能检查', description: 'AI自动检测异常数据', time: '实时', status: 'finish' },
    { title: '一键提交', description: '自动流转到审核环节', time: '5秒', status: 'finish' },
    { title: '实时反馈', description: '在线讨论和修改', time: '10分钟', status: 'finish' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const renderOverview = () => (
    <Row gutter={[24, 24]}>
      {/* 问题分析 */}
      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <TableOutlined style={{ color: '#f5222d' }} />
              <Text strong>传统飞书表格方式</Text>
              <Tag color="error">问题重重</Tag>
            </Space>
          }
          style={{ height: '600px' }}
        >
          <Alert 
            message="当前面临的主要挑战" 
            description="手动填表效率低，预测准确性差，协作流程复杂"
            type="error" 
            showIcon 
            style={{ marginBottom: 16 }}
          />
          
          <List
            dataSource={traditionalProblems}
            renderItem={(item, index) => (
              <List.Item style={{ padding: '12px 0' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text strong style={{ color: getSeverityColor(item.severity) }}>
                      {item.title}
                    </Text>
                    <Tag color={item.severity === 'high' ? 'error' : 'warning'}>
                      {item.severity === 'high' ? '严重' : '中等'}
                    </Tag>
                  </div>
                  <Paragraph style={{ fontSize: '13px', margin: 0, marginBottom: 4 }}>
                    {item.description}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    影响：{item.impact}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* 解决方案 */}
      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <RocketOutlined style={{ color: '#52c41a' }} />
              <Text strong>智能预测工作台</Text>
              <Tag color="success">全面升级</Tag>
            </Space>
          }
          style={{ height: '600px' }}
        >
          <Alert 
            message="AI驱动的智能化解决方案" 
            description="自动化预测，智能协作，数据驱动决策"
            type="success" 
            showIcon 
            style={{ marginBottom: 16 }}
          />

          <List
            dataSource={smartAdvantages}
            renderItem={(item, index) => (
              <List.Item style={{ padding: '12px 0' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ marginRight: 12, fontSize: '20px' }}>
                      {item.icon}
                    </div>
                    <Text strong style={{ color: '#262626' }}>
                      {item.title}
                    </Text>
                  </div>
                  <Paragraph style={{ fontSize: '13px', margin: 0, marginBottom: 4, marginLeft: 32 }}>
                    {item.description}
                  </Paragraph>
                  <div style={{ marginLeft: 32 }}>
                    <Tag color="success" style={{ fontSize: '11px' }}>
                      {item.benefit}
                    </Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>

      {/* 效率对比 */}
      <Col xs={24}>
        <Card title="效率对比分析" style={{ marginTop: 16 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', background: '#fff2e8' }}>
                <Statistic
                  title="传统方式 - 完成时间"
                  value={5.5}
                  suffix="小时"
                  valueStyle={{ color: '#fa8c16' }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  包括填写、检查、修改时间
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
                <Statistic
                  title="智能工作台 - 完成时间"
                  value={45}
                  suffix="分钟"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  AI辅助，大幅提升效率
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ textAlign: 'center', background: '#e6f7ff' }}>
                <Statistic
                  title="效率提升"
                  value={86}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                  prefix="+"
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  节省大量人工时间
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );

  const renderWorkflow = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <FileTextOutlined style={{ color: '#fa8c16' }} />
              传统飞书表格流程
            </Space>
          }
          style={{ height: '500px' }}
        >
          <Timeline
            items={traditionalWorkflow.map((step, index) => ({
              color: step.status === 'error' ? 'red' : '#faad14',
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{step.title}</Text>
                    <Tag color="orange">{step.time}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {step.description}
                  </Text>
                  {step.status === 'error' && (
                    <div style={{ marginTop: 4 }}>
                      <ExclamationCircleOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                      <Text type="danger" style={{ fontSize: '11px' }}>
                        经常需要反复修改
                      </Text>
                    </div>
                  )}
                </div>
              )
            }))}
          />

          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Statistic
              title="总耗时"
              value="5.5+"
              suffix="小时"
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
            />
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card 
          title={
            <Space>
              <RocketOutlined style={{ color: '#52c41a' }} />
              智能工作台流程
            </Space>
          }
          style={{ height: '500px' }}
        >
          <Timeline
            items={smartWorkflow.map((step, index) => ({
              color: '#52c41a',
              children: (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{step.title}</Text>
                    <Tag color="success">{step.time}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {step.description}
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                    <Text style={{ fontSize: '11px', color: '#52c41a' }}>
                      自动化处理
                    </Text>
                  </div>
                </div>
              )
            }))}
          />

          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Statistic
              title="总耗时"
              value="45"
              suffix="分钟"
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );

  const renderFeatures = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Card title="功能特性对比">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <TableOutlined />
                    传统表格方式
                  </Space>
                }
                extra={<Tag color="error">Limited</Tag>}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>智能预测</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>实时协作</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>数据验证</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>可视化分析</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>流程自动化</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>移动端支持</Text>
                    <CloseCircleOutlined style={{ color: '#f5222d' }} />
                  </div>
                </Space>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card 
                size="small" 
                title={
                  <Space>
                    <RocketOutlined />
                    智能工作台
                  </Space>
                }
                extra={<Tag color="success">Advanced</Tag>}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={12}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>智能预测</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>实时协作</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>数据验证</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>可视化分析</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>流程自动化</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>移动端支持</Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col xs={24}>
        <Card title="核心功能演示">
          <Tabs defaultActiveKey="ai">
            <TabPane tab="AI智能预测" key="ai">
              <Alert
                message="AI预测算法"
                description="基于历史3年销售数据，结合季节性因素、市场趋势、产品生命周期等多维度分析，自动生成预测建议"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic title="历史准确率" value={92} suffix="%" valueStyle={{ color: '#52c41a' }} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic title="覆盖SKU数" value={350} suffix="个" valueStyle={{ color: '#1890ff' }} />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic title="预测周期" value={6} suffix="个月" valueStyle={{ color: '#722ed1' }} />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="实时协作" key="collaboration">
              <div style={{ padding: '16px 0' }}>
                <Timeline>
                  <Timeline.Item color="green">
                    <Text strong>张三</Text> 完成了PowerPort系列预测 <Text type="secondary">2分钟前</Text>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>李四</Text> 正在填写PowerCore系列预测 <Text type="secondary">进行中</Text>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Text strong>肖哥</Text> 将在完成后进行审核 <Text type="secondary">等待中</Text>
                  </Timeline.Item>
                </Timeline>
              </div>
            </TabPane>
            <TabPane tab="智能分析" key="analysis">
              <Alert
                message="异常检测"
                description="AI自动识别预测数据中的异常值，如同比增长超过200%或环比波动超过50%的数据会自动标记"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <List
                size="small"
                dataSource={[
                  { sku: 'PowerPort A2637', issue: '预测值较去年同期增长180%，请确认', level: 'warning' },
                  { sku: 'PowerCore A1266', issue: '9月预测值异常偏低，建议检查', level: 'info' }
                ]}
                renderItem={item => (
                  <List.Item>
                    <Space>
                      <Tag color={item.level === 'warning' ? 'orange' : 'blue'}>{item.sku}</Tag>
                      <Text>{item.issue}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px',
          marginBottom: 16
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              🔄 方案对比演示
            </Title>
            <Text type="secondary">传统飞书表格 vs 智能预测工作台</Text>
          </div>
          <Space>
            <Button 
              type={demoMode === 'overview' ? 'primary' : 'default'}
              onClick={() => setDemoMode('overview')}
            >
              方案对比
            </Button>
            <Button 
              type={demoMode === 'workflow' ? 'primary' : 'default'}
              onClick={() => setDemoMode('workflow')}
            >
              流程对比
            </Button>
            <Button 
              type={demoMode === 'features' ? 'primary' : 'default'}
              onClick={() => setDemoMode('features')}
            >
              功能对比
            </Button>
          </Space>
        </div>
      </div>

      {/* 核心价值展示 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={18}>
            <Space size={16}>
              <div style={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px'
              }}>
                🚀
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  从手动填表到智能预测的革命性升级
                </Title>
                <Text type="secondary">
                  告别重复劳动，拥抱AI驱动的智能化预测工作流程
                </Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Statistic
              title="预期效率提升"
              value={86}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 动态内容区域 */}
      {demoMode === 'overview' && renderOverview()}
      {demoMode === 'workflow' && renderWorkflow()}
      {demoMode === 'features' && renderFeatures()}

      {/* 总结卡片 */}
      <Card 
        style={{ 
          marginTop: 24,
          background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)',
          border: '1px solid #91d5ff'
        }}
      >
        <Row align="middle">
          <Col xs={24} md={18}>
            <Space>
              <ThunderboltOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  智能预测工作台 - 您的最佳选择
                </Title>
                <Text style={{ color: '#096dd9' }}>
                  替代传统飞书表格，实现预测工作的全面智能化升级
                </Text>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button type="primary" size="large" href="/prediction-workbench">
              立即体验 <RightOutlined />
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ComparisonDemo;