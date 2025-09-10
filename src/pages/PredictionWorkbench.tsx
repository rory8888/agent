import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, Progress, Button, Space, Tag, 
  Timeline, Steps, Statistic, Avatar, List, Input, Slider,
  Alert, Badge, Tooltip, Drawer, Form, InputNumber, message,
  Tabs, Calendar, Select
} from 'antd';
import {
  UserOutlined, ClockCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, RobotOutlined, TeamOutlined,
  TrendingUpOutlined, BulbOutlined, ThunderboltOutlined,
  CalendarOutlined, BarChartOutlined, EditOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const PredictionWorkbench: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);
  const [predictionDrawer, setPredictionDrawer] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  // 模拟数据
  const myTasks = [
    { 
      id: 1, 
      sku: 'PowerPort-A2637-BK', 
      name: 'PowerPort III 65W 黑色',
      category: '高端快充',
      deadline: '2024-03-15',
      status: 'pending',
      priority: 'high',
      aiSuggestion: 15000,
      lastMonth: 12000,
      trend: 'up'
    },
    { 
      id: 2, 
      sku: 'PowerCore-A1266-WT', 
      name: 'PowerCore 10000 白色',
      category: '便携移动电源',
      deadline: '2024-03-16',
      status: 'draft',
      priority: 'medium',
      aiSuggestion: 8500,
      lastMonth: 9200,
      trend: 'down'
    },
    { 
      id: 3, 
      sku: 'Gssential-A5634-GY', 
      name: 'Gssential 无线充电座 灰色',
      category: '无线充电器',
      deadline: '2024-03-17',
      status: 'completed',
      priority: 'low',
      aiSuggestion: 12000,
      lastMonth: 11500,
      trend: 'stable'
    }
  ];

  const teamProgress = [
    { name: '张三', role: 'Sales', completed: 8, total: 12, avatar: '👨‍💼' },
    { name: '李四', role: 'Sales', completed: 10, total: 15, avatar: '👩‍💼' },
    { name: '王五', role: 'Sales', completed: 6, total: 10, avatar: '👨‍💼' },
    { name: '肖哥', role: 'Manager', completed: 5, total: 8, avatar: '👨‍💻' }
  ];

  const workflowSteps = [
    { title: 'Sales填写', description: '6个月SKU需求预测', status: 'process' },
    { title: 'AI分析', description: '智能建议与历史对比', status: 'wait' },
    { title: '策略调整', description: '肖哥基于策略调整', status: 'wait' },
    { title: '比例分解', description: '按比例拆解到各Sales', status: 'wait' }
  ];

  // AI建议趋势图
  const aiTrendOption = {
    title: {
      text: 'AI智能预测趋势',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['历史销量', 'AI预测', '用户输入'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '历史销量',
        type: 'line',
        data: [12000, 13500, 11800, 14200, 12800, 13200],
        itemStyle: { color: '#52c41a' }
      },
      {
        name: 'AI预测',
        type: 'line',
        data: [13200, 14800, 13500, 15200, 14000, 15000],
        itemStyle: { color: '#1890ff' },
        lineStyle: { type: 'dashed' }
      },
      {
        name: '用户输入',
        type: 'line',
        data: [null, null, null, 15000, 14500, 15500],
        itemStyle: { color: '#722ed1' }
      }
    ]
  };

  const handleSKUClick = (sku: any) => {
    setSelectedSKU(sku);
    setPredictionDrawer(true);
  };

  const handleSubmitPrediction = () => {
    message.success('预测数据已提交，等待AI分析');
    setPredictionDrawer(false);
    setCurrentStep(1);
  };

  return (
    <div style={{ 
      padding: '16px',
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
              🚀 智能销售预测工作台
            </Title>
            <Text type="secondary">基于AI的智能化预测流程，告别手动填表</Text>
          </div>
          <Space>
            <Button type="primary" icon={<RobotOutlined />}>
              AI助手
            </Button>
            <Button icon={<TeamOutlined />}>
              团队协作
            </Button>
          </Space>
        </div>
      </div>

      {/* 流程步骤 */}
      <Card style={{ marginBottom: 16, borderRadius: '12px' }}>
        <Steps current={currentStep} size="small">
          {workflowSteps.map((step, index) => (
            <Step key={index} title={step.title} description={step.description} />
          ))}
        </Steps>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 左侧：我的任务 */}
        <Col xs={24} lg={14}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                我的预测任务
                <Badge count={myTasks.filter(t => t.status !== 'completed').length} />
              </Space>
            }
            extra={
              <Space>
                <Button size="small">批量操作</Button>
                <Button type="primary" size="small">智能填写</Button>
              </Space>
            }
            style={{ borderRadius: '12px', height: '500px' }}
          >
            <List
              dataSource={myTasks}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => handleSKUClick(item)}
                    >
                      {item.status === 'completed' ? '查看' : '编辑'}
                    </Button>
                  ]}
                  style={{ 
                    padding: '12px',
                    marginBottom: '8px',
                    background: item.status === 'completed' ? '#f6ffed' : '#fff',
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSKUClick(item)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={
                          item.priority === 'high' ? '#ff4d4f' : 
                          item.priority === 'medium' ? '#faad14' : '#52c41a'
                        }
                      >
                        <Avatar 
                          style={{ 
                            backgroundColor: item.status === 'completed' ? '#52c41a' : '#1890ff' 
                          }}
                        >
                          {item.status === 'completed' ? <CheckCircleOutlined /> : <EditOutlined />}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>{item.name}</Text>
                        <Space>
                          <Tag color="blue">{item.category}</Tag>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            截止: {item.deadline}
                          </Text>
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text code style={{ fontSize: '12px' }}>{item.sku}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space>
                            <Text style={{ fontSize: '12px' }}>
                              AI建议: <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                {item.aiSuggestion.toLocaleString()}
                              </Text>
                            </Text>
                            <Text style={{ fontSize: '12px' }}>
                              上月: {item.lastMonth.toLocaleString()}
                            </Text>
                          </Space>
                          <div style={{ fontSize: '16px' }}>
                            {item.trend === 'up' && <TrendingUpOutlined style={{ color: '#52c41a' }} />}
                            {item.trend === 'down' && <TrendingUpOutlined style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />}
                            {item.trend === 'stable' && <span style={{ color: '#faad14' }}>━</span>}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧：团队协作和AI助手 */}
        <Col xs={24} lg={10}>
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {/* AI智能助手 */}
            <Card 
              title={
                <Space>
                  <RobotOutlined style={{ color: '#722ed1' }} />
                  AI智能助手
                </Space>
              }
              size="small"
              style={{ borderRadius: '12px' }}
            >
              {aiSuggestions && (
                <Alert
                  message="🎯 智能建议"
                  description={
                    <div>
                      <p>• PowerPort系列预测偏保守，建议上调15%</p>
                      <p>• 3月份整体市场趋势向好，建议关注新品推广</p>
                      <p>• 库存周转率优化空间较大</p>
                    </div>
                  }
                  type="info"
                  showIcon
                  closable
                  onClose={() => setAiSuggestions(false)}
                />
              )}
            </Card>

            {/* 团队协作状态 */}
            <Card 
              title={
                <Space>
                  <TeamOutlined />
                  团队进度
                </Space>
              }
              size="small"
              style={{ borderRadius: '12px' }}
            >
              <List
                dataSource={teamProgress}
                renderItem={item => (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      avatar={<span style={{ fontSize: '20px' }}>{item.avatar}</span>}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>{item.name}</Text>
                          <Tag size="small">{item.role}</Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Progress 
                            percent={Math.round((item.completed / item.total) * 100)} 
                            size="small"
                            format={() => `${item.completed}/${item.total}`}
                          />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* 快速统计 */}
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                  <Statistic
                    title="待处理"
                    value={23}
                    suffix="个SKU"
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ textAlign: 'center', borderRadius: '8px' }}>
                  <Statistic
                    title="已完成"
                    value={67}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>

      {/* 智能预测抽屉 */}
      <Drawer
        title={
          selectedSKU ? (
            <Space>
              <BulbOutlined style={{ color: '#722ed1' }} />
              智能预测：{selectedSKU.name}
            </Space>
          ) : "智能预测"
        }
        placement="right"
        onClose={() => setPredictionDrawer(false)}
        open={predictionDrawer}
        width={600}
      >
        {selectedSKU && (
          <Tabs defaultActiveKey="prediction">
            <TabPane tab="智能预测" key="prediction">
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* SKU基本信息 */}
                <Card size="small" title="产品信息">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>SKU: </Text>
                      <Text code>{selectedSKU.sku}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>类别: </Text>
                      <Tag color="blue">{selectedSKU.category}</Tag>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Text strong>名称: </Text>
                    <Text>{selectedSKU.name}</Text>
                  </div>
                </Card>

                {/* AI趋势分析 */}
                <Card size="small" title="AI趋势分析">
                  <ReactECharts option={aiTrendOption} style={{ height: '200px' }} />
                </Card>

                {/* 预测输入表单 */}
                <Card size="small" title="6个月预测填写">
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="1月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            placeholder="AI建议: 13200"
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="2月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            placeholder="AI建议: 14800"
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="3月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            placeholder="AI建议: 13500"
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item label="4月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            defaultValue={15000}
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="5月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            defaultValue={14500}
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="6月预测">
                          <InputNumber 
                            style={{ width: '100%' }}
                            defaultValue={15500}
                            addonAfter="件"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item label="备注说明">
                      <TextArea 
                        rows={3} 
                        placeholder="填写预测依据、市场分析或特殊情况..."
                      />
                    </Form.Item>
                    
                    <Form.Item>
                      <Space>
                        <Button type="primary" onClick={handleSubmitPrediction}>
                          提交预测
                        </Button>
                        <Button>采用AI建议</Button>
                        <Button>保存草稿</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </Space>
            </TabPane>
            
            <TabPane tab="历史数据" key="history">
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                📈 历史销售数据分析
                <br />
                <Text type="secondary">显示过去12个月的销售趋势和季节性规律</Text>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default PredictionWorkbench;