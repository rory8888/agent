import { PDTForecast, PNData, ForecastTemplate, KPIMetric } from '../types';

// PDT维度模拟数据
export const mockPDTData: PDTForecast[] = [
  {
    key: '1',
    cnCategory: '充电器',
    q3AchievedAmount: 2850000,
    septemberForecast: 980000,
    octoberForecast: 1200000,
    novemberForecast: 1350000,
    decemberForecast: 1100000,
    q3TotalAmount: 3200000,
    q4TotalAmount: 3650000
  },
  {
    key: '2',
    cnCategory: '移动电源',
    q3AchievedAmount: 1950000,
    septemberForecast: 650000,
    octoberForecast: 780000,
    novemberForecast: 890000,
    decemberForecast: 720000,
    q3TotalAmount: 2100000,
    q4TotalAmount: 2390000
  },
  {
    key: '3',
    cnCategory: '数据线',
    q3AchievedAmount: 1250000,
    septemberForecast: 420000,
    octoberForecast: 500000,
    novemberForecast: 580000,
    decemberForecast: 450000,
    q3TotalAmount: 1400000,
    q4TotalAmount: 1950000
  },
  {
    key: '4',
    cnCategory: '无线充电器',
    q3AchievedAmount: 890000,
    septemberForecast: 300000,
    octoberForecast: 380000,
    novemberForecast: 420000,
    decemberForecast: 350000,
    q3TotalAmount: 950000,
    q4TotalAmount: 1450000
  },
  {
    key: '5',
    cnCategory: '车载充电器',
    q3AchievedAmount: 650000,
    septemberForecast: 220000,
    octoberForecast: 280000,
    novemberForecast: 310000,
    decemberForecast: 260000,
    q3TotalAmount: 720000,
    q4TotalAmount: 1070000
  }
];

// 生成大量测试数据的函数
const generatePNData = (count: number): PNData[] => {
  const brands = ['anker', 'soundcore'];
  const channels = ['线下sales', '京东自营', '天猫自营', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Amazon'];
  const cnCategories = ['充电器', '移动电源', '音响', '摄像头', '投影仪', '会议设备', '车载产品', '无线充电器'];
  const pdtNames = ['Gssential', 'PowerPort', 'PowerCore', 'PowerLine', 'SoundCore', 'Eufy'];
  const pnCodes = ['A2698', 'A2637', 'A1266', 'A8856', 'A3945', 'A7908', 'A2567', 'A1347', 'A9821', 'A5634'];
  const pnSuffixes = ['20w-30w', '65w-fast', '10000mah', 'usb-c-pro', '3ft-cable', 'wireless-pro', 'compact-mini', 'ultra-slim', 'high-speed', 'premium'];
  const segments = ['高端快充', '便携移动电源', 'USB-C数据线', '无线充电器', '车载充电器', '音频配件', '智能家居', '存储设备'];
  const statuses = ['active', 'inactive', 'new', 'eol'];
  const statusTexts = ['正常售卖', '停售', '新品', 'EOL'];
  const trends = ['rising', 'stable', 'declining'];
  const remarks = [
    '销售表现良好，建议增加库存',
    '市场竞争激烈，需要关注定价策略', 
    '表现优异，考虑扩大生产',
    '需要优化供应链管理',
    '关注库存周转率',
    '建议促销活动',
    '产品生命周期末期',
    '新品推广中',
    '季节性产品',
    '重点关注产品'
  ];

  const data: PNData[] = [];
  
  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const cnCategory = cnCategories[Math.floor(Math.random() * cnCategories.length)];
    const pdtName = pdtNames[Math.floor(Math.random() * pdtNames.length)];
    const pnCode = pnCodes[Math.floor(Math.random() * pnCodes.length)];
    const pnSuffix = pnSuffixes[Math.floor(Math.random() * pnSuffixes.length)];
    const statusIndex = Math.floor(Math.random() * statuses.length);
    
    const baseQuantity = Math.floor(Math.random() * 150000) + 10000;
    const baseAmount = Math.floor(Math.random() * 3000000) + 100000;
    
    data.push({
      key: (i + 1).toString(),
      brand,
      channel,
      sku: `${pnCode}-${['BK', 'WH', 'GY', 'BL', 'RD'][Math.floor(Math.random() * 5)]}-${['US', 'EU', 'JP', 'CN'][Math.floor(Math.random() * 4)]}`,
      pdt: pdtName,
      pn: pnCode,
      cnCategory,
      singularitySegment: segments[Math.floor(Math.random() * segments.length)],
      productStatus: statuses[statusIndex] as 'active' | 'inactive' | 'new' | 'eol',
      salesTrend: trends[Math.floor(Math.random() * trends.length)] as 'rising' | 'stable' | 'declining',
      q3ForecastQuantity: baseQuantity,
      q3ForecastAmount: baseAmount,
      julyForecast: Math.floor(baseQuantity * 0.3) + Math.floor(Math.random() * 10000),
      augustForecast: Math.floor(baseQuantity * 0.35) + Math.floor(Math.random() * 10000),
      septemberForecast: Math.floor(baseQuantity * 0.35) + Math.floor(Math.random() * 10000),
      quarterProgress: Math.floor(Math.random() * 30) + 70,
      actualShipment: Math.floor(baseQuantity * 0.8) + Math.floor(Math.random() * 20000),
      timeProgress: 75.0,
      shipmentVolume: Math.floor(baseQuantity * 0.85) + Math.floor(Math.random() * 15000),
      offlineInventory: Math.floor(Math.random() * 30000) + 5000,
      offlineSuper: Math.floor(Math.random() * 20000) + 3000,
      omniChannelInventory: Math.floor(Math.random() * 50000) + 10000,
      salesAchievementRate: Math.floor(Math.random() * 40) + 60,
      timeGap: Math.floor(Math.random() * 25) + 0,
      quarterGap: Math.floor(Math.random() * 20) + 0,
      remarks: remarks[Math.floor(Math.random() * remarks.length)]
    });
  }
  
  return data;
};

