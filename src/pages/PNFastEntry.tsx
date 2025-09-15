import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { 
  Table, Typography, Space, Button, Tag, Input, Select,
  Card, InputNumber, message, Form, Row, Col, 
  Statistic, Alert, Tooltip, Progress, Drawer, Tabs, Switch, Divider
} from 'antd';
import { 
  EditOutlined, PlusOutlined, DeleteOutlined, SwapOutlined,
  ImportOutlined, ExportOutlined, SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface ForecastEntryData {
  key: string;
  channel: string;           // 渠道
  sku: string;              // SKU
  pdt: string;              // PDT
  singularity: string;       // 奇点细分
  pn: string;               // PN
  cnCategory: string;        // CN品类
  skuName: string;          // SKU名称
  skuStatus: 'active' | 'inactive' | 'eol' | 'new';  // SKU状态
  jan2025Sales: number;      // 25年1月销量
  feb2025Sales: number;      // 25年2月销量
  mar2025Sales: number;      // 25年3月销量
  apr2025Sales: number;      // 25年4月销量
  may2025Sales: number;      // 25年5月销量
  jun2025Sales: number;      // 25年6月销量
  jul2025Sales: number;      // 25年7月销量
  aug2025Sales: number;      // 25年8月销量
  avgPrice: number;          // 成交均价(未税)
  q3PlanTotal: number;       // Q3规划合计
  currentSales: number;      // 当前销量
  timeProgress: number;      // 时间进度
  vsTimeProgress: number;    // VS时间进度
  inventory: number;         // 库存
  q3Total: number;          // Q3总计
  // 需要Sales填写的字段
  augForecast: number;       // 8月预测
  sepForecast: number;       // 9月预测
  octForecast: number;       // 10月预测
  novForecast: number;       // 11月预测
  decForecast: number;       // 12月预测
  // 修正字段（只读）
  aug2Corrected: number;    // 8月（修正）
  sep2Corrected: number;    // 9月（修正）
  oct2Corrected: number;    // 10月（修正）
  nov2Corrected: number;    // 11月（修正）
  dec2Corrected: number;    // 12月（修正）
  isNew?: boolean;
}

const generateTestData = (): ForecastEntryData[] => {
  const channels = ['Amazon', 'Best Buy', 'Walmart', 'Target', 'eBay', '天猫', '京东', '拼多多'];
  const pdts = ['PowerPort', 'PowerCore', 'SoundCore', 'Eufy', 'Nebula', 'AnkerWork', 'Roav', 'PowerWave'];
  const singularities = ['高端快充', '便携移动电源', '音频设备', '智能家居', '投影设备', '办公设备', '车载设备', '无线充电'];
  const cnCategories = ['充电器', '移动电源', '音响', '摄像头', '投影仪', '会议设备', '车载产品', '无线充电器'];
  const statuses: ('active' | 'inactive' | 'eol' | 'new')[] = ['active', 'active', 'active', 'new', 'inactive', 'eol'];
  
  const data: ForecastEntryData[] = [];
  
  for (let i = 1; i <= 152; i++) {
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const pdt = pdts[Math.floor(Math.random() * pdts.length)];
    const singularity = singularities[Math.floor(Math.random() * singularities.length)];
    const cnCategory = cnCategories[Math.floor(Math.random() * cnCategories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const basePrice = 15 + Math.random() * 85; // 15-100 price range
    const baseSales = Math.floor(1000 + Math.random() * 4000); // 1000-5000 sales range
    
    const jan = Math.floor(baseSales * (0.8 + Math.random() * 0.4));
    const feb = Math.floor(baseSales * (0.85 + Math.random() * 0.3));
    const mar = Math.floor(baseSales * (0.9 + Math.random() * 0.2));
    const apr = Math.floor(baseSales * (0.85 + Math.random() * 0.3));
    const may = Math.floor(baseSales * (0.8 + Math.random() * 0.4));
    const jun = Math.floor(baseSales * (0.9 + Math.random() * 0.2));
    const jul = Math.floor(baseSales * (0.95 + Math.random() * 0.1));
    const aug = Math.floor(baseSales * (1.0 + Math.random() * 0.1));
    
    const currentSales = jan + feb + mar + apr + may + jun + jul + Math.floor(aug * 0.75);
    const q3PlanTotal = Math.floor(baseSales * 2.8 + Math.random() * 1000);
    const timeProgress = 75 + Math.random() * 15;
    const vsTimeProgress = -5 + Math.random() * 25;
    const inventory = Math.floor(baseSales * (0.5 + Math.random() * 1.5));
    const q3Total = Math.floor(q3PlanTotal * (1.05 + Math.random() * 0.15));
    
    data.push({
      key: i.toString(),
      channel,
      sku: `A${String(1000 + i).slice(1)}-${['BK', 'WH', 'GY', 'BL', 'RD'][Math.floor(Math.random() * 5)]}-${['US', 'EU', 'JP', 'CN'][Math.floor(Math.random() * 4)]}`,
      pdt,
      singularity,
      pn: `A${1000 + i}`,
      cnCategory,
      skuName: `${pdt} ${singularity} ${cnCategory} ${channel}版`,
      skuStatus: status,
      jan2025Sales: jan,
      feb2025Sales: feb,
      mar2025Sales: mar,
      apr2025Sales: apr,
      may2025Sales: may,
      jun2025Sales: jun,
      jul2025Sales: jul,
      aug2025Sales: aug,
      avgPrice: Math.round(basePrice * 100) / 100,
      q3PlanTotal,
      currentSales,
      timeProgress: Math.round(timeProgress * 10) / 10,
      vsTimeProgress: Math.round(vsTimeProgress * 10) / 10,
      inventory,
      q3Total,
      augForecast: Math.floor(baseSales * (1.0 + Math.random() * 0.2)),
      sepForecast: Math.floor(baseSales * (1.05 + Math.random() * 0.15)),
      octForecast: Math.floor(baseSales * (1.1 + Math.random() * 0.1)),
      novForecast: Math.floor(baseSales * (1.0 + Math.random() * 0.2)),
      decForecast: Math.floor(baseSales * (0.95 + Math.random() * 0.2)),
      aug2Corrected: Math.floor(baseSales * (1.02 + Math.random() * 0.16)),
      sep2Corrected: Math.floor(baseSales * (1.07 + Math.random() * 0.13)),
      oct2Corrected: Math.floor(baseSales * (1.12 + Math.random() * 0.08)),
      nov2Corrected: Math.floor(baseSales * (1.02 + Math.random() * 0.18)),
      dec2Corrected: Math.floor(baseSales * (0.97 + Math.random() * 0.18))
    });
  }
  
  return data;
};

const PNFastEntry: React.FC = () => {
  const [data, setData] = useState<ForecastEntryData[]>(generateTestData());

  const [selectedRegion, setSelectedRegion] = useState<string>('全部');
  const [selectedSales, setSelectedSales] = useState<string>('全部');
  
  // 防抖处理
  const debounceTimer = useRef<NodeJS.Timeout>();

  // 列显示控制 - 默认显示所有列
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
    'channel', 'sku', 'pdt', 'singularity', 'pn', 'cnCategory', 'skuName', 'skuStatus',
    'jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales', 'jul2025Sales', 'aug2025Sales',
    'avgPrice', 'q3PlanTotal', 'currentSales', 'timeProgress', 'vsTimeProgress', 'inventory', 'q3Total',
    'augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast',
    'aug2Corrected', 'sep2Corrected', 'oct2Corrected', 'nov2Corrected', 'dec2Corrected'
  ]));

  // 列设置抽屉
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  const regions = ['全部', '华东区', '华南区', '华北区', '华中区'];
  const salesPersons = ['全部', '张三', '李四', '王五', 'rory'];

  const filteredData = data.filter(item => {
    // 这里可以根据需要添加筛选逻辑
    return true;
  });

  // 处理可编辑字段的变更（防抖优化）
  const handleEditableFieldChange = useCallback((key: string, field: string, value: number | string) => {
    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // 立即更新UI显示
    setData(prevData => 
      prevData.map(item => 
        item.key === key 
          ? { ...item, [field]: value }
          : item
      )
    );
    
    // 防抖处理，200ms后执行实际的数据处理
    debounceTimer.current = setTimeout(() => {
      // 这里可以添加保存到后端的逻辑
      console.log(`Field ${field} updated to ${value} for record ${key}`);
    }, 200);
  }, []);

  const getSkuStatusColor = (status: string) => {
    const statusMap = {
      'active': 'success',
      'inactive': 'default',
      'eol': 'error',
      'new': 'processing'
    };
    return statusMap[status as keyof typeof statusMap] || 'default';
  };

  const getSkuStatusText = (status: string) => {
    const statusMap = {
      'active': '在售',
      'inactive': '停售',
      'eol': 'EOL',
      'new': '新品'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const allColumns = useMemo((): ColumnsType<ForecastEntryData> => [
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 80,
      fixed: 'left',
      render: (text: string) => (
        <Tag color="blue" style={{ fontSize: '10px' }}>{text}</Tag>
      )
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      fixed: 'left',
      render: (text: string, record: ForecastEntryData) => (
        <Text 
          code 
          style={{ 
            fontSize: '11px',
            color: record.isNew ? '#52c41a' : '#1890ff',
            background: record.isNew ? '#f6ffed' : '#e6f7ff',
            padding: '2px 4px',
            borderRadius: '3px'
          }}
        >
          {text}
          {record.isNew && <Tag color="green" size="small" style={{ marginLeft: 2, fontSize: '8px' }}>新</Tag>}
        </Text>
      )
    },
    {
      title: 'PDT',
      dataIndex: 'pdt',
      key: 'pdt',
      width: 80,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff', fontSize: '11px' }}>{text}</Text>
      )
    },
    {
      title: '奇点细分',
      dataIndex: 'singularity',
      key: 'singularity',
      width: 100,
      render: (text: string) => (
        <Tag color="cyan" style={{ fontSize: '10px' }}>{text}</Tag>
      )
    },
    {
      title: 'PN',
      dataIndex: 'pn',
      key: 'pn',
      width: 80,
      render: (text: string) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1' }}>{text}</Text>
      )
    },
    {
      title: 'CN品类',
      dataIndex: 'cnCategory',
      key: 'cnCategory',
      width: 80,
      render: (text: string) => (
        <Tag color="orange" style={{ fontSize: '10px' }}>{text}</Tag>
      )
    },
    {
      title: 'SKU名称',
      dataIndex: 'skuName',
      key: 'skuName',
      width: 180,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: '11px' }} ellipsis>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: 'SKU状态',
      dataIndex: 'skuStatus',
      key: 'skuStatus',
      width: 80,
      render: (status: string) => (
        <Tag color={getSkuStatusColor(status)} style={{ fontSize: '10px' }}>
          {getSkuStatusText(status)}
        </Tag>
      )
    },
    {
      title: '25年1月销量',
      dataIndex: 'jan2025Sales',
      key: 'jan2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年2月销量',
      dataIndex: 'feb2025Sales',
      key: 'feb2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年3月销量',
      dataIndex: 'mar2025Sales',
      key: 'mar2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年4月销量',
      dataIndex: 'apr2025Sales',
      key: 'apr2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年5月销量',
      dataIndex: 'may2025Sales',
      key: 'may2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年6月销量',
      dataIndex: 'jun2025Sales',
      key: 'jun2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年7月销量',
      dataIndex: 'jul2025Sales',
      key: 'jul2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '25年8月销量',
      dataIndex: 'aug2025Sales',
      key: 'aug2025Sales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '成交均价(未税)',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatPrice(value)}</Text>
      )
    },
    {
      title: 'Q3规划合计',
      dataIndex: 'q3PlanTotal',
      key: 'q3PlanTotal',
      width: 100,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '当前销量',
      dataIndex: 'currentSales',
      key: 'currentSales',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: '时间进度',
      dataIndex: 'timeProgress',
      key: 'timeProgress',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{value}%</Text>
      )
    },
    {
      title: 'VS时间进度',
      dataIndex: 'vsTimeProgress',
      key: 'vsTimeProgress',
      width: 100,
      render: (value: number) => (
        <Text strong style={{ 
          fontSize: '11px', 
          color: value >= 0 ? '#52c41a' : '#f5222d',
          fontWeight: 600
        }}>
          {value >= 0 ? '+' : ''}{value}%
        </Text>
      )
    },
    {
      title: '库存',
      dataIndex: 'inventory',
      key: 'inventory',
      width: 80,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: 'Q3总计',
      dataIndex: 'q3Total',
      key: 'q3Total',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    // 可编辑的预测字段
    {
      title: '8月预测',
      dataIndex: 'augForecast',
      key: 'augForecast',
      width: 90,
      render: (value: number, record: ForecastEntryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ 
            width: '100%',
            borderRadius: '6px',
            borderColor: '#d9d9d9',
            transition: 'all 0.2s'
          }}
          className="editable-input"
          controls={false}
          onChange={(newValue) => handleEditableFieldChange(record.key, 'augForecast', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '9月预测',
      dataIndex: 'sepForecast',
      key: 'sepForecast',
      width: 90,
      render: (value: number, record: ForecastEntryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ 
            width: '100%',
            borderRadius: '6px',
            borderColor: '#d9d9d9',
            transition: 'all 0.2s'
          }}
          className="editable-input"
          controls={false}
          onChange={(newValue) => handleEditableFieldChange(record.key, 'sepForecast', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '10月预测',
      dataIndex: 'octForecast',
      key: 'octForecast',
      width: 90,
      render: (value: number, record: ForecastEntryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ 
            width: '100%',
            borderRadius: '6px',
            borderColor: '#d9d9d9',
            transition: 'all 0.2s'
          }}
          className="editable-input"
          controls={false}
          onChange={(newValue) => handleEditableFieldChange(record.key, 'octForecast', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '11月预测',
      dataIndex: 'novForecast',
      key: 'novForecast',
      width: 90,
      render: (value: number, record: ForecastEntryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ 
            width: '100%',
            borderRadius: '6px',
            borderColor: '#d9d9d9',
            transition: 'all 0.2s'
          }}
          className="editable-input"
          controls={false}
          onChange={(newValue) => handleEditableFieldChange(record.key, 'novForecast', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '12月预测',
      dataIndex: 'decForecast',
      key: 'decForecast',
      width: 90,
      render: (value: number, record: ForecastEntryData) => (
        <InputNumber
          size="small"
          value={value}
          style={{ 
            width: '100%',
            borderRadius: '6px',
            borderColor: '#d9d9d9',
            transition: 'all 0.2s'
          }}
          className="editable-input"
          controls={false}
          onChange={(newValue) => handleEditableFieldChange(record.key, 'decForecast', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '8月（修正）',
      dataIndex: 'aug2Corrected',
      key: 'aug2Corrected',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      )
    },
    {
      title: '9月（修正）',
      dataIndex: 'sep2Corrected',
      key: 'sep2Corrected',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      )
    },
    {
      title: '10月（修正）',
      dataIndex: 'oct2Corrected',
      key: 'oct2Corrected',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      )
    },
    {
      title: '11月（修正）',
      dataIndex: 'nov2Corrected',
      key: 'nov2Corrected',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      )
    },
    {
      title: '12月（修正）',
      dataIndex: 'dec2Corrected',
      key: 'dec2Corrected',
      width: 90,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      )
    }
  ], [handleEditableFieldChange, formatNumber]);

  // 根据可见列筛选columns
  const columns = useMemo(() => {
    return allColumns.filter(col => visibleColumns.has(col.key as string));
  }, [allColumns, visibleColumns]);

  // 列分组定义
  const columnGroups = useMemo(() => ({
    basic: ['channel', 'sku', 'pdt', 'singularity', 'pn', 'cnCategory', 'skuName', 'skuStatus'],
    sales: ['jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales', 'jul2025Sales', 'aug2025Sales'],
    summary: ['avgPrice', 'q3PlanTotal', 'currentSales', 'timeProgress', 'vsTimeProgress', 'inventory', 'q3Total'],
    forecast: ['augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast'],
    corrected: ['aug2Corrected', 'sep2Corrected', 'oct2Corrected', 'nov2Corrected', 'dec2Corrected']
  }), []);

  const handleSaveAll = () => {
    message.success('所有预测数据已保存！');
  };

  const handleExport = () => {
    message.info('正在导出预测收集数据...');
  };

  // 计算统计数据
  const statisticsData = useMemo(() => {
    const totalQ3Plan = filteredData.reduce((sum, item) => sum + item.q3PlanTotal, 0);
    const totalCurrentSales = filteredData.reduce((sum, item) => sum + item.currentSales, 0);
    const avgTimeProgress = filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.timeProgress, 0) / filteredData.length 
      : 0;
    return { totalQ3Plan, totalCurrentSales, avgTimeProgress };
  }, [filteredData]);

  return (
    <div style={{ 
      padding: '16px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px',
          marginBottom: 12
        }} />
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#262626' }}>
              📊 预测收集
            </Title>
            <Text type="secondary">Sales预测数据填写 - 只需填写可编辑字段</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ImportOutlined />}
                style={{ borderRadius: '6px' }}
              >
                导入
              </Button>
              <Button 
                icon={<ExportOutlined />}
                onClick={handleExport}
                style={{ borderRadius: '6px' }}
              >
                导出
              </Button>
              <Button 
                icon={<SettingOutlined />}
                onClick={() => setColumnSettingsOpen(true)}
                style={{ borderRadius: '6px' }}
              >
                列设置
              </Button>
              <Button 
                type="primary"
                onClick={handleSaveAll}
                style={{ borderRadius: '6px' }}
              >
                保存所有预测
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="Q3规划总计"
              value={statisticsData.totalQ3Plan}
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="当前销量总计"
              value={statisticsData.totalCurrentSales}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="平均时间进度"
              value={statisticsData.avgTimeProgress}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#722ed1', fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col flex={1}>
              <Space wrap>
                <Select
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  style={{ width: 120 }}
                  size="small"
                  placeholder="选择区域"
                >
                  {regions.map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
                <Select
                  value={selectedSales}
                  onChange={setSelectedSales}
                  style={{ width: 120 }}
                  size="small"
                  placeholder="选择Sales"
                >
                  {salesPersons.map(person => (
                    <Option key={person} value={person}>{person}</Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                当前显示 {filteredData.length} 条记录 | 预测字段可编辑
              </Text>
            </Col>
          </Row>
        </div>


        <Table
          columns={columns}
          dataSource={filteredData}
          size="small"
          pagination={{
            defaultPageSize: 100,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['100', '200', '500'],
          }}
          scroll={{ x: 2800, y: 600 }}
          bordered
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
                        {groupKey === 'sales' && '销量数据'}
                        {groupKey === 'summary' && '统计信息'}
                        {groupKey === 'forecast' && '预测数据'}
                        {groupKey === 'corrected' && '修正数据'}
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
              setVisibleColumns(new Set(['channel', 'sku', 'pdt', 'pn', 'augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast']));
            }}
          >
            重置
          </Button>
        </Space>
      </Drawer>

      <style>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-weight: 600;
          color: #262626;
          font-size: 11px;
          padding: 8px 6px;
          text-align: center;
        }
        .ant-table-tbody > tr > td {
          padding: 8px 6px;
          font-size: 11px;
        }
        .ant-input-number {
          border-radius: 6px;
        }
        .ant-input {
          border-radius: 6px;
        }
        .ant-btn {
          border-radius: 6px;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #e6f7ff !important;
        }
        .editable-input:hover {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
        .editable-input:focus,
        .editable-input:focus-within {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
        .editable-input .ant-input-number-input {
          border: none !important;
          box-shadow: none !important;
        }
        .ant-table-tbody > tr > td .editable-input {
          background: linear-gradient(135deg, #fff 0%, #f8faff 100%);
          border: 1px solid #e8f0fe;
        }
      `}</style>
    </div>
  );
};

export default PNFastEntry;