import React, { useState } from 'react';
import { 
  Table, 
  Typography, 
  Space, 
  Button, 
  Tag, 
  Input, 
  Select,
  Card,
  InputNumber,
  message,
  Tooltip,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  DownloadOutlined, 
  SearchOutlined, 
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  FilterOutlined,
  UploadOutlined,
  CopyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ForecastTemplate } from '../types';
import { mockForecastTemplateData, channels, productStatuses } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select';
  record: ForecastTemplate;
  index: number;
  children: React.ReactNode;
  options?: { label: string; value: string }[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  ...restProps
}) => {
  let inputNode;
  
  if (inputType === 'number') {
    inputNode = <InputNumber style={{ width: '100%' }} min={0} />;
  } else if (inputType === 'select' && options) {
    inputNode = (
      <Select style={{ width: '100%' }}>
        {options.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  } else {
    inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? inputNode : children}
    </td>
  );
};

const ForecastCollectionTemplate: React.FC = () => {
  const [data, setData] = useState<ForecastTemplate[]>(mockForecastTemplateData);
  const [filteredData, setFilteredData] = useState<ForecastTemplate[]>(mockForecastTemplateData);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    channel: '',
    productStatus: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const isEditing = (record: ForecastTemplate) => record.key === editingKey;

  const edit = (record: Partial<ForecastTemplate> & { key: React.Key }) => {
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      setEditingKey('');
      message.success('保存成功');
    } catch (errInfo) {
      console.log('保存失败:', errInfo);
      message.error('保存失败');
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, filters);
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    filterData(searchText, newFilters);
  };

  const filterData = (search: string, filterParams: any) => {
    let filtered = data;
    
    if (search) {
      filtered = filtered.filter(item => 
        item.ankerSKU.toLowerCase().includes(search.toLowerCase()) ||
        item.pdt.toLowerCase().includes(search.toLowerCase()) ||
        item.pn.toLowerCase().includes(search.toLowerCase()) ||
        item.skuDescription.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key]) {
        filtered = filtered.filter(item => item[key as keyof ForecastTemplate] === filterParams[key]);
      }
    });
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('导出成功');
    }, 1000);
  };

  const handleImport = () => {
    message.info('导入功能开发中...');
  };

  const handleAddRow = () => {
    const newKey = (data.length + 1).toString();
    const newRow: ForecastTemplate = {
      key: newKey,
      channel: '',
      ankerSKU: '',
      pdt: '',
      singularity: '',
      pn: '',
      skuDescription: '',
      productStatus: 'active',
      jan2025Sales: 0,
      feb2025Sales: 0,
      mar2025Sales: 0,
      apr2025Sales: 0,
      may2025Sales: 0,
      jun2025Sales: 0,
      q3Summary: 0
    };
    setData([...data, newRow]);
    setFilteredData([...filteredData, newRow]);
    setEditingKey(newKey);
  };

  const getProductStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'default',
      'eol': 'error',
      'new': 'processing'
    };
    return statusMap[status] || 'default';
  };

  const getProductStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'active': '在售',
      'inactive': '停售',
      'eol': 'EOL',
      'new': '新品'
    };
    return statusMap[status] || status;
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toLocaleString();
  };

  const columns: ColumnsType<ForecastTemplate> = [
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      fixed: 'left',
      width: 100,
      editable: true,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '12px' }}>
          {text}
        </Tag>
      ),
      sorter: (a, b) => a.channel.localeCompare(b.channel),
    },
    {
      title: 'Anker SKU',
      dataIndex: 'ankerSKU',
      key: 'ankerSKU',
      fixed: 'left',
      width: 130,
      editable: true,
      render: (text: string) => (
        <Text code style={{ fontSize: '11px' }}>
          {text}
        </Text>
      ),
      sorter: (a, b) => a.ankerSKU.localeCompare(b.ankerSKU),
    },
    {
      title: 'PDT',
      dataIndex: 'pdt',
      key: 'pdt',
      width: 80,
      editable: true,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '奇点',
      dataIndex: 'singularity',
      key: 'singularity',
      width: 100,
      editable: true,
      render: (text: string) => (
        <Tag color="cyan" style={{ fontSize: '11px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'PN',
      dataIndex: 'pn',
      key: 'pn',
      width: 120,
      editable: true,
      render: (text: string) => (
        <Text 
          strong 
          style={{ 
            fontSize: '14px',
            color: '#1890ff',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #e6f7ff, #f0f9ff)',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #91d5ff'
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'SKU描述',
      dataIndex: 'skuDescription',
      key: 'skuDescription',
      width: 180,
      editable: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: '11px', maxWidth: '160px', display: 'block' }} ellipsis>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '产品状态',
      dataIndex: 'productStatus',
      key: 'productStatus',
      width: 90,
      editable: true,
      render: (status: string) => (
        <Tag color={getProductStatusColor(status)} style={{ fontSize: '11px' }}>
          {getProductStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '25年1月',
      dataIndex: 'jan2025Sales',
      key: 'jan2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.jan2025Sales - b.jan2025Sales,
    },
    {
      title: '25年2月',
      dataIndex: 'feb2025Sales',
      key: 'feb2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.feb2025Sales - b.feb2025Sales,
    },
    {
      title: '25年3月',
      dataIndex: 'mar2025Sales',
      key: 'mar2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.mar2025Sales - b.mar2025Sales,
    },
    {
      title: '25年4月',
      dataIndex: 'apr2025Sales',
      key: 'apr2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.apr2025Sales - b.apr2025Sales,
    },
    {
      title: '25年5月',
      dataIndex: 'may2025Sales',
      key: 'may2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.may2025Sales - b.may2025Sales,
    },
    {
      title: '25年6月',
      dataIndex: 'jun2025Sales',
      key: 'jun2025Sales',
      width: 90,
      editable: true,
      render: (value: number) => (
        <Text style={{ fontSize: '12px', color: '#722ed1' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.jun2025Sales - b.jun2025Sales,
    },
    {
      title: 'Q3汇总',
      dataIndex: 'q3Summary',
      key: 'q3Summary',
      width: 100,
      render: (value: number) => (
        <Text strong style={{ fontSize: '13px', color: '#f5222d' }}>
          {formatQuantity(value)}
        </Text>
      ),
      sorter: (a, b) => a.q3Summary - b.q3Summary,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record: ForecastTemplate) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Tooltip title="保存">
              <Button 
                type="link" 
                icon={<SaveOutlined />} 
                size="small"
                onClick={() => save(record.key)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
            <Tooltip title="取消">
              <Button 
                type="link" 
                icon={<CloseOutlined />} 
                size="small"
                onClick={cancel}
                style={{ color: '#f5222d' }}
              />
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Tooltip title="编辑">
              <Button
                type="link"
                icon={<EditOutlined />}
                size="small"
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
              />
            </Tooltip>
            <Tooltip title="复制">
              <Button
                type="link"
                icon={<CopyOutlined />}
                size="small"
                disabled={editingKey !== ''}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    const getInputType = (dataIndex: string) => {
      if (dataIndex === 'productStatus') return 'select';
      if (dataIndex?.includes('Sales') || dataIndex === 'q3Summary') return 'number';
      return 'text';
    };

    const getOptions = (dataIndex: string) => {
      if (dataIndex === 'productStatus') {
        return productStatuses.map(status => ({
          label: getProductStatusText(status),
          value: status
        }));
      }
      return undefined;
    };

    return {
      ...col,
      onCell: (record: ForecastTemplate) => ({
        record,
        inputType: getInputType(col.dataIndex as string),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: getOptions(col.dataIndex as string),
      }),
    };
  });

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // 统计数据
  const totalQ3Summary = filteredData.reduce((sum, item) => sum + item.q3Summary, 0);
  const avgMonthlySales = filteredData.length > 0 
    ? filteredData.reduce((sum, item) => 
        sum + item.jan2025Sales + item.feb2025Sales + item.mar2025Sales + 
        item.apr2025Sales + item.may2025Sales + item.jun2025Sales, 0
      ) / (filteredData.length * 6)
    : 0;

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px'
        }} />
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title="Q3预测汇总"
              value={totalQ3Summary}
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title="平均月销量"
              value={avgMonthlySales}
              precision={0}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small">
            <Statistic
              title="SKU总数"
              value={filteredData.length}
              suffix="个"
              valueStyle={{ color: '#722ed1', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col flex={1}>
              <Space wrap>
                <Search
                  placeholder="搜索SKU/PDT/PN/描述"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 250 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="选择渠道"
                  allowClear
                  style={{ width: 120 }}
                  onChange={(value) => handleFilterChange('channel', value)}
                >
                  {channels.map(channel => (
                    <Option key={channel} value={channel}>
                      {channel}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="产品状态"
                  allowClear
                  style={{ width: 100 }}
                  onChange={(value) => handleFilterChange('productStatus', value)}
                >
                  {productStatuses.map(status => (
                    <Option key={status} value={status}>
                      {getProductStatusText(status)}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  ghost
                  icon={<UploadOutlined />}
                  onClick={handleImport}
                >
                  导入模板
                </Button>
                <Button 
                  type="primary" 
                  ghost
                  icon={<PlusOutlined />}
                  onClick={handleAddRow}
                  disabled={editingKey !== ''}
                >
                  添加SKU
                </Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  loading={loading}
                >
                  导出Excel
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: '8px 12px', background: '#e6f7ff', borderRadius: '6px' }}>
            <Text>已选择 {selectedRowKeys.length} 项</Text>
            <Divider type="vertical" />
            <Button type="link" size="small">批量编辑</Button>
            <Button type="link" size="small">批量复制</Button>
            <Button type="link" size="small">批量删除</Button>
          </div>
        )}

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowSelection={rowSelection}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1600, y: 500 }}
          size="small"
          loading={loading}
        />
      </Card>

      <style jsx>{`
        .editable-row .ant-form-item {
          margin: 0;
        }
        .ant-table-tbody > tr > td {
          padding: 8px;
          font-size: 12px;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-weight: 600;
          color: #262626;
          font-size: 12px;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default ForecastCollectionTemplate;