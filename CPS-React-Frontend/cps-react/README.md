# Claims Processing System - Frontend

A modern React-based frontend application for managing insurance claims, policies, hospitals, and customer interactions.

---

## 🎨 Overview

This is the client-side application for the Claims Processing System (CPS), built with React 19 and Vite. It provides an intuitive interface for customers to manage their insurance policies, submit claims, and track claim status.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (5173)                     │
│                      Vite Dev Server                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway (8899)                          │
│              Backend Microservices                          │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication
- **Customer Login** - Secure customer authentication
- Session management with localStorage
- Role-based access control (customer, officer, admin, hospital)

### 👤 Customer Features
- **Profile Management** - View and update customer details
- **Policy Browsing** - View available insurance policies
- **Coverage Details** - Check policy coverage and benefits
- **Hospital Search** - Find empaneled hospitals by location
- **Claims Submission** - Submit reimbursement claims with documents
- **Claims Tracking** - View recent claims and their status

### 🏥 Hospital Features (Partial - Needs Backend)
- View hospital profile
- Track admitted patients
- Manage medical information
- Handle pre-authorization requests

### 👨‍💼 Officer Features (Needs Backend)
- **Level 1 Officer Dashboard** - Review and process claims
- **Level 2 Officer Dashboard** - Approve/reject claims
- **Field Doctor Dashboard** - Inspect claims on-site
- Query management and resolution

### 🔧 Admin Features (Needs Backend)
- User management (officers, field doctors)
- Hospital management
- Policy management
- Role management

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 19.1.0 |
| Build Tool | Vite | 7.0.0 |
| UI Library | Material-UI (MUI) | 7.2.0 |
| Routing | React Router DOM | 6.30.1 |
| HTTP Client | Axios | 1.7.9 |
| State Management | React Hooks (useState, useEffect) | - |
| Styling | CSS + MUI Components | - |

---

## 📋 Prerequisites

Before running the application, ensure you have:

1. **Node.js (v18 or higher)**
   ```powershell
   node --version
   # Should show: v18.x.x or higher
   ```

2. **npm (v9 or higher)**
   ```powershell
   npm --version
   # Should show: 9.x.x or higher
   ```

3. **Backend Services Running**
   - All backend microservices must be running
   - API Gateway accessible at http://localhost:8899
   - See backend README for setup instructions

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```powershell
# Navigate to frontend directory
cd d:\CPS-React-Frontenddddddd\CPS-React-Frontend\cps-react

# Install dependencies
npm install
```

### Step 2: Configure API Endpoints

The API configuration is centralized in `src/utils/api.js`:

```javascript
// API Gateway base URL
const API_BASE_URL = "http://localhost:8899";

// All endpoints are configured here
export const API_ROUTES = {
  CUSTOMER: {
    LOGIN: `${API_BASE_URL}/customer/login`,
    ALL_HOSPITALS: `${API_BASE_URL}/customer/allHospitals`,
    // ... more endpoints
  }
};
```

**Note:** The default configuration points to `localhost:8899`. Modify if your API Gateway is on a different host/port.

### Step 3: Start Development Server

```powershell
npm run dev
```

