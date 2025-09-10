import React from 'react';
import { Card, Typography, Space, Select } from 'antd';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { Option } = Select;

interface CategoryChartProps {
  loading?: boolean;
  height?: number;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ 
  loading = false, 
  height = 350 
}) => {
  const categoryData = [
    { name: '手机', value: 4500000, forecast: 4800000 },
    { name: '笔记本电脑', value: 3200000, forecast: 3400000 },
    { name: '平板电脑', value: 2100000, forecast: 2300000 },
    { name: '音频设备', value: 1800000, forecast: 1950000 },
    { name: '智能手表', value: 1200000, forecast: 1350000 },
    { name: '配件', value: 900000, forecast: 1000000 }
  ];

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = `<div style="margin-bottom: 8px; font-weight: bold;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = `¥${(param.value / 10000).toFixed(0)}万`;
            result += `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 2px; margin-right: 8px;"></span>
                <span style="margin-right: 8px;">${param.seriesName}:</span>
                <span style="font-weight: bold;">${value}</span>
              </div>
            `;
          });
          return result;
        }
      },
      legend: {
        data: ['实际销售', '预测销售'],
        top: 10,
        itemGap: 20,
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categoryData.map(item => item.name),
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#666',
          fontSize: 11,
          interval: 0,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 11,
          formatter: (value: number) => `${(value / 10000).toFixed(0)}万`
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '实际销售',
          type: 'bar',
          data: categoryData.map(item => item.value),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#52c41a'
              }, {
                offset: 1, color: '#a0d468'
              }]
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '35%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        },
        {
          name: '预测销售',
          type: 'bar',
          data: categoryData.map(item => item.forecast),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#1890ff'
              }, {
                offset: 1, color: '#69c0ff'
              }]
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '35%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }
      ]
    };
  };

  return (
    <Card 
      loading={loading}
      style={{ 
        height: height + 100,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              品类销售对比
            </Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              各产品类别的销售表现分析
            </Text>
          </div>
          <Select defaultValue="2024" style={{ width: 100 }}>
            <Option value="2024">2024年</Option>
            <Option value="2023">2023年</Option>
          </Select>
        </Space>
      </div>
      
      <ReactECharts
        option={getOption()}
        style={{ height: `${height}px` }}
        opts={{ renderer: 'svg' }}
        theme="light"
      />
    </Card>
  );
};

export default CategoryChart;