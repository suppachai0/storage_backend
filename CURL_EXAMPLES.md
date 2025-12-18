# API Testing Examples using curl

## 🔐 Authentication

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "role": "shelter_staff",
    "phone": "0812345678"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token:**
```bash
export TOKEN="your_jwt_token_here"
```

---

## 🏛️ Shelters

### Get All Shelters
```bash
curl -X GET "http://localhost:3000/api/shelters?province=Bangkok" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Shelter (Admin Only)
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

## 📝 Requests

### Submit Request (Shelter Staff)
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shelterId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "itemId": "507f1f77bcf86cd799439012",
        "quantityRequested": 10
      },
      {
        "itemId": "507f1f77bcf86cd799439013",
        "quantityRequested": 5
      }
    ]
  }'
```

### Get All Requests
```bash
curl -X GET "http://localhost:3000/api/requests?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Request Detail
```bash
curl -X GET http://localhost:3000/api/requests/REQUEST_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update Request (Only when pending)
```bash
curl -X PUT http://localhost:3000/api/requests/REQUEST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "507f1f77bcf86cd799439012",
        "quantityRequested": 15
      }
    ]
  }'
```

### Approve Request (Warehouse Staff)
```bash
curl -X POST http://localhost:3000/api/requests/REQUEST_ID/approve \
  -H "Authorization: Bearer $WAREHOUSE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "507f1f77bcf86cd799439012",
        "quantityApproved": 8
      }
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

### Transfer Items (Warehouse Staff - ตัดสต็อก)
```bash
curl -X POST http://localhost:3000/api/requests/REQUEST_ID/transfer \
  -H "Authorization: Bearer $WAREHOUSE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "itemId": "507f1f77bcf86cd799439012",
        "quantityTransferred": 8
      }
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

---

## 📦 Stocks

### Check Item Availability
```bash
curl -X POST http://localhost:3000/api/stocks/check-availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "507f1f77bcf86cd799439012",
    "quantity": 10
  }'
```

### Get Low Stock Items
```bash
curl -X GET http://localhost:3000/api/stocks/low-stock \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Dashboard

### Dashboard Overview
```bash
curl -X GET http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer $TOKEN"
```

### Shelter Status
```bash
curl -X GET http://localhost:3000/api/dashboard/shelter-status \
  -H "Authorization: Bearer $TOKEN"
```

### Stock Status
```bash
curl -X GET "http://localhost:3000/api/dashboard/stock-status?warehouseId=507f1f77bcf86cd799439014" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔄 Complete Workflow Example

### 1. Shelter Staff: Submit Request
```bash
REQUEST_RESPONSE=$(curl -s -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer $SHELTER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shelterId": "507f1f77bcf86cd799439011",
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityRequested": 10}
    ]
  }')

REQUEST_ID=$(echo $REQUEST_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Request ID: $REQUEST_ID"
```

### 2. Warehouse Staff: Approve Request
```bash
curl -X POST http://localhost:3000/api/requests/$REQUEST_ID/approve \
  -H "Authorization: Bearer $WAREHOUSE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityApproved": 8}
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

### 3. Warehouse Staff: Transfer Items
```bash
curl -X POST http://localhost:3000/api/requests/$REQUEST_ID/transfer \
  -H "Authorization: Bearer $WAREHOUSE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"itemId": "507f1f77bcf86cd799439012", "quantityTransferred": 8}
    ],
    "warehouseId": "507f1f77bcf86cd799439014"
  }'
```

### 4. Check Status
```bash
curl -X GET http://localhost:3000/api/requests/$REQUEST_ID \
  -H "Authorization: Bearer $SHELTER_TOKEN"
```

---

## 📝 Using Postman

1. Set environment variable: `token` = your JWT token
2. Create requests with headers:
   ```
   Authorization: Bearer {{token}}
   Content-Type: application/json
   ```

---

## 🚨 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | No token or invalid token | Login again and get new token |
| 403 Forbidden | Insufficient permissions | Check user role |
| 404 Not Found | Resource doesn't exist | Verify ID is correct |
| 400 Bad Request | Missing required fields | Check request body |
| 500 Internal Server | Server error | Check server logs |

---

## 💡 Quick Tips

✅ Always include `Authorization: Bearer $TOKEN` header  
✅ Use `-H "Content-Type: application/json"` for POST/PUT requests  
✅ Save token in environment variable for easier testing  
✅ Use `curl -s` for silent mode (no progress bar)  
✅ Use `jq` to format JSON output: `curl ... | jq`

---

Happy Testing! 🎉
