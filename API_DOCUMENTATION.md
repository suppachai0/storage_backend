# Shelter Management System - Backend API

ระบบจัดการสิ่งของช่วยเหลือผู้ประสบภัย + ศูนย์พักพิง

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
สร้างไฟล์ `.env.local` และใส่:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shelter_db
JWT_SECRET=your_secret_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server
```bash
npm run dev
```
API จะทำงานที่ `http://localhost:3000`

---

## 📋 API Endpoints Overview

### 🔐 Authentication

#### POST `/api/auth/register`
สมัครสมาชิก
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "role": "shelter_staff",
  "phone": "0812345678"
}
```

#### POST `/api/auth/login`
เข้าสู่ระบบ
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "shelter_staff"
    }
  }
}
```

---

### 🏛️ Shelters (ศูนย์พักพิง)

#### GET `/api/shelters?province=Bangkok`
ดูรายการศูนย์พักพิง (ค้นหาตามจังหวัด)

#### POST `/api/shelters` (Admin Only)
สร้างศูนย์พักพิงใหม่
```json
{
  "name": "ศูนย์พักพิง บางกอก",
  "province": "Bangkok",
  "district": "District Name",
  "address": "Address",
  "capacity": 500,
  "contactName": "Manager Name",
  "contactPhone": "0812345678",
  "latitude": 13.7563,
  "longitude": 100.5018
}
```

---

### 📦 Items & Stocks

#### POST `/api/stocks/check-availability`
เช็คว่าของมีอยู่ในคลังหรือไม่
```json
{
  "itemId": "...",
  "quantity": 10
}
```

Response:
```json
{
  "success": true,
  "data": {
    "itemId": "...",
    "quantityRequested": 10,
    "totalAvailable": 50,
    "isAvailable": true,
    "availability": [
      {
        "warehouseId": "...",
        "warehouseName": "Central Warehouse",
        "available": 50,
        "canFulfill": true
      }
    ]
  }
}
```

#### GET `/api/stocks/low-stock`
ดูรายการสินค้าที่เกือบหมด

---

### 📝 Requests (คำร้องขอ)

#### POST `/api/requests` (Shelter Staff Only)
ยื่นคำร้องขอ
```json
{
  "shelterId": "...",
  "items": [
    {
      "itemId": "...",
      "quantityRequested": 10
    },
    {
      "itemId": "...",
      "quantityRequested": 5
    }
  ]
}
```

#### GET `/api/requests?status=pending&shelterId=...`
ดูรายการคำร้องขอ

#### GET `/api/requests/:id`
ดูรายละเอียดคำร้อง

#### PUT `/api/requests/:id` (Shelter Staff - Only when pending)
อัพเดตคำร้อง (เมื่อยังเป็น pending)

#### POST `/api/requests/:id/approve` (Warehouse Staff Only)
อนุมัติคำร้อง
```json
{
  "items": [
    {
      "itemId": "...",
      "quantityApproved": 8,
      "warehouseId": "..."
    }
  ]
}
```

#### POST `/api/requests/:id/transfer` (Warehouse Staff Only)
โอนของ + ตัดสต็อก
```json
{
  "items": [
    {
      "itemId": "...",
      "quantityTransferred": 8
    }
  ],
  "warehouseId": "..."
}
```

---

### 📊 Dashboard

#### GET `/api/dashboard/overview`
ดูภาพรวมระบบ
Response:
```json
{
  "success": true,
  "data": {
    "shelters": {
      "total": 523,
      "normal": 475,
      "nearlyFull": 45,
      "full": 3,
      "avgOccupancy": 75
    },
    "requests": {
      "pending": 20,
      "approved": 15,
      "transferred": 50,
      "rejected": 2,
      "total": 87
    }
  }
}
```

