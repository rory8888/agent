# FastAPI 后端 API 接口需求文档

## 概述

前端已经完成了与FastAPI后端的集成配置。以下是需要实现的API接口规范，包括请求/响应格式和端点定义。

## 基础配置

### API 基础URL
- 开发环境: `http://localhost:8000/api/v1`
- 生产环境: `https://your-production-api.com/api/v1`

### 通用响应格式

```python
# 成功响应
{
    "success": true,
    "data": <actual_data>,
    "message": "success"
}

# 错误响应
{
    "success": false,
    "data": null,
    "message": "error_message",
    "code": "ERROR_CODE"
}

# 分页响应
{
    "success": true,
    "data": {
        "items": [<data_array>],
        "total": 100,
        "page": 1,
        "size": 50,
        "pages": 2
    }
}
```

## 数据模型

### 1. 预测收集数据 (ForecastEntryData)
```python
class ForecastEntryData(BaseModel):
    key: str
    channel: str           # 渠道
    sku: str              # SKU
    pdt: str              # PDT
    singularity: str       # 奇点细分
    pn: str               # PN
    cnCategory: str        # CN品类
    skuName: str          # SKU名称
    skuStatus: str        # SKU状态 ('active', 'inactive', 'eol', 'new')
    jan2025Sales: int      # 25年1月销量
    feb2025Sales: int      # 25年2月销量
    mar2025Sales: int      # 25年3月销量
    apr2025Sales: int      # 25年4月销量
    may2025Sales: int      # 25年5月销量
    jun2025Sales: int      # 25年6月销量
    jul2025Sales: int      # 25年7月销量
    aug2025Sales: int      # 25年8月销量
    avgPrice: float        # 成交均价(未税)
    q3PlanTotal: int       # Q3规划合计
    currentSales: int      # 当前销量
    timeProgress: float    # 时间进度
    vsTimeProgress: float  # VS时间进度
    inventory: int         # 库存
    q3Total: int          # Q3总计
    # 可编辑字段
    augForecast: int       # 8月预测
    sepForecast: int       # 9月预测
    octForecast: int       # 10月预测
    novForecast: int       # 11月预测
    decForecast: int       # 12月预测
    # 只读修正字段
    aug2Corrected: int     # 8月（修正）
    sep2Corrected: int     # 9月（修正）
    oct2Corrected: int     # 10月（修正）
    nov2Corrected: int     # 11月（修正）
    dec2Corrected: int     # 12月（修正）
    isNew: bool = False
```

### 2. PN审核数据 (PNAuditData)
```python
class PNAuditData(BaseModel):
    key: str
    pdt: str                    # PDT
    pn: str                     # PN
    singularitySegment: str     # 奇点细分
    productStatus: str          # 产品状态
    jan2025Sales: int           # 25年1月销量
    feb2025Sales: int           # 25年2月销量
    mar2025Sales: int           # 25年3月销量
    apr2025Sales: int           # 25年4月销量
    may2025Sales: int           # 25年5月销量
    jun2025Sales: int           # 25年6月销量
    currentStock: int           # 现有库存
    q3SalesForecastQuantity: int # Q3-sales预测数量
    q3ForecastAmount: float      # Q3-预测金额
    auditCorrectedQuantity: int  # 评审修正数量（可编辑）
```

## API 端点详细规范

### 1. 数据总览 API

#### 1.1 获取总览数据
```
GET /dashboard/summary

Response:
{
    "success": true,
    "data": {
        "totalRevenue": 1000000.00,
        "totalProducts": 150,
        "forecastAccuracy": 85.5,
        "activePNs": 120,
        "kpiMetrics": [
            {
                "title": "Q3预测总金额",
                "value": 500000,
                "unit": "万",
                "trend": "up",
                "trendValue": 15.2,
                "color": "#1890ff"
            }
        ]
    }
}
```

#### 1.2 获取销售趋势
```
GET /dashboard/sales-trend?timeRange=6months

Response:
{
    "success": true,
    "data": {
        "chartData": [
            {
                "month": "2025-01",
                "forecast": 50000,
                "actual": 48000
            }
        ]
    }
}
```

### 2. 预测收集 API

#### 2.1 获取预测数据列表
```
GET /forecast/entries?page=1&size=100&search=&pdt=&channel=&region=&salesPerson=

Response: PaginatedResponse<ForecastEntryData>
```

#### 2.2 更新预测记录
```
PUT /forecast/entries/{id}

Request Body:
{
    "augForecast": 5000,
    "sepForecast": 5200
}

Response:
{
    "success": true,
    "data": <updated_forecast_entry>
}
```