**Output:**
```
  VITE v7.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Access the Application

Open your browser and navigate to:
- **Local:** http://localhost:5173
- **Landing Page:** http://localhost:5173/login

---

## 📁 Project Structure

```
cps-react/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, icons, etc.
│   ├── Components/
│   │   ├── Admin/              # Admin management components
│   │   │   ├── FieldDoctor.jsx
│   │   │   ├── HospitalManager.jsx
│   │   │   ├── Level1Officer.jsx
│   │   │   ├── Level2Officer.jsx
│   │   │   ├── PolicyDetailManager.jsx
│   │   │   └── RoleManager.jsx
│   │   ├── Customer/           # Customer-facing components
│   │   │   ├── CustomerHeader.jsx
│   │   │   ├── PolicyDetails.jsx     ✅ Working
│   │   │   ├── RecentClaims.jsx      ✅ Working
│   │   │   ├── ReimbursementComponent.jsx ✅ Working
│   │   │   └── ViewHospital.jsx      ✅ Working
│   │   ├── Hospital/           # Hospital operations
│   │   │   ├── AdmitPatients.jsx
│   │   │   ├── ClaimTracking.jsx
│   │   │   ├── HospitalHeader.jsx
│   │   │   ├── MedicalInformation.jsx
│   │   │   └── PreAuthorization.jsx
│   │   ├── LandingPageComponents/
│   │   ├── AdminPage.jsx
│   │   ├── CustProfile.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx            ✅ Working
│   │   └── Profile.jsx
│   ├── FieldOfficerComponents/  # Field doctor workflows
│   ├── Level1OfficerComponents/ # Level 1 officer workflows
│   ├── Level2OfficerComponents/ # Level 2 officer workflows
│   ├── utils/
│   │   └── api.js              ✅ Centralized API config
│   ├── App.jsx                  # Main app component
│   ├── App.css
│   ├── main.jsx                 # Application entry point
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md                    # This file
```

---

## 🎯 Application Flow

### 1. User Authentication Flow

```
┌─────────────┐
│ Landing Page│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Login Page  │────────────┐
└──────┬──────┘            │
       │                   │
       ▼                   ▼
   [Customer]        [Officer/Admin/Hospital]
       │                   │
       ▼                   ▼
┌─────────────┐      [Not Available Yet]
│  Customer   │      (Needs Backend Services)
│  Dashboard  │
└─────────────┘
```

**Steps:**
1. User lands on login page
2. Enters email and password
3. System sends `GET /customer/login?customer_email=xxx&customer_password=xxx`
4. Backend validates credentials
5. On success:
   - User data stored in localStorage
   - Redirects to appropriate dashboard based on role
6. On failure:
   - Shows error message

### 2. Hospital Search Flow

```
Customer Dashboard
    ↓
[View Hospitals] Button
    ↓
ViewHospital Component
    ↓
Fetch Hospitals (GET /customer/allHospitals)
    ↓
Display Hospital List
    ↓
Filter by State/City (Optional)
    ↓
Select Hospital
```

**Features:**
- Browse all empaneled hospitals
- Filter by state and city
- View hospital details
- Search functionality

### 3. Policy Viewing Flow

```
Customer Dashboard
    ↓
[View Policies] Button
    ↓
PolicyDetails Component
    ↓
Fetch Policies (GET /customer/policies/{customerId})
    ↓
Display Policy List
    ↓
View Coverage Details
```

### 4. Claims Submission Flow

```
Customer Dashboard
    ↓
[Submit Claim] Button
    ↓
ReimbursementComponent
    ↓
Step 1: Patient Information
    ↓
Step 2: Treatment Details
    ↓
Step 3: Document Upload
    ↓
Step 4: Declaration
    ↓
Submit (POST /customer/addClaims)
    ↓
Success Confirmation
```

**Multi-Step Form:**
1. **Patient Information**
   - Policy ID, Policy Holder ID
   - Date of Birth, Contact Number
   - Email, Relationship to Patient

2. **Treatment Details**
   - Claim Type (Hospitalization/Outpatient)
   - Admission/Discharge Dates
   - Hospital Details
   - Doctor Name, Ailment, Diagnosis
   - Total Claim Amount

3. **Document Upload**
   - Medical reports
   - Bills and invoices
   - Prescriptions
   - Discharge summary

4. **Declaration**
   - Terms and conditions acceptance
   - Final submission

### 5. Claims Tracking Flow

```
Customer Dashboard
    ↓
[My Claims] Button
    ↓
RecentClaims Component
    ↓
Fetch Claims (GET /customer/claims/{customerId})
    ↓
Display Claims Table
    ↓
View Claim Details
    ↓
Track Status
```

**Claim Statuses:**
- 🟡 `status_raised` - Claim submitted
- 🔵 `approved_by_fielddoctor` - Field doctor approved
- 🔵 `approved_by_level1` - Level 1 officer approved
- 🔵 `approved_by_level2` - Level 2 officer approved
- 🟢 `status_settled` - Claim settled/paid
- 🟠 `status_queried` - Additional information needed
- 🔴 `status_rejected` - Claim rejected

---

## 🔧 Configuration

### API Configuration (`src/utils/api.js`)

All API endpoints are centralized for easy management:

```javascript
const API_BASE_URL = "http://localhost:8899";

