# Billing Management API

A comprehensive .NET 8 Web API for managing billing operations including invoices, customers, and dashboard analytics.

## Features

- **Invoice Management**: Create, read, update, and track invoices
- **Customer Management**: Manage customer information and relationships
- **Dashboard Analytics**: Real-time statistics and recent activity
- **Data Transfer Objects (DTOs)**: Clean API contracts
- **Validation**: FluentValidation for request validation
- **Mapping**: AutoMapper for entity-DTO mapping
- **Logging**: Serilog for structured logging
- **API Documentation**: Swagger/OpenAPI documentation
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: Application health monitoring

## Architecture

The API follows clean architecture principles with:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer
- **Models**: Domain entities
- **DTOs**: Data transfer objects for API contracts
- **Validators**: Request validation using FluentValidation
- **Mappings**: AutoMapper profiles for object mapping

## API Endpoints

### Dashboard

- `GET /api/dashboard` - Get combined dashboard data
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-invoices` - Get recent invoices

### Invoices

- `GET /api/invoices` - Get all invoices (with filtering and pagination)
- `GET /api/invoices/{id}` - Get specific invoice
- `POST /api/invoices` - Create new invoice
- `PATCH /api/invoices/{id}/status` - Update invoice status

### Customers

- `GET /api/customers` - Get all customers (with search and pagination)
- `GET /api/customers/{id}` - Get specific customer
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer
- `GET /api/customers/{id}/invoices` - Get customer's invoices

## Configuration

### Environment Variables

- `ASPNETCORE_ENVIRONMENT` - Application environment (Development/Production)
- `ASPNETCORE_URLS` - URLs the application listens on

### CORS Configuration

The API is configured to accept requests from:

- http://localhost:3000 (React development server)
- https://localhost:3000
- http://localhost:3001
- https://localhost:3001

## Data Models

### Invoice

- ID, Invoice Number, Date, Due Date
- Customer relationship
- Invoice items with descriptions, quantities, and prices
- Calculated totals (subtotal, tax, total)
- Status tracking (Draft, Sent, Paid, Overdue, Cancelled)

### Customer

- ID, Name, Email, Phone, Address
- Relationship to invoices
- Calculated metrics (total invoices, total amount)

### Invoice Item

- Description, Quantity, Unit Price
- Calculated total (quantity × unit price)

## Validation Rules

### Invoice Creation

- Customer ID must be valid
- Due date must be today or future
- At least one invoice item required
- Item descriptions, quantities, and prices validated

### Customer Creation

- Name and email required
- Email format validation
- Phone number format validation
- Unique email constraint

## Logging

The application uses Serilog for structured logging with:

- Console logging for development
- File logging with daily rolling files
- Error context and correlation

## Security Features

- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- HTTPS redirection
- Input validation and sanitization
- SQL injection prevention through Entity Framework

## Getting Started

1. **Prerequisites**
   - .NET 8 SDK
   - Visual Studio 2022 or VS Code

2. **Run the Application**

   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```

3. **Access Swagger UI**
   - Navigate to `https://localhost:7195` (or configured port)
   - Swagger UI will be available at the root URL in development

4. **Health Check**
   - GET `/health` - Check application health

## Development

### Adding New Features

1. Create/update models in `Models/`
2. Add DTOs in `DTOs/`
3. Create validators in `Validators/`
4. Update mapping profiles in `Mappings/`
5. Implement business logic in `Services/`
6. Add controller endpoints in `Controllers/`

### Database

Currently uses Entity Framework with In-Memory database for development.
For production, configure a persistent database provider.

### Testing

Unit tests can be added using xUnit, NUnit, or MSTest.
Integration tests can test the full API pipeline.

## Production Considerations

- Configure persistent database (SQL Server, PostgreSQL, etc.)
- Add authentication and authorization
- Implement caching strategies
- Set up monitoring and alerting
- Configure load balancing
- Add rate limiting
- Implement backup strategies
