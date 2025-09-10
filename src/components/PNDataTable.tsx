import React, { useState, useMemo, useCallback, memo } from 'react';
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
  Row,
  Col,
  Statistic,
  Divider,
  Badge,
  Dropdown,
  Checkbox,
  Switch,
  Drawer,
  Form,
  InputNumber,
  DatePicker,
  Tabs
} from 'antd';
import { 
  DownloadOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  ColumnHeightOutlined,
  ReloadOutlined,
  MenuOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { PNData } from '../types';
import { mockPNData, singularitySegments, productStatuses, salesTrends } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;


const PNDataTable: React.FC = () => {
  const [data, setData] = useState<PNData[]>(mockPNData);
  const [filteredData, setFilteredData] = useState<PNData[]>(mockPNData);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    singularitySegment: '',
    productStatus: '',
    salesTrend: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // 列显示控制 - 默认显示所有列
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
    'pdt', 'pn', 'singularitySegment', 'productStatus', 'salesTrend',
    'q3ForecastQuantity', 'q3ForecastAmount', 'julyForecast', 'augustForecast', 'septemberForecast',
    'actualShipment', 'timeProgress', 'shipmentVolume', 'salesAchievementRate',
    'timeGap', 'quarterGap', 'offlineInventory', 'offlineSuper', 'omniChannelInventory', 'remarks'
  ]));
  
  // 高级筛选抽屉
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);
  
  // 表格尺寸
  const [tableSize, setTableSize] = useState<'small' | 'middle' | 'large'>('middle');
  
  // 数据详情弹窗
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PNData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSalesTrendIcon = useCallback((trend: string) => {
    switch (trend) {
      case 'rising':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'declining':
        return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
      default:
        return <MinusOutlined style={{ color: '#faad14' }} />;
    }
  }, []);

  const getProductStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'eol':
        return 'error';
      case 'new':
        return 'processing';
      default:
        return 'default';
    }
  }, []);

  const getProductStatusText = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return '在售';
      case 'inactive':
        return '停售';
      case 'eol':
        return 'EOL';
      case 'new':
        return '新品';
      default:
        return status;
    }
  }, []);

  const getSalesTrendText = useCallback((trend: string) => {
    switch (trend) {
      case 'rising':
        return '上升';
      case 'declining':
        return '下降';
      case 'stable':
        return '稳定';
      default:
        return trend;
    }
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    filterData(value, filters);
  }, [filters]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    filterData(searchText, newFilters);
  }, [filters, searchText]);

  const filterData = useCallback((search: string, filterParams: any) => {
    let filtered = data;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => 
        item.pdt.toLowerCase().includes(searchLower) ||
        item.pn.toLowerCase().includes(searchLower) ||
        item.singularitySegment.toLowerCase().includes(searchLower)
      );
    }
    
    Object.keys(filterParams).forEach(key => {
      if (filterParams[key]) {
        filtered = filtered.filter(item => item[key as keyof PNData] === filterParams[key]);
      }
    });
    
    setFilteredData(filtered);
  }, [data]);

  const handleExport = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 处理行点击，打开详情弹窗
  const handleRowClick = useCallback((record: PNData, index: number) => {
    setCurrentRecord(record);
    setCurrentIndex(index);
    setDetailModalOpen(true);
  }, []);

  // 导航到上一条/下一条数据
  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < filteredData.length) {
      setCurrentIndex(newIndex);
      setCurrentRecord(filteredData[newIndex]);
    }
  }, [currentIndex, filteredData]);

  // 保存编辑的数据
  const handleSaveRecord = useCallback((updatedRecord: PNData) => {
    const newData = data.map(item => 
      item.key === updatedRecord.key ? updatedRecord : item
    );
    setData(newData);
    setFilteredData(newData);
    setCurrentRecord(updatedRecord);
  }, [data]);

  const formatAmount = useCallback((amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }, []);

  const formatQuantity = useCallback((quantity: number) => {
    return quantity.toLocaleString();
  }, []);

  // 所有可用的列定义
  const allColumns: ColumnsType<PNData> = useMemo(() => [
    {
      title: 'PDT',
      dataIndex: 'pdt',
      key: 'pdt',
      fixed: 'left',
      width: 80,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
          {text}
        </Text>
      ),
      sorter: (a, b) => a.pdt.localeCompare(b.pdt),
    },
    {
      title: 'PN',
      dataIndex: 'pn',
      key: 'pn',
      fixed: 'left',
      width: 120,
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
      sorter: (a, b) => a.pn.localeCompare(b.pn),
    },
    {
      title: '奇点细分',
      dataIndex: 'singularitySegment',
      key: 'singularitySegment',
      width: 100,
      render: (text: string) => (
        <Tag color="cyan" style={{ fontSize: '10px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: '产品状态',
      dataIndex: 'productStatus',
      key: 'productStatus',
      width: 80,
      render: (status: string) => (
        <Badge 
          status={getProductStatusColor(status) as any} 
          text={getProductStatusText(status)}
          style={{ fontSize: '11px' }}
        />
      ),
    },
    {
      title: '销售趋势',
      dataIndex: 'salesTrend',
      key: 'salesTrend',
      width: 80,
      render: (trend: string) => (
        <Space size={4}>
          {getSalesTrendIcon(trend)}
          <Text style={{ fontSize: '11px' }}>
            {getSalesTrendText(trend)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Q3预测数量',
      dataIndex: 'q3ForecastQuantity',
      key: 'q3ForecastQuantity',
      width: 90,
      render: (quantity: number) => (
        <Text style={{ color: '#722ed1', fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.q3ForecastQuantity - b.q3ForecastQuantity,
    },
    {
      title: 'Q3预测金额',
      dataIndex: 'q3ForecastAmount',
      key: 'q3ForecastAmount',
      width: 90,
      render: (amount: number) => (
        <Text strong style={{ color: '#722ed1', fontSize: '11px' }}>
          {formatAmount(amount)}
        </Text>
      ),
      sorter: (a, b) => a.q3ForecastAmount - b.q3ForecastAmount,
    },
    {
      title: '7月预测',
      dataIndex: 'julyForecast',
      key: 'julyForecast',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ color: '#fa8c16', fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.julyForecast - b.julyForecast,
    },
    {
      title: '8月预测',
      dataIndex: 'augustForecast',
      key: 'augustForecast',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ color: '#fa8c16', fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.augustForecast - b.augustForecast,
    },
    {
      title: '9月预测',
      dataIndex: 'septemberForecast',
      key: 'septemberForecast',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ color: '#fa8c16', fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.septemberForecast - b.septemberForecast,
    },
    {
      title: '实际出货',
      dataIndex: 'actualShipment',
      key: 'actualShipment',
      width: 90,
      render: (quantity: number) => (
        <Text style={{ color: '#52c41a', fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.actualShipment - b.actualShipment,
    },
    {
      title: '时间进度',
      dataIndex: 'timeProgress',
      key: 'timeProgress',
      width: 80,
      render: (progress: number) => (
        <Text style={{ fontSize: '11px' }}>{progress}%</Text>
      ),
      sorter: (a, b) => a.timeProgress - b.timeProgress,
    },
    {
      title: '出货量',
      dataIndex: 'shipmentVolume',
      key: 'shipmentVolume',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.shipmentVolume - b.shipmentVolume,
    },
    {
      title: '销量达成率',
      dataIndex: 'salesAchievementRate',
      key: 'salesAchievementRate',
      width: 100,
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={rate >= 95 ? '#52c41a' : rate >= 80 ? '#faad14' : '#f5222d'}
          format={() => `${rate}%`}
        />
      ),
      sorter: (a, b) => a.salesAchievementRate - b.salesAchievementRate,
    },
    {
      title: '时间GAP',
      dataIndex: 'timeGap',
      key: 'timeGap',
      width: 80,
      render: (gap: number) => (
        <Text style={{ 
          color: gap > 10 ? '#f5222d' : '#52c41a',
          fontSize: '11px'
        }}>
          {gap}%
        </Text>
      ),
      sorter: (a, b) => a.timeGap - b.timeGap,
    },
    {
      title: '季度GAP',
      dataIndex: 'quarterGap',
      key: 'quarterGap',
      width: 80,
      render: (gap: number) => (
        <Text style={{ 
          color: gap > 10 ? '#f5222d' : '#52c41a',
          fontSize: '11px'
        }}>
          {gap}%
        </Text>
      ),
      sorter: (a, b) => a.quarterGap - b.quarterGap,
    },
    {
      title: 'offline库',
      dataIndex: 'offlineInventory',
      key: 'offlineInventory',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.offlineInventory - b.offlineInventory,
    },
    {
      title: 'offline超',
      dataIndex: 'offlineSuper',
      key: 'offlineSuper',
      width: 80,
      render: (quantity: number) => (
        <Text style={{ fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.offlineSuper - b.offlineSuper,
    },
    {
      title: '全渠道库',
      dataIndex: 'omniChannelInventory',
      key: 'omniChannelInventory',
      width: 90,
      render: (quantity: number) => (
        <Text strong style={{ fontSize: '11px' }}>
          {formatQuantity(quantity)}
        </Text>
      ),
      sorter: (a, b) => a.omniChannelInventory - b.omniChannelInventory,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: '11px' }} ellipsis>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 80,
      render: (_, record: PNData) => (
        <Space size={4}>
          <Tooltip title="查看">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="link" icon={<EditOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ], []);

  // 根据可见列筛选columns
  const visibleColumnsArray = useMemo(() => {
    return allColumns.filter(col => visibleColumns.has(col.key as string));
  }, [allColumns, visibleColumns]);

  // 列分组定义
  const columnGroups = useMemo(() => ({
    basic: ['pdt', 'pn', 'singularitySegment', 'productStatus', 'salesTrend'],
    forecast: ['q3ForecastQuantity', 'q3ForecastAmount', 'julyForecast', 'augustForecast', 'septemberForecast'],
    shipment: ['actualShipment', 'timeProgress', 'shipmentVolume', 'salesAchievementRate'],
    inventory: ['offlineInventory', 'offlineSuper', 'omniChannelInventory'],
    analysis: ['timeGap', 'quarterGap'],
    other: ['remarks', 'action']
  }), []);

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  }), [selectedRowKeys]);

  // 统计数据
  const statisticsData = useMemo(() => {
    const totalForecastAmount = filteredData.reduce((sum, item) => sum + item.q3ForecastAmount, 0);
    const totalActualShipment = filteredData.reduce((sum, item) => sum + item.actualShipment, 0);
    const avgAchievementRate = filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.salesAchievementRate, 0) / filteredData.length 
      : 0;
    
    return { totalForecastAmount, totalActualShipment, avgAchievementRate };
  }, [filteredData]);

  return (
    <div style={{ 
      padding: '16px',
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
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6} lg={6}>
          <Card size="small" bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Q3预测总金额"
              value={statisticsData.totalForecastAmount / 10000}
              precision={1}
              suffix="万"
              prefix="¥"
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card size="small" bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="实际出货总量"
              value={statisticsData.totalActualShipment}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card size="small" bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="平均达成率"
              value={statisticsData.avgAchievementRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Card size="small" bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="产品总数"
              value={filteredData.length}
              suffix="个"
              valueStyle={{ color: '#fa8c16', fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col flex={1}>
              <Space wrap>
                <Search
                  placeholder="搜索PDT/PN/奇点细分"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 200 }}
                  prefix={<SearchOutlined />}
                />
                <Select
                  placeholder="奇点细分"
                  allowClear
                  style={{ width: 110 }}
                  onChange={(value) => handleFilterChange('singularitySegment', value)}
                >
                  {singularitySegments.map(segment => (
                    <Option key={segment} value={segment}>
                      {segment}
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
                <Button 
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerOpen(true)}
                  style={{ border: '1px dashed #d9d9d9' }}
                >
                  高级筛选
                </Button>
              </Space>
            </Col>
            <Col>
              <Space>
                <Dropdown
                  overlay={
                    <Card size="small" style={{ minWidth: 120 }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '12px', color: '#262626' }}>表格尺寸</Text>
                      </div>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button 
                          size="small" 
                          type={tableSize === 'small' ? 'primary' : 'default'}
                          onClick={() => setTableSize('small')}
                          block
                          style={{ 
                            backgroundColor: tableSize === 'small' ? '#1890ff' : '#fff',
                            color: tableSize === 'small' ? '#fff' : '#262626',
                            border: '1px solid #d9d9d9'
                          }}
                        >
                          紧凑
                        </Button>
                        <Button 
                          size="small"
                          type={tableSize === 'middle' ? 'primary' : 'default'}
                          onClick={() => setTableSize('middle')}
                          block
                          style={{ 
                            backgroundColor: tableSize === 'middle' ? '#1890ff' : '#fff',
                            color: tableSize === 'middle' ? '#fff' : '#262626',
                            border: '1px solid #d9d9d9'
                          }}
                        >
                          默认
                        </Button>
                        <Button 
                          size="small"
                          type={tableSize === 'large' ? 'primary' : 'default'}
                          onClick={() => setTableSize('large')}
                          block
                          style={{ 
                            backgroundColor: tableSize === 'large' ? '#1890ff' : '#fff',
                            color: tableSize === 'large' ? '#fff' : '#262626',
                            border: '1px solid #d9d9d9'
                          }}
                        >
                          宽松
                        </Button>
                      </Space>
                    </Card>
                  }
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Button icon={<ColumnHeightOutlined />} />
                </Dropdown>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => setColumnSettingsOpen(true)}
                >
                  列设置
                </Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  loading={loading}
                >
                  导出
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
            <Button type="link" size="small">批量导出</Button>
          </div>
        )}

        <Table
          rowSelection={rowSelection}
          columns={visibleColumnsArray}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: visibleColumnsArray.length * 90, y: 600 }}
          size={tableSize}
          pagination={{
            defaultPageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
            size: 'default'
          }}
          rowClassName={() => 'clickable-row'}
          onRow={(record, index) => ({
            onClick: () => handleRowClick(record, index || 0),
          })}
        />
      </Card>

      {/* 列设置抽屉 */}
      <Drawer
        title="列显示设置"
        placement="right"
        onClose={() => setColumnSettingsOpen(false)}
        open={columnSettingsOpen}
        width={350}
      >
        <Tabs defaultActiveKey="groups">
          <Tabs.TabPane tab="按分组" key="groups">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(columnGroups).map(([groupKey, columns]) => (
                <Card 
                  key={groupKey} 
                  size="small" 
                  title={
                    <Space>
                      <Text strong style={{ fontSize: '13px' }}>
                        {groupKey === 'basic' && '基础信息'}
                        {groupKey === 'forecast' && '预测数据'}
                        {groupKey === 'shipment' && '出货数据'}
                        {groupKey === 'inventory' && '库存数据'}
                        {groupKey === 'analysis' && 'GAP分析'}
                        {groupKey === 'other' && '其他'}
                      </Text>
                      <Switch
                        size="small"
                        checked={columns.every(col => visibleColumns.has(col))}
                        onChange={(checked) => {
                          const newVisibleColumns = new Set(visibleColumns);
                          columns.forEach(col => {
                            if (checked) {
                              newVisibleColumns.add(col);
                            } else {
                              newVisibleColumns.delete(col);
                            }
                          });
                          setVisibleColumns(newVisibleColumns);
                        }}
                      />
                    </Space>
                  }
                >
                  <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    {columns.map(columnKey => {
                      const column = allColumns.find(col => col.key === columnKey);
                      return column ? (
                        <div key={columnKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '12px' }}>{column.title as string}</Text>
                          <Switch
                            size="small"
                            checked={visibleColumns.has(columnKey)}
                            onChange={(checked) => {
                              const newVisibleColumns = new Set(visibleColumns);
                              if (checked) {
                                newVisibleColumns.add(columnKey);
                              } else {
                                newVisibleColumns.delete(columnKey);
                              }
                              setVisibleColumns(newVisibleColumns);
                            }}
                          />
                        </div>
                      ) : null;
                    })}
                  </Space>
                </Card>
              ))}
            </Space>
          </Tabs.TabPane>
          <Tabs.TabPane tab="全部列" key="all">
            <Space direction="vertical" style={{ width: '100%' }}>
              {allColumns.map(column => (
                <div key={column.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                  <Text style={{ fontSize: '12px' }}>{column.title as string}</Text>
                  <Switch
                    size="small"
                    checked={visibleColumns.has(column.key as string)}
                    onChange={(checked) => {
                      const newVisibleColumns = new Set(visibleColumns);
                      if (checked) {
                        newVisibleColumns.add(column.key as string);
                      } else {
                        newVisibleColumns.delete(column.key as string);
                      }
                      setVisibleColumns(newVisibleColumns);
                    }}
                  />
                </div>
              ))}
            </Space>
          </Tabs.TabPane>
        </Tabs>
        <Divider />
        <Space>
          <Button 
            size="small"
            onClick={() => {
              setVisibleColumns(new Set(Object.values(columnGroups).flat()));
            }}
          >
            全选
          </Button>
          <Button 
            size="small"
            onClick={() => {
              setVisibleColumns(new Set(['pdt', 'pn', 'action']));
            }}
          >
            重置
          </Button>
        </Space>
      </Drawer>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="销量达成率">
            <Space>
              <InputNumber 
                placeholder="最小值" 
                style={{ width: 100 }}
                suffix="%"
                min={0}
                max={200}
              />
              <Text>-</Text>
              <InputNumber 
                placeholder="最大值" 
                style={{ width: 100 }}
                suffix="%"
                min={0}
                max={200}
              />
            </Space>
          </Form.Item>
          <Form.Item label="Q3预测金额">
            <Space>
              <InputNumber 
                placeholder="最小值" 
                style={{ width: 150 }}
                prefix="¥"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
              <Text>-</Text>
              <InputNumber 
                placeholder="最大值" 
                style={{ width: 150 }}
                prefix="¥"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Space>
          </Form.Item>
          <Form.Item label="时间GAP">
            <Space>
              <InputNumber 
                placeholder="最小值" 
                style={{ width: 100 }}
                suffix="%"
              />
              <Text>-</Text>
              <InputNumber 
                placeholder="最大值" 
                style={{ width: 100 }}
                suffix="%"
              />
            </Space>
          </Form.Item>
          <Form.Item label="季度GAP">
            <Space>
              <InputNumber 
                placeholder="最小值" 
                style={{ width: 100 }}
                suffix="%"
              />
              <Text>-</Text>
              <InputNumber 
                placeholder="最大值" 
                style={{ width: 100 }}
                suffix="%"
              />
            </Space>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary">应用筛选</Button>
              <Button>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* 数据详情编辑弹窗 */}
      {detailModalOpen && currentRecord && (
        <Drawer
          title={
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong style={{ fontSize: '16px' }}>
                  {currentRecord.pdt} - {currentRecord.pn}
                </Text>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {currentRecord.singularitySegment} | {getProductStatusText(currentRecord.productStatus)}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {currentIndex + 1} / {filteredData.length}
              </div>
            </Space>
          }
          placement="right"
          onClose={() => setDetailModalOpen(false)}
          open={detailModalOpen}
          width={500}
          extra={
            <Space>
              <Button 
                size="small"
                disabled={currentIndex === 0}
                onClick={() => handleNavigation('prev')}
              >
                上一条
              </Button>
              <Button 
                size="small"
                disabled={currentIndex === filteredData.length - 1}
                onClick={() => handleNavigation('next')}
              >
                下一条
              </Button>
            </Space>
          }
        >
          <Form
            layout="vertical"
            initialValues={currentRecord}
            onFinish={handleSaveRecord}
            key={currentRecord.key} // 重新渲染表单当记录改变
          >
            {/* 基础信息 - 只读 */}
            <Card size="small" title="基础信息" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>PDT</Text>
                  <div style={{ fontWeight: 'bold' }}>{currentRecord.pdt}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>PN</Text>
                  <div style={{ fontWeight: 'bold' }}>{currentRecord.pn}</div>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 12 }}>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>奇点细分</Text>
                  <div>{currentRecord.singularitySegment}</div>
                </Col>
                <Col span={12}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>产品状态</Text>
                  <div>
                    <Badge 
                      status={getProductStatusColor(currentRecord.productStatus) as any}
                      text={getProductStatusText(currentRecord.productStatus)}
                    />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 预测数据 - 可编辑 */}
            <Card size="small" title="预测数据编辑" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="q3ForecastQuantity"
                    label="Q3预测数量"
                    rules={[{ required: true, message: '请输入Q3预测数量' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="q3ForecastAmount"
                    label="Q3预测金额"
                    rules={[{ required: true, message: '请输入Q3预测金额' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      prefix="¥"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\¥\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="julyForecast"
                    label="7月预测"
                    rules={[{ required: true, message: '请输入7月预测' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="augustForecast"
                    label="8月预测"
                    rules={[{ required: true, message: '请输入8月预测' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="septemberForecast"
                    label="9月预测"
                    rules={[{ required: true, message: '请输入9月预测' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 其他关键数据 - 可编辑 */}
            <Card size="small" title="其他数据" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="actualShipment"
                    label="实际出货数量"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="salesAchievementRate"
                    label="销量达成率 (%)"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={200}
                      suffix="%"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="offlineInventory"
                    label="offline库"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="offlineSuper"
                    label="offline超"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="omniChannelInventory"
                    label="全渠道库"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input.TextArea rows={3} placeholder="请输入备注信息..." />
              </Form.Item>
            </Card>

            {/* 操作按钮 */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Space>
                <Button 
                  onClick={() => handleNavigation('prev')}
                  disabled={currentIndex === 0}
                >
                  上一条
                </Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button 
                  onClick={() => handleNavigation('next')}
                  disabled={currentIndex === filteredData.length - 1}
                >
                  下一条
                </Button>
              </Space>
            </div>
          </Form>
        </Drawer>
      )}

      <style jsx>{`
        .clickable-row {
          cursor: pointer;
        }
        .clickable-row:hover {
          background-color: #e6f7ff !important;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-weight: 600;
          color: #262626;
          font-size: 11px;
        }
        .ant-table-tbody > tr > td {
          padding: 6px 8px;
        }
      `}</style>
    </div>
  );
};

export default PNDataTable;