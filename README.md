# 🎫 Event Ticket Platform

A full-stack event management platform built with Spring Boot and React, featuring role-based access control, QR code ticket validation, and real-time event management capabilities.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Exception Handling](#exception-handling)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)

## Project Overview

The Event Ticket Platform is a modern, scalable solution for event management that serves three distinct user roles:

- **🎪 Organizers**: Create, manage, and publish events with multiple ticket types
- **🎫 Attendees**: Discover events, purchase tickets, and manage their ticket collection
- **👮 Staff**: Validate tickets using QR code scanning or manual entry
![preview0](https://i.imgur.com/KXgKb9A.png)
The platform implements **optimistic locking** for concurrent ticket purchases, ensuring data integrity during high-traffic scenarios. Built with enterprise-grade security using Keycloak for authentication and authorization.

### Login
![preview1](https://i.imgur.com/zfhx6WG.jpeg)


### Organizer FLOW
![preview5](https://i.imgur.com/NPpprcK.png)
![preview6](https://i.imgur.com/4QB9UMD.png)

### Staff FLOW
![preview7](https://i.imgur.com/cPPLMpi.png)

### Attendee FLOW
![preview2](https://i.imgur.com/LN8Mxwe.jpeg)
![preview3](https://i.imgur.com/EkiHpBA.png)
![preview4](https://i.imgur.com/QSoIlsc.png)



## Features

### 🎪 Organizer Features
- **Event Management**: Create, edit, delete events with comprehensive details
- **Ticket Type Configuration**: Multiple pricing tiers and categories per event
- **Real-time Analytics**: Dashboard with sales statistics and performance metrics
- **Event Publishing**: Control event visibility and sales periods
- **Sales Management**: Track ticket sales and revenue

### 🎫 Attendee Features
- **Event Discovery**: Browse and search published events
- **Ticket Purchase**: Secure ticket buying with quantity selection (1-10)
- **Ticket Management**: View purchased tickets with QR codes
- **QR Code Download**: Download ticket QR codes for offline access
- **Event Details**: Comprehensive event information and ticket availability

### 👮 Staff Features
- **QR Code Validation**: Camera-based ticket scanning
- **Manual Validation**: Ticket ID entry for validation
- **Validation Results**: Real-time validation status (VALID/INVALID/EXPIRED)
- **Method Tracking**: Record validation method used

### 🔒 Security & Data Integrity
- **JWT Authentication**: Stateless authentication with Keycloak
- **Role-Based Access Control**: Granular permissions per user role
- **Optimistic Locking**: Prevents race conditions in ticket purchases
- **CORS Configuration**: Secure cross-origin resource sharing
- **Input Validation**: Comprehensive request validation

## Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Core programming language |
| **Spring Boot** | 3.5.5 | Application framework |
| **Spring Security** | 3.5.5 | Authentication & authorization |
| **Spring Data JPA** | 3.5.5 | Database abstraction layer |
| **PostgreSQL** | Latest | Primary database |
| **Flyway** | Latest | Database migration management |
| **MapStruct** | 1.6.3 | Object mapping |
| **Lombok** | 1.18.36 | Code generation |
| **Google ZXing** | 3.5.3 | QR code generation |
| **Maven** | Latest | Build tool |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | 5.9.2 | Type-safe JavaScript |
| **Vite** | 7.1.7 | Build tool & dev server |
| **React Router** | 6.8.0 | Client-side routing |
| **Axios** | 1.6.0 | HTTP client |
| **js-cookie** | 3.0.5 | Cookie management |
| **@yudiel/react-qr-scanner** | 2.3.1 | QR code scanning |

### Testing Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **JUnit 5** | Latest | Unit testing framework |
| **TestContainers** | Latest | Integration testing with real databases |
| **DataFaker** | 2.2.2 | Realistic test data generation |
| **Spring Boot Test** | 3.5.5 | Integration testing |

### Infrastructure & Tools

| Technology | Purpose |
|------------|---------|
| **Keycloak** | Identity and access management |
| **Docker** | Containerization (for TestContainers) |
| **Git** | Version control |

## 📚 API Documentation

### Authentication
All endpoints (except published events) require JWT authentication via Keycloak.

**Base URL**: `http://localhost:8080/api/v1`

### 🎪 Event Management Endpoints

#### Create Event
```http
POST /api/v1/events
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Tech Conference 2024",
  "description": "Annual technology conference",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Convention Center",
  "salesStart": "2024-05-01T00:00:00",
  "salesEnd": "2024-06-14T23:59:59",
  "status": "DRAFT",
  "ticketTypeRequestList": [
    {
      "name": "Early Bird",
      "price": 99.99,
      "description": "Early bird pricing",
      "totalAvailable": 100
    },
    {
      "name": "VIP",
      "price": 199.99,
      "description": "VIP access with premium benefits",
      "totalAvailable": 50
    }
  ]
}
```

**Success Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Conference 2024",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Convention Center",
  "salesStart": "2024-05-01T00:00:00",
  "salesEnd": "2024-06-14T23:59:59",
  "status": "DRAFT",
  "ticketTypes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Early Bird",
      "price": 99.99,
      "description": "Early bird pricing",
      "totalAvailable": 100
    }
  ],
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

#### List Organizer Events
```http
GET /api/v1/events?page=0&size=8&sort=createdAt,desc
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Conference 2024",
      "start": "2024-06-15T09:00:00",
      "end": "2024-06-15T18:00:00",
      "location": "Convention Center",
      "status": "DRAFT",
      "ticketTypesCount": 2
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 8,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "numberOfElements": 1
}
```

#### Get Event Details
```http
GET /api/v1/events/{eventId}
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Conference 2024",
  "description": "Annual technology conference",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Convention Center",
  "salesStart": "2024-05-01T00:00:00",
  "salesEnd": "2024-06-14T23:59:59",
  "status": "DRAFT",
  "organizerId": "550e8400-e29b-41d4-a716-446655440010",
  "ticketTypes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Early Bird",
      "price": 99.99,
      "description": "Early bird pricing",
      "totalAvailable": 100,
      "eventId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00"
    }
  ],
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

#### Update Event
```http
PUT /api/v1/events/{eventId}
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Updated Tech Conference 2024",
  "description": "Updated description",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Updated Convention Center",
  "salesStart": "2024-05-01T00:00:00",
  "salesEnd": "2024-06-14T23:59:59",
  "status": "PUBLISHED",
  "ticketTypes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Updated Early Bird",
      "price": 89.99,
      "description": "Updated early bird pricing",
      "totalAvailable": 120
    }
  ]
}
```

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Updated Tech Conference 2024",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Updated Convention Center",
  "salesStart": "2024-05-01T00:00:00",
  "salesEnd": "2024-06-14T23:59:59",
  "status": "PUBLISHED",
  "ticketTypes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Updated Early Bird",
      "price": 89.99,
      "description": "Updated early bird pricing",
      "totalAvailable": 120
    }
  ],
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T11:45:00"
}
```

#### Delete Event
```http
DELETE /api/v1/events/{eventId}
Authorization: Bearer <jwt_token>
```

**Success Response** (204 No Content)

### 🎫 Published Events Endpoints (Public)

#### List Published Events
```http
GET /api/v1/published-events?page=0&size=10&sort=name,asc
```

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Conference 2024",
      "start": "2024-06-15T09:00:00",
      "end": "2024-06-15T18:00:00",
      "location": "Convention Center",
      "totalAvailable": 150
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "numberOfElements": 1
}
```

#### Search Published Events
```http
GET /api/v1/published-events?q=conference&page=0&size=10&sort=name,asc
```

**Success Response** (200 OK): Same as List Published Events

#### Get Published Event Details
```http
GET /api/v1/published-events/{eventId}
```

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Tech Conference 2024",
  "start": "2024-06-15T09:00:00",
  "end": "2024-06-15T18:00:00",
  "location": "Convention Center",
  "description": "Annual technology conference",
  "totalAvailable": 150,
  "ticketTypes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Early Bird",
      "price": 99.99,
      "description": "Early bird pricing",
      "totalAvailable": 100
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "VIP",
      "price": 199.99,
      "description": "VIP access with premium benefits",
      "totalAvailable": 50
    }
  ]
}
```

### 🎫 Ticket Management Endpoints

#### Purchase Tickets
```http
POST /api/v1/events/{eventId}/ticket-types/{ticketTypeId}/tickets?quantity=2
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `quantity` (required): Number of tickets to purchase (1-10)

**Success Response** (200 OK):
```json
{
  "ticketTypeId": "550e8400-e29b-41d4-a716-446655440001",
  "quantity": 2,
  "ticketIds": [
    "550e8400-e29b-41d4-a716-446655440100",
    "550e8400-e29b-41d4-a716-446655440101"
  ]
}
```

#### List User Tickets
```http
GET /api/v1/tickets?page=0&size=10&sort=createdAt,desc
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "status": "PURCHASED",
      "eventName": "Tech Conference 2024",
      "ticketType": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Early Bird",
        "price": 99.99,
        "description": "Early bird pricing"
      }
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "sorted": true,
      "unsorted": false
    }
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "numberOfElements": 1
}
```

#### Get Ticket Details
```http
GET /api/v1/tickets/{ticketId}
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "status": "PURCHASED",
  "price": 99.99,
  "description": "Early bird pricing",
  "eventName": "Tech Conference 2024",
  "location": "Convention Center",
  "eventStart": "2024-06-15T09:00:00",
  "eventEnd": "2024-06-15T18:00:00"
}
```

#### Download Ticket QR Code
```http
GET /api/v1/tickets/{ticketId}/qr-codes
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
- **Content-Type**: `image/png`
- **Body**: Binary PNG image data

