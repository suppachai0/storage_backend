# 🚀 Setup Guide - Shelter Management System API

## Prerequisites
- Node.js >= 18
- npm or yarn
- MongoDB Atlas account (free tier available)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create Account
- ไปที่ https://www.mongodb.com/cloud/atlas
- Sign up (Free tier available)

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose "M0 Shared" (Free)
3. Select cloud provider (AWS/Google Cloud)
4. Create cluster

### 1.3 Get Connection String
1. Click "Connect"
2. Choose "Drivers" (Node.js)
3. Copy connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name`

### 1.4 Create User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username & password
4. Select "Built-in Role" → Read and write to any database
5. Add User

### 1.5 Whitelist IP
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for development)
4. Confirm

---

## Step 2: Project Setup

### 2.1 Install Dependencies
```bash
cd storage_backend
npm install
```

### 2.2 Configure Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:

```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shelter_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_generate_random_string_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

⚠️ **เปลี่ยนค่า:**
- `username:password` → Username & password จาก MongoDB
- `cluster` → Cluster name ของคุณ
- `JWT_SECRET` → Generate random string (แนะนำใช้ `openssl rand -base64 32`)

---

## Step 3: Create Initial Collections in MongoDB

ไป MongoDB Atlas → Collections → Add My Own Data:

### Collections ที่ต้องสร้าง:
1. **users** - สำหรับผู้ใช้งาน
2. **shelters** - สำหรับศูนย์พักพิง
3. **warehouses** - สำหรับคลังกลาง
4. **categories** - สำหรับหมวดหมู่สินค้า
5. **items** - สำหรับรายการสินค้า
6. **stocks** - สำหรับสต็อก
7. **requests** - สำหรับคำร้องขอ
8. **stock_logs** - สำหรับประวัติการเปลี่ยนแปลง
9. **notifications** - สำหรับการแจ้งเตือน

---

## Step 4: Run Development Server

```bash
npm run dev
```

Server จะทำงานที่ `http://localhost:3000`

---

## Step 5: Test API

### 5.1 Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123",
    "role": "admin",
    "phone": "0812345678"
  }'
```

### 5.2 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

ตัวอย่าง Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

Save token:
```bash
export TOKEN="your_token_here"
```

### 5.3 Create Warehouse
```bash
curl -X POST http://localhost:3000/api/shelters \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ศูนย์พักพิง กรุงเทพ",
    "province": "Bangkok",
    "district": "Pathumwan",
    "address": "123 Rama 1 Road",
    "capacity": 500,
    "currentPeople": 100,
    "contactName": "Manager",
    "contactPhone": "0812345678",
    "latitude": 13.7563,
    "longitude": 100.5018
  }'
```

---

## Step 6: Project Structure Review

```
storage_backend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── requests/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── approve/route.ts
│   │   │   │       └── transfer/route.ts
│   │   │   ├── stocks/
│   │   │   │   ├── check-availability/route.ts
│   │   │   │   └── low-stock/route.ts
│   │   │   ├── shelters/
│   │   │   │   └── route.ts
│   │   │   └── dashboard/
│   │   │       ├── overview/route.ts
│   │   │       ├── shelter-status/route.ts
│   │   │       └── stock-status/route.ts
│   ├── lib/
│   │   ├── mongodb.ts
│   │   └── auth.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Shelter.ts
│   │   ├── Warehouse.ts
│   │   ├── Item.ts
│   │   ├── Stock.ts
│   │   ├── Request.ts
│   │   ├── StockLog.ts
│   │   ├── Category.ts
│   │   └── Notification.ts
│   └── utils/
│       ├── errorHandler.ts
│       └── responseHandler.ts
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Step 7: Seeding Database (Optional)

สร้างไฟล์ `src/scripts/seed.ts`:

```typescript
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import Warehouse from '@/models/Warehouse';
import Category from '@/models/Category';
import Item from '@/models/Item';
import Shelter from '@/models/Shelter';

async function seed() {
  await dbConnect();

  // Create admin user
  const adminUser = new User({
    name: 'Admin',
    email: 'admin@example.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  });
  await adminUser.save();

  // Create warehouse
  const warehouse = new Warehouse({
    name: 'Central Warehouse',
    province: 'Bangkok',
    address: '123 Main Road',
    managerName: 'Manager Name',
    phone: '0812345678',
  });
  await warehouse.save();

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Food', description: 'Food items' },
    { name: 'Water', description: 'Drinking water' },
    { name: 'Medicine', description: 'Medicine' },
    { name: 'Clothing', description: 'Clothes' },
    { name: 'Bedding', description: 'Bedding' },
  ]);

  // Create items
  const items = await Item.insertMany([
    { name: 'Rice Boxes', categoryId: categories[0]._id, unit: 'box' },
    { name: 'Mineral Water', categoryId: categories[1]._id, unit: 'liter' },
    { name: 'First Aid Kit', categoryId: categories[2]._id, unit: 'piece' },
    { name: 'T-Shirt', categoryId: categories[3]._id, unit: 'piece' },
    { name: 'Blanket', categoryId: categories[4]._id, unit: 'piece' },
  ]);

  // Create shelters
  const shelters = await Shelter.insertMany([
    {
      name: 'Shelter Bangkok 1',
      province: 'Bangkok',
      district: 'Pathumwan',
      address: '123 Rama 1',
      capacity: 500,
      currentPeople: 100,
      contactName: 'Manager 1',
      contactPhone: '0812345678',
      latitude: 13.7563,
      longitude: 100.5018,
    },
    {
      name: 'Shelter Bangkok 2',
      province: 'Bangkok',
      district: 'Watthana',
      address: '456 Sukhumvit',
      capacity: 300,
      currentPeople: 250,
      contactName: 'Manager 2',
      contactPhone: '0812345679',
      latitude: 13.7315,
      longitude: 100.5631,
    },
  ]);

  console.log('✅ Database seeded successfully');
  console.log('- 1 Admin user created');
  console.log('- 1 Warehouse created');
  console.log('- 5 Categories created');
  console.log('- 5 Items created');
  console.log('- 2 Shelters created');
}

seed().catch(console.error);
```

Run seeding:
```bash
npx ts-node src/scripts/seed.ts
```

---

## Step 8: Next Steps

### Backend
- ✅ API Routes สร้างแล้ว
- ✅ MongoDB Models สร้างแล้ว
- ⏳ Add input validation using Zod/Yup
- ⏳ Add rate limiting
- ⏳ Add CORS configuration
- ⏳ Add logging (Winston/Morgan)
- ⏳ Deploy to Vercel/Railway

### Frontend
- ⏳ Create React components for UI
- ⏳ Implement request form UI
- ⏳ Create dashboard visualization
- ⏳ Build shelter map view
- ⏳ Add real-time notifications

---

## Troubleshooting

### MongoDB Connection Error
```
MongoServerError: connect ECONNREFUSED
```
**Solution:**
- Check MongoDB URI is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure MongoDB credentials are correct

### JWT Token Errors
```
401 Unauthorized - Invalid token
```
**Solution:**
- Login again to get new token
- Check JWT_SECRET in .env.local

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

---

## Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code
npm lint

# Check TypeScript
npx tsc --noEmit

# View MongoDB with UI (optional)
npm install -g compass  # MongoDB Compass
```

---

## Environment Variables Checklist

- [ ] MONGODB_URI set correctly
- [ ] JWT_SECRET is random & secure
- [ ] NEXT_PUBLIC_API_URL configured
- [ ] .env.local is in .gitignore

---

## Security Best Practices

✅ Use strong JWT_SECRET (min 32 chars)  
✅ Never commit .env.local to git  
✅ Use HTTPS in production  
✅ Implement rate limiting  
✅ Validate & sanitize inputs  
✅ Use CORS for frontend domain  
✅ Hash passwords (bcryptjs)  
✅ Implement request logging

---

## Support & Documentation

- API Docs: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Usage Examples: See [API_USAGE_EXAMPLE.ts](API_USAGE_EXAMPLE.ts)
- curl Examples: See [CURL_EXAMPLES.md](CURL_EXAMPLES.md)
- MongoDB Docs: https://docs.mongodb.com/
- Next.js Docs: https://nextjs.org/docs

---

Happy Building! 🎉
