# 📋 Quick Reference - API Routes Summary

## 🎯 All Available Endpoints (v1.0)

### 🔐 Authentication (Auth)
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| POST | `/api/auth/register` | สมัครสมาชิก | ❌ |
| POST | `/api/auth/login` | เข้าสู่ระบบ | ❌ |

### 👥 Users
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/users` | ดูรายการผู้ใช้ | admin |
| GET | `/api/users/:id` | ดูรายละเอียด | admin |
| PUT | `/api/users/:id` | อัพเดทผู้ใช้ | admin |

### 🏛️ Shelters (ศูนย์พักพิง)
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/shelters` | ดูรายการศูนย์ | authenticated |
| GET | `/api/shelters?province=Bangkok` | ค้นหาตามจังหวัด | authenticated |
| POST | `/api/shelters` | สร้างศูนย์ | admin |
| GET | `/api/shelters/:id` | ดูรายละเอียด | authenticated |
| PUT | `/api/shelters/:id` | อัพเดทศูนย์ | admin |

### 📦 Items (สินค้า)
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/items` | ดูรายการสินค้า | authenticated |
| GET | `/api/items/:id` | ดูรายละเอียด | authenticated |
| POST | `/api/items` | สร้างสินค้า | admin |
| GET | `/api/items/categories` | ดูหมวดหมู่ | authenticated |

### 📊 Stocks (สต็อก)
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/stocks?warehouseId=xxx` | ดูสต็อกในคลัง | authenticated |
| GET | `/api/stocks/:id` | ดูรายละเอียดสต็อก | authenticated |
| POST | `/api/stocks/check-availability` | เช็คของว่ามีหรือไม่ | authenticated |
| GET | `/api/stocks/low-stock` | สินค้าเกือบหมด | warehouse_staff, admin |

### 📝 Requests (คำร้องขอ)
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| POST | `/api/requests` | ยื่นคำร้องขอ | shelter_staff |
| GET | `/api/requests` | ดูรายการคำร้อง | authenticated |
| GET | `/api/requests?status=pending` | ค้นหาตามสถานะ | authenticated |
| GET | `/api/requests/:id` | ดูรายละเอียด | authenticated |
| PUT | `/api/requests/:id` | อัพเดตคำร้อง (pending) | shelter_staff |
| POST | `/api/requests/:id/approve` | อนุมัติคำร้อง | warehouse_staff, admin |
| POST | `/api/requests/:id/reject` | ปฏิเสธคำร้อง | warehouse_staff, admin |
| POST | `/api/requests/:id/transfer` | โอนของ + ตัดสต็อก | warehouse_staff, admin |

### 🚚 Transfers
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/transfers` | ดูประวัติโอนของ | authenticated |
| GET | `/api/transfers/:id` | ดูรายละเอียดโอน | authenticated |

### 📜 Stock Logs
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/stock-logs?itemId=xxx` | ดูประวัติ | warehouse_staff, admin |
| GET | `/api/stock-logs?warehouseId=xxx` | ดูประวัติตามคลัง | warehouse_staff, admin |

### 📈 Dashboard
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/dashboard/overview` | ภาพรวมระบบ | authenticated |
| GET | `/api/dashboard/shelter-status` | สถานะศูนย์ทั้งหมด | authenticated |
| GET | `/api/dashboard/stock-status?warehouseId=xxx` | สต็อกในคลัง | warehouse_staff, admin |

### 🔔 Notifications
| Method | Route | Description | Role Required |
|--------|-------|-------------|--------------|
| GET | `/api/notifications` | ดูแจ้งเตือน | authenticated |
| GET | `/api/notifications?isRead=false` | ดูแจ้งเตือนใหม่ | authenticated |
| POST | `/api/notifications/:id/read` | ทำเครื่องหมายว่าอ่าน | authenticated |

---

## 📋 Request Status Flow

```
pending → approved → transferred → completed
   ↓
rejected
```

## 🏪 Warehouse Status Flow (Auto-calculated)

```
capacity = 500
currentPeople = X

X ≤ 300 → normal
300 < X < 500 → nearly_full  
X ≥ 500 → full
```

## 📊 Stock Status Flow

```
quantity > minAlert → normal
quantity ≤ minAlert → low_stock
quantity = 0 → out_of_stock
```

---

## 🔑 Authentication Header

ทุก request (ยกเว้น login/register) ต้องส่ง:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 💾 Response Format

### Success (200, 201)
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation successful"
}
```