export const API_ROUTES = {
  CUSTOMER: {
    BASE: `${API_BASE_URL}/customer`,
    LOGIN: `${API_BASE_URL}/customer/login`,
    ALL_HOSPITALS: `${API_BASE_URL}/customer/allHospitals`,
    GET_POLICIES: (customerId) => `${API_BASE_URL}/customer/policies/${customerId}`,
    GET_CLAIMS: (customerId) => `${API_BASE_URL}/customer/claims/${customerId}`,
    ADD_CLAIM: `${API_BASE_URL}/customer/addClaims`,
    // ... more endpoints
  },
  DOCUMENTS: {
    UPLOAD: `${API_BASE_URL}/documents/upload`,
    // ... more endpoints
  },
  REGIONAL_HEAD: {
    FORWARDED_CLAIMS: `${API_BASE_URL}/head/forwarded`,
    // ... more endpoints
  }
};
```

### Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

---

## 🎨 Available Components

### ✅ Working Components (Connected to Backend)

| Component | Path | Purpose | Status |
|-----------|------|---------|--------|
| Login | `/Components/Login.jsx` | Customer authentication | ✅ Working |
| ViewHospital | `/Components/Customer/ViewHospital.jsx` | Browse hospitals | ✅ Working |
| PolicyDetails | `/Components/Customer/PolicyDetails.jsx` | View policies | ✅ Working |
| RecentClaims | `/Components/Customer/RecentClaims.jsx` | View claims | ✅ Working |
| ReimbursementComponent | `/Components/Customer/ReimbursementComponent.jsx` | Submit claims | ✅ Working |

### ⚠️ Components Needing Backend Services

| Component Group | Purpose | Missing Service |
|----------------|---------|-----------------|
| Admin/* | User/Hospital/Policy/Role management | User Management, Policy Management |
| Level1OfficerComponents/* | Claim review and approval | Advanced Claims Service |
| Level2OfficerComponents/* | Senior claim approval | Advanced Claims Service |
| FieldOfficerComponents/* | On-site claim inspection | Advanced Claims Service |
| Hospital/* | Hospital operations | Hospital Operations Service |

**For detailed analysis, see:**
- `FRONTEND_FIXES_SUMMARY.md`
- `API_ENDPOINT_MAPPING.md`
- `FRONTEND_BACKEND_ALIGNMENT.md`

---

## 🧪 Testing

### Manual Testing

1. **Test Login**
   ```
   - Navigate to http://localhost:5173/login
   - Enter customer credentials
   - Click Login
   - Should redirect to customer dashboard
   ```

2. **Test Hospital Search**
   ```
   - From customer dashboard, click "View Hospitals"
   - Should display list of hospitals
   - Select state and city filters
   - Verify hospitals are filtered correctly
   ```

3. **Test Claim Submission**
   ```
   - Click "Submit Claim"
   - Fill multi-step form
   - Upload documents
   - Submit claim
   - Verify success message
   ```

### API Testing

Use browser DevTools (F12) → Network tab to monitor API calls:

```javascript
// Example API calls you should see:
GET http://localhost:8899/customer/login?customer_email=xxx&customer_password=xxx
GET http://localhost:8899/customer/allHospitals
GET http://localhost:8899/customer/policies/123
POST http://localhost:8899/customer/addClaims
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Backend Connection Errors

**Problem:** API calls failing with network errors

**Solution:**
```powershell
# Verify backend is running
Invoke-RestMethod -Uri "http://localhost:8899/customer/allCustomer"

# Check if API Gateway is accessible
# Should return JSON data, not error
```

#### 2. CORS Errors

**Problem:** "Access-Control-Allow-Origin" error in browser console

**Solution:**
- Verify API Gateway CORS configuration includes `http://localhost:5173`
- Check `API-Gateway/application.properties`:
  ```properties
  spring.cloud.gateway.server.webflux.globalcors.cors-configurations[/**].allowedOrigins=http://localhost:5173
  ```

