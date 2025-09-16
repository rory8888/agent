import React, { useState, useMemo } from 'react';
import { 
  Typography, Card, Row, Col, Space, 
  Statistic, Tag, Divider
} from 'antd';
import { 
  BarChartOutlined, LineChartOutlined, PieChartOutlined,
  DollarOutlined, TrophyOutlined, FundOutlined, PercentageOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;

interface BrandData {
  brand: string;
  sales: number;        // 销量
  profit: number;       // 利润
  cost: number;         // 成本
  grossAmount: number;  // 毛利额
  grossRate: number;    // 毛利率
  categories: {
    category: string;
    sales: number;
    profit: number;
    cost: number;
    grossAmount: number;
    grossRate: number;
  }[];
}

const PDTDataPage: React.FC = () => {
  // 生成品牌数据
  const brandData = useMemo((): BrandData[] => {
    const ankerCategories = [
      { category: '充电器', sales: 850000, cost: 450000, grossRate: 47.1 },
      { category: '移动电源', sales: 1200000, cost: 720000, grossRate: 40.0 },
      { category: '数据线', sales: 320000, cost: 160000, grossRate: 50.0 },
      { category: '无线充电器', sales: 480000, cost: 288000, grossRate: 40.0 },
      { category: '车载充电器', sales: 280000, cost: 154000, grossRate: 45.0 }
    ];
    
    const soundcoreCategories = [
      { category: '蓝牙音箱', sales: 650000, cost: 390000, grossRate: 40.0 },
      { category: '耳机', sales: 920000, cost: 506000, grossRate: 45.0 },
      { category: '音频配件', sales: 180000, cost: 99000, grossRate: 45.0 },
      { category: '智能音响', sales: 360000, cost: 216000, grossRate: 40.0 },
      { category: '降噪耳机', sales: 520000, cost: 286000, grossRate: 45.0 }
    ];
    
    const calculateBrandData = (brand: string, categories: any[]) => {
      const totalSales = categories.reduce((sum, cat) => sum + cat.sales, 0);
      const totalCost = categories.reduce((sum, cat) => sum + cat.cost, 0);
      const grossAmount = totalSales - totalCost;
      const grossRate = (grossAmount / totalSales) * 100;
      const profit = grossAmount * 0.6; // 假设利润是毛利的60%
      
      return {
        brand,
        sales: totalSales,
        profit,
        cost: totalCost,
        grossAmount,
        grossRate,
        categories: categories.map(cat => ({
          ...cat,
          grossAmount: cat.sales - cat.cost,
          profit: (cat.sales - cat.cost) * 0.6
        }))
      };
    };
    
    return [
      calculateBrandData('Anker', ankerCategories),
      calculateBrandData('Soundcore', soundcoreCategories)
    ];
  }, []);

  // 格式化数字
  const formatNumber = (num: number) => {
    return (num / 10000).toFixed(1) + '万';
  };
  
  const formatPercent = (num: number) => {
    return num.toFixed(1) + '%';
  };

  // 柱状图配置
  const getBarChartOption = (data: BrandData) => {
    return {
      title: {
        text: data.brand + ' 销售数据分析',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: data.brand === 'Anker' ? '#1890ff' : '#722ed1'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          let result = params[0].name + '<br/>';
          params.forEach((param: any) => {
            const value = param.seriesName === '毛利率' ? param.value + '%' : formatNumber(param.value * 10000);
            result += param.marker + param.seriesName + ': ' + value + '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: ['销量', '成本', '毛利额', '毛利率'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: data.categories.map(cat => cat.category),
        axisLabel: {
          fontSize: 11,
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '金额(万)',
          position: 'left',
          axisLabel: {
            formatter: '{value}万'
          }
        },
        {
          type: 'value',
          name: '毛利率(%)',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: '销量',
          type: 'bar',
          data: data.categories.map(cat => (cat.sales / 10000).toFixed(1)),
          itemStyle: {
            color: data.brand === 'Anker' ? '#1890ff' : '#722ed1'
          }
        },
        {
          name: '成本',
          type: 'bar',
          data: data.categories.map(cat => (cat.cost / 10000).toFixed(1)),
          itemStyle: {
            color: '#ff7875'
          }
        },
        {
          name: '毛利额',
          type: 'bar',
          data: data.categories.map(cat => (cat.grossAmount / 10000).toFixed(1)),
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          name: '毛利率',
          type: 'line',
          yAxisIndex: 1,
          data: data.categories.map(cat => cat.grossRate.toFixed(1)),
          itemStyle: {
            color: '#faad14'
          },
          lineStyle: {
            width: 3
          }
        }
      ],
      grid: {
        left: 50,
        right: 50,
        top: 80,
        bottom: 80
      }
    };
  };
  
  // 饼图配置
  const getPieChartOption = (data: BrandData) => {
    return {
      title: {
        text: data.brand + ' 品类销量占比',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: data.brand === 'Anker' ? '#1890ff' : '#722ed1'
        },
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}万 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '销量',
          type: 'pie',
          radius: '50%',
          center: ['60%', '50%'],
          data: data.categories.map(cat => ({
            value: (cat.sales / 10000).toFixed(1),
            name: cat.category
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ]
    };
  };

  // 获取品牌颜色
  const getBrandColor = (brand: string) => {
    return brand === 'Anker' ? '#1890ff' : '#722ed1';
  };
  
  // 获取品牌图标
  const getBrandIcon = (brand: string) => {
    return brand === 'Anker' ? <TrophyOutlined /> : <FundOutlined />;
  };

  return (
    <div style={{ 
      padding: '16px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 标题区域 */}
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
              <BarChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              PDT数据分析
            </Title>
            <Text type="secondary">Anker vs Soundcore 品牌数据对比分析</Text>
          </Col>
        </Row>
      </div>

      {/* 品牌对比概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {brandData.map((brand, index) => (
          <Col xs={24} lg={12} key={brand.brand}>
            <Card 
              title={
                <Space>
                  {getBrandIcon(brand.brand)}
                  <Text strong style={{ color: getBrandColor(brand.brand), fontSize: '16px' }}>
                    {brand.brand}
                  </Text>
                </Space>
              }
              style={{ 
                borderRadius: '12px',
                border: `2px solid ${getBrandColor(brand.brand)}20`
              }}
              headStyle={{ 
                background: `${getBrandColor(brand.brand)}10`,
                borderBottom: `1px solid ${getBrandColor(brand.brand)}20`
              }}
            >
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Statistic
                    title="总销量"
                    value={brand.sales}
                    formatter={(value) => formatNumber(value as number)}
                    valueStyle={{ color: getBrandColor(brand.brand), fontSize: '16px' }}
                    prefix={<BarChartOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="总利润"
                    value={brand.profit}
                    formatter={(value) => formatNumber(value as number)}
                    valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    prefix={<DollarOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="总成本"
                    value={brand.cost}
                    formatter={(value) => formatNumber(value as number)}
                    valueStyle={{ color: '#ff7875', fontSize: '16px' }}
                    prefix={<FundOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="毛利率"
                    value={brand.grossRate}
                    formatter={(value) => formatPercent(value as number)}
                    valueStyle={{ color: '#faad14', fontSize: '16px' }}
                    prefix={<PercentageOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 品牌数据图表 */}
      <Row gutter={[16, 16]}>
        {brandData.map((brand, index) => (
          <Col xs={24} lg={12} key={brand.brand}>
            <Card 
              title={
                <Space>
                  <BarChartOutlined style={{ color: getBrandColor(brand.brand) }} />
                  <span>{brand.brand} 详细数据分析</span>
                </Space>
              }
              style={{ 
                borderRadius: '12px',
                border: `1px solid ${getBrandColor(brand.brand)}30`
              }}
            >
              {/* 柱状图 */}
              <div style={{ marginBottom: 20 }}>
                <ReactECharts 
                  option={getBarChartOption(brand)}
                  style={{ height: '300px', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
              
              <Divider />
              
              {/* 饼图 */}
              <div>
                <ReactECharts 
                  option={getPieChartOption(brand)}
                  style={{ height: '250px', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 数据汇总对比 */}
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <PieChartOutlined style={{ color: '#52c41a' }} />
                <span>品牌数据对比汇总</span>
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f0f9ff' }}>
                  <Statistic
                    title="总销量对比"
                    value={`${formatNumber(brandData[0].sales)} : ${formatNumber(brandData[1].sales)}`}
                    valueStyle={{ color: '#1890ff', fontSize: '14px' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
                  <Statistic
                    title="总利润对比"
                    value={`${formatNumber(brandData[0].profit)} : ${formatNumber(brandData[1].profit)}`}
                    valueStyle={{ color: '#52c41a', fontSize: '14px' }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff2e8' }}>
                  <Statistic
                    title="总成本对比"
                    value={`${formatNumber(brandData[0].cost)} : ${formatNumber(brandData[1].cost)}`}
                    valueStyle={{ color: '#fa8c16', fontSize: '14px' }}
                    prefix={<FundOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fffbe6' }}>
                  <Statistic
                    title="毛利率对比"
                    value={`${formatPercent(brandData[0].grossRate)} : ${formatPercent(brandData[1].grossRate)}`}
                    valueStyle={{ color: '#faad14', fontSize: '14px' }}
                    prefix={<PercentageOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PDTDataPage;