#### 2.3 批量更新预测数据
```
PUT /forecast/entries/batch

Request Body:
{
    "updates": [
        {
            "id": "1",
            "data": {
                "augForecast": 5000,
                "sepForecast": 5200
            }
        }
    ]
}

Response:
{
    "success": true,
    "data": [<updated_entries>]
}
```

#### 2.4 导出预测数据
```
GET /forecast/entries/export?format=xlsx

Response: Excel file (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
```

#### 2.5 导入预测数据
```
POST /forecast/entries/import

Content-Type: multipart/form-data
Body: file (Excel/CSV file)

Response:
{
    "success": true,
    "data": {
        "success": 100,
        "failed": 5,
        "errors": ["Row 10: Invalid SKU format"]
    }
}
```

### 3. PN审核 API

#### 3.1 获取审核数据列表
```
GET /audit/entries?page=1&size=100

Response: PaginatedResponse<PNAuditData>
```

#### 3.2 更新审核记录
```
PUT /audit/entries/{id}

Request Body:
{
    "auditCorrectedQuantity": 4500
}

Response:
{
    "success": true,
    "data": <updated_audit_entry>
}
```

#### 3.3 批量更新审核数据
```
PUT /audit/entries/batch

Request Body: Same as forecast batch update

Response: Array of updated audit entries
```

### 4. PN数据 API

#### 4.1 获取PN数据列表
```
GET /pn-data?page=1&size=50

Response: PaginatedResponse<PNData>
```

#### 4.2 获取PN数据详情
```
GET /pn-data/{id}

Response:
{
    "success": true,
    "data": <pn_data_detail>
}
```

### 5. 基础数据 API

#### 5.1 获取PDT列表
```
GET /metadata/pdts

Response:
{
    "success": true,
    "data": ["PowerPort", "PowerCore", "SoundCore", "Eufy", "Nebula"]
}
```

#### 5.2 获取渠道列表
```
GET /metadata/channels

Response:
{
    "success": true,
    "data": ["Amazon", "Best Buy", "Walmart", "Target", "天猫", "京东"]
}
```

#### 5.3 获取奇点细分列表
```
GET /metadata/singularities

Response:
{
    "success": true,
    "data": ["高端快充", "便携移动电源", "音频设备", "智能家居"]
}
```

#### 5.4 获取品类列表
```
GET /metadata/categories

Response:
{
    "success": true,
    "data": ["充电器", "移动电源", "音响", "摄像头", "投影仪"]
}
```

## 错误处理

### HTTP状态码
- 200: 成功
- 400: 请求参数错误
- 401: 未授权
- 403: 禁止访问
- 404: 资源不存在
- 500: 服务器内部错误

### 错误响应示例
```python
# 参数验证错误
{
    "success": false,
    "data": null,
    "message": "Validation error: augForecast must be a positive integer",
    "code": "VALIDATION_ERROR"
}

# 资源不存在
{
    "success": false,
    "data": null,
    "message": "Forecast entry not found",
    "code": "NOT_FOUND"
}
```

## 实现建议

### FastAPI 项目结构
```
fastapi_backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── forecast.py
│   │   │   │   ├── audit.py
│   │   │   │   ├── pn_data.py
│   │   │   │   └── metadata.py
│   │   │   └── api.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── forecast.py
│   │   ├── audit.py
│   │   └── pn_data.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── forecast.py
│   │   ├── audit.py
│   │   └── common.py
│   └── core/
│       ├── __init__.py
│       ├── config.py
│       └── database.py
└── requirements.txt
```

### 主要依赖
```
fastapi
uvicorn[standard]
pydantic
sqlalchemy
alembic
pandas
openpyxl
python-multipart
```

### 启动命令
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## CORS 配置

前端运行在 `http://localhost:3001`，需要配置CORS：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # 开发环境
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 测试

建议使用以下工具测试API：
- Postman
- FastAPI自动生成的Swagger UI (`http://localhost:8000/docs`)
- pytest + httpx 进行单元测试

## 注意事项

1. **数据验证**: 使用Pydantic进行请求/响应数据验证
2. **错误处理**: 统一的错误处理中间件
3. **日志记录**: 记录所有API请求和响应
4. **性能优化**: 对于大数据量的分页查询进行优化
5. **安全**: 如需要，添加认证和授权机制
6. **文档**: 使用FastAPI自动生成的API文档

完成后端实现后，前端将能够：
- 从API获取真实数据
- 实时更新预测数值
- 导入/导出Excel文件
- 分页浏览大量数据
- 显示加载状态和错误信息