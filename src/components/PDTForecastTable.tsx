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
  Card,
  InputNumber,
  message,
  Popconfirm
} from 'antd';
import { 
  DownloadOutlined, 
  SearchOutlined, 
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  FilterOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PDTForecast } from '../types';
import { mockPDTData, cnCategories } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: PDTForecast;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? 
    <InputNumber 
      style={{ width: '100%' }} 
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
    /> : 
    <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        inputNode
      ) : (
        children
      )}
    </td>
  );
};

const PDTForecastTable: React.FC = () => {
  const [data, setData] = useState<PDTForecast[]>(mockPDTData);
  const [filteredData, setFilteredData] = useState<PDTForecast[]>(mockPDTData);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isEditing = (record: PDTForecast) => record.key === editingKey;

  const edit = (record: Partial<PDTForecast> & { key: React.Key }) => {
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
        item.cnCategory.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(item => item.cnCategory === category);
    }
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('导出成功');
    }, 1000);
  };

  const handleAddRow = () => {
    const newKey = (data.length + 1).toString();
    const newRow: PDTForecast = {
      key: newKey,
      cnCategory: '',
      q3AchievedAmount: 0,
      septemberForecast: 0,
      octoberForecast: 0,
      novemberForecast: 0,
      decemberForecast: 0,
      q3TotalAmount: 0,
      q4TotalAmount: 0
    };
    setData([...data, newRow]);
    setFilteredData([...filteredData, newRow]);
    setEditingKey(newKey);
  };

  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  const getQ4Progress = (q3Amount: number, q4Amount: number) => {
    if (!q4Amount) return 0;
    return Math.min((q3Amount / q4Amount) * 100, 100);
  };

  const columns: ColumnsType<PDTForecast> = [
    {
      title: 'CN品类',
      dataIndex: 'cnCategory',
      key: 'cnCategory',
      fixed: 'left',
      width: 120,
      editable: true,
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '13px', fontWeight: 'bold' }}>
          {text}
        </Tag>
      ),
      sorter: (a, b) => a.cnCategory.localeCompare(b.cnCategory),
    },
    {
      title: 'Q3已达成金额',
      dataIndex: 'q3AchievedAmount',
      key: 'q3AchievedAmount',
      width: 130,
      editable: true,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.q3AchievedAmount - b.q3AchievedAmount,
    },
    {
      title: '9月预测',
      dataIndex: 'septemberForecast',
      key: 'septemberForecast',
      width: 110,
      editable: true,
      render: (amount: number) => (
        <Text style={{ color: '#1890ff', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.septemberForecast - b.septemberForecast,
    },
    {
      title: '10月预测',
      dataIndex: 'octoberForecast',
      key: 'octoberForecast',
      width: 110,
      editable: true,
      render: (amount: number) => (
        <Text style={{ color: '#1890ff', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.octoberForecast - b.octoberForecast,
    },
    {
      title: '11月预测',
      dataIndex: 'novemberForecast',
      key: 'novemberForecast',
      width: 110,
      editable: true,
      render: (amount: number) => (
        <Text style={{ color: '#1890ff', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.novemberForecast - b.novemberForecast,
    },
    {
      title: '12月预测',
      dataIndex: 'decemberForecast',
      key: 'decemberForecast',
      width: 110,
      editable: true,
      render: (amount: number) => (
        <Text style={{ color: '#1890ff', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.decemberForecast - b.decemberForecast,
    },
    {
      title: 'Q3总金额',
      dataIndex: 'q3TotalAmount',
      key: 'q3TotalAmount',
      width: 120,
      editable: true,
      render: (amount: number) => (
        <Text strong style={{ color: '#722ed1', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.q3TotalAmount - b.q3TotalAmount,
    },
    {
      title: 'Q4总金额',
      dataIndex: 'q4TotalAmount',
      key: 'q4TotalAmount',
      width: 120,
      editable: true,
      render: (amount: number) => (
        <Text strong style={{ color: '#fa8c16', fontSize: '13px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.q4TotalAmount - b.q4TotalAmount,
    },
    {
      title: '达成进度',
      key: 'progress',
      width: 120,
      render: (_, record: PDTForecast) => {
        const progress = getQ4Progress(record.q3AchievedAmount, record.q3TotalAmount);
        return (
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Progress
              percent={progress}
              size="small"
              strokeColor={progress >= 90 ? '#52c41a' : progress >= 70 ? '#faad14' : '#f5222d'}
              format={() => `${progress.toFixed(0)}%`}
            />
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record: PDTForecast) => {
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
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: PDTForecast) => ({
        record,
        inputType: col.dataIndex === 'cnCategory' ? 'text' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
                placeholder="搜索品类"
                allowClear
                onSearch={handleSearch}
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="选择品类"
                allowClear
                style={{ width: 150 }}
                onChange={handleCategoryFilter}
                suffixIcon={<FilterOutlined />}
              >
                {cnCategories.map(category => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Space>
            
            <Space>
              <Button 
                type="primary" 
                ghost
                icon={<PlusOutlined />}
                onClick={handleAddRow}
                disabled={editingKey !== ''}
              >
                添加品类
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
          </Space>
        </div>

        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200, y: 500 }}
          size="middle"
          loading={loading}
        />
      </Card>

      <style jsx>{`
        .editable-row .ant-form-item {
          margin: 0;
        }
        .ant-table-tbody > tr > td {
          padding: 12px 8px;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-weight: 600;
          color: #262626;
        }
      `}</style>
    </div>
  );
};

export default PDTForecastTable;