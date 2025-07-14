# Billing Management System

A comprehensive full-stack billing management application built with React.js frontend and .NET Web API backend. The system provides complete invoice and customer management capabilities with professional UI/UX and modern architecture patterns.

## 🚀 Features

### 📊 Dashboard

- **Real-time Statistics**: Live metrics for total invoices, customers, revenue, and pending amounts
- **Recent Activity**: Quick view of latest invoices and their statuses
- **Visual Analytics**: Clean, responsive dashboard with status indicators
- **Connection Monitoring**: Backend connectivity status with automatic fallback

### 📄 Invoice Management

- **Complete CRUD Operations**: Create, read, update, and delete invoices
- **Invoice Status Tracking**: Draft, Sent, Paid, Overdue, and Cancelled statuses
- **Dynamic Item Management**: Add/remove multiple line items with automatic calculations
- **Status Updates**: Quick status changes with real-time updates
- **Search & Filter**: Find invoices by number, customer, status, or date range
- **Pagination**: Efficient handling of large invoice lists

### 👥 Customer Management

- **Customer Profiles**: Complete customer information management
- **Contact Details**: Name, email, phone, and address management
- **Customer Analytics**: View total invoices and amounts per customer
- **Search Functionality**: Quick customer lookup by name or email
- **Relationship Tracking**: View all invoices associated with each customer
- **Pagination Support**: Handle large customer databases efficiently

### 🔧 Professional Architecture

- **Modular Structure**: Well-organized feature modules and components
- **TypeScript Integration**: Full type safety across the application
- **Responsive Design**: Mobile-first responsive UI design
- **Clean Code Patterns**: Following React and .NET best practices
- **Error Handling**: Comprehensive error management and user feedback
- **Loading States**: Professional loading indicators and transitions

### 🛡️ Demo Mode & Reliability

- **Automatic Fallback**: Seamlessly switches to demo data when backend unavailable
- **Realistic Sample Data**: 6 sample invoices and 5 customers with realistic relationships
- **Connection Indicators**: Visual status of backend connectivity
- **Offline Capability**: Full functionality even without backend connection

## 🏗️ Technology Stack

### Frontend (React.js)

- **React 18** with TypeScript
- **React Router** for navigation
- **Create React App** configuration
- **CSS3** with modern styling
- **Responsive Design** with mobile support
- **Environment Configuration** for different deployment stages

### Backend (.NET Web API)

- **.NET 8** Web API
- **Entity Framework Core** for data access
- **AutoMapper** for object mapping
- **FluentValidation** for request validation
- **Serilog** for structured logging
- **Swagger/OpenAPI** for API documentation
- **CORS** configuration for cross-origin requests

### Development & Deployment

- **Docker** support for both frontend and backend
- **docker-compose** for full-stack orchestration
- **Nginx** configuration for production deployment
- **Environment Variables** for configuration management

## 📁 Project Structure

