import React, { useState, useCallback } from 'react';
import { 
  Table, Typography, Space, Button, Tag, Input, Select,
  Card, InputNumber, message, Form, Row, Col, 
  Statistic, Alert, Tooltip, Avatar, Modal, Radio, Upload, Checkbox
} from 'antd';
import { 
  UserOutlined, EditOutlined, PlusOutlined, DeleteOutlined, SwapOutlined,
  ImportOutlined, ExportOutlined, UploadOutlined, DownloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface PNEntryData {
  key: string;
  pn: string;
  region: string;
  salesPerson: string;
  quantity: number;
  isNew?: boolean;
}

interface SKUEntryData {
  key: string;
  sku: string;
  region: string;
  salesPerson: string;
  quantity: number;
  isNew?: boolean;
}

interface NewEntryForm {
  pn?: string;
  sku?: string;
  region: string;
  quantity: number;
  mode: 'refresh' | 'add';
}

const PNFastEntry: React.FC = () => {
  const [viewMode, setViewMode] = useState<'PN' | 'SKU'>('PN');
  
  const [data, setData] = useState<PNEntryData[]>([
    {
      key: '1',
      pn: 'A5634',
      region: '华东区',
      salesPerson: '张三',
      quantity: 15000
    },
    {
      key: '2',
      pn: 'A2637',
      region: '华东区', 
      salesPerson: '张三',
      quantity: 12000
    },
    {
      key: '3',
      pn: 'A1266',
      region: '华南区',
      salesPerson: '李四',
      quantity: 8500
    }
  ]);

  const [skuData, setSkuData] = useState<SKUEntryData[]>([
    {
      key: '1',
      sku: 'A5634-BK-US',
      region: '华东区',
      salesPerson: '张三',
      quantity: 8000
    },
    {
      key: '2',
      sku: 'A5634-WH-EU',
      region: '华东区',
      salesPerson: '张三',
      quantity: 7000
    },
    {
      key: '3',
      sku: 'A2637-BK-US',
      region: '华东区',
      salesPerson: '张三',
      quantity: 6500
    },
    {
      key: '4',
      sku: 'A2637-WH-EU',
      region: '华东区',
      salesPerson: '张三',
      quantity: 5500
    },
    {
      key: '5',
      sku: 'A1266-BK-US',
      region: '华南区',
      salesPerson: '李四',
      quantity: 4500
    },
    {
      key: '6',
      sku: 'A1266-WH-EU',
      region: '华南区',
      salesPerson: '李四',
      quantity: 4000
    }
  ]);

  const [selectedRegion, setSelectedRegion] = useState<string>('全部');
  const [selectedSales, setSelectedSales] = useState<string>('全部');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PNEntryData | SKUEntryData | null>(null);
  const [form] = Form.useForm<NewEntryForm>();
  
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importFileList, setImportFileList] = useState<any[]>([]);
  const [exportFields, setExportFields] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const regions = ['全部', '华东区', '华南区', '华北区', '华中区'];
  const salesPersons = ['全部', '张三', '李四', '王五'];

  const getCurrentData = () => viewMode === 'PN' ? data : skuData;
  const setCurrentData = (newData: any) => viewMode === 'PN' ? setData(newData) : setSkuData(newData);
  
  const filteredData = getCurrentData().filter(item => {
    const regionMatch = selectedRegion === '全部' || item.region === selectedRegion;
    const salesMatch = selectedSales === '全部' || item.salesPerson === selectedSales;
    return regionMatch && salesMatch;
  });

  const handleQuantityChange = useCallback((key: string, value: number) => {
    if (viewMode === 'PN') {
      setData(prevData => 
        prevData.map(item => 
          item.key === key 
            ? { ...item, quantity: value }
            : item
        )
      );
    } else {
      setSkuData(prevData => 
        prevData.map(item => 
          item.key === key 
            ? { ...item, quantity: value }
            : item
        )
      );
    }
  }, [viewMode]);

  const handleAddNew = useCallback(() => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({
      mode: 'refresh'
    });
    setModalVisible(true);
  }, [form]);

  const handleEdit = useCallback((record: PNEntryData | SKUEntryData) => {
    setEditingRecord(record);
    if (viewMode === 'PN') {
      form.setFieldsValue({
        pn: (record as PNEntryData).pn,
        region: record.region,
        quantity: record.quantity,
        mode: 'refresh'
      });
    } else {
      form.setFieldsValue({
        sku: (record as SKUEntryData).sku,
        region: record.region,
        quantity: record.quantity,
        mode: 'refresh'
      });
    }
    setModalVisible(true);
  }, [form, viewMode]);

  const handleDelete = useCallback((key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => {
        if (viewMode === 'PN') {
          setData(prevData => prevData.filter(item => item.key !== key));
        } else {
          setSkuData(prevData => prevData.filter(item => item.key !== key));
        }
        message.success('删除成功');
      }
    });
  }, [viewMode]);

  const generateKey = () => {
    return Date.now().toString();
  };

  const getSalesPersonByRegion = (region: string) => {
    const regionSalesMap: Record<string, string> = {
      '华东区': '张三',
      '华南区': '李四',
      '华北区': '王五',
      '华中区': '王五'
    };
    return regionSalesMap[region] || '张三';
  };

  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const salesPerson = getSalesPersonByRegion(values.region);
      
      if (viewMode === 'PN') {
        if (editingRecord) {
          // 编辑现有记录
          if (values.mode === 'refresh') {
            setData(prevData => 
              prevData.map(item => 
                item.key === editingRecord.key 
                  ? { ...item, pn: values.pn, region: values.region, quantity: values.quantity, salesPerson }
                  : item
              )
            );
            message.success('更新成功');
          } else {
            // 增加到现有记录
            setData(prevData => 
              prevData.map(item => 
                item.key === editingRecord.key 
                  ? { ...item, quantity: item.quantity + values.quantity }
                  : item
              )
            );
            message.success('数量已增加');
          }
        } else {
          // 新增PN记录
          if (values.mode === 'refresh') {
            // 刷新模式：直接新增或替换
            const existingIndex = data.findIndex(item => 
              item.pn === values.pn && item.region === values.region && item.salesPerson === salesPerson
            );
            
            if (existingIndex >= 0) {
              // 找到相同PN、区域、Sales的记录，替换数量
              setData(prevData => 
                prevData.map((item, index) => 
                  index === existingIndex 
                    ? { ...item, quantity: values.quantity }
                    : item
                )
              );
              message.success('已更新现有记录');
            } else {
              // 新增记录
              const newRecord: PNEntryData = {
                key: generateKey(),
                pn: values.pn,
                region: values.region,
                quantity: values.quantity,
                salesPerson,
                isNew: true
              };
              setData(prevData => [...prevData, newRecord]);
              message.success('新增成功');
            }
          } else {
            // 增加模式：累加到现有记录或新增
            const existingIndex = data.findIndex(item => 
              item.pn === values.pn && item.region === values.region && item.salesPerson === salesPerson
            );
            
            if (existingIndex >= 0) {
              // 找到相同记录，累加数量
              setData(prevData => 
                prevData.map((item, index) => 
                  index === existingIndex 
                    ? { ...item, quantity: item.quantity + values.quantity }
                    : item
                )
              );
              message.success('数量已累加到现有记录');
            } else {
              // 新增记录
              const newRecord: PNEntryData = {
                key: generateKey(),
                pn: values.pn,
                region: values.region,
                quantity: values.quantity,
                salesPerson,
                isNew: true
              };
              setData(prevData => [...prevData, newRecord]);
              message.success('新增成功');
            }
          }
        }
      } else {
        // SKU 模式处理
        if (editingRecord) {
          // 编辑现有SKU记录
          if (values.mode === 'refresh') {
            setSkuData(prevData => 
              prevData.map(item => 
                item.key === editingRecord.key 
                  ? { ...item, sku: values.sku, region: values.region, quantity: values.quantity, salesPerson }
                  : item
              )
            );
            message.success('更新成功');
          } else {
            // 增加到现有记录
            setSkuData(prevData => 
              prevData.map(item => 
                item.key === editingRecord.key 
                  ? { ...item, quantity: item.quantity + values.quantity }
                  : item
              )
            );
            message.success('数量已增加');
          }
        } else {
          // 新增SKU记录
          if (values.mode === 'refresh') {
            // 刷新模式：直接新增或替换
            const existingIndex = skuData.findIndex(item => 
              item.sku === values.sku && item.region === values.region && item.salesPerson === salesPerson
            );
            
            if (existingIndex >= 0) {
              // 找到相同SKU、区域、Sales的记录，替换数量
              setSkuData(prevData => 
                prevData.map((item, index) => 
                  index === existingIndex 
                    ? { ...item, quantity: values.quantity }
                    : item
                )
              );
              message.success('已更新现有记录');
            } else {
              // 新增记录
              const newRecord: SKUEntryData = {
                key: generateKey(),
                sku: values.sku,
                region: values.region,
                quantity: values.quantity,
                salesPerson,
                isNew: true
              };
              setSkuData(prevData => [...prevData, newRecord]);
              message.success('新增成功');
            }
          } else {
            // 增加模式：累加到现有记录或新增
            const existingIndex = skuData.findIndex(item => 
              item.sku === values.sku && item.region === values.region && item.salesPerson === salesPerson
            );
            
            if (existingIndex >= 0) {
              // 找到相同记录，累加数量
              setSkuData(prevData => 
                prevData.map((item, index) => 
                  index === existingIndex 
                    ? { ...item, quantity: item.quantity + values.quantity }
                    : item
                )
              );
              message.success('数量已累加到现有记录');
            } else {
              // 新增记录
              const newRecord: SKUEntryData = {
                key: generateKey(),
                sku: values.sku,
                region: values.region,
                quantity: values.quantity,
                salesPerson,
                isNew: true
              };
              setSkuData(prevData => [...prevData, newRecord]);
              message.success('新增成功');
            }
          }
        }
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }, [editingRecord, form]);

  const handleContinueAdd = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const salesPerson = getSalesPersonByRegion(values.region);
      
      if (editingRecord) {
        if (values.mode === 'refresh') {
          setData(prevData => 
            prevData.map(item => 
              item.key === editingRecord.key 
                ? { ...item, pn: values.pn, region: values.region, quantity: values.quantity, salesPerson }
                : item
            )
          );
          message.success('更新成功');
        } else {
          // 增加到现有记录
          setData(prevData => 
            prevData.map(item => 
              item.key === editingRecord.key 
                ? { ...item, quantity: item.quantity + values.quantity }
                : item
            )
          );
          message.success('数量已增加');
        }
      } else {
        // 新增记录
        if (values.mode === 'refresh') {
          // 刷新模式：直接新增或替换
          const existingIndex = data.findIndex(item => 
            item.pn === values.pn && item.region === values.region && item.salesPerson === salesPerson
          );
          
          if (existingIndex >= 0) {
            // 找到相同PN、区域、Sales的记录，替换数量
            setData(prevData => 
              prevData.map((item, index) => 
                index === existingIndex 
                  ? { ...item, quantity: values.quantity }
                  : item
              )
            );
            message.success('已更新现有记录');
          } else {
            // 新增记录
            const newRecord: PNEntryData = {
              key: generateKey(),
              pn: values.pn,
              region: values.region,
              quantity: values.quantity,
              salesPerson,
              isNew: true
            };
            setData(prevData => [...prevData, newRecord]);
            message.success('新增成功');
          }
        } else {
          // 增加模式：累加到现有记录或新增
          const existingIndex = data.findIndex(item => 
            item.pn === values.pn && item.region === values.region && item.salesPerson === salesPerson
          );
          
          if (existingIndex >= 0) {
            // 找到相同记录，累加数量
            setData(prevData => 
              prevData.map((item, index) => 
                index === existingIndex 
                  ? { ...item, quantity: item.quantity + values.quantity }
                  : item
              )
            );
            message.success('数量已累加到现有记录');
          } else {
            // 新增记录
            const newRecord: PNEntryData = {
              key: generateKey(),
              pn: values.pn,
              region: values.region,
              quantity: values.quantity,
              salesPerson,
              isNew: true
            };
            setData(prevData => [...prevData, newRecord]);
            message.success('新增成功');
          }
        }
      }
      
      // 重置表单但保持模态框开启
      form.resetFields();
      form.setFieldsValue({
        mode: 'refresh'
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }, [editingRecord, form]);

  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  }, [form]);

  const handleImport = useCallback(() => {
    setImportModalVisible(true);
    setImportFileList([]);
  }, []);

  const handleExport = useCallback(() => {
    // 初始化导出字段
    const defaultFields = viewMode === 'PN' 
      ? ['pn', 'region', 'salesPerson', 'quantity']
      : ['sku', 'region', 'salesPerson', 'quantity'];
    setExportFields(defaultFields);
    setExportModalVisible(true);
  }, [viewMode]);

  const handleFileUpload = useCallback((file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setImporting(true);
        // 模拟Excel解析过程
        setTimeout(() => {
          // 这里应该使用实际的Excel解析库如xlsx
          // 现在模拟导入数据
          let mockImportData: (PNEntryData | SKUEntryData)[];
          
          if (viewMode === 'PN') {
            mockImportData = [
              {
                key: generateKey(),
                pn: 'A9999',
                region: '华东区',
                salesPerson: '张三',
                quantity: 5000,
                isNew: true
              },
              {
                key: generateKey(),
                pn: 'A8888',
                region: '华南区',
                salesPerson: '李四',
                quantity: 3000,
                isNew: true
              }
            ] as PNEntryData[];
          } else {
            mockImportData = [
              {
                key: generateKey(),
                sku: 'A9999-BK-US',
                region: '华东区',
                salesPerson: '张三',
                quantity: 5000,
                isNew: true
              },
              {
                key: generateKey(),
                sku: 'A8888-WH-EU',
                region: '华南区',
                salesPerson: '李四',
                quantity: 3000,
                isNew: true
              }
            ] as SKUEntryData[];
          }
          
          if (viewMode === 'PN') {
            setData(prevData => [...prevData, ...(mockImportData as PNEntryData[])]);
          } else {
            setSkuData(prevData => [...prevData, ...(mockImportData as SKUEntryData[])]);
          }
          
          message.success(`成功导入 ${mockImportData.length} 条${viewMode}数据`);
          setImporting(false);
          setImportModalVisible(false);
        }, 2000);
      } catch (error) {
        message.error('文件解析失败，请检查文件格式');
        setImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
    return false; // 阻止自动上传
  }, [viewMode]);

  const handleExportConfirm = useCallback(() => {
    setExporting(true);
    
    // 模拟导出过程
    setTimeout(() => {
      const currentData = getCurrentData();
      const exportData = currentData.map(item => {
        const row: any = {};
        exportFields.forEach(field => {
          if (field in item) {
            row[field] = (item as any)[field];
          }
        });
        return row;
      });
      
      // 生成CSV数据
      const headers = exportFields.map(field => getFieldLabel(field));
      const csvRows = [headers.join(',')];
      
      exportData.forEach(item => {
        const row = exportFields.map(field => {
          const value = item[field] || '';
          return `"${value}"`;
        });
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${viewMode}数据导出_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      message.success(`成功导出 ${exportData.length} 条${viewMode}数据`);
      setExporting(false);
      setExportModalVisible(false);
    }, 1000);
  }, [getCurrentData, exportFields, viewMode]);

  const getExportFieldOptions = () => {
    if (viewMode === 'PN') {
      return [
        { label: 'PN编号', value: 'pn' },
        { label: '区域', value: 'region' },
        { label: 'Sales', value: 'salesPerson' },
        { label: '预测数量', value: 'quantity' }
      ];
    } else {
      return [
        { label: 'SKU编号', value: 'sku' },
        { label: '区域', value: 'region' },
        { label: 'Sales', value: 'salesPerson' },
        { label: '预测数量', value: 'quantity' }
      ];
    }
  };

  const getFieldLabel = (field: string) => {
    const fieldMap: Record<string, string> = {
      pn: 'PN编号',
      sku: 'SKU编号',
      region: '区域',
      salesPerson: 'Sales',
      quantity: '预测数量'
    };
    return fieldMap[field] || field;
  };

  const getColumns = (): ColumnsType<any> => [
    {
      title: viewMode,
      dataIndex: viewMode === 'PN' ? 'pn' : 'sku',
      key: viewMode === 'PN' ? 'pn' : 'sku',
      width: 120,
      render: (text: string, record: any) => (
        <Text 
          strong 
          style={{ 
            fontSize: '13px',
            color: record.isNew ? '#52c41a' : '#1890ff',
            fontWeight: 'bold',
            background: record.isNew ? 'linear-gradient(90deg, #f6ffed, #f0f9ff)' : 'linear-gradient(90deg, #e6f7ff, #f0f9ff)',
            padding: '3px 6px',
            borderRadius: '4px',
            border: record.isNew ? '1px solid #95de64' : '1px solid #91d5ff'
          }}
        >
          {text}
          {record.isNew && <Tag color="green" style={{ marginLeft: 4, fontSize: '10px' }}>新增</Tag>}
        </Text>
      ),
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 100,
      render: (text: string) => <Tag color="blue" style={{ fontSize: '12px' }}>{text}</Tag>
    },
    {
      title: 'Sales',
      dataIndex: 'salesPerson',
      key: 'salesPerson',
      width: 120,
      render: (text: string) => (
        <Space size={4}>
          <Avatar size={24} style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          <Text style={{ fontSize: '13px' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: '预测数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 150,
      render: (val: number, record: PNEntryData) => (
        <InputNumber
          size="small"
          value={val}
          style={{ width: '100%' }}
          onChange={(value) => handleQuantityChange(record.key, value || 0)}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => parseInt(value!.replace(/\$\s?|(,*)/g, '')) || 0}
          min={0}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record: PNEntryData) => (
        <Space size={2}>
          <Tooltip title="编辑">
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="link" 
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const totalQuantity = getCurrentData().reduce((sum, item) => sum + item.quantity, 0);
  const newItemsCount = getCurrentData().filter(item => item.isNew).length;

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
              ⚡ {viewMode}快速填写
            </Title>
            <Text type="secondary">销售预测数据快速录入与管理</Text>
          </Col>
          <Col>
            <Space>
              <Tooltip title={`切换到${viewMode === 'PN' ? 'SKU' : 'PN'}维度`}>
                <Button 
                  icon={<SwapOutlined />}
                  onClick={() => setViewMode(viewMode === 'PN' ? 'SKU' : 'PN')}
                  style={{ borderRadius: '6px' }}
                >
                  {viewMode === 'PN' ? 'SKU' : 'PN'}维度
                </Button>
              </Tooltip>
              
              <Tooltip title="导入Excel数据">
                <Button 
                  icon={<ImportOutlined />}
                  onClick={handleImport}
                  style={{ borderRadius: '6px' }}
                >
                  导入
                </Button>
              </Tooltip>
              
              <Tooltip title="导出数据">
                <Button 
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  style={{ borderRadius: '6px' }}
                >
                  导出
                </Button>
              </Tooltip>
              
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={handleAddNew}
                style={{ borderRadius: '6px' }}
              >
                新增填写
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title={`总${viewMode}数量`}
              value={getCurrentData().length}
              suffix="个"
              valueStyle={{ color: '#1890ff', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="新增项目"
              value={newItemsCount}
              suffix="个"
              valueStyle={{ color: '#52c41a', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="预测总量"
              value={totalQuantity}
              valueStyle={{ color: '#722ed1', fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic
              title="平均数量"
              value={data.length > 0 ? Math.round(totalQuantity / data.length) : 0}
              valueStyle={{ color: '#fa8c16', fontSize: '18px' }}
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
                >
                  {salesPersons.map(person => (
                    <Option key={person} value={person}>{person}</Option>
                  ))}
                </Select>
              </Space>
            </Col>
            <Col>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                当前显示 {filteredData.length} 条记录
              </Text>
            </Col>
          </Row>
        </div>

        {newItemsCount > 0 && (
          <Alert
            message={`本次新增了 ${newItemsCount} 个${viewMode}项目`}
            description="新增的项目已标记为绿色，可以继续编辑或添加"
            type="success"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={getColumns()}
          dataSource={filteredData}
          size="small"
          pagination={{
            defaultPageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '15', '30'],
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingRecord ? '编辑PN记录' : '新增PN记录'}
        open={modalVisible}
        onCancel={handleModalCancel}
        width={500}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button key="continue" onClick={handleContinueAdd}>
            继续添加
          </Button>,
          <Button key="ok" type="primary" onClick={handleModalOk}>
            确定
          </Button>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ mode: 'add' }}
        >
          {viewMode === 'PN' ? (
            <Form.Item
              label="PN编号"
              name="pn"
              rules={[
                { required: true, message: '请输入PN编号' },
                { pattern: /^[A-Za-z0-9]+$/, message: 'PN编号只能包含字母和数字' }
              ]}
            >
              <Input 
                placeholder="请输入PN编号，如A5634" 
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="SKU编号"
              name="sku"
              rules={[
                { required: true, message: '请输入SKU编号' },
                { pattern: /^[A-Za-z0-9\-]+$/, message: 'SKU编号只能包含字母、数字和连字符' }
              ]}
            >
              <Input 
                placeholder="请输入SKU编号，如A5634-BK-US" 
                style={{ textTransform: 'uppercase' }}
              />
            </Form.Item>
          )}

          <Form.Item
            label="区域"
            name="region"
            rules={[{ required: true, message: '请选择区域' }]}
          >
            <Select placeholder="请选择区域">
              {regions.slice(1).map(region => (
                <Option key={region} value={region}>{region}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="预测数量"
            name="quantity"
            rules={[
              { required: true, message: '请输入预测数量' },
              { type: 'number', min: 1, message: '数量必须大于0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入预测数量"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => parseInt(value!.replace(/\$\s?|(,*)/g, '')) || 0}
              min={1}
            />
          </Form.Item>

          <Form.Item
            label="操作模式"
            name="mode"
            rules={[{ required: true, message: '请选择操作模式' }]}
          >
            <Radio.Group>
              <Radio value="refresh">刷新（替换现有数量）</Radio>
              <Radio value="add">增加（累加到现有数量）</Radio>
            </Radio.Group>
          </Form.Item>

          <Alert
            message="操作说明"
            description={
              <div>
                {!editingRecord && (
                  <div>• 新增记录后可以选择"继续添加"来快速录入多个{viewMode}</div>
                )}
              </div>
            }
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>

      {/* 导入数据模态框 */}
      <Modal
        title={
          <Space>
            <UploadOutlined style={{ color: '#1890ff' }} />
            导入{viewMode}数据
          </Space>
        }
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="import" 
            type="primary" 
            loading={importing}
            disabled={importFileList.length === 0}
            onClick={() => {
              if (importFileList.length > 0) {
                handleFileUpload(importFileList[0].originFileObj);
              }
            }}
          >
            {importing ? '正在导入...' : '开始导入'}
          </Button>
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Alert
            message="导入说明"
            description={
              <div>
                <div>• 支持Excel文件格式（.xlsx, .xls）</div>
                <div>• Excel文件应包含列：{viewMode === 'PN' ? 'PN编号' : 'SKU编号'}、区域、预测数量</div>
                <div>• 系统将自动根据区域匹配对应的Sales人员</div>
                <div>• 导入的数据将添加到现有数据中</div>
              </div>
            }
            type="info"
            showIcon
            style={{ fontSize: '12px' }}
          />
        </div>
        
        <Upload.Dragger
          accept=".xlsx,.xls"
          beforeUpload={handleFileUpload}
          fileList={importFileList}
          onChange={({ fileList }) => setImportFileList(fileList)}
          showUploadList={true}
          multiple={false}
          style={{ 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域</p>
          <p className="ant-upload-hint">
            支持单个文件上传，仅支持Excel文件格式
          </p>
        </Upload.Dragger>
      </Modal>

      {/* 导出数据模态框 */}
      <Modal
        title={
          <Space>
            <DownloadOutlined style={{ color: '#52c41a' }} />
            导出{viewMode}数据
          </Space>
        }
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onOk={handleExportConfirm}
        confirmLoading={exporting}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>选择导出字段：</Text>
        </div>
        
        <Checkbox.Group
          value={exportFields}
          onChange={setExportFields}
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 8]}>
            {getExportFieldOptions().map(option => (
              <Col span={12} key={option.value}>
                <Checkbox value={option.value}>{option.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
        
        <div style={{ marginTop: 16 }}>
          <Alert
            message="导出说明"
            description={
              <div>
                <div>• 将按照选中的字段导出Excel文件</div>
                <div>• 导出数据为当前筛选结果</div>
                <div>• 共 {getCurrentData().length} 条{viewMode}数据</div>
              </div>
            }
            type="info"
            showIcon
            style={{ fontSize: '12px' }}
          />
        </div>
      </Modal>

      <style>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-weight: 600;
          color: #262626;
          font-size: 12px;
          padding: 12px 8px;
        }
        .ant-table-tbody > tr > td {
          padding: 12px 8px;
        }
        .ant-input-number {
          border-radius: 4px;
        }
        .ant-btn {
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default PNFastEntry;