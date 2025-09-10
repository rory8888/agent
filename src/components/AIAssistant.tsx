import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Input, 
  Button, 
  Space, 
  Avatar, 
  Typography, 
  Divider,
  Card,
  Tag,
  Spin,
  message
} from 'antd';
import {
  RobotOutlined,
  SendOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  BarChartOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { AIMessage } from '../types';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你好！我是销售预测AI助手。我可以帮您分析数据、提供预测建议、解答业务问题。有什么需要帮助的吗？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: '分析销售趋势',
      icon: <BarChartOutlined />,
      prompt: '请帮我分析当前的销售趋势，哪些产品表现最好？'
    },
    {
      id: '2',
      label: '预测准确性评估',
      icon: <ThunderboltOutlined />,
      prompt: '请评估我们的预测准确性，并给出改进建议'
    },
    {
      id: '3',
      label: '库存优化建议',
      icon: <BulbOutlined />,
      prompt: '基于当前销售数据，请给出库存优化建议'
    },
    {
      id: '4',
      label: '异常数据检测',
      icon: <SearchOutlined />,
      prompt: '请检测数据中的异常值，并分析可能的原因'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent);
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('销售趋势') || lowerMessage.includes('趋势分析')) {
      return `根据当前数据分析：

📈 **充电器品类** 表现最佳，Q3达成率87.5%，建议：
- 继续加大市场投入
- 关注高端快充细分市场

📊 **移动电源品类** 增长稳定，但竞争激烈：
- 建议优化定价策略
- 开发差异化产品

⚠️ **数据线品类** 超预期表现，达成率96.8%：
- 考虑扩大生产规模
- 评估供应链承载能力

需要查看具体产品的详细分析吗？`;
    }
    
    if (lowerMessage.includes('预测准确') || lowerMessage.includes('准确性')) {
      return `预测准确性评估报告：

🎯 **整体准确率**: 92.3%（目标：95%）

**表现良好的品类**：
- 数据线: 96.8% ✅
- 充电器: 94.2% ✅

**需要改进的品类**：
- 移动电源: 89.7% ⚠️
- 无线充电器: 88.5% ⚠️

**改进建议**：
1. 加强季节性因素考虑
2. 引入更多外部数据源
3. 优化算法模型参数

要详细了解某个品类的预测模型吗？`;
    }
    
    if (lowerMessage.includes('库存') || lowerMessage.includes('inventory')) {
      return `库存优化建议：

📦 **库存状况总览**：
- 充电器：库存健康，周转率良好
- 移动电源：略有积压，建议促销
- 数据线：库存不足，需要补货

🎯 **优化策略**：
1. **ABC分析**：重点关注A类产品（贡献80%销售额）
2. **季节性调整**：Q4备货增加20-30%
3. **安全库存**：建议保持15天销售量

📊 **具体行动**：
- A2637充电器：增加30%库存
- A1266移动电源：减少20%采购
- A8856数据线：紧急补货50%

需要看详细的库存分析表吗？`;
    }
    
    if (lowerMessage.includes('异常') || lowerMessage.includes('检测')) {
      return `异常数据检测结果：

🔍 **检测到的异常**：

1. **PN A8856123** - 数据线
   - 9月销量异常高（超出预测60%）
   - 可能原因：竞品缺货、促销活动效果好
   
2. **PN A1266521** - 移动电源  
   - 库存周转异常慢
   - 可能原因：市场饱和、新品冲击

3. **时间GAP异常**：
   - 部分产品时间进度滞后15%以上
   - 建议检查供应链和生产计划

🛠️ **处理建议**：
- 验证数据源准确性
- 调查市场变化因素
- 更新预测模型参数

需要深入分析某个异常点吗？`;
    }

    // 默认响应
    return `我理解您的问题。基于当前的销售预测数据，我建议：

1. **数据驱动决策**：关注关键指标的变化趋势
2. **定期复盘**：每周对预测vs实际进行对比分析  
3. **快速响应**：发现异常时及时调整策略

如果您需要更具体的分析，请告诉我您关注的具体产品或指标，我可以提供更详细的见解。

您还可以使用下方的快捷操作来获取常见分析！`;
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        style={{ 
          right: 24, 
          bottom: 24,
          width: 60,
          height: 60,
          fontSize: '24px'
        }}
        onClick={() => setIsOpen(true)}
        badge={{ count: messages.filter(m => m.type === 'assistant' && m.id !== '1').length }}
      />

      <Drawer
        title={
          <Space>
            <Avatar 
              style={{ backgroundColor: '#1890ff' }} 
              icon={<RobotOutlined />}
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                AI预测助手
              </Title>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                智能分析 · 预测建议
              </Text>
            </div>
          </Space>
        }
        placement="right"
        onClose={() => setIsOpen(false)}
        open={isOpen}
        width={400}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />}
            onClick={() => setIsOpen(false)}
          />
        }
        styles={{
          body: { padding: 0 }
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%'
        }}>
          {/* 快捷操作 */}
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa'
          }}>
            <Text strong style={{ fontSize: '13px', marginBottom: '8px', display: 'block' }}>
              快捷操作
            </Text>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              {quickActions.map(action => (
                <Button
                  key={action.id}
                  size="small"
                  icon={action.icon}
                  onClick={() => handleQuickAction(action)}
                  style={{ 
                    height: 'auto',
                    padding: '8px',
                    textAlign: 'left',
                    fontSize: '11px'
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 消息区域 */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#ffffff'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '12px',
                  alignItems: 'flex-start',
                  flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
                }}>
                  <Avatar 
                    size="small"
                    style={{ 
                      backgroundColor: message.type === 'user' ? '#52c41a' : '#1890ff',
                      flexShrink: 0
                    }}
                    icon={message.type === 'user' ? '我' : <RobotOutlined />}
                  />
                  <div style={{ 
                    flex: 1, 
                    textAlign: message.type === 'user' ? 'right' : 'left'
                  }}>
                    <Card
                      size="small"
                      style={{
                        backgroundColor: message.type === 'user' ? '#e6f7ff' : '#f6ffed',
                        border: 'none',
                        borderRadius: '12px',
                        maxWidth: '85%',
                        marginLeft: message.type === 'user' ? 'auto' : 0,
                        marginRight: message.type === 'user' ? 0 : 'auto'
                      }}
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Text style={{ 
                        fontSize: '13px', 
                        lineHeight: '1.5',
                        whiteSpace: 'pre-line'
                      }}>
                        {message.content}
                      </Text>
                      <div style={{ 
                        marginTop: '8px', 
                        textAlign: 'right'
                      }}>
                        <Text 
                          type="secondary" 
                          style={{ fontSize: '11px' }}
                        >
                          {formatTime(message.timestamp)}
                        </Text>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ 
                display: 'flex', 
                gap: '12px',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <Avatar 
                  size="small"
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<RobotOutlined />}
                />
                <Card
                  size="small"
                  style={{
                    backgroundColor: '#f6ffed',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                  bodyStyle={{ padding: '12px' }}
                >
                  <Space>
                    <Spin size="small" />
                    <Text style={{ fontSize: '13px' }}>
                      AI正在思考中...
                    </Text>
                  </Space>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#ffffff'
          }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入您的问题..."
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{ resize: 'none' }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                style={{ height: '32px' }}
              />
            </Space.Compact>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '11px', 
                marginTop: '8px',
                display: 'block'
              }}
            >
              按 Enter 发送，Shift + Enter 换行
            </Text>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AIAssistant;