#### GET `/api/dashboard/shelter-status`
ดูสถานะศูนย์พักพิงทั้งหมด
Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "ศูนย์พักพิง...",
      "province": "Bangkok",
      "capacity": 500,
      "currentPeople": 480,
      "occupancyPercentage": 96,
      "status": "nearly_full",
      "contactPhone": "0812345678",
      "latitude": 13.7563,
      "longitude": 100.5018
    }
  ]
}
```

#### GET `/api/dashboard/stock-status?warehouseId=...`
ดูสต็อกสินค้าในคลัง
Response:
```json
{
  "success": true,
  "data": {
    "warehouseName": "Central Warehouse",
    "totalItems": 50,
    "lowStockItems": 8,
    "items": [
      {
        "itemId": "...",
        "itemName": "อาหารกล่อง",
        "quantity": 5,
        "minAlert": 10,
        "status": "low_stock",
        "percentageOfMin": 50
      }
    ]
  }
}
```

---

## 🔑 Authentication Headers

ทุก request ต้องส่ง JWT token ในส่วน headers:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📁 Project Structure

```
src/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── requests/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── approve/route.ts
│       │       └── transfer/route.ts
│       ├── stocks/
│       │   ├── check-availability/route.ts
│       │   └── low-stock/route.ts
│       ├── shelters/
│       │   └── route.ts
│       └── dashboard/
│           ├── overview/route.ts
│           ├── shelter-status/route.ts
│           └── stock-status/route.ts
├── lib/
│   ├── mongodb.ts (DB Connection)
│   └── auth.ts (JWT Auth)
├── models/
│   ├── User.ts
│   ├── Shelter.ts
│   ├── Warehouse.ts
│   ├── Item.ts
│   ├── Stock.ts
│   ├── Request.ts
│   ├── StockLog.ts
│   ├── Category.ts
│   └── Notification.ts
└── utils/
    ├── errorHandler.ts
    └── responseHandler.ts
```

---

## 🔄 Request Flow (ขั้นตอนการขอของ)

1. **Shelter Staff** → POST `/api/requests` (ยื่นคำร้อง)
   - Status: `pending`

2. **System** → Validate stock availability

3. **Warehouse Staff** → POST `/api/requests/:id/approve` (อนุมัติ)
   - Status: `approved`
   - ระบบตรวจสอบสต็อก

4. **Warehouse Staff** → POST `/api/requests/:id/transfer` (โอนของ)
   - Status: `transferred`
   - ระบบตัดสต็อกอัตโนมัติ
   - สร้าง Stock Log
   - Alert if stock low

5. **Shelter Staff** → GET `/api/requests/:id` (ติดตามสถานะ)

---

## 🛡️ Roles & Permissions

| Role | Abilities |
|------|-----------|
| `admin` | สร้างผู้ใช้ทั้งหมด, อนุมัติ, โอนของ, ดู dashboard |
| `warehouse_staff` | อนุมัติคำร้อง, โอนของ, ตัดสต็อก, ดู dashboard |
| `shelter_staff` | ยื่นคำร้อง, ติดตามสถานะ, ดูรายละเอียด |

---

## 🔐 Security Features

✅ Password hashing (bcryptjs)  
✅ JWT Authentication  
✅ Role-based access control  
✅ Stock validation before transfer  
✅ Audit logging (Stock Logs)  
✅ Notifications on status change

---

## 📝 Example: Complete Request Flow

### Step 1: Shelter Staff ยื่นคำร้อง
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "shelterId": "507f1f77bcf86cd799439011",
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityRequested": 10}
    ]
  }'
```

### Step 2: Warehouse Staff อนุมัติ
```bash
curl -X POST http://localhost:3000/api/requests/507f1f77bcf86cd799439013/approve \
  -H "Authorization: Bearer <warehouse_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityApproved": 8}
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

### Step 3: Warehouse Staff โอนของ (ตัดสต็อก)
```bash
curl -X POST http://localhost:3000/api/requests/507f1f77bcf86cd799439013/transfer \
  -H "Authorization: Bearer <warehouse_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityTransferred": 8}
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

---

## 🚨 Error Handling

API จะ return error ในรูปแบบ:
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 💡 Tips

✅ เสมอใช้ `check-availability` ก่อนยื่นคำร้อง  
✅ ระบบ auto-update shelter status จาก occupancy percentage  
✅ Stock logs จะเก็บทุกการเปลี่ยนแปลง  
✅ Low stock alerts ส่ง notification ให้ warehouse staff  
✅ Dashboard ใช้ดู real-time status

---

Happy coding! 🎉