```
billing-management-system/
├── frontend/                          # React.js Frontend Application
│   ├── public/                        # Static assets
│   ├── src/
│   │   ├── Assets/                    # Styles and static resources
│   │   │   └── Styles/
│   │   │       └── Styles.css         # Global styling system
│   │   ├── Common/                    # Shared utilities and components
│   │   │   ├── Components/            # Reusable UI components
│   │   │   │   ├── Layouts/           # Layout components (Header, Layout)
│   │   │   │   └── ConnectionStatus.tsx  # Backend connection indicator
│   │   │   ├── Constants/             # Application constants
│   │   │   │   ├── Routes.ts          # Route definitions
│   │   │   │   ├── Constants.ts       # General constants
│   │   │   │   ├── Enums.ts          # TypeScript enumerations
│   │   │   │   ├── SessionStorage.ts  # Session storage utilities
│   │   │   │   └── Auth.ts           # Authentication constants
│   │   │   ├── Hooks/                # Custom React hooks
│   │   │   │   └── CustomHooks.tsx   # Reusable hooks
│   │   │   ├── Services/             # API and data services
│   │   │   │   ├── httpRequest.ts    # HTTP client service
│   │   │   │   ├── BillingApiService.ts # Main API service
│   │   │   │   ├── DemoDataService.ts   # Demo mode data
│   │   │   │   └── Endpoints/        # API endpoint services
│   │   │   ├── Theme/               # Design system
│   │   │   │   └── Theme.ts         # Theme configuration
│   │   │   ├── Utils/               # Utility functions
│   │   │   │   ├── Formatters.ts    # Currency, date formatters
│   │   │   │   └── Helper.ts        # General utilities
│   │   │   └── Validator/           # Form validation
│   │   │       └── CustomValidators.ts # Validation rules
│   │   ├── Modules/                 # Feature modules
│   │   │   ├── Billing/             # Billing management module
│   │   │   │   ├── Components/      # Billing components
│   │   │   │   │   ├── InvoiceList.tsx     # Invoice listing
│   │   │   │   │   ├── CustomerList.tsx    # Customer management
│   │   │   │   │   └── CreateInvoice.tsx   # Invoice creation
│   │   │   │   ├── Model/           # TypeScript interfaces
│   │   │   │   │   └── Billing.interfaces.tsx
│   │   │   ���   ├── Services/        # Module-specific services
│   │   │   │   │   └── BillingService.ts
│   │   │   │   └── BillingModule.tsx # Module wrapper
│   │   │   ├── Dashboard/           # Dashboard module
│   │   │   │   ├── Model/
│   │   │   │   │   └── Dashboard.interfaces.tsx
│   │   │   │   └── Dashboard.tsx    # Main dashboard
│   │   │   └── Profile/             # User profile module
│   │   │       └── Profile.tsx      # Profile management
│   │   ├── App.tsx                  # Main application component
│   │   ├── index.tsx               # Application entry point
│   │   └── react-app-env.d.ts      # TypeScript declarations
│   ├── package.json                # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── Dockerfile                 # Frontend containerization
│   ├── nginx.conf                 # Production nginx config
│   └── folder_structure.txt       # Architecture documentation
├── backend/                        # .NET Web API Backend
│   ├── Controllers/                # API controllers
│   │   ├── InvoicesController.cs   # Invoice endpoints
│   │   ├── CustomersController.cs  # Customer endpoints
│   │   └── DashboardController.cs  # Dashboard endpoints
│   ├── Models/                     # Domain models
│   │   ├── BillingModels.cs       # Core entities
│   │   └── BillingContext.cs      # Entity Framework context
│   ├── DTOs/                      # Data transfer objects
│   │   └── BillingDTOs.cs         # API contracts
│   ├── Services/                  # Business logic
│   │   ├── BillingService.cs      # Core billing operations
│   │   └── DashboardService.cs    # Dashboard analytics
│   ├── Validators/                # Request validation
│   │   └── BillingValidators.cs   # FluentValidation rules
│   ├── Mappings/                  # Object mapping
│   │   └── BillingMappingProfile.cs # AutoMapper profiles
│   ├── Program.cs                 # Application startup
│   ├── appsettings.json          # Configuration
│   ├── backend.csproj            # Project file
│   ├── Dockerfile                # Backend containerization
│   └── README.md                 # Backend documentation
├── docker-compose.yml            # Full-stack orchestration
└── README.md                     # This file
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 16+ and npm
- **.NET 8** SDK
- **Docker** (optional, for containerization)

### Quick Start (Demo Mode)

The application includes a comprehensive demo mode that works without a backend:

```bash
# Clone the repository
git clone <repository-url>
cd billing-management-system

# Start frontend only (with demo data)
cd frontend
npm install
npm start
```

The application will start on `http://localhost:3000` with full demo functionality.

### Full Stack Development

1. **Start Backend API**:

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

2. **Start Frontend Application**:

```bash
cd frontend
npm install
npm start
```

3. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `https://localhost:7195`
   - Swagger Documentation: `https://localhost:7195` (in development)

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up --build

# Frontend will be available at http://localhost:3000
# Backend API at http://localhost:5000
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

