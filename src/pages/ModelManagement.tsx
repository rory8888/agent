import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Space, 
  Button, 
  Tag, 
  Progress,
  Switch,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Statistic,
  Divider
} from 'antd';
import { 
  SettingOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ModelPerformance } from '../types';
import { mockModelData } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

const ModelManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelPerformance[]>(mockModelData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelPerformance | null>(null);
  const [form] = Form.useForm();

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return '#52c41a';
    if (accuracy >= 90) return '#faad14';
    return '#f5222d';
  };

  const handleModelToggle = (name: string, checked: boolean) => {
    setModels(prev => prev.map(model => ({
      ...model,
      isActive: model.name === name ? checked : (checked ? false : model.isActive)
    })));
    message.success(`模型 ${name} ${checked ? '已激活' : '已停用'}`);
  };

  const handleAddModel = () => {
    setEditingModel(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditModel = (model: ModelPerformance) => {
    setEditingModel(model);
    form.setFieldsValue(model);
    setModalVisible(true);
  };

  const handleDeleteModel = (name: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除模型 "${name}" 吗？`,
      onOk: () => {
        setModels(prev => prev.filter(model => model.name !== name));
        message.success('模型删除成功');
      }
    });
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingModel) {
        setModels(prev => prev.map(model => 
          model.name === editingModel.name ? { ...model, ...values } : model
        ));
        message.success('模型更新成功');
      } else {
        const newModel: ModelPerformance = {
          ...values,
          isActive: false
        };
        setModels(prev => [...prev, newModel]);
        message.success('模型创建成功');
      }
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<ModelPerformance> = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text: string, record: ModelPerformance) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          <Tag color="blue" style={{ fontSize: '11px' }}>{record.type}</Tag>
        </Space>
      ),
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 150,
      render: (value: number) => (
        <Progress
          percent={value}
          size="small"
          strokeColor={getAccuracyColor(value)}
          format={() => `${value}%`}
        />
      ),
      sorter: (a, b) => a.accuracy - b.accuracy,
    },
    {
      title: 'MAE',
      dataIndex: 'mae',
      key: 'mae',
      width: 100,
      render: (value: number) => (
        <Text style={{ fontFamily: 'monospace' }}>{value.toFixed(3)}</Text>
      ),
      sorter: (a, b) => a.mae - b.mae,
    },
    {
      title: 'RMSE',
      dataIndex: 'rmse',
      key: 'rmse',
      width: 100,
      render: (value: number) => (
        <Text style={{ fontFamily: 'monospace' }}>{value.toFixed(3)}</Text>
      ),
      sorter: (a, b) => a.rmse - b.rmse,
    },
    {
      title: 'MAPE',
      dataIndex: 'mape',
      key: 'mape',
      width: 100,
      render: (value: number) => (
        <Text style={{ fontFamily: 'monospace' }}>{value.toFixed(1)}%</Text>
      ),
      sorter: (a, b) => a.mape - b.mape,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record: ModelPerformance) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleModelToggle(record.name, checked)}
          checkedChildren="激活"
          unCheckedChildren="停用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record: ModelPerformance) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditModel(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            icon={<SettingOutlined />} 
            size="small"
          >
            配置
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteModel(record.name)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const activeModel = models.find(model => model.isActive);

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626', fontWeight: 600 }}>
          预测模型管理
        </Title>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px',
          marginTop: '8px'
        }} />
      </div>

      {activeModel && (
        <Card 
          style={{ 
            marginBottom: 24,
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col flex={1}>
              <Space direction="vertical" size={4}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                  当前激活模型
                </Text>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                  {activeModel.name}
                </Title>
                <Tag color="green" style={{ marginTop: 8 }}>
                  {activeModel.type}
                </Tag>
              </Space>
            </Col>
            <Col>
              <Row gutter={24}>
                <Col>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>准确率</span>}
                    value={activeModel.accuracy}
                    suffix="%"
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>MAE</span>}
                    value={activeModel.mae}
                    precision={3}
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                </Col>
                <Col>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>MAPE</span>}
                    value={activeModel.mape}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                模型列表
              </Title>
              <Text type="secondary">管理和配置预测模型</Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddModel}
            >
              添加模型
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={models}
          rowKey="name"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingModel ? '编辑模型' : '添加模型'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模型名称"
                rules={[{ required: true, message: '请输入模型名称' }]}
              >
                <input style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模型类型"
                rules={[{ required: true, message: '请选择模型类型' }]}
              >
                <Select>
                  <Option value="ARIMA">ARIMA</Option>
                  <Option value="Prophet">Prophet</Option>
                  <Option value="Linear">Linear Regression</Option>
                  <Option value="Neural Network">Neural Network</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Divider />
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accuracy"
                label="准确率 (%)"
                rules={[{ required: true, message: '请输入准确率' }]}
              >
                <InputNumber min={0} max={100} precision={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mae"
                label="MAE"
                rules={[{ required: true, message: '请输入MAE值' }]}
              >
                <InputNumber min={0} precision={3} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rmse"
                label="RMSE"
                rules={[{ required: true, message: '请输入RMSE值' }]}
              >
                <InputNumber min={0} precision={3} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mape"
                label="MAPE (%)"
                rules={[{ required: true, message: '请输入MAPE值' }]}
              >
                <InputNumber min={0} precision={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelManagement;