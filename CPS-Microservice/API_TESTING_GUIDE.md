# Claims Processing System (CPS) - API Testing Guide

## ✅ Migration Complete: MongoDB → H2 Database

All microservices have been successfully migrated from MongoDB to H2 in-memory database.

---

## 🚀 Running Services

All services are currently running on:

| Service | Port | Status | H2 Console |
|---------|------|--------|------------|
| **Eureka Server** | 8761 | ✅ UP | N/A |
| **API Gateway** | 8899 | ✅ UP | N/A |
| **Customer** | 5001 | ✅ UP | http://localhost:5001/h2-console |
| **Documents** | 9096 | ✅ UP | http://localhost:9096/h2-console |
| **RegionalHead** | 9098 | ✅ UP | http://localhost:9098/h2-console |

---

## 🔍 Service Discovery (Eureka)

**URL**: http://localhost:8761/

All services are registered with IP addresses (192.168.1.12) instead of hostnames, resolving DNS issues.

---

## 🗄️ H2 Database Access

### Customer Database (cpsdb)
- **Console URL**: http://localhost:5001/h2-console
- **JDBC URL**: `jdbc:h2:mem:cpsdb`
- **Username**: `sa`
- **Password**: (leave empty)

### Documents Database (docsdb)
- **Console URL**: http://localhost:9096/h2-console
- **JDBC URL**: `jdbc:h2:mem:docsdb`
- **Username**: `sa`
- **Password**: (leave empty)

### RegionalHead Database (headdb)
- **Console URL**: http://localhost:9098/h2-console
- **JDBC URL**: `jdbc:h2:mem:headdb`
- **Username**: `sa`
- **Password**: (leave empty)

---

## 📡 API Endpoints

### Through API Gateway (Recommended)

**Base URL**: `http://localhost:8899`

#### Customer Service
- `GET /customer/allCustomer` - Get all customers
- `GET /customer/policies/allPolicies` - Get all policies
- `GET /customer/covers/allCovers` - Get all covers
- `GET /customer/hospitals/allHospitals` - Get all hospitals
- `GET /customer/claims/allClaims` - Get all claims
- `POST /customer/addCustomer` - Add new customer
- `POST /customer/policies/addPolicy` - Add new policy
- `POST /customer/claims/addClaim` - Add new claim

#### Documents Service
- `GET /documents/getAll` - Get all documents
- `POST /documents/addDocument` - Add new document

#### RegionalHead Service
- `GET /head/getAllClaimsWithDocs` - Get all forwarded claims with documents

### Direct Service Access

- **Customer**: http://localhost:5001/customer/*
- **Documents**: http://localhost:9096/documents/*
- **RegionalHead**: http://localhost:9098/head/*

---

## ✅ Verified Tests

All endpoints tested and working:
- ✅ `GET http://localhost:8899/customer/allCustomer` → `[]` (empty, correct)
- ✅ `GET http://localhost:8899/documents/getAll` → `[]` (empty, correct)
- ✅ `GET http://localhost:5001/customer/allCustomer` → `[]` (direct access working)
- ✅ `GET http://localhost:9096/documents/getAll` → `[]` (direct access working)

---

## 🧪 Sample API Calls

### Add a Customer (POST)
```bash
curl -X POST http://localhost:8899/customer/addCustomer \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerAddress": "123 Main St",
    "customerAadhaar": "123456789012",
    "customerEmail": "john@example.com",
    "customerPassword": "password123",
    "customerDob": "1990-01-01",
    "customerPhone": "1234567890",
    "nomineeName": "Jane Doe",
    "nomineeDob": "1995-01-01",
    "nomineeRelation": "Spouse"
  }'
```

### Get All Customers (GET)
```bash
curl http://localhost:8899/customer/allCustomer
```

---

## 🎯 Frontend Integration

**React Frontend**: http://localhost:5173 (if running)

The frontend is configured to call the API Gateway at `http://localhost:8899` for all backend requests.

---

## 📊 Database Schema

Tables are automatically created by JPA with `ddl-auto=update`:

### Customer Service Tables:
- `customers`
- `policies`
- `covers`
- `hospitals`
- `claims`

### Documents Service Tables:
- `documents`

### RegionalHead Service Tables:
- `claims` (read from Customer service through API calls)

---

## 🔄 Key Changes from MongoDB to H2

1. **No installation required** - H2 runs in-memory
2. **Auto-restart creates fresh database** - Data is not persisted between restarts
3. **SQL-based queries** - Can use H2 Console to query directly
4. **JPA/Hibernate** - Standard JPA annotations instead of MongoDB-specific
5. **Faster startup** - No external database connection needed

---

## 🛠️ Troubleshooting

### Service Not Registered with Eureka
- Wait 30-60 seconds after service startup
- Check Eureka dashboard at http://localhost:8761/

### 404 Not Found Error
- Verify service is registered in Eureka
- Check API Gateway route configuration
- Ensure correct path prefix (/customer/, /documents/, /head/)

### DNS Resolution Error
- Fixed by setting `eureka.instance.prefer-ip-address=true`
- Services now register with IP (192.168.1.12) instead of hostname

---

## 📝 Notes

- **In-Memory Database**: Data is lost when service restarts
- **CORS Enabled**: Frontend at localhost:5173 can access APIs
- **Service Discovery**: All routing happens through Eureka service names
- **Load Balancing**: API Gateway uses `lb://SERVICE-NAME` for client-side load balancing

---

**System Status**: ✅ All services operational with H2 database
**Last Updated**: May 21, 2026
