import React from 'react';
import { Row, Col, Typography, Card, Statistic } from 'antd';
import { 
  ArrowUpOutlined, 
  DashboardOutlined,
  PieChartOutlined,
  FundOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { mockPNData, mockPDTData } from '../data/mockData';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // 基础统计数据
  const totalProducts = mockPNData.length;
  const totalForecastAmount = mockPNData.reduce((sum, item) => sum + item.q3ForecastAmount, 0);
  const avgAchievementRate = mockPNData.reduce((sum, item) => sum + item.salesAchievementRate, 0) / mockPNData.length;
  const totalCategories = mockPDTData.length;

  // KPI指标数据
  const kpiData = [
    {
      title: 'PN产品总数',
      value: totalProducts,
      suffix: '个',
      color: '#1890ff',
      icon: <DashboardOutlined />
    },
    {
      title: 'Q3预测总金额',
      value: `${(totalForecastAmount / 10000).toFixed(1)}万`,
      prefix: '¥',
      color: '#52c41a',
      icon: <FundOutlined />
    },
    {
      title: '平均达成率',
      value: avgAchievementRate.toFixed(1),
      suffix: '%',
      color: '#722ed1',
      icon: <ArrowUpOutlined />
    },
    {
      title: 'PDT品类数',
      value: totalCategories,
      suffix: '个',
      color: '#fa8c16',
      icon: <PieChartOutlined />
    }
  ];

  // 奇点细分统计
  const segmentStats = mockPNData.reduce((acc, item) => {
    if (!acc[item.singularitySegment]) {
      acc[item.singularitySegment] = 0;
    }
    acc[item.singularitySegment]++;
    return acc;
  }, {} as Record<string, number>);

  // 产品状态统计
  const statusStats = mockPNData.reduce((acc, item) => {
    if (!acc[item.productStatus]) {
      acc[item.productStatus] = 0;
    }
    acc[item.productStatus]++;
    return acc;
  }, {} as Record<string, number>);

  // 奇点细分饼图配置
  const segmentPieOption = {
    title: {
      text: 'PN产品奇点细分分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 10,
      left: 'center'
    },
    series: [{
      name: '产品数量',
      type: 'pie',
      radius: ['40%', '70%'],
      data: Object.entries(segmentStats).map(([key, value]) => ({
        value,
        name: key
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 产品状态柱状图配置
  const statusBarOption = {
    title: {
      text: '产品状态分布',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: Object.keys(statusStats).map(status => {
        const statusMap: Record<string, string> = {
          'active': '在售',
          'inactive': '停售', 
          'eol': 'EOL',
          'new': '新品'
        };
        return statusMap[status] || status;
      })
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '产品数量',
      type: 'bar',
      data: Object.values(statusStats),
      itemStyle: {
        color: (params: any) => {
          const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666'];
          return colors[params.dataIndex % colors.length];
        },
        borderRadius: [4, 4, 0, 0]
      }
    }]
  };

  // 月度预测趋势图
  const monthlyTrendOption = {
    title: {
      text: 'Q3月度预测趋势',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        return `${params[0].axisValue}<br/>${params[0].seriesName}: ${(params[0].value / 10000).toFixed(1)}万`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['7月', '8月', '9月']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => `${(value / 10000).toFixed(0)}万`
      }
    },
    series: [{
      name: '预测金额',
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: '#fff'
      },
      areaStyle: {
        opacity: 0.3
      },
      data: [
        mockPNData.reduce((sum, item) => sum + item.julyForecast, 0),
        mockPNData.reduce((sum, item) => sum + item.augustForecast, 0),
        mockPNData.reduce((sum, item) => sum + item.septemberForecast, 0)
      ]
    }]
  };

  // 整体达成率仪表盘
  const overallGaugeOption = {
    title: {
      text: '整体达成率',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    series: [{
      name: '达成率',
      type: 'gauge',
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        lineStyle: {
          width: 18
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 25,
        color: '#999',
        fontSize: 12
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 25,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        fontSize: 40,
        offsetCenter: [0, '70%'],
        formatter: '{value}%'
      },
      data: [{
        value: avgAchievementRate
      }]
    }]
  };

  return (
    <div style={{ 
      padding: '24px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ 
          height: '4px', 
          width: '60px', 
          background: 'linear-gradient(90deg, #1890ff, #722ed1)',
          borderRadius: '2px',
          marginBottom: 16
        }} />
        <Title level={2} style={{ margin: 0, color: '#262626' }}>
          📊 数据可视化总览
        </Title>
      </div>

      {/* KPI指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpiData.map((kpi, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: 'none'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '32px', color: kpi.color, marginBottom: '8px' }}>
                    {kpi.icon}
                  </div>
                  <Statistic
                    title={kpi.title}
                    value={kpi.value}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    valueStyle={{ 
                      color: kpi.color, 
                      fontSize: '24px', 
                      fontWeight: 'bold' 
                    }}
                  />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    color: '#52c41a',
                    fontSize: '16px',
                    marginBottom: '4px'
                  }}>
                    <ArrowUpOutlined />
                    {(Math.random() * 20 + 5).toFixed(1)}%
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    较上期
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 第一行图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card 
            title="🎯 PN产品细分分析"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={segmentPieOption} 
              style={{ height: '320px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="📊 产品状态分布"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={statusBarOption} 
              style={{ height: '320px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="⚡ 整体达成率仪表盘"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={overallGaugeOption} 
              style={{ height: '320px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 第二行图表 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title="📅 Q3月度预测趋势分析"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '400px'
            }}
          >
            <ReactECharts 
              option={monthlyTrendOption} 
              style={{ height: '320px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;