# Claims Processing System (CPS)

A comprehensive insurance claims processing system built with modern microservices architecture and React frontend.

---

## 🏗️ System Overview

The Claims Processing System is a full-stack application designed to streamline insurance claim submissions, approvals, and settlements. It features a Spring Boot microservices backend with MongoDB and a React-based frontend.

```
┌────────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 5173)                  │
│          Customer Portal • Hospital Portal • Admin Panel        │
└────────────────────────┬───────────────────────────────────────┘
                         │ REST API (HTTP)
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                  API Gateway (Port 8899)                        │
│                  Single Entry Point with Routing               │
└──────┬───────────────┬────────────────┬────────────────────────┘
       │               │                │
       ▼               ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐
│ Customer │    │Documents │    │ RegionalHead │    │  Eureka  │
│ Service  │    │ Service  │    │   Service    │    │  Server  │
│  (5001)  │    │  (9096)  │    │   (9098)     │    │  (8761)  │
└────┬─────┘    └────┬─────┘    └──────┬───────┘    └──────────┘
     │               │                  │
     └───────────────┴──────────────────┘
                     │
              ┌──────▼──────┐
              │   MongoDB   │
              │  (27017)    │
              └─────────────┘
```

---

## 📂 Repository Structure

```
CPS-React-Frontenddddddd/
├── CPS-Microservice/              # Backend Services
│   ├── Eureka-Server/            # Service Discovery (8761)
│   ├── API-Gateway/              # API Gateway (8899)
│   ├── Customer/                 # Customer Service (5001)
│   ├── Documents/                # Documents Service (9096)
│   ├── RegionalHead/             # RegionalHead Service (9098)
│   └── README.md                 # Backend Documentation ⭐
│
├── CPS-React-Frontend/           # Frontend Application
│   └── cps-react/
│       ├── src/                  # React source code
│       ├── public/               # Static assets
│       └── README.md             # Frontend Documentation ⭐
│
├── README.md                      # This file ⭐
├── FRONTEND_FIXES_SUMMARY.md     # Frontend changes summary
├── API_ENDPOINT_MAPPING.md       # API documentation
├── FRONTEND_BACKEND_ALIGNMENT.md # Architecture alignment
└── README_FRONTEND_ANALYSIS.md   # Quick start guide
```

---

## 🚀 Quick Start (Full System)

### Prerequisites

Ensure you have installed:
- ☑️ **Java 17** or higher
- ☑️ **Maven 3.x** or higher
- ☑️ **Node.js 18** or higher
- ☑️ **npm 9** or higher
- ☑️ **MongoDB 4.x** or higher

### Step-by-Step Setup

#### 1. Start MongoDB
```powershell
# Windows
net start MongoDB

# OR using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 2. Start Backend Services

Open **5 separate terminals** and run each service in order:

```powershell
# Terminal 1: Eureka Server
cd CPS-Microservice\Eureka-Server
mvn spring-boot:run

# Terminal 2: Customer Service
cd CPS-Microservice\Customer
mvn spring-boot:run

# Terminal 3: Documents Service
cd CPS-Microservice\Documents
mvn spring-boot:run

# Terminal 4: RegionalHead Service
cd CPS-Microservice\RegionalHead
mvn spring-boot:run