### Error (400, 401, 403, 404, 500)
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional */ }
}
```

---

## 🚀 Popular Routes for Quick Access

### For Shelter Staff
```bash
# 1. ยื่นคำร้องขอ
POST /api/requests

# 2. ติดตามสถานะ
GET /api/requests

# 3. ดูรายละเอียดคำร้อง
GET /api/requests/:id

# 4. เช็คว่าของมีหรือไม่ก่อนยื่น
POST /api/stocks/check-availability

# 5. ดูศูนย์พักพิง
GET /api/shelters
```

### For Warehouse Staff
```bash
# 1. ดูคำร้องที่รอการอนุมัติ
GET /api/requests?status=pending

# 2. อนุมัติคำร้อง
POST /api/requests/:id/approve

# 3. โอนของและตัดสต็อก
POST /api/requests/:id/transfer

# 4. ดูสินค้าที่เกือบหมด
GET /api/stocks/low-stock

# 5. ดู Dashboard
GET /api/dashboard/overview
```

### For Admin
```bash
# 1. สร้างศูนย์พักพิง
POST /api/shelters

# 2. สร้างสินค้า
POST /api/items

# 3. ดู Dashboard
GET /api/dashboard/overview

# 4. ดูประวัติทั้งหมด
GET /api/stock-logs

# 5. จัดการผู้ใช้
GET /api/users
```

---

## ⚡ Performance Tips

✅ ใช้ query parameters เพื่อ filter (ลด data transfer)  
✅ ใช้ pagination สำหรับข้อมูลเยอะ  
✅ Cache dashboard data ในฝั่ง client  
✅ Batch requests ถ้าเป็นไปได้  
✅ Debounce search requests

---

## 🔄 Common API Sequences

### Sequence 1: ขอของ (Normal Flow)
```
1. GET /api/items                          # ดูของที่มี
2. POST /api/stocks/check-availability     # เช็คของว่ามีหรือไม่
3. POST /api/requests                      # ยื่นคำร้อง
4. GET /api/requests/:id                   # ติดตามสถานะ
```

### Sequence 2: อนุมัติและโอนของ
```
1. GET /api/requests?status=pending        # ดูคำร้องที่รอ
2. GET /api/requests/:id                   # ดูรายละเอียด
3. POST /api/requests/:id/approve          # อนุมัติ
4. POST /api/requests/:id/transfer         # โอนและตัดสต็อก
5. GET /api/stocks/low-stock               # เช็คสินค้าเกือบหมด
```

### Sequence 3: Dashboard Update
```
1. GET /api/dashboard/overview             # ภาพรวม
2. GET /api/dashboard/shelter-status       # สถานะศูนย์
3. GET /api/dashboard/stock-status?wid=x   # สต็อกคลัง
```

---

## 🛡️ Common Error Responses

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Bad Request | Check JSON format & required fields |
| 401 | Unauthorized | Login & get new token |
| 403 | Forbidden | Check user role |
| 404 | Not Found | Verify resource ID exists |
| 500 | Server Error | Check server logs |

---

ฉันสร้าง **Complete Backend API** สำหรับ Shelter Management System แล้วครับ! 🎉

## 📦 สิ่งที่สร้างให้:

### ✅ API Routes (14+ endpoints)
- 🔐 Authentication (login, register)
- 📝 Requests (submit, approve, transfer)
- 📦 Stocks (check availability, low stock)
- 🏛️ Shelters (CRUD)
- 📊 Dashboard (overview, status)

### ✅ Database Models (9 schemas)
- User, Shelter, Warehouse, Item, Category
- Stock, Request, StockLog, Notification

### ✅ Utilities & Middleware
- JWT Authentication
- Error Handling
- Response Formatting
- MongoDB Connection

### ✅ Documentation (4 files)
- **API_DOCUMENTATION.md** - Full API reference
- **SETUP_GUIDE.md** - Installation steps
- **CURL_EXAMPLES.md** - Command examples
- **API_USAGE_EXAMPLE.ts** - Code examples

## 🚀 ถัดไป:

1. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

2. **Setup MongoDB Atlas** (ตามใน SETUP_GUIDE.md)

3. **Run Development**:
   ```bash
   npm run dev
   ```

4. **Test APIs** (ใช้ CURL_EXAMPLES.md)

5. **สร้าง Frontend** (ใช้ API_USAGE_EXAMPLE.ts)

ต้องการให้ผมช่วยอะไรต่ออีกไหมครับ? 😊
