# Claims Processing System - Backend Microservices

A Spring Boot microservices-based backend system for managing insurance claims, customers, policies, hospitals, and documents.

---

## 🏗️ Architecture Overview

This system follows a **microservices architecture** with service discovery and an API Gateway pattern.

```
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway (8899)                       │
│                    Single Entry Point for All APIs              │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────┐
        │            │            │            │
   ┌────▼───┐  ┌────▼────┐  ┌────▼────┐  ┌───▼──────┐
   │Customer│  │Documents│  │Regional │  │  Eureka  │
   │ (5001) │  │ (9096)  │  │  Head   │  │  Server  │
   │        │  │         │  │ (9098)  │  │  (8761)  │
   └────┬───┘  └────┬────┘  └────┬────┘  └──────────┘
        │           │            │
   ┌────▼───────────▼────────────▼─────┐
   │         MongoDB (27017)            │
   │  - cpsdb (Customer)                │
   │  - docsdb (Documents)              │
   │  - headdb (RegionalHead)           │
   └────────────────────────────────────┘
```

---

## 🎯 Microservices

### 1. **Eureka Server** (Port 8761)
- **Purpose:** Service Registry and Discovery
- **Technology:** Spring Cloud Netflix Eureka
- **URL:** http://localhost:8761

### 2. **API Gateway** (Port 8899)
- **Purpose:** Single entry point for all client requests
- **Technology:** Spring Cloud Gateway
- **Features:**
  - Route management
  - Load balancing
  - CORS configuration
- **Routes:**
  - `/customer/**` → Customer Service
  - `/documents/**` → Documents Service
  - `/head/**` → RegionalHead Service

### 3. **Customer Service** (Port 5001)
- **Purpose:** Core business logic for customers, policies, hospitals, and claims
- **Database:** MongoDB (`cpsdb`)
- **Entities:**
  - Customer (customers)
  - Policies (policies)
  - Covers (covers)
  - Hospitals (hospitals)
  - Claims (claims)

### 4. **Documents Service** (Port 9096)
- **Purpose:** Document management for insurance claims
- **Database:** MongoDB (`docsdb`)
- **Entities:**
  - Documents (documents)

### 5. **RegionalHead Service** (Port 9098)
- **Purpose:** Senior management review of forwarded claims
- **Database:** MongoDB (`headdb`)
- **Entities:**
  - Claims (claims)

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Java | OpenJDK | 17 |
| Framework | Spring Boot | 2.7.5 / 3.5.3 |
| Build Tool | Maven | 3.x |
| Service Discovery | Spring Cloud Netflix Eureka | 2021.0.6 / 2025.0.0 |
| API Gateway | Spring Cloud Gateway | 2025.0.0 |
| Database | MongoDB | 4.x+ |
| Data Access | Spring Data MongoDB | 2.7.5 |
| Code Generation | Lombok | 1.18.38 |

---

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Java Development Kit (JDK) 17**
   ```powershell
   java -version
   # Should show: openjdk version "17.x.x"
   ```

2. **Maven 3.x**
   ```powershell
   mvn -version
   # Should show: Apache Maven 3.x.x
   ```

3. **MongoDB 4.x or higher**
   - **Install:** https://www.mongodb.com/try/download/community
   - **Or use Docker:**
     ```powershell
     docker run -d -p 27017:27017 --name mongodb mongo:latest
     ```
   - **Verify:**
     ```powershell
     # MongoDB should be running on localhost:27017
     ```

---

## 🚀 Quick Start Guide

### Step 1: Start MongoDB
```powershell
# If installed locally
net start MongoDB

# OR using Docker
docker start mongodb

# Verify MongoDB is running
# Connect to: mongodb://localhost:27017
```

### Step 2: Start Services in Order

Open **5 separate PowerShell terminals** and run:

#### Terminal 1: Eureka Server (Service Registry)
```powershell
cd d:\CPS-React-Frontenddddddd\CPS-Microservice\Eureka-Server
mvn spring-boot:run
```
**Wait for:** "Started EurekaServerApplication" message
**Verify:** Open http://localhost:8761 - Should see Eureka dashboard

#### Terminal 2: Customer Service
```powershell
cd d:\CPS-React-Frontenddddddd\CPS-Microservice\Customer
mvn spring-boot:run
```
**Wait for:** "Started CustomerApplication" message
**Verify:** Check Eureka dashboard - Should see "CUSTOMER" service registered

#### Terminal 3: Documents Service
```powershell
cd d:\CPS-React-Frontenddddddd\CPS-Microservice\Documents
mvn spring-boot:run
```
**Wait for:** "Started DocumentsApplication" message
**Verify:** Check Eureka dashboard - Should see "DOCUMENTS" service registered

#### Terminal 4: RegionalHead Service
```powershell
cd d:\CPS-React-Frontenddddddd\CPS-Microservice\RegionalHead
mvn spring-boot:run
```
**Wait for:** "Started RegionalHeadApplication" message
**Verify:** Check Eureka dashboard - Should see "REGIONALHEAD" service registered

#### Terminal 5: API Gateway
```powershell
cd d:\CPS-React-Frontenddddddd\CPS-Microservice\API-Gateway
mvn spring-boot:run
```
**Wait for:** "Started ApiGatewayApplication" message

### Step 3: Verify All Services

**Check Eureka Dashboard:** http://localhost:8761
- Should see 4 services registered: CUSTOMER, DOCUMENTS, REGIONALHEAD, API-GATEWAY

**Test API Gateway:**
```powershell
# Get all customers
Invoke-RestMethod -Uri "http://localhost:8899/customer/allCustomer" -Method GET

# Get all hospitals
Invoke-RestMethod -Uri "http://localhost:8899/customer/allHospitals" -Method GET
```

---

## 📡 API Endpoints

All requests go through the **API Gateway** on port **8899**.

### Customer Service Endpoints

#### Customer Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customer/addCustomer` | Create new customer |
| GET | `/customer/allCustomer` | Get all customers |
| GET | `/customer/getCustomer/{id}` | Get customer by ID |
| PUT | `/customer/{id}` | Update customer |
| DELETE | `/customer/{id}` | Delete customer |
| GET | `/customer/login?customer_email={email}&customer_password={password}` | Customer login |

#### Policies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/allPolicies` | Get all policies |
| GET | `/customer/policies/{customerId}` | Get policies for a customer |

#### Covers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/allCovers` | Get all coverage options |
| GET | `/customer/covers/{customerId}` | Get covers for a customer |

#### Hospitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/allHospitals` | Get all hospitals |
| GET | `/customer/city/{city}` | Get hospitals by city |

#### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customer/claims/{customerId}` | Get claims for a customer |
| POST | `/customer/addClaims` | Create new claim |
| PUT | `/customer/claims/{claimId}` | Update claim |
| DELETE | `/customer/claims/{claimId}` | Delete claim |

### Documents Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/getAll` | Get all documents |
| GET | `/documents/{id}` | Get document by ID |
| POST | `/documents/upload` | Upload new document |
| PUT | `/documents/{id}` | Update document |
| DELETE | `/documents/delete/{id}` | Delete document |

### RegionalHead Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/head/forwarded` | Get forwarded claims |
| PATCH | `/head/{claimId}/status?status={status}` | Update claim status |

---

## 🔧 Configuration

### Application Properties

Each microservice has its own `application.properties`:

#### Customer Service (`Customer/src/main/resources/application.properties`)
```properties
spring.application.name=CUSTOMER
server.port=5001
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.data.mongodb.uri=mongodb://localhost:27017/cpsdb
```

#### Documents Service (`Documents/src/main/resources/application.properties`)
```properties
spring.application.name=DOCUMENTS
server.port=9096
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.data.mongodb.uri=mongodb://localhost:27017/docsdb
```

