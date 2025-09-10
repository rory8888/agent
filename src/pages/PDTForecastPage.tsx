import React, { useState } from 'react';
import { 
  Typography, Card, Row, Col, Table, InputNumber, Button, Space, 
  Statistic, Tag, Progress, Alert, Divider, Tooltip, Avatar, 
  message, Modal, Form, Input, Select, Badge
} from 'antd';
import { 
  AuditOutlined, TeamOutlined, EditOutlined, CheckCircleOutlined,
  HistoryOutlined, BarChartOutlined, ExclamationCircleOutlined,
  SaveOutlined, ReloadOutlined, DownloadOutlined, UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PNSummaryData {
  key: string;
  pn: string;
  region: string;
  salesPerson: string;
  salesForecast: number;
  adjustedForecast: number;
  adjustmentRatio: number;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewComment: string;
}

interface HistoricalData {
  month: string;
  sales: number;
  growth: number;
}

const PDTForecastPage: React.FC = () => {
  const [summaryData, setSummaryData] = useState<PNSummaryData[]>([
    {
      key: '1',
      pn: 'A5634',
      region: '华东区',
      salesPerson: '张三',
      salesForecast: 15000,
      adjustedForecast: 16500,
      adjustmentRatio: 10,
      reviewStatus: 'approved',
      reviewComment: '根据Q4 GTM策略，适当调高'
    },
    {
      key: '2',
      pn: 'A2637',
      region: '华东区',
      salesPerson: '张三',
      salesForecast: 12000,
      adjustedForecast: 11000,
      adjustmentRatio: -8.3,
      reviewStatus: 'approved',
      reviewComment: '市场饱和，适度调低'
    },
    {
      key: '3',
      pn: 'A1266',
      region: '华南区',
      salesPerson: '李四',
      salesForecast: 8500,
      adjustedForecast: 8500,
      adjustmentRatio: 0,
      reviewStatus: 'pending',
      reviewComment: ''
    },
    {
      key: '4',
      pn: 'A8857',
      region: '华北区',
      salesPerson: '王五',
      salesForecast: 0,
      adjustedForecast: 5000,
      adjustmentRatio: 100,
      reviewStatus: 'pending',
      reviewComment: ''
    },
    {
      key: '5',
      pn: 'A2663',
      region: '华南区',
      salesPerson: '李四',
      salesForecast: 0,
      adjustedForecast: 3000,
      adjustmentRatio: 100,
      reviewStatus: 'rejected',
      reviewComment: '新品预测过于乐观，需重新评估'
    }
  ]);

  const [historicalData] = useState<HistoricalData[]>([
    { month: '2024-03', sales: 45600, growth: 12.5 },
    { month: '2024-04', sales: 48200, growth: 5.7 },
    { month: '2024-05', sales: 52100, growth: 8.1 },
    { month: '2024-06', sales: 49800, growth: -4.4 },
    { month: '2024-07', sales: 53200, growth: 6.8 },
    { month: '2024-08', sales: 55100, growth: 3.6 }
  ]);

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentReviewRecord, setCurrentReviewRecord] = useState<PNSummaryData | null>(null);
  const [form] = Form.useForm();

  const handleAdjustment = (record: PNSummaryData, value: number) => {
    const newData = summaryData.map(item => {
      if (item.key === record.key) {
        const adjustmentRatio = ((value - item.salesForecast) / item.salesForecast) * 100;
        return {
          ...item,
          adjustedForecast: value,
          adjustmentRatio: Math.round(adjustmentRatio * 10) / 10
        };
      }
      return item;
    });
    setSummaryData(newData);
  };

  const handleReview = (record: PNSummaryData) => {
    setCurrentReviewRecord(record);
    form.setFieldsValue({
      reviewStatus: record.reviewStatus,
      reviewComment: record.reviewComment
    });
    setReviewModalVisible(true);
  };

  const handleReviewSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (currentReviewRecord) {
        const newData = summaryData.map(item => {
          if (item.key === currentReviewRecord.key) {
            return {
              ...item,
              reviewStatus: values.reviewStatus,
              reviewComment: values.reviewComment
            };
          }
          return item;
        });
        setSummaryData(newData);
        message.success('审核完成');
        setReviewModalVisible(false);
      }
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'processing';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已批准';
      case 'rejected': return '已驳回';
      case 'pending': return '待审核';
      default: return '未知';
    }
  };

  const getAdjustmentColor = (ratio: number) => {
    if (ratio > 0) return '#52c41a';
    if (ratio < 0) return '#ff4d4f';
    return '#1890ff';
  };

  const columns: ColumnsType<PNSummaryData> = [
    {
      title: 'PN',
      dataIndex: 'pn',
      key: 'pn',
      width: 100,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '13px', fontWeight: 'bold' }}>{text}</Tag>
      )
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Sales',
      dataIndex: 'salesPerson',
      key: 'salesPerson',
      width: 100,
      render: (text: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          <Text>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Sales预测',
      dataIndex: 'salesForecast',
      key: 'salesForecast',
      width: 120,
      render: (value: number) => (
        <Text style={{ color: '#666', fontSize: '13px' }}>
          {value.toLocaleString()}
        </Text>
      )
    },
    {
      title: '调整后预测',
      dataIndex: 'adjustedForecast',
      key: 'adjustedForecast',
      width: 140,
      render: (value: number, record: PNSummaryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ width: '100%' }}
          onChange={(val) => handleAdjustment(record, val || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => val!.replace(/\$\s?|(,*)/g, '')}
          min={0}
        />
      )
    },
    {
      title: '调整比例',
      dataIndex: 'adjustmentRatio',
      key: 'adjustmentRatio',
      width: 100,
      render: (ratio: number) => (
        <Text 
          strong 
          style={{ 
            color: getAdjustmentColor(ratio),
            fontSize: '13px'
          }}
        >
          {ratio > 0 ? '+' : ''}{ratio}%
        </Text>
      )
    },
    {
      title: '审核状态',
      dataIndex: 'reviewStatus',
      key: 'reviewStatus',
      width: 100,
      render: (status: string) => (
        <Badge status={getStatusColor(status)} text={getStatusText(status)} />
      )
    },
    {
      title: '审核意见',
      dataIndex: 'reviewComment',
      key: 'reviewComment',
      width: 200,
      render: (comment: string) => (
        <Text 
          ellipsis={{ tooltip: comment }} 
          style={{ fontSize: '12px', color: '#666', maxWidth: '180px' }}
        >
          {comment || '暂无'}
        </Text>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record: PNSummaryData) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleReview(record)}
        >
          审核
        </Button>
      )
    }
  ];

  const totalSalesForecast = summaryData.reduce((sum, item) => sum + item.salesForecast, 0);
  const totalAdjustedForecast = summaryData.reduce((sum, item) => sum + item.adjustedForecast, 0);
  const overallAdjustment = totalSalesForecast > 0 ? 
    ((totalAdjustedForecast - totalSalesForecast) / totalSalesForecast) * 100 : 0;
  
  const approvedCount = summaryData.filter(item => item.reviewStatus === 'approved').length;
  const pendingCount = summaryData.filter(item => item.reviewStatus === 'pending').length;
  const rejectedCount = summaryData.filter(item => item.reviewStatus === 'rejected').length;

  return (
    <div style={{ 
      padding: '16px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 标题区域 */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #52c41a, #1890ff)',
          borderRadius: '2px',
          marginBottom: 12
        }} />
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#262626' }}>
              <AuditOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              PN预测审核与调整
            </Title>
            <Text type="secondary">基于Sales预测进行汇总分析，结合历史数据和GTM策略进行调整</Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />}>
                刷新数据
              </Button>
              <Button type="primary" icon={<DownloadOutlined />}>
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 概览统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="总预测量"
              value={totalAdjustedForecast}
              precision={0}
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="整体调整"
              value={overallAdjustment}
              precision={1}
              suffix="%"
              valueStyle={{ 
                color: getAdjustmentColor(overallAdjustment), 
                fontSize: '18px' 
              }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="已审核"
              value={approvedCount}
              suffix={`/${summaryData.length}`}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="待审核"
              value={pendingCount}
              valueStyle={{ color: '#faad14', fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 主要内容区域 - PN汇总表 */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <TeamOutlined style={{ color: '#1890ff' }} />
                <span>PN预测汇总</span>
                <Badge count={pendingCount} style={{ backgroundColor: '#faad14' }} />
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            {pendingCount > 0 && (
              <Alert
                message={`还有 ${pendingCount} 个PN待审核`}
                description="请审核员及时处理待审核项目，确保预测数据准确性"
                type="warning"
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}
            
            <Table
              columns={columns}
              dataSource={summaryData}
              size="small"
              pagination={false}
              scroll={{ x: 800 }}
              summary={(pageData) => {
                const totalSales = pageData.reduce((sum, item) => sum + item.salesForecast, 0);
                const totalAdjusted = pageData.reduce((sum, item) => sum + item.adjustedForecast, 0);
                return (
                  <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <Text strong>合计</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text strong>{totalSales.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text strong>{totalAdjusted.toLocaleString()}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <Text 
                        strong 
                        style={{ color: getAdjustmentColor(overallAdjustment) }}
                      >
                        {overallAdjustment > 0 ? '+' : ''}{overallAdjustment.toFixed(1)}%
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} colSpan={3} />
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </Col>

        {/* 历史数据参考 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <HistoryOutlined style={{ color: '#722ed1' }} />
                <span>历史销售参考</span>
              </Space>
            }
            style={{ borderRadius: '12px', height: '100%' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                过去6个月销售趋势，供调整参考
              </Text>
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }}>
              {historicalData.map((item, index) => (
                <div key={index} style={{ 
                  padding: '8px 12px', 
                  backgroundColor: '#fafafa',
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0'
                }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text strong style={{ fontSize: '13px' }}>{item.month}</Text>
                    </Col>
                    <Col>
                      <Space size={8}>
                        <Text style={{ fontSize: '12px' }}>
                          {item.sales.toLocaleString()}
                        </Text>
                        <Text 
                          style={{ 
                            fontSize: '11px',
                            color: item.growth >= 0 ? '#52c41a' : '#ff4d4f'
                          }}
                        >
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </div>
              ))}
            </Space>

            <Divider style={{ margin: '16px 0' }} />
            
            <Alert
              message="GTM策略提醒"
              description={
                <div style={{ fontSize: '12px' }}>
                  <div>• Q4重点推广A5634系列</div>
                  <div>• 新品A8857预期12月上市</div>
                  <div>• 华南区加大市场投入</div>
                </div>
              }
              type="info"
              showIcon
              icon={<BarChartOutlined />}
              style={{ marginTop: 12 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 审核弹窗 */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            审核PN预测
          </Space>
        }
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleReviewSubmit}
        width={500}
      >
        {currentReviewRecord && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">PN:</Text> 
                  <Text strong style={{ marginLeft: 8 }}>{currentReviewRecord.pn}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">区域:</Text> 
                  <Text strong style={{ marginLeft: 8 }}>{currentReviewRecord.region}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Sales预测:</Text> 
                  <Text style={{ marginLeft: 8 }}>{currentReviewRecord.salesForecast.toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">调整后:</Text> 
                  <Text style={{ marginLeft: 8 }}>{currentReviewRecord.adjustedForecast.toLocaleString()}</Text>
                </Col>
              </Row>
            </div>
            
            <Form form={form} layout="vertical">
              <Form.Item
                label="审核状态"
                name="reviewStatus"
                rules={[{ required: true, message: '请选择审核状态' }]}
              >
                <Select placeholder="请选择审核状态">
                  <Option value="approved">批准</Option>
                  <Option value="rejected">驳回</Option>
                  <Option value="pending">待定</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="审核意见"
                name="reviewComment"
                rules={[{ required: true, message: '请输入审核意见' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="请输入审核意见，包括调整依据、GTM策略考虑等"
                  maxLength={200}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PDTForecastPage;