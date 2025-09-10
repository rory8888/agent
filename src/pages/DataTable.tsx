import React, { useState } from 'react';
import { 
  Table, 
  Typography, 
  Space, 
  Button, 
  Tag, 
  Input, 
  Select,
  Progress,
  Tooltip,
  Card
} from 'antd';
import { 
  DownloadOutlined, 
  SearchOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  MinusOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { TableData } from '../types';
import { mockTableData } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const DataTable: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TableData[]>(mockTableData);
  const [filteredData, setFilteredData] = useState<TableData[]>(mockTableData);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'down':
        return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MinusOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return '#52c41a';
    if (variance < -5) return '#f5222d';
    return '#faad14';
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, categoryFilter);
  };

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    filterData(searchText, value);
  };

  const filterData = (search: string, category: string) => {
    let filtered = data;
    
    if (search) {
      filtered = filtered.filter(item => 
        item.product.toLowerCase().includes(search.toLowerCase()) ||
        item.region.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    setLoading(true);
    // Simulate export
    setTimeout(() => {
      setLoading(false);
      // Here you would implement actual export logic
      console.log('Exporting data...', filteredData);
    }, 1000);
  };

  const columns: ColumnsType<TableData> = [
    {
      title: '产品名称',
      dataIndex: 'product',
      key: 'product',
      fixed: 'left',
      width: 180,
      render: (text: string, record: TableData) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
        </Space>
      ),
      sorter: (a, b) => a.product.localeCompare(b.product),
    },
    {
      title: '销售区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '12px' }}>{text}</Tag>
      ),
      filters: [
        { text: '华北', value: '华北' },
        { text: '华东', value: '华东' },
        { text: '华南', value: '华南' },
        { text: '华中', value: '华中' },
        { text: '西南', value: '西南' },
      ],
      onFilter: (value, record) => record.region === value,
    },
    {
      title: '实际销售额',
      dataIndex: 'actualSales',
      key: 'actualSales',
      width: 140,
      render: (value: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ¥{(value / 10000).toFixed(1)}万
        </Text>
      ),
      sorter: (a, b) => a.actualSales - b.actualSales,
    },
    {
      title: '预测销售额',
      dataIndex: 'forecastSales',
      key: 'forecastSales',
      width: 140,
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ¥{(value / 10000).toFixed(1)}万
        </Text>
      ),
      sorter: (a, b) => a.forecastSales - b.forecastSales,
    },
    {
      title: '差异率',
      dataIndex: 'variance',
      key: 'variance',
      width: 120,
      render: (value: number, record: TableData) => (
        <Space align="center">
          <Text style={{ color: getVarianceColor(value), fontWeight: 'bold' }}>
            {value > 0 ? '+' : ''}{value.toFixed(1)}%
          </Text>
          {getTrendIcon(record.trend)}
        </Space>
      ),
      sorter: (a, b) => a.variance - b.variance,
    },
    {
      title: '预测准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      width: 160,
      render: (value: number) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value >= 95 ? '#52c41a' : value >= 90 ? '#faad14' : '#f5222d'}
            format={() => `${value}%`}
          />
        </Space>
      ),
      sorter: (a, b) => a.accuracy - b.accuracy,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record: TableData) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" size="small">
              详情
            </Button>
          </Tooltip>
          <Tooltip title="调整预测">
            <Button type="link" size="small">
              调整
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const tableProps: TableProps<TableData> = {
    dataSource: filteredData,
    columns,
    loading,
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    },
    scroll: { x: 1000 },
    size: 'middle',
    rowClassName: (record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark',
  };

  const categories = [...new Set(data.map(item => item.category))];

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#262626', fontWeight: 600 }}>
          详细数据分析
        </Title>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px',
          marginTop: '8px'
        }} />
      </div>

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="搜索产品或区域"
                allowClear
                onSearch={handleSearch}
                style={{ width: 250 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="选择类别"
                allowClear
                style={{ width: 150 }}
                onChange={handleCategoryFilter}
                suffixIcon={<FilterOutlined />}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Space>
            
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={loading}
            >
              导出数据
            </Button>
          </Space>
        </div>

        <Table {...tableProps} />
      </Card>

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default DataTable;