#### RegionalHead Service (`RegionalHead/src/main/resources/application.properties`)
```properties
spring.application.name=REGIONALHEAD
server.port=9098
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.data.mongodb.uri=mongodb://localhost:27017/headdb
```

#### API Gateway (`API-Gateway/src/main/resources/application.properties`)
```properties
server.port=8899
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
# Routes configured using Spring Cloud Gateway
```

---

## 🔄 Application Flow

### 1. Customer Registration & Login Flow
```
1. Customer submits registration → POST /customer/addCustomer
2. System creates customer in MongoDB
3. Customer logs in → GET /customer/login?customer_email=xxx&customer_password=xxx
4. System validates credentials
5. Returns customer data
```

### 2. Policy & Coverage Selection Flow
```
1. Customer views available policies → GET /customer/allPolicies
2. Customer views coverage options → GET /customer/allCovers
3. System fetches data from MongoDB
4. Customer selects and associates policy with their account
```

### 3. Hospital Search Flow
```
1. Customer searches hospitals → GET /customer/allHospitals
2. OR filters by city → GET /customer/city/{cityName}
3. System returns list of empaneled hospitals
4. Customer selects hospital for treatment
```

### 4. Claims Submission Flow
```
1. Customer submits claim → POST /customer/addClaims
   {
     "customerId": 123,
     "hospitalId": 456,
     "policyId": 789,
     "claimAmount": 50000,
     "ailment": "Surgery",
     ...
   }
2. System creates claim in MongoDB
3. Customer uploads documents → POST /documents/upload
4. System stores document metadata and links to claim
```

### 5. Claims Review Flow (RegionalHead)
```
1. Claims forwarded to regional head → GET /head/forwarded
2. Regional head reviews claim details
3. Updates claim status → PATCH /head/{claimId}/status?status=approved
4. System updates claim status in MongoDB
```

### 6. Service Discovery & Routing Flow
```
1. All services register with Eureka Server on startup
2. Client sends request to API Gateway (8899)
3. API Gateway queries Eureka for service location
4. Eureka returns service instance (load balanced)
5. API Gateway routes request to appropriate service
6. Service processes request and returns response
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### Customer Service Database (`cpsdb`)

**customers collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "customerName": String,
  "customerAddress": String,
  "customerAadhaar": String,
  "customerEmail": String,
  "customerPassword": String,
  "customerDob": Date,
  "customerPhone": String,
  "nomineeName": String,
  "nomineeDob": Date,
  "nomineeRelation": String,
  "policies": [
    {
      "policyId": Integer,
      "coverId": Integer
    }
  ]
}
```

**claims collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "customerId": Integer,
  "hospitalId": Integer,
  "policyId": Integer,
  "claimAmount": Number,
  "ailment": String,
  "admissionDate": Date,
  "dischargeDate": Date,
  "status": String,
  "remarks": String
}
```

**policies collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "policyName": String,
  "policyType": String,
  "premium": Number,
  "coverageAmount": Number,
  "tenure": Integer
}
```

**hospitals collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "hospitalName": String,
  "city": String,
  "state": String,
  "address": String,
  "phone": String,
  "specialization": String
}
```

#### Documents Service Database (`docsdb`)

**documents collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "claim_id": Integer,
  "blood_test": String,
  "admission_note": String,
  "prescription": String,
  "xray_report": String,
  "insurance_form": String,
  "discharge_summary": String,
  "other": String,
  "last_updated": String,
  "verified_by": Integer
}
```

#### RegionalHead Service Database (`headdb`)

**claims collection:**
```javascript
{
  "_id": ObjectId,
  "id": Integer,
  "customerId": Integer,
  "hospitalId": Integer,
  "claimDetails": String,
  "status": String,
  "forwardedDate": Date,
  "reviewComments": String
}
```

---

## 🧪 Testing

### Using PowerShell (Invoke-RestMethod)

