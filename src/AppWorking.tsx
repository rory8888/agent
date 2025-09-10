import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Card, Space, Table } from 'antd';

// 简单的页面组件
const HomePage = () => (
  <div>
    <Card title="数据总览" style={{ marginBottom: '20px' }}>
      <p>PN产品总数: 350个</p>
      <p>Q3预测总金额: ¥2,580.5万</p>
      <p>平均达成率: 87.6%</p>
      <p>PDT品类数: 15个</p>
    </Card>
  </div>
);

const ComparisonPage = () => (
  <Card title="方案对比演示">
    <h3>🔄 传统飞书表格 vs 智能预测工作台</h3>
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <Card size="small" title="传统方式" style={{ flex: 1, background: '#fff2e8' }}>
        <p>❌ 手动填表效率低</p>
        <p>❌ 缺乏智能建议</p>
        <p>❌ 协作流程复杂</p>
        <p>⏱️ 耗时: 5.5小时</p>
      </Card>
      <Card size="small" title="智能工作台" style={{ flex: 1, background: '#f6ffed' }}>
        <p>✅ AI智能预测</p>
        <p>✅ 任务导向流程</p>
        <p>✅ 实时协作</p>
        <p>⏱️ 耗时: 45分钟</p>
      </Card>
    </div>
  </Card>
);

const WorkbenchPage = () => (
  <Card title="🚀 智能预测工作台">
    <div style={{ marginBottom: '20px' }}>
      <h4>我的预测任务</h4>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Card size="small" title="PowerPort-A2637-BK" style={{ width: 300 }}>
          <p>AI建议: 15,000</p>
          <p>上月: 12,000</p>
          <Button type="primary" size="small">编辑预测</Button>
        </Card>
        <Card size="small" title="PowerCore-A1266-WT" style={{ width: 300 }}>
          <p>AI建议: 8,500</p>
          <p>上月: 9,200</p>
          <Button type="primary" size="small">编辑预测</Button>
        </Card>
      </div>
    </div>
  </Card>
);

// 简化的PN数据页面
const PNDataPage = () => {
  const columns = [
    { title: 'PDT', dataIndex: 'pdt', key: 'pdt' },
    { title: 'PN', dataIndex: 'pn', key: 'pn' },
    { title: 'Q3预测数量', dataIndex: 'forecast', key: 'forecast' },
    { title: '实际出货', dataIndex: 'actual', key: 'actual' },
    { title: '达成率', dataIndex: 'rate', key: 'rate', render: (val: number) => `${val}%` }
  ];

  const data = [
    { key: '1', pdt: 'Gssential', pn: 'A5634', forecast: 15000, actual: 13200, rate: 88 },
    { key: '2', pdt: 'PowerPort', pn: 'A2637', forecast: 12000, actual: 11500, rate: 96 },
    { key: '3', pdt: 'PowerCore', pn: 'A1266', forecast: 8500, actual: 7800, rate: 92 },
    { key: '4', pdt: 'Gssential', pn: 'A8857', forecast: 9200, actual: 8900, rate: 97 },
    { key: '5', pdt: 'PowerPort', pn: 'A2663', forecast: 6800, actual: 6200, rate: 91 }
  ];

  return (
    <Card title="PN数据管理">
      <p style={{ marginBottom: '16px' }}>共 {data.length} 个产品，平均达成率 92.8%</p>
      <Table 
        columns={columns} 
        dataSource={data} 
        size="small"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

const AppWorking: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Card title="Anker销售预测系统" style={{ marginBottom: '20px' }}>
          <p>基于AI的智能化预测流程，告别手动填表</p>
          <Space>
            <Link to="/"><Button>数据总览</Button></Link>
            <Link to="/comparison"><Button>方案对比</Button></Link>
            <Link to="/workbench"><Button type="primary">智能工作台</Button></Link>
            <Link to="/pn-data"><Button>PN数据</Button></Link>
          </Space>
        </Card>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/pn-data" element={<PNDataPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppWorking;