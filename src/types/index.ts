// PDT维度的销售预测数据
export interface PDTForecast {
  key: string;
  cnCategory: string; // CN品类
  q3AchievedAmount: number; // Q3已达成金额
  septemberForecast: number; // 9月份要货预测
  octoberForecast: number; // 10月份要货预测
  novemberForecast: number; // 11月份要货预测
  decemberForecast: number; // 12月份要货预测
  q3TotalAmount: number; // Q3总金额
  q4TotalAmount: number; // Q4总金额
}

// PN维度的详细数据
export interface PNData {
  key: string;
  pdt: string; // PDT
  pn: string; // PN
  singularitySegment: string; // 奇点细分
  productStatus: 'active' | 'inactive' | 'eol' | 'new'; // 产品状态
  salesTrend: 'rising' | 'stable' | 'declining'; // 销售趋势
  q3ForecastQuantity: number; // Q3预测数量
  q3ForecastAmount: number; // Q3预测金额
  julyForecast: number; // 7月预测
  augustForecast: number; // 8月预测
  septemberForecast: number; // 9月预测
  quarterProgress: number; // 季度销售进展 (%)
  actualShipment: number; // 实际出货数量
  timeProgress: number; // 时间进度 (%)
  shipmentVolume: number; // 出货量
  offlineInventory: number; // offline库
  offlineSuper: number; // offline超
  omniChannelInventory: number; // 全渠道库
  salesAchievementRate: number; // 销量达成率 (%)
  timeGap: number; // 时间GAP
  quarterGap: number; // 季度GAP
  remarks: string; // 备注
}

// 预测收集模板
export interface ForecastTemplate {
  key: string;
  channel: string; // 渠道
  ankerSKU: string; // Anker SKU
  pdt: string; // PDT
  singularity: string; // 奇点
  pn: string; // PN
  skuDescription: string; // sku描述/备注
  productStatus: 'active' | 'inactive' | 'eol' | 'new'; // 产品状态
  jan2025Sales: number; // 25年1月销量
  feb2025Sales: number; // 25年2月销量
  mar2025Sales: number; // 25年3月销量
  apr2025Sales: number; // 25年4月销量
  may2025Sales: number; // 25年5月销量
  jun2025Sales: number; // 6月销量
  q3Summary: number; // Q3汇总
}

// KPI指标
export interface KPIMetric {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  target?: number;
  icon?: string;
  color?: string;
}

// 筛选选项
export interface FilterOptions {
  dateRange: [string, string];
  categories: string[];
  pdts: string[];
  channels: string[];
  productStatus: string[];
}

// AI助手消息
export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// AI助手状态
export interface AIAssistantState {
  isOpen: boolean;
  messages: AIMessage[];
  isTyping: boolean;
}