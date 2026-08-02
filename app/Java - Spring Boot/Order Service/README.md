# Order Service

A small Spring Boot REST API for managing customer orders, paired with a React (Vite) frontend. It is used as a demo application for **application code modernization** (Java upgrade, CVE remediation, and Azure migration scenarios).

## Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Language   | Java 8                                       |
| Framework  | Spring Boot 2.7.18 (Web, Data JPA, Validation) |
| Database   | H2 (in-memory)                               |
| Build      | Maven                                         |
| Frontend   | React 18 + Vite 5                            |

## Project Structure

```
pom.xml                     # Maven build for the backend
src/main/java/...           # Spring Boot application code
  OrderServiceApplication   # Application entry point
  model/Order               # JPA entity
  repository/OrderRepository# Spring Data JPA repository
  service/OrderService      # Business logic
  web/OrderController        # REST endpoints
  config/                   # Web config + data seeding
src/main/resources/         # application.properties
src/test/java/...           # Unit and web tests
frontend/                   # React + Vite UI
```

## Prerequisites

- JDK 8+ and Maven 3.6+
- Node.js 18+ (for the frontend)

## Running the Backend

```pwsh
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. An in-memory H2 database is seeded with sample orders on startup, and the H2 console is available at http://localhost:8080/h2-console (JDBC URL `jdbc:h2:mem:orders`, user `sa`, no password).

To build a runnable JAR:

```pwsh
mvn clean package
java -jar target/order-service-1.0.0.jar
```

## Running the Frontend

```pwsh
cd frontend
npm install
npm run dev
```

The UI runs on **http://localhost:5173** and proxies `/api` requests to the backend on port 8080.

## API Reference

Base path: `/api/orders`

| Method | Endpoint                              | Description                              |
| ------ | ------------------------------------- | ---------------------------------------- |
| GET    | `/api/orders`                         | List all orders                          |
| GET    | `/api/orders/{id}`                    | Get a single order by ID (404 if absent) |
| GET    | `/api/orders/customer/{customer}/total` | Sum of order amounts for a customer    |
| POST   | `/api/orders`                         | Create a new order                       |

### Order model

```json
{
  "id": 1,
  "customer": "alice",
  "amount": 120.50,
  "createdAt": "2026-06-09T12:00:00.000+00:00"
}
```

`customer` and `amount` are required when creating an order.

### Example requests

```pwsh
# List orders
curl http://localhost:8080/api/orders

# Create an order
curl -X POST http://localhost:8080/api/orders `
  -H "Content-Type: application/json" `
  -d '{ "customer": "carol", "amount": 99.99 }'

# Total spend for a customer
curl http://localhost:8080/api/orders/customer/alice/total
```

## Testing

```pwsh
mvn test
```

Tests cover the repository, service, and web controller layers (see `src/test/java`).