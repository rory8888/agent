import React from 'react';
import { Card, DatePicker, Select, Space, Button, Typography, Row, Col } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { FilterOptions } from '../types';
import { categories, regions, customerTypes } from '../data/mockData';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  loading?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  loading = false 
}) => {
  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      onFiltersChange({
        ...filters,
        dateRange: [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]
      });
    }
  };

  const handleCategoriesChange = (values: string[]) => {
    onFiltersChange({
      ...filters,
      categories: values
    });
  };

  const handleRegionsChange = (values: string[]) => {
    onFiltersChange({
      ...filters,
      regions: values
    });
  };

  const handleCustomerTypesChange = (values: string[]) => {
    onFiltersChange({
      ...filters,
      customerTypes: values
    });
  };

  const handleReset = () => {
    onFiltersChange({
      dateRange: [dayjs().subtract(1, 'year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
      categories: [],
      regions: [],
      customerTypes: []
    });
  };

  const dateRange = filters.dateRange.map(date => dayjs(date));

  return (
    <Card 
      size="small"
      style={{ 
        marginBottom: 24,
        borderRadius: '8px',
        border: '1px solid #f0f0f0',
        backgroundColor: '#fafafa'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 12]} align="middle">
        <Col>
          <Space align="center">
            <FilterOutlined style={{ color: '#1890ff' }} />
            <Text strong style={{ fontSize: '14px' }}>筛选条件</Text>
          </Space>
        </Col>
        
        <Col flex={1}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>时间范围</Text>
                <RangePicker
                  value={dateRange as any}
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                  size="small"
                  format="YYYY-MM-DD"
                  disabled={loading}
                />
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>产品类别</Text>
                <Select
                  mode="multiple"
                  placeholder="选择类别"
                  value={filters.categories}
                  onChange={handleCategoriesChange}
                  style={{ width: '100%' }}
                  size="small"
                  maxTagCount="responsive"
                  disabled={loading}
                >
                  {categories.map(category => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={6}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>销售区域</Text>
                <Select
                  mode="multiple"
                  placeholder="选择区域"
                  value={filters.regions}
                  onChange={handleRegionsChange}
                  style={{ width: '100%' }}
                  size="small"
                  maxTagCount="responsive"
                  disabled={loading}
                >
                  {regions.map(region => (
                    <Option key={region} value={region}>
                      {region}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
            
            <Col xs={24} sm={12} md={5}>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>客户类型</Text>
                <Select
                  mode="multiple"
                  placeholder="选择类型"
                  value={filters.customerTypes}
                  onChange={handleCustomerTypesChange}
                  style={{ width: '100%' }}
                  size="small"
                  maxTagCount="responsive"
                  disabled={loading}
                >
                  {customerTypes.map(type => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>
        </Col>
        
        <Col>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            size="small"
            disabled={loading}
            style={{ 
              border: 'none',
              backgroundColor: 'transparent',
              color: '#666'
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterPanel;