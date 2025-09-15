import React, { useState, useCallback, useMemo, useRef } from 'react';
import { 
  Table, Typography, Space, Button, Tag, Input, Select,
  Card, InputNumber, message, Row, Col, 
  Statistic, Tooltip, Drawer, Tabs, Switch, Divider
} from 'antd';
import { 
  ImportOutlined, ExportOutlined, SettingOutlined, SaveOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface PNAuditData {
  key: string;
  pdt: string;                    // PDT
  pn: string;                     // PN
  singularitySegment: string;     // 奇点细分
  productStatus: 'active' | 'inactive' | 'eol' | 'new';  // 产品状态
  jan2025Sales: number;           // 25年1月销量
  feb2025Sales: number;           // 25年2月销量
  mar2025Sales: number;           // 25年3月销量
  apr2025Sales: number;           // 25年4月销量
  may2025Sales: number;           // 25年5月销量
  jun2025Sales: number;           // 25年6月销量
  currentStock: number;           // 现有库存
  q3SalesForecastQuantity: number; // Q3-sales预测数量
  q3ForecastAmount: number;       // Q3-预测金额
  auditCorrectedQuantity: number; // 评审修正数量（可编辑）
}

// 生成测试数据
const generateAuditData = (): PNAuditData[] => {
  const pdts = ['PowerPort', 'PowerCore', 'SoundCore', 'Eufy', 'Nebula', 'AnkerWork', 'Roav', 'PowerWave'];
  const singularities = ['高端快充', '便携移动电源', '音频设备', '智能家居', '投影设备', '办公设备', '车载设备', '无线充电'];
  const statuses: ('active' | 'inactive' | 'eol' | 'new')[] = ['active', 'active', 'active', 'new', 'inactive', 'eol'];
  
  const data: PNAuditData[] = [];
  
  // 按PN维度生成数据（每个PN对应一条记录）
  for (let i = 1; i <= 80; i++) {
    const pdt = pdts[Math.floor(Math.random() * pdts.length)];
    const singularity = singularities[Math.floor(Math.random() * singularities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const baseSales = Math.floor(2000 + Math.random() * 8000); // 2000-10000 销量范围
    
    const jan = Math.floor(baseSales * (0.8 + Math.random() * 0.4));
    const feb = Math.floor(baseSales * (0.85 + Math.random() * 0.3));
    const mar = Math.floor(baseSales * (0.9 + Math.random() * 0.2));
    const apr = Math.floor(baseSales * (0.85 + Math.random() * 0.3));
    const may = Math.floor(baseSales * (0.8 + Math.random() * 0.4));
    const jun = Math.floor(baseSales * (0.9 + Math.random() * 0.2));
    
    const currentStock = Math.floor(baseSales * (0.3 + Math.random() * 1.2));
    const q3SalesForecast = Math.floor(baseSales * (2.5 + Math.random() * 1.0));
    const q3Amount = q3SalesForecast * (20 + Math.random() * 60); // 单价20-80
    const auditCorrected = Math.floor(q3SalesForecast * (0.95 + Math.random() * 0.1)); // 95%-105%的调整
    
    data.push({
      key: i.toString(),
      pdt,
      pn: `A${1000 + i}`,
      singularitySegment: singularity,
      productStatus: status,
      jan2025Sales: jan,
      feb2025Sales: feb,
      mar2025Sales: mar,
      apr2025Sales: apr,
      may2025Sales: may,
      jun2025Sales: jun,
      currentStock,
      q3SalesForecastQuantity: q3SalesForecast,
      q3ForecastAmount: q3Amount,
      auditCorrectedQuantity: auditCorrected
    });
  }
  
  return data;
};

const PNAuditPage: React.FC = () => {
  const [data, setData] = useState<PNAuditData[]>(generateAuditData());

  // 列显示控制 - 默认显示所有列
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
    'pdt', 'pn', 'singularitySegment', 'productStatus',
    'jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales',
    'currentStock', 'q3SalesForecastQuantity', 'q3ForecastAmount', 'auditCorrectedQuantity'
  ]));

  // 列设置抽屉
  const [columnSettingsOpen, setColumnSettingsOpen] = useState(false);

  // 防抖处理
  const debounceTimer = useRef<NodeJS.Timeout>();

  const filteredData = data.filter(item => {
    // 这里可以根据需要添加筛选逻辑
    return true;
  });

  // 处理可编辑字段的变更（防抖优化）
  const handleEditableFieldChange = useCallback((key: string, field: string, value: number) => {
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
      console.log(`Field ${field} updated to ${value} for PN ${key}`);
    }, 200);
  }, []);

  const getProductStatusColor = (status: string) => {
    const statusMap = {
      'active': 'success',
      'inactive': 'default',
      'eol': 'error',
      'new': 'processing'
    };
    return statusMap[status as keyof typeof statusMap] || 'default';
  };

  const getProductStatusText = (status: string) => {
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

  const formatAmount = (amount: number) => {
    return `¥${(amount / 10000).toFixed(1)}万`;
  };

  const allColumns = useMemo((): ColumnsType<PNAuditData> => [
    {
      title: 'PDT',
      dataIndex: 'pdt',
      key: 'pdt',
      fixed: 'left',
      width: 100,
      render: (text: string) => (
        <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>{text}</Text>
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
      width: 120,
      render: (text: string) => (
        <Tag color="cyan" style={{ fontSize: '11px' }}>{text}</Tag>
      ),
    },
    {
      title: '产品状态',
      dataIndex: 'productStatus',
      key: 'productStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={getProductStatusColor(status)} style={{ fontSize: '11px' }}>
          {getProductStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '25年1月销量',
      dataIndex: 'jan2025Sales',
      key: 'jan2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.jan2025Sales - b.jan2025Sales,
    },
    {
      title: '25年2月销量',
      dataIndex: 'feb2025Sales',
      key: 'feb2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.feb2025Sales - b.feb2025Sales,
    },
    {
      title: '25年3月销量',
      dataIndex: 'mar2025Sales',
      key: 'mar2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.mar2025Sales - b.mar2025Sales,
    },
    {
      title: '25年4月销量',
      dataIndex: 'apr2025Sales',
      key: 'apr2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.apr2025Sales - b.apr2025Sales,
    },
    {
      title: '25年5月销量',
      dataIndex: 'may2025Sales',
      key: 'may2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.may2025Sales - b.may2025Sales,
    },
    {
      title: '25年6月销量',
      dataIndex: 'jun2025Sales',
      key: 'jun2025Sales',
      width: 110,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.jun2025Sales - b.jun2025Sales,
    },
    {
      title: '现有库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#333', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: 'Q3-sales预测数量',
      dataIndex: 'q3SalesForecastQuantity',
      key: 'q3SalesForecastQuantity',
      width: 140,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1', fontWeight: 600 }}>
          {formatNumber(value)}
        </Text>
      ),
      sorter: (a, b) => a.q3SalesForecastQuantity - b.q3SalesForecastQuantity,
    },
    {
      title: 'Q3-预测金额',
      dataIndex: 'q3ForecastAmount',
      key: 'q3ForecastAmount',
      width: 120,
      render: (value: number) => (
        <Text strong style={{ fontSize: '11px', color: '#722ed1', fontWeight: 600 }}>
          {formatAmount(value)}
        </Text>
      ),
      sorter: (a, b) => a.q3ForecastAmount - b.q3ForecastAmount,
    },
    {
      title: '评审修正数量',
      dataIndex: 'auditCorrectedQuantity',
      key: 'auditCorrectedQuantity',
      width: 130,
      render: (value: number, record: PNAuditData) => (
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
          onChange={(newValue) => handleEditableFieldChange(record.key, 'auditCorrectedQuantity', newValue || 0)}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(val) => parseInt(val!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      ),
      sorter: (a, b) => a.auditCorrectedQuantity - b.auditCorrectedQuantity,
    }
  ], [handleEditableFieldChange]);

  // 根据可见列筛选columns
  const columns = useMemo(() => {
    return allColumns.filter(col => visibleColumns.has(col.key as string));
  }, [allColumns, visibleColumns]);

  // 列分组定义
  const columnGroups = useMemo(() => ({
    basic: ['pdt', 'pn', 'singularitySegment', 'productStatus'],
    sales: ['jan2025Sales', 'feb2025Sales', 'mar2025Sales', 'apr2025Sales', 'may2025Sales', 'jun2025Sales'],
    forecast: ['currentStock', 'q3SalesForecastQuantity', 'q3ForecastAmount'],
    audit: ['auditCorrectedQuantity']
  }), []);

  const handleSaveAll = () => {
    message.success('所有评审修正数据已保存！');
  };

  const handleExport = () => {
    message.info('正在导出PN审核数据...');
  };

  const handleImport = () => {
    message.info('导入功能开发中...');
  };

  // 计算统计数据
  const statisticsData = useMemo(() => {
    const totalQ3Forecast = filteredData.reduce((sum, item) => sum + item.q3SalesForecastQuantity, 0);
    const totalCorrected = filteredData.reduce((sum, item) => sum + item.auditCorrectedQuantity, 0);
    const totalAmount = filteredData.reduce((sum, item) => sum + item.q3ForecastAmount, 0);
    const avgCorrectionRate = totalQ3Forecast > 0 ? (totalCorrected / totalQ3Forecast * 100) : 0;
    
    return { totalQ3Forecast, totalCorrected, totalAmount, avgCorrectionRate };
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
              📋 PN审核
            </Title>
            <Text type="secondary">按PN维度进行评审修正数量填写</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ImportOutlined />}
                onClick={handleImport}
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
                icon={<SaveOutlined />}
                onClick={handleSaveAll}
                style={{ borderRadius: '6px' }}
              >
                保存审核结果
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="Q3预测总量"
              value={statisticsData.totalQ3Forecast}
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="修正后总量"
              value={statisticsData.totalCorrected}
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="预测总金额"
              value={statisticsData.totalAmount / 10000}
              precision={1}
              suffix="万"
              prefix="¥"
              valueStyle={{ color: '#722ed1', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="平均修正率"
              value={statisticsData.avgCorrectionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#fa8c16', fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '12px' }}>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[12, 12]} align="middle">
            <Col flex={1}>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                当前显示 {filteredData.length} 条PN记录 | 评审修正数量可编辑
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
            pageSizeOptions: ['50', '100', '200'],
          }}
          scroll={{ x: 1600, y: 600 }}
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
                        {groupKey === 'forecast' && '预测信息'}
                        {groupKey === 'audit' && '审核编辑'}
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
              setVisibleColumns(new Set(['pdt', 'pn', 'auditCorrectedQuantity']));
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

export default PNAuditPage;