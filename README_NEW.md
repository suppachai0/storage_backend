# 🏥 Shelter Management System - Backend API

ระบบจัดการสิ่งของช่วยเหลือผู้ประสบภัยและศูนย์พักพิง โดยใช้ **Next.js 16 + MongoDB Atlas + TypeScript**

## 📋 Features

✅ **Authentication**: JWT-based auth with role-based access control (Admin, Warehouse Staff, Shelter Staff)  
✅ **Request Management**: ศูนย์พักพิงสามารถยื่นคำร้องขอ - เจ้าหน้าที่คลังอนุมัติและโอนของ  
✅ **Stock Management**: ตัดสต็อกอัตโนมัติ + ประวัติการเปลี่ยนแปลง (Stock Logs)  
✅ **Shelter Tracking**: ติดตามสถานะศูนย์พักพิง (normal/nearly_full/full)  
✅ **Dashboard**: Real-time overview ของระบบ  
✅ **Low Stock Alerts**: Notifications เมื่อสินค้าเกือบหมด  
✅ **API Documentation**: Complete docs + curl examples  

## 🚀 Quick Start

### 1️⃣ Installation
```bash
npm install
```

### 2️⃣ Setup Environment Variables
```bash
# Create .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shelter_db
JWT_SECRET=your_secret_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3️⃣ Run Development Server
```bash
npm run dev
```
API จะทำงานที่ `http://localhost:3000`

### 4️⃣ Test API
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "role": "admin"
  }'
```

## 📚 Documentation

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions  
- **[CURL_EXAMPLES.md](CURL_EXAMPLES.md)** - curl command examples
- **[API_USAGE_EXAMPLE.ts](API_USAGE_EXAMPLE.ts)** - Frontend usage examples

## 🏗️ Project Structure

```
src/
├── app/api/
│   ├── auth/                  # Authentication (login, register)
│   ├── requests/              # Request management
│   ├── stocks/                # Stock operations
│   ├── shelters/              # Shelter management
│   └── dashboard/             # Dashboard endpoints
├── lib/
│   ├── mongodb.ts            # MongoDB connection
│   └── auth.ts               # JWT authentication
├── models/                    # Mongoose schemas
├── utils/                     # Helpers & utilities
```

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register     # สมัครสมาชิก
POST   /api/auth/login        # เข้าสู่ระบบ
```

### Requests (คำร้องขอ)
```
POST   /api/requests          # ยื่นคำร้องขอ (Shelter Staff)
GET    /api/requests          # ดูรายการ
GET    /api/requests/:id      # ดูรายละเอียด
POST   /api/requests/:id/approve    # อนุมัติ (Warehouse Staff)
POST   /api/requests/:id/transfer   # โอนของ + ตัดสต็อก (Warehouse Staff)
```

### Stocks (สต็อก)
```
POST   /api/stocks/check-availability    # เช็คของว่ามีหรือไม่
GET    /api/stocks/low-stock             # สินค้าเกือบหมด
```

### Shelters (ศูนย์พักพิง)
```
GET    /api/shelters          # ดูรายการศูนย์
POST   /api/shelters          # สร้างศูนย์ (Admin)
```

### Dashboard
```
GET    /api/dashboard/overview         # ภาพรวมระบบ
GET    /api/dashboard/shelter-status   # สถานะศูนย์
GET    /api/dashboard/stock-status     # สต็อกสินค้า
```

## 🔄 Request Flow

```
1. Shelter Staff → POST /api/requests (ยื่นคำร้อง)
   ↓ (Status: pending)
2. System → Validate Stock Availability
   ↓
3. Warehouse Staff → POST /api/requests/:id/approve (อนุมัติ)
   ↓ (Status: approved)
4. Warehouse Staff → POST /api/requests/:id/transfer (โอนของ)
   ↓ (Status: transferred)
5. ✅ System Auto:
   - ตัดสต็อก
   - สร้าง Stock Log
   - ส่ง Notification
```

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **admin** | ทุกอย่าง |
| **warehouse_staff** | อนุมัติ + โอนของ + ตัดสต็อก |
| **shelter_staff** | ยื่นคำร้อง + ติดตาม |

## 🔑 Requirements

- Node.js >= 18
- MongoDB Atlas (Free tier available)
- npm/yarn

## 📦 Dependencies

- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **next** - Next.js framework
- **typescript** - Type safety

## 🚀 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Railway / Heroku
```bash
# Push to GitHub first
git push
# Then deploy
```

## 🐛 Troubleshooting

**MongoDB Connection Error?**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure username & password are correct

**401 Unauthorized?**
- Login again to get new JWT token
- Add token to Authorization header

**Port 3000 in use?**
```bash
npx kill-port 3000
npm run dev
```

## 📝 Examples

### Example 1: Submit Request
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shelterId": "...",
    "items": [
      {"itemId": "...", "quantityRequested": 10}
    ]
  }'
```

### Example 2: Check Availability
```bash
curl -X POST http://localhost:3000/api/stocks/check-availability \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "...",
    "quantity": 10
  }'
```

### Example 3: Dashboard Overview
```bash
curl -X GET http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📖 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Docs](https://jwt.io)

## 📞 Support

See documentation files:
- API_DOCUMENTATION.md - Full API reference
- SETUP_GUIDE.md - Installation guide
- CURL_EXAMPLES.md - Command examples
- API_USAGE_EXAMPLE.ts - Code examples

## ✨ Next Steps

- [ ] Add input validation (Zod/Yup)
- [ ] Add rate limiting
- [ ] Add CORS configuration
- [ ] Add logging (Winston/Morgan)
- [ ] Create frontend components
- [ ] Deploy to production
- [ ] Setup CI/CD pipeline
- [ ] Add unit tests

---

**Created with ❤️ for Disaster Relief**
