import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { 
  Table, Typography, Space, Button, Tag, Input, Select,
  Card, InputNumber, message, Form, Row, Col, 
  Statistic, Alert, Tooltip, Progress, Drawer, Tabs, Switch, Divider
} from 'antd';
const { Search } = Input;
import { 
  EditOutlined, PlusOutlined, DeleteOutlined, SwapOutlined,
  ImportOutlined, ExportOutlined, SettingOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useForecastList, useDebouncedForecastUpdate, useImportForecast } from '../hooks/useForecast';
import { useMetadata } from '../hooks/useDashboard';
import { downloadFile } from '../services/api';
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface ForecastEntryData {
  key: string;
  brand: string;            // 品牌
  channel: string;           // 一级渠道
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
  q3PlanTotal: number;       // Q3规划合计（M-3）
  currentSales: number;      // Q3实际销量
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
  const brands = ['anker', 'soundcore'];
  const channels = ['线下sales', '京东自营', '天猫自营', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Amazon'];
  const pdts = ['PowerPort', 'PowerCore', 'SoundCore', 'Eufy', 'Nebula', 'AnkerWork', 'Roav', 'PowerWave'];
  const singularities = ['高端快充', '便携移动电源', '音频设备', '智能家居', '投影设备', '办公设备', '车载设备', '无线充电'];
  const cnCategories = ['充电器', '移动电源', '音响', '摄像头', '投影仪', '会议设备', '车载产品', '无线充电器'];
  const statuses: ('active' | 'inactive' | 'eol' | 'new')[] = ['active', 'active', 'active', 'new', 'inactive', 'eol'];
  
  const data: ForecastEntryData[] = [];
  
  for (let i = 1; i <= 152; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
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
      brand,
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
  // 本地数据状态
  const [localData, setLocalData] = useState<ForecastEntryData[]>(generateTestData());
  const [useLocalData, setUseLocalData] = useState(true); // 默认使用本地数据
  
  // API hooks (仅在需要时使用)
  const {
    data: apiData,
    loading: apiLoading,
    pagination,
    params,
    handleTableChange,
    updateParams,
    refetch,
  } = useForecastList({ size: 100 });

  const { debouncedUpdate } = useDebouncedForecastUpdate();
  const { upload: uploadFile, loading: uploadLoading } = useImportForecast();
  const metadata = useMetadata();

  
  // 筛选状态
  const [filters, setFilters] = useState({
    brand: '',
    channel: '',
    sku: '',
    pdt: '',
    cnCategory: '',
    pn: '',
    singularity: '',
    skuStatus: ''
  });
  const [searchText, setSearchText] = useState('');
  
  // 防抖处理
  const debounceTimer = useRef<NodeJS.Timeout>();

  // 列显示控制 - 默认显示所有列
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
    'brand', 'channel', 'sku', 'pdt', 'singularity', 'pn', 'cnCategory', 'skuName', 'skuStatus',
    'jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales', 'jul2025Sales', 'aug2025Sales',
    'avgPrice', 'q3PlanTotal', 'currentSales', 'timeProgress', 'vsTimeProgress', 'inventory', 'q3Total',
    'augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast',
    'aug2Corrected', 'sep2Corrected', 'oct2Corrected', 'nov2Corrected', 'dec2Corrected'
  ]));

  // 列设置抽屉
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  
  // 可以从API获取的元数据
  const { pdts, channels, singularities, categories } = metadata;
  
  // 筛选选项数据
  const brands = ['anker', 'soundcore'];
  const primaryChannels = ['线下sales', '京东自营', '天猫自营', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Amazon'];
  const pdtOptions = ['PowerPort', 'PowerCore', 'SoundCore', 'Eufy', 'Nebula', 'AnkerWork', 'Roav', 'PowerWave'];
  const singularityOptions = ['高端快充', '便携移动电源', '音频设备', '智能家居', '投影设备', '办公设备', '车载设备', '无线充电'];
  const cnCategoryOptions = ['充电器', '移动电源', '音响', '摄像头', '投影仪', '会议设备', '车载产品', '无线充电器'];
  const skuStatusOptions = ['active', 'inactive', 'eol', 'new'];

  // 使用本地数据或API数据
  const data = useLocalData ? localData : (apiData || []);
  const loading = useLocalData ? false : apiLoading;
  
  // 处理搜索和筛选
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const filteredData = useMemo(() => {
    let filtered = data;
    
    // 全文搜索
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.brand.toLowerCase().includes(searchLower) ||
        item.channel.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        item.pdt.toLowerCase().includes(searchLower) ||
        item.pn.toLowerCase().includes(searchLower) ||
        item.cnCategory.toLowerCase().includes(searchLower) ||
        item.singularity.toLowerCase().includes(searchLower) ||
        item.skuName.toLowerCase().includes(searchLower)
      );
    }
    
    // 具体字段筛选
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key as keyof typeof filters];
      if (filterValue) {
        if (key === 'sku' || key === 'pn') {
          // SKU和PN支持模糊匹配
          filtered = filtered.filter(item => 
            String(item[key as keyof ForecastEntryData]).toLowerCase().includes(filterValue.toLowerCase())
          );
        } else {
          // 其他字段精确匹配
          filtered = filtered.filter(item => item[key as keyof ForecastEntryData] === filterValue);
        }
      }
    });
    
    return filtered;
  }, [data, searchText, filters]);

  // 处理可编辑字段的变更
  const handleEditableFieldChange = useCallback((key: string, field: string, value: number | string) => {
    if (useLocalData) {
      // 本地模式：直接更新本地数据
      setLocalData(prevData => 
        prevData.map(item => 
          item.key === key 
            ? { ...item, [field]: value }
            : item
        )
      );
    } else {
      // API模式：使用防抖API更新
      debouncedUpdate(key, { [field]: value });
    }
  }, [useLocalData, debouncedUpdate]);

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
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 80,
      fixed: 'left',
      render: (text: string) => (
        <Tag color="purple" style={{ fontSize: '10px', textTransform: 'capitalize' }}>{text}</Tag>
      )
    },
    {
      title: '一级渠道',
      dataIndex: 'channel',
      key: 'channel',
      width: 90,
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
      title: 'Q3规划合计（M-3）',
      dataIndex: 'q3PlanTotal',
      key: 'q3PlanTotal',
      width: 100,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1', fontWeight: 600 }}>{formatNumber(value)}</Text>
      )
    },
    {
      title: 'Q3实际销量',
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
    basic: ['brand', 'channel', 'sku', 'pdt', 'singularity', 'pn', 'cnCategory', 'skuName', 'skuStatus'],
    sales: ['jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales', 'jul2025Sales', 'aug2025Sales'],
    summary: ['avgPrice', 'q3PlanTotal', 'currentSales', 'timeProgress', 'vsTimeProgress', 'inventory', 'q3Total'],
    forecast: ['augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast'],
    corrected: ['aug2Corrected', 'sep2Corrected', 'oct2Corrected', 'nov2Corrected', 'dec2Corrected']
  }), []);

  const handleSaveAll = useCallback(() => {
    if (useLocalData) {
      message.success('本地模式：所有预测数据已保存在浏览器中！');
    } else {
      message.success('所有预测数据已自动保存！');
    }
  }, [useLocalData]);

  const handleExport = useCallback(async () => {
    if (useLocalData) {
      message.info('本地模式暂不支持导出功能，请连接API后使用');
      return;
    }
    
    try {
      message.loading('正在导出预测收集数据...', 0);
      const blob = await api.forecast.export(params);
      downloadFile(blob, `预测收集数据_${new Date().toISOString().split('T')[0]}.xlsx`);
      message.destroy();
      message.success('导出成功！');
    } catch (error) {
      message.destroy();
      message.error('导出失败，请重试');
    }
  }, [useLocalData, params]);

  const handleImport = useCallback(async () => {
    if (useLocalData) {
      message.info('本地模式暂不支持导入功能，请连接API后使用');
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const result = await uploadFile(file);
        if (result) {
          refetch(); // 重新获取数据
        }
      }
    };
    input.click();
  }, [useLocalData, uploadFile, refetch]);
  
  // 切换数据模式
  const toggleDataMode = useCallback(() => {
    setUseLocalData(prev => !prev);
    message.info(useLocalData ? '切换到API模式' : '切换到本地模式');
  }, [useLocalData]);

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
                onClick={handleImport}
                loading={uploadLoading}
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
                type={useLocalData ? "default" : "primary"}
                onClick={toggleDataMode}
                style={{ borderRadius: '6px' }}
              >
                {useLocalData ? '连接API' : '本地模式'}
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

      {/* 错误提示 */}
      {metadata.error && (
        <Alert
          message="数据加载失败"
          description={metadata.error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={refetch}>
              重试
            </Button>
          }
        />
      )}

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
                <Search
                  placeholder="搜索品牌/渠道/SKU/PDT/PN/品类/奇点细分"
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 280 }}
                  size="small"
                />
                <Select
                  placeholder="品牌"
                  allowClear
                  style={{ width: 90 }}
                  size="small"
                  onChange={(value) => handleFilterChange('brand', value || '')}
                >
                  {brands.map(brand => (
                    <Option key={brand} value={brand}>{brand}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="一级渠道"
                  allowClear
                  style={{ width: 110 }}
                  size="small"
                  onChange={(value) => handleFilterChange('channel', value || '')}
                >
                  {primaryChannels.map(channel => (
                    <Option key={channel} value={channel}>{channel}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="PDT"
                  allowClear
                  style={{ width: 90 }}
                  size="small"
                  onChange={(value) => handleFilterChange('pdt', value || '')}
                >
                  {pdtOptions.map(pdt => (
                    <Option key={pdt} value={pdt}>{pdt}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="CN品类"
                  allowClear
                  style={{ width: 90 }}
                  size="small"
                  onChange={(value) => handleFilterChange('cnCategory', value || '')}
                >
                  {cnCategoryOptions.map(category => (
                    <Option key={category} value={category}>{category}</Option>
                  ))}
                </Select>
                <Input
                  placeholder="输入SKU"
                  allowClear
                  style={{ width: 120 }}
                  size="small"
                  onChange={(e) => handleFilterChange('sku', e.target.value)}
                />
                <Input
                  placeholder="输入PN"
                  allowClear
                  style={{ width: 100 }}
                  size="small"
                  onChange={(e) => handleFilterChange('pn', e.target.value)}
                />
                <Select
                  placeholder="奇点细分"
                  allowClear
                  style={{ width: 110 }}
                  size="small"
                  onChange={(value) => handleFilterChange('singularity', value || '')}
                >
                  {singularityOptions.map(segment => (
                    <Option key={segment} value={segment}>{segment}</Option>
                  ))}
                </Select>
                <Select
                  placeholder="SKU状态"
                  allowClear
                  style={{ width: 100 }}
                  size="small"
                  onChange={(value) => handleFilterChange('skuStatus', value || '')}
                >
                  {skuStatusOptions.map(status => (
                    <Option key={status} value={status}>
                      {status === 'active' ? '在售' : 
                       status === 'inactive' ? '停售' : 
                       status === 'eol' ? 'EOL' : 
                       status === 'new' ? '新品' : status}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>
        </div>


        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          size="small"
          pagination={useLocalData ? {
            pageSize: 100,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['100', '200', '500'],
          } : {
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['100', '200', '500'],
          }}
          onChange={useLocalData ? undefined : handleTableChange}
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
              setVisibleColumns(new Set(['brand', 'channel', 'sku', 'pdt', 'pn', 'augForecast', 'sepForecast', 'octForecast', 'novForecast', 'decForecast']));
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