#### 3. Module Not Found Errors

**Problem:** Import errors after `npm install`

**Solution:**
```powershell
# Clear npm cache and reinstall
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

#### 4. Vite Build Errors

**Problem:** Build fails with dependency errors

**Solution:**
```powershell
# Update Vite and plugins
npm update vite @vitejs/plugin-react

# Or reinstall specific versions
npm install vite@7.0.0 @vitejs/plugin-react@latest
```

#### 5. Login Not Working

**Problem:** Login fails even with correct credentials

**Checklist:**
- ✅ Backend Customer service is running (port 5001)
- ✅ API Gateway is running (port 8899)
- ✅ MongoDB has customer data
- ✅ API endpoint is correct in `src/utils/api.js`
- ✅ Check browser console for errors
- ✅ Check Network tab for API response

---

## 📦 Building for Production

```powershell
# Build optimized production bundle
npm run build

# Output will be in dist/ directory
# Preview production build
npm run preview
```

### Deployment

1. **Build the app:**
   ```powershell
   npm run build
   ```

2. **Deploy `dist/` folder to:**
   - Static hosting (Netlify, Vercel, GitHub Pages)
   - Web server (Apache, Nginx)
   - Cloud platform (AWS S3, Azure Static Web Apps)

3. **Update API_BASE_URL:**
   - Change from `http://localhost:8899` to production API Gateway URL
   - Consider using environment variables:
     ```javascript
     const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8899";
     ```

---

## 🔄 Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | Start dev server | Development mode with HMR |
| `npm run build` | Build for production | Creates optimized bundle in `dist/` |
| `npm run preview` | Preview production build | Test production build locally |
| `npm run lint` | Run ESLint | Check code quality (if configured) |

---

## 📊 Feature Status Matrix

| Feature | Customer | Hospital | Officer | Admin | Backend Ready |
|---------|----------|----------|---------|-------|---------------|
| Login | ✅ | ⚠️ | ⚠️ | ⚠️ | Partial |
| View Profile | ✅ | ⚠️ | ⚠️ | ⚠️ | Partial |
| View Hospitals | ✅ | - | - | ⚠️ | ✅ |
| View Policies | ✅ | - | - | ⚠️ | ✅ |
| Submit Claims | ✅ | - | - | - | ✅ |
| Track Claims | ✅ | ✅ | - | - | ✅ |
| Review Claims | - | - | ❌ | - | ❌ |
| Approve Claims | - | - | ❌ | - | ❌ |
| User Management | - | - | - | ❌ | ❌ |
| Hospital CRUD | - | - | - | ⚠️ | Partial |
| Policy CRUD | - | - | - | ⚠️ | Partial |

**Legend:**
- ✅ Fully Working
- ⚠️ Partial (needs backend)
- ❌ Not Working (needs backend)
- `-` Not Applicable

---

## 📚 Additional Resources

### Documentation Created

1. **README_FRONTEND_ANALYSIS.md** - Quick start guide with analysis
2. **FRONTEND_FIXES_SUMMARY.md** - Detailed changes summary
3. **API_ENDPOINT_MAPPING.md** - Complete endpoint reference
4. **FRONTEND_BACKEND_ALIGNMENT.md** - Architecture alignment guide

### External Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)

---

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ Customer login and dashboard
- ✅ Hospital search
- ✅ Policy viewing
- ✅ Claims submission
- ✅ Claims tracking

### Next Version (v2.0)
- ⏳ Multi-role authentication
- ⏳ Officer dashboards
- ⏳ Admin panel
- ⏳ Hospital operations
- ⏳ Real-time notifications

### Future Enhancements
- 📱 Mobile app (React Native)
- 🔔 Push notifications
- 📊 Analytics dashboard
- 💬 Chat support
- 🌐 Multi-language support

---

**Last Updated:** May 21, 2026
**React Version:** 19.1.0
**Vite Version:** 7.0.0
**Dev Server:** http://localhost:5173
**API Gateway:** http://localhost:8899