# Terminal 5: API Gateway
cd CPS-Microservice\API-Gateway
mvn spring-boot:run
```

**Wait for all services to start** (check Eureka dashboard at http://localhost:8761)

#### 3. Start Frontend

```powershell
# Terminal 6: Frontend
cd CPS-React-Frontend\cps-react
npm install
npm run dev
```

#### 4. Access the Application

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:8899
- **Eureka Dashboard:** http://localhost:8761

---

## 🎯 Key Features

### ✅ Currently Working

| Feature | Description | User Role |
|---------|-------------|-----------|
| 🔐 Customer Login | Secure authentication | Customer |
| 🏥 Hospital Search | Browse empaneled hospitals | Customer |
| 📋 Policy Viewing | View insurance policies | Customer |
| 💰 Claim Submission | Submit reimbursement claims | Customer |
| 📊 Claim Tracking | Track claim status | Customer |
| 📄 Document Upload | Upload claim documents | Customer |

### ⚠️ Requires Additional Backend Development

| Feature | Missing Component | Priority |
|---------|------------------|----------|
| Officer/Admin Login | Authentication Service | 🔴 High |
| Claim Review Workflow | Advanced Claims Service | 🔴 High |
| User Management | User Management Service | 🔴 High |
| Hospital Operations | Hospital Operations Service | 🟡 Medium |
| Policy Management | Policy Management Service | 🟡 Medium |
| Role Management | Role Management Service | 🟢 Low |

---

## 🏗️ Architecture Details

### Backend Architecture

**Pattern:** Microservices with Service Discovery

**Components:**
1. **Eureka Server** - Service registry for dynamic service discovery
2. **API Gateway** - Single entry point with load balancing and routing
3. **Customer Service** - Core business logic (customers, policies, hospitals, claims)
4. **Documents Service** - Document management for claims
5. **RegionalHead Service** - Senior management claim reviews

**Technology:**
- Spring Boot 2.7.5 / 3.5.3
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- Spring Data MongoDB
- Lombok

### Frontend Architecture

**Pattern:** Component-based SPA (Single Page Application)

**Technology:**
- React 19.1.0
- Vite 7.0.0
- Material-UI 7.2.0
- React Router DOM 6.30.1
- Axios 1.7.9

**Key Directories:**
- `Components/Customer/` - Customer portal features ✅
- `Components/Admin/` - Admin panel features ⚠️
- `Level1OfficerComponents/` - Level 1 officer workflows ⚠️
- `Level2OfficerComponents/` - Level 2 officer workflows ⚠️
- `FieldOfficerComponents/` - Field doctor workflows ⚠️
- `Components/Hospital/` - Hospital operations ⚠️

---

## 📡 API Endpoints

All requests go through the **API Gateway** on port **8899**.

### Available Endpoints

#### Customer Service (`/customer/**`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/customer/addCustomer` | Create customer |
| GET | `/customer/allCustomer` | Get all customers |
| GET | `/customer/getCustomer/{id}` | Get customer by ID |
| GET | `/customer/login` | Customer login |
| GET | `/customer/allHospitals` | Get all hospitals |
| GET | `/customer/city/{city}` | Get hospitals by city |
| GET | `/customer/allPolicies` | Get all policies |
| GET | `/customer/policies/{id}` | Get policies by customer |
| GET | `/customer/claims/{id}` | Get claims by customer |
| POST | `/customer/addClaims` | Submit new claim |

#### Documents Service (`/documents/**`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/getAll` | Get all documents |
| GET | `/documents/{id}` | Get document by ID |
| POST | `/documents/upload` | Upload document |
| PUT | `/documents/{id}` | Update document |
| DELETE | `/documents/delete/{id}` | Delete document |

#### RegionalHead Service (`/head/**`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/head/forwarded` | Get forwarded claims |
| PATCH | `/head/{id}/status` | Update claim status |

**For complete API documentation, see:** `API_ENDPOINT_MAPPING.md`

---

## 🗄️ Database Structure

### MongoDB Databases

- **cpsdb** (Customer Service)
  - `customers` - Customer information
  - `policies` - Insurance policies
  - `covers` - Coverage options
  - `hospitals` - Empaneled hospitals
  - `claims` - Insurance claims

- **docsdb** (Documents Service)
  - `documents` - Claim documents metadata

- **headdb** (RegionalHead Service)
  - `claims` - Forwarded claims for review

---

## 🧪 Testing the System

### 1. Verify Backend Services

```powershell
# Check Eureka Dashboard
Start-Process "http://localhost:8761"

# Test API Gateway
Invoke-RestMethod -Uri "http://localhost:8899/customer/allCustomer"
```

### 2. Test Frontend

```powershell
# Open frontend
Start-Process "http://localhost:5173"

# Try customer login
# Navigate through hospital search
# Submit a test claim
```

### 3. Monitor Logs

Watch terminal outputs for:
- Service registration confirmations
- API request/response logs
- Error messages (if any)

---

## 📊 System Status

### Backend Services
| Service | Port | Status | Database |
|---------|------|--------|----------|
| Eureka Server | 8761 | ✅ Running | - |
| API Gateway | 8899 | ✅ Running | - |
| Customer Service | 5001 | ✅ Running | cpsdb |
| Documents Service | 9096 | ✅ Running | docsdb |
| RegionalHead Service | 9098 | ✅ Running | headdb |

### Frontend Components
| Component Group | Status | Notes |
|----------------|--------|-------|
| Customer Portal | ✅ Working | Login, hospitals, policies, claims |
| Admin Panel | ⚠️ Partial | Needs backend services |
| Officer Dashboards | ⚠️ Partial | Needs backend services |
| Hospital Portal | ⚠️ Partial | Needs backend services |

---

## 🐛 Troubleshooting

### Common Issues

#### Services Won't Start

```powershell
# 1. Check if MongoDB is running
Get-Service MongoDB  # Windows
docker ps           # Docker

# 2. Check if ports are available
Get-NetTCPConnection -LocalPort 8761,8899,5001,9096,9098

# 3. Kill processes if needed
Stop-Process -Id <ProcessId> -Force

# 4. Clean and rebuild
mvn clean install
```

#### Frontend Can't Connect to Backend

```powershell
# 1. Verify API Gateway is running
Invoke-RestMethod -Uri "http://localhost:8899/customer/allCustomer"

# 2. Check CORS configuration in API Gateway
# Should allow http://localhost:5173

# 3. Check browser console for errors
# F12 → Console → Network tab
```

#### MongoDB Connection Issues

```powershell
# 1. Start MongoDB
net start MongoDB

# 2. Verify connection
# MongoDB should be accessible at mongodb://localhost:27017

# 3. Check application.properties files
# All services should point to correct MongoDB URI
```

---

## 📚 Documentation

### Comprehensive Guides

1. **[Backend README](CPS-Microservice/README.md)** ⭐
   - Detailed backend setup
   - Service configurations
   - API documentation
   - Database schemas

2. **[Frontend README](CPS-React-Frontend/cps-react/README.md)** ⭐
   - Frontend setup guide
   - Component documentation
   - UI/UX guidelines
   - Build instructions

3. **[Frontend Analysis](README_FRONTEND_ANALYSIS.md)**
   - Quick start guide
   - Feature status
   - Testing instructions

4. **[API Endpoint Mapping](API_ENDPOINT_MAPPING.md)**
   - Complete endpoint reference
   - Request/response examples
   - Backend development roadmap

5. **[Frontend Fixes Summary](FRONTEND_FIXES_SUMMARY.md)**
   - Detailed change log
   - Component status
   - Missing services

6. **[Architecture Alignment](FRONTEND_BACKEND_ALIGNMENT.md)**
   - System architecture
   - Integration points
   - Development priorities

---

## 🛣️ Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Microservices architecture
- ✅ Service discovery with Eureka
- ✅ API Gateway setup
- ✅ Customer portal features
- ✅ Basic claim workflow

### Phase 2: Advanced Features (In Progress)
- ⏳ Authentication & authorization service
- ⏳ User management service
- ⏳ Advanced claims processing
- ⏳ Officer workflows
- ⏳ Admin panel

### Phase 3: Hospital Integration
- ⏳ Hospital operations service
- ⏳ Patient admission
- ⏳ Medical records management
- ⏳ Pre-authorization workflow

### Phase 4: Enhancements
- ⏳ Real-time notifications
- ⏳ Analytics dashboard
- ⏳ Reporting system
- ⏳ Mobile application

---

## 🔐 Security Considerations

### Current Status
⚠️ **Security is minimal in current version:**
- No authentication/authorization
- Passwords sent in plain text
- No encryption
- Basic CORS configuration

### Production Requirements
Before deploying to production:
1. ✅ Implement JWT-based authentication
2. ✅ Add HTTPS/TLS encryption
3. ✅ Secure password hashing (BCrypt)
4. ✅ Role-based access control (RBAC)
5. ✅ API rate limiting
6. ✅ Input validation and sanitization
7. ✅ Security headers
8. ✅ Audit logging

---

## 🤝 Contributing

### Guidelines

1. **Backend Development**
   - Follow Spring Boot best practices
   - Use Lombok for boilerplate reduction
   - Write unit tests
   - Document APIs with Swagger

2. **Frontend Development**
   - Use functional components with hooks
   - Follow React best practices
   - Maintain responsive design
   - Write clean, readable code

3. **Documentation**
   - Update README files for major changes
   - Document new features
   - Add code comments for complex logic

---

## 📞 Support & Contact

### Getting Help

1. Check relevant README files
2. Review documentation files
3. Check browser/terminal console for errors
4. Verify all prerequisites are installed
5. Ensure all services are running

### Known Limitations

- ⚠️ Only customer login implemented
- ⚠️ Officer/admin features need backend services
- ⚠️ Hospital operations need backend services
- ⚠️ No real-time notifications
- ⚠️ No email integration

---

## 📝 License

[Add your license information here]

---

## 🙏 Acknowledgments

Built with:
- Spring Boot & Spring Cloud
- React & Vite
- MongoDB
- Material-UI
- And many other open-source libraries

---

**Project Status:** In Development
**Version:** 1.0.0
**Last Updated:** May 21, 2026
**Architecture:** Microservices + React SPA
**Database:** MongoDB
**Frontend:** http://localhost:5173
**Backend:** http://localhost:8899
**Service Registry:** http://localhost:8761