```powershell
# Get all customers
Invoke-RestMethod -Uri "http://localhost:8899/customer/allCustomer" -Method GET

# Add new customer
$customer = @{
    id = 1
    customerName = "John Doe"
    customerEmail = "john@example.com"
    customerPassword = "password123"
    customerPhone = "9876543210"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8899/customer/addCustomer" `
    -Method POST `
    -Body $customer `
    -ContentType "application/json"

# Get all hospitals
Invoke-RestMethod -Uri "http://localhost:8899/customer/allHospitals" -Method GET

# Add new claim
$claim = @{
    customerId = 1
    hospitalId = 1
    policyId = 1
    claimAmount = 50000
    ailment = "Surgery"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8899/customer/addClaims" `
    -Method POST `
    -Body $claim `
    -ContentType "application/json"
```

### Using Browser

- **Eureka Dashboard:** http://localhost:8761
- **Get All Customers:** http://localhost:8899/customer/allCustomer
- **Get All Hospitals:** http://localhost:8899/customer/allHospitals
- **Get All Policies:** http://localhost:8899/customer/allPolicies

---

## 🐛 Troubleshooting

### Services Not Starting

**Problem:** Maven build fails
```powershell
# Clean and rebuild
mvn clean install
```

**Problem:** MongoDB connection refused
```powershell
# Check if MongoDB is running
Get-Service MongoDB  # Windows
# OR
docker ps  # If using Docker

# Start MongoDB
net start MongoDB  # Windows
# OR
docker start mongodb  # Docker
```

**Problem:** Port already in use
```powershell
# Find process using port 8899 (example)
Get-NetTCPConnection -LocalPort 8899 | Select-Object OwningProcess
# Kill the process
Stop-Process -Id <ProcessId> -Force
```

### Services Not Registering with Eureka

**Check:**
1. Eureka Server is running (http://localhost:8761)
2. `eureka.client.service-url.defaultZone` is correct in application.properties
3. Service name matches in both properties and @EnableEurekaClient annotation
4. Wait 30 seconds for registration (default heartbeat interval)

### API Gateway Not Routing

**Check:**
1. All services are registered with Eureka
2. Routes are correctly configured in API Gateway application.properties
3. Service names match Eureka registration (case-sensitive)
4. CORS configuration allows your client origin

---

## 📊 Monitoring

### Eureka Dashboard
- **URL:** http://localhost:8761
- **Shows:** All registered services, instances, health status

### Health Endpoints
- **Customer:** http://localhost:5001/actuator/health
- **Documents:** http://localhost:9096/actuator/health
- **RegionalHead:** http://localhost:9098/actuator/health
- **API Gateway:** http://localhost:8899/actuator/health

---

## 🔐 Security

**Note:** Current implementation has **no authentication/authorization**. All endpoints are publicly accessible.

**Recommended for Production:**
1. Implement Spring Security
2. Add JWT-based authentication
3. Role-based access control (RBAC)
4. API rate limiting
5. HTTPS/TLS encryption

---

## 📦 Building for Production

```powershell
# Build all services
cd Eureka-Server
mvn clean package

cd ../Customer
mvn clean package

cd ../Documents
mvn clean package

cd ../RegionalHead
mvn clean package

cd ../API-Gateway
mvn clean package

# JAR files will be in target/ directory of each service
```

---

## 🤝 Contributing

1. Follow Spring Boot best practices
2. Use Lombok for boilerplate code reduction
3. Maintain consistent naming conventions
4. Add appropriate logging
5. Write unit tests for new features

---

## 📝 License

[Add your license information here]

---

## 📞 Support

For issues or questions:
- Check Eureka dashboard for service health
- Review application logs in console
- Verify MongoDB connection
- Ensure all prerequisites are installed

---

**Last Updated:** May 21, 2026
**Architecture:** Spring Boot Microservices with MongoDB
**API Gateway:** Port 8899
**Service Discovery:** Eureka Server (Port 8761)
