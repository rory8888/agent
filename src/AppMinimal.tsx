import React from 'react';

const AppMinimal: React.FC = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <h1>Anker销售预测系统</h1>
      <p>系统正在运行中...</p>
      <div style={{ marginTop: '20px' }}>
        <h2>功能模块</h2>
        <ul>
          <li>数据总览</li>
          <li>智能预测工作台</li>
          <li>PDT预测</li>
          <li>PN数据</li>
          <li>预测收集</li>
        </ul>
      </div>
    </div>
  );
};

export default AppMinimal;