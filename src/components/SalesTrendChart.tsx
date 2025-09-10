import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { SalesData } from '../types';

const { Title, Text } = Typography;

interface SalesTrendChartProps {
  data: SalesData[];
  loading?: boolean;
  height?: number;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ 
  data, 
  loading = false, 
  height = 400 
}) => {
  const getOption = () => {
    const actualData = data.filter(item => item.actual !== undefined);
    const forecastData = data.filter(item => item.forecast !== undefined);
    const upperBoundData = data.filter(item => item.upperBound !== undefined);
    const lowerBoundData = data.filter(item => item.lowerBound !== undefined);

    const actualDates = actualData.map(item => item.date);
    const forecastDates = forecastData.map(item => item.date);
    const allDates = [...new Set([...actualDates, ...forecastDates])].sort();

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params: any) => {
          let result = `<div style="margin-bottom: 8px; font-weight: bold;">${params[0].axisValue}</div>`;
          params.forEach((param: any) => {
            const value = param.value ? `¥${(param.value / 10000).toFixed(1)}万` : '--';
            result += `
              <div style="display: flex; align-items: center; margin-bottom: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="margin-right: 8px;">${param.seriesName}:</span>
                <span style="font-weight: bold;">${value}</span>
              </div>
            `;
          });
          return result;
        }
      },
      legend: {
        data: ['历史实际', '预测值', '预测区间'],
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
        boundaryGap: false,
        data: allDates,
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999',
          fontSize: 11
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
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
          name: '预测区间',
          type: 'line',
          data: allDates.map(date => {
            const upperItem = upperBoundData.find(item => item.date === date);
            return upperItem ? upperItem.upperBound : null;
          }),
          lineStyle: {
            opacity: 0
          },
          stack: 'confidence-band',
          symbol: 'none',
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.1)'
          }
        },
        {
          name: '预测区间下界',
          type: 'line',
          data: allDates.map(date => {
            const lowerItem = lowerBoundData.find(item => item.date === date);
            const upperItem = upperBoundData.find(item => item.date === date);
            if (lowerItem && upperItem) {
              return upperItem.upperBound! - lowerItem.lowerBound!;
            }
            return null;
          }),
          lineStyle: {
            opacity: 0
          },
          stack: 'confidence-band',
          symbol: 'none',
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.1)'
          },
          showInLegend: false
        },
        {
          name: '历史实际',
          type: 'line',
          data: allDates.map(date => {
            const actualItem = actualData.find(item => item.date === date);
            return actualItem ? actualItem.actual : null;
          }),
          lineStyle: {
            color: '#52c41a',
            width: 3
          },
          itemStyle: {
            color: '#52c41a',
            borderWidth: 2,
            borderColor: '#fff'
          },
          symbol: 'circle',
          symbolSize: 6,
          smooth: true
        },
        {
          name: '预测值',
          type: 'line',
          data: allDates.map(date => {
            const forecastItem = forecastData.find(item => item.date === date);
            return forecastItem ? forecastItem.forecast : null;
          }),
          lineStyle: {
            color: '#1890ff',
            width: 3,
            type: 'dashed'
          },
          itemStyle: {
            color: '#1890ff',
            borderWidth: 2,
            borderColor: '#fff'
          },
          symbol: 'diamond',
          symbolSize: 8,
          smooth: true
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 0,
          end: 100,
          height: 20
        }
      ]
    };
  };

  return (
    <Card 
      loading={loading}
      style={{ 
        marginBottom: 24,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              销售趋势预测
            </Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              历史数据与未来预测的对比分析
            </Text>
          </div>
          <Space>
            <Tag color="success">实际销售</Tag>
            <Tag color="processing">预测值</Tag>
            <Tag color="default">置信区间</Tag>
          </Space>
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

export default SalesTrendChart;