### 👮 Ticket Validation Endpoints

#### Validate Ticket
```http
POST /api/v1/ticket-validations
Content-Type: application/json
```

**Request Body**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "method": "QR_SCAN"
}
```

**Success Response** (200 OK):
```json
{
  "ticketId": "550e8400-e29b-41d4-a716-446655440100",
  "status": "VALID"
}
```

### 📊 Organizer Statistics Endpoints

#### Get Organizer Statistics
```http
GET /api/v1/organizers/stats
Authorization: Bearer <jwt_token>
```

**Success Response** (200 OK):
```json
{
  "totalEvents": 15,
  "totalTicketsSold": 1250,
  "totalRevenue": 125000.00,
  "publishedEvents": 12,
  "draftEvents": 3
}
```

## Exception Handling

All endpoints return standardized error responses with the following format:

```json
{
  "message": "Error description"
}
```

### Common Error Responses

#### 400 Bad Request
```json
{
  "message": "Event name is required"
}
```

#### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

#### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

#### 404 Not Found
```json
{
  "message": "Event not found!"
}
```

#### 409 Conflict
```json
{
  "message": "Could not complete the purchase due to concurrent updates. Please try again."
}
```

#### 500 Internal Server Error
```json
{
  "message": "An unknown error occurred."
}
```

### Specific Exception Handling

| Exception | HTTP Status | Description |
|-----------|-------------|-------------|
| `ConcurrentTicketPurchaseException` | 409 Conflict | Optimistic locking failure during ticket purchase |
| `TicketNotFoundException` | 404 Not Found | Ticket not found |
| `TicketsSoldOutException` | 400 Bad Request | No tickets available for purchase |
| `QrCodeNotFoundException` | 404 Not Found | QR code not found |
| `QrCodeGenerationException` | 500 Internal Server Error | QR code generation failed |
| `EventUpdateException` | 400 Bad Request | Event update validation failed |
| `TicketTypeNotFoundException` | 404 Not Found | Ticket type not found |
| `EventNotFoundException` | 404 Not Found | Event not found |
| `UserNotFoundException` | 400 Bad Request | User not found (token expired) |
| `MethodArgumentNotValidException` | 400 Bad Request | Request validation failed |
| `ConstraintViolationException` | 400 Bad Request | Data constraint violation |
| `DataIntegrityViolationException` | 400 Bad Request | Database integrity violation |


## Demo Credentials

### Organizer Account
- **Username**: `organizer2`
- **Password**: `password`
- **Role**: `ROLE_ORGANIZER`

### Staff Account
- **Username**: `staff1`
- **Password**: `password`
- **Role**: `ROLE_STAFF`

### Attendee Accounts
- **Username**: `attendee1` / `attendee2`
- **Password**: `password`
- **Role**: `ROLE_ATTENDEE`

## Project Structure

```
ticket-platform/
├── ticket-service/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/adrianaparaschivei/ticketservice/
│   │       ├── controller/         # REST Controllers
│   │       ├── service/           # Business Logic
│   │       ├── repository/        # Data Access Layer
│   │       ├── model/            # Entities & DTOs
│   │       ├── config/           # Configuration
│   │       └── util/             # Utilities
│   ├── src/main/resources/
│   │   ├── db/migration/         # Flyway migrations
│   │   └── application.yml       # Application config
│   └── src/test/                # Test classes
├── fe-client/                    # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── styles/             # CSS styles
│   └── package.json
└── README.md
```

### QR Code Generation & Validation
- **Generation**: Uses Google ZXing library to create QR codes containing ticket UUIDs
- **Validation**: Supports both QR code scanning and manual UUID entry
- **Security**: QR codes contain only ticket identifiers, not sensitive data

### Role-Based Access Control
- **Organizers**: Full CRUD access to their events
- **Attendees**: Read-only access to published events, ticket management
- **Staff**: Ticket validation capabilities only

### Integration Testing Strategy
- **TestContainers**: Real PostgreSQL database for integration tests
- **DataFaker**: Realistic test data generation
- **BaseIntegrationTest**: Common test setup and utilities
- **Repository Testing**: Direct database interaction testing