// PN维度模拟数据 - 350条
export const mockPNData: PNData[] = generatePNData(350);

// 预测收集模板数据
export const mockForecastTemplateData: ForecastTemplate[] = [
  {
    key: '1',
    channel: 'Amazon',
    ankerSKU: 'PowerPort-A2637-BK',
    pdt: 'PowerPort',
    singularity: '高端快充',
    pn: 'A2637',
    skuDescription: 'PowerPort III 65W USB-C 充电器 黑色',
    productStatus: 'active',
    jan2025Sales: 15000,
    feb2025Sales: 18000,
    mar2025Sales: 22000,
    apr2025Sales: 20000,
    may2025Sales: 19000,
    jun2025Sales: 21000,
    q3Summary: 63000
  },
  {
    key: '2',
    channel: 'Best Buy',
    ankerSKU: 'PowerCore-A1266-WT',
    pdt: 'PowerCore',
    singularity: '便携移动电源',
    pn: 'A1266',
    skuDescription: 'PowerCore 10000 便携充电宝 白色',
    productStatus: 'active',
    jan2025Sales: 8500,
    feb2025Sales: 9200,
    mar2025Sales: 11000,
    apr2025Sales: 10500,
    may2025Sales: 9800,
    jun2025Sales: 10200,
    q3Summary: 30700
  },
  {
    key: '3',
    channel: 'Walmart',
    ankerSKU: 'PowerLine-A8856-RD',
    pdt: 'PowerLine',
    singularity: 'USB-C数据线',
    pn: 'A8856',
    skuDescription: 'PowerLine III USB-C to USB-C 数据线 红色',
    productStatus: 'active',
    jan2025Sales: 25000,
    feb2025Sales: 28000,
    mar2025Sales: 32000,
    apr2025Sales: 30000,
    may2025Sales: 29000,
    jun2025Sales: 31000,
    q3Summary: 92000
  },
  {
    key: '4',
    channel: 'Target',
    ankerSKU: 'Gssential-A5634-GY',
    pdt: 'Gssential',
    singularity: '无线充电器',
    pn: 'A5634',
    skuDescription: 'Gssential 无线充电座 灰色',
    productStatus: 'active',
    jan2025Sales: 12000,
    feb2025Sales: 14000,
    mar2025Sales: 16000,
    apr2025Sales: 15000,
    may2025Sales: 13000,
    jun2025Sales: 17000,
    q3Summary: 45000
  },
  {
    key: '5',
    channel: 'Costco',
    ankerSKU: 'SoundCore-A3945-BL',
    pdt: 'SoundCore',
    singularity: '音频配件',
    pn: 'A3945',
    skuDescription: 'SoundCore 蓝牙音箱 蓝色',
    productStatus: 'new',
    jan2025Sales: 6000,
    feb2025Sales: 8000,
    mar2025Sales: 10000,
    apr2025Sales: 12000,
    may2025Sales: 14000,
    jun2025Sales: 16000,
    q3Summary: 42000
  }
];

// KPI数据
export const mockKPIData: KPIMetric[] = [
  {
    title: 'Q3总预测金额',
    value: '¥8.15M',
    unit: '',
    trend: 'up',
    trendValue: 15.8,
    target: 8500000,
    icon: 'dollar-circle',
    color: '#1890ff'
  },
  {
    title: 'Q4预测金额',
    value: '¥10.51M',
    unit: '',
    trend: 'up',
    trendValue: 28.9,
    target: 11000000,
    icon: 'rise',
    color: '#52c41a'
  },
  {
    title: '预测准确率',
    value: 92.3,
    unit: '%',
    trend: 'up',
    trendValue: 3.2,
    target: 95,
    icon: 'aim',
    color: '#722ed1'
  },
  {
    title: '在售产品数',
    value: 156,
    unit: '个',
    trend: 'up',
    trendValue: 8,
    target: 160,
    icon: 'trophy',
    color: '#fa8c16'
  }
];

// 基础数据选项
export const brands = ['anker', 'soundcore'];
export const cnCategories = ['充电器', '移动电源', '音响', '摄像头', '投影仪', '会议设备', '车载产品', '无线充电器'];
export const channels = ['线下sales', '京东自营', '天猫自营', 'eBay', 'Walmart', 'Target', 'Best Buy', 'Amazon'];
export const pdts = ['Gssential', 'PowerPort', 'PowerCore', 'PowerLine', 'SoundCore', 'Eufy'];
export const productStatuses = ['active', 'inactive', 'eol', 'new'];
export const salesTrends = ['rising', 'stable', 'declining'];
export const singularitySegments = ['高端快充', '便携移动电源', 'USB-C数据线', '无线充电器', '车载充电器', '音频配件', '智能家居', '存储设备'];