```
REACT_APP_API_BASE_URL=https://localhost:7195/api
REACT_APP_DEMO_MODE=true
REACT_APP_ENVIRONMENT=development
```

#### Backend (appsettings.json)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "AllowedHosts": "*"
}
```

## 📡 API Endpoints

### Dashboard APIs

- `GET /api/dashboard` - Combined dashboard data
- `GET /api/dashboard/stats` - Statistics summary
- `GET /api/dashboard/recent-invoices` - Recent invoice activity

### Invoice Management APIs

- `GET /api/invoices` - List invoices (with filtering & pagination)
- `GET /api/invoices/{id}` - Get specific invoice
- `POST /api/invoices` - Create new invoice
- `PATCH /api/invoices/{id}/status` - Update invoice status

### Customer Management APIs

- `GET /api/customers` - List customers (with search & pagination)
- `GET /api/customers/{id}` - Get specific customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer information
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/{id}/invoices` - Get customer's invoices

## 🎯 Key Features Breakdown

### Professional UI/UX

- **Modern Design**: Clean, professional interface with consistent styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use navigation with clear information hierarchy
- **Loading States**: Professional loading indicators for better user experience
- **Error Handling**: Graceful error messages and fallback mechanisms

### Data Management

- **Real-time Updates**: Live data synchronization across components
- **Form Validation**: Client-side and server-side validation
- **Search & Filtering**: Powerful search capabilities across all entities
- **Pagination**: Efficient handling of large datasets
- **Sorting**: Customizable sorting options for lists

### Developer Experience

- **TypeScript**: Full type safety and better development experience
- **Modular Architecture**: Easy to maintain and extend
- **Code Quality**: ESLint, TypeScript, and best practices enforcement
- **Documentation**: Comprehensive code documentation and README files
- **Testing Ready**: Structure prepared for unit and integration tests

### Production Ready Features

- **Security**: Input validation, sanitization, and security headers
- **Performance**: Optimized builds and efficient data loading
- **Scalability**: Modular architecture that scales with requirements
- **Monitoring**: Health checks and logging infrastructure
- **Deployment**: Docker support and production configurations

## 🛠️ Development

### Adding New Features

1. **Frontend Module**:
   - Create new module in `frontend/src/Modules/`
   - Add components, services, and interfaces
   - Update routing in `App.tsx`

2. **Backend API**:
   - Add models in `Models/`
   - Create DTOs in `DTOs/`
   - Implement validators in `Validators/`
   - Add services in `Services/`
   - Create controllers in `Controllers/`

### Code Quality

- Follow TypeScript best practices
- Use consistent naming conventions
- Implement proper error handling
- Add comprehensive validation
- Write clean, self-documenting code

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test                # Run tests
npm run test:coverage   # Run with coverage
```

### Backend Testing

```bash
cd backend
dotnet test            # Run unit tests
```

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
dotnet publish -c Release
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up --build
```

## 📈 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Minified and compressed production builds
- **Caching**: Efficient caching strategies for API responses
- **Code Splitting**: Reduced initial bundle size
- **Database Optimization**: Efficient Entity Framework queries

## 🔒 Security Features

- **Input Validation**: Comprehensive client and server-side validation
- **XSS Protection**: Cross-site scripting prevention
- **CORS Configuration**: Secure cross-origin resource sharing
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **Security Headers**: Standard security headers implementation

## 🎮 Demo Mode

The application includes a comprehensive demo mode that provides:

- **6 Sample Invoices** with different statuses and realistic data
- **5 Sample Customers** with complete contact information
- **Dashboard Analytics** with calculated metrics
- **Full CRUD Operations** that work offline
- **Automatic Fallback** when backend is unavailable

## 📞 Support & Contributing

This project follows modern development practices and is designed for easy maintenance and extension. The modular architecture allows for adding new features without affecting existing functionality.

For development questions or feature requests, please refer to the comprehensive code documentation and architectural patterns established in the codebase.

## 📄 License

This project is built for educational and development purposes, demonstrating modern full-stack development practices with React.js and .NET.
