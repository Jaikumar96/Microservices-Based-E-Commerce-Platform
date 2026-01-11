# Microservices-Based E-Commerce Platform

A comprehensive, production-ready e-commerce platform built using Spring Boot microservices architecture with React frontend, demonstrating modern cloud-native development practices.

## 📋 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Contributing](#contributing)

## 🏗️ Architecture Overview

This platform follows a microservices architecture pattern with the following components:

```
┌─────────────────┐
│   React App     │ (Port 5173)
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Gateway   │ (Port 8080)
│  Spring Cloud   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Eureka Server   │ (Port 8761)
│  (Discovery)    │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┬─────────────┐
    ▼         ▼          ▼            ▼             ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│Product │ │Order │ │Inventory│ │Auth      │ │Notification│
│Service │ │Service│ │Service  │ │Service   │ │Service   │
└────────┘ └──────┘ └────────┘ └──────────┘ └──────────┘
    │         │         │
    └────┬────┴────┬────┘
         ▼         ▼
    ┌────────┐ ┌────────┐
    │  MySQL │ │  Kafka │
    └────────┘ └────────┘
```

### Microservices:

1. **API Gateway** (Port 8080)
   - Entry point for all client requests
   - Routes requests to appropriate microservices
   - Load balancing and service discovery integration

2. **Eureka Server** (Port 8761)
   - Service registry and discovery
   - Manages service instances and health checks

3. **Product Service**
   - Product catalog management
   - CRUD operations for products
   - Product search and filtering

4. **Order Service**
   - Order processing and management
   - Order history and tracking

5. **Inventory Service**
   - Stock management
   - Real-time inventory updates

6. **Auth Service**
   - User authentication and authorization
   - JWT token-based security

7. **Notification Service**
   - Event-driven notifications
   - Kafka integration for asynchronous messaging

## 🚀 Technologies Used

### Backend
- **Java 17+** - Programming language
- **Spring Boot 3.x** - Framework for microservices
- **Spring Cloud** - Microservices infrastructure
  - Spring Cloud Gateway - API Gateway
  - Spring Cloud Netflix Eureka - Service Discovery
- **MySQL 8.0** - Relational database
- **Apache Kafka** - Event streaming platform
- **Maven** - Build and dependency management

### Frontend
- **React 19.x** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **SweetAlert2** - User notifications

### DevOps & Infrastructure
- **Docker & Docker Compose** - Containerization
- **Git** - Version control

## 📁 Project Structure

```
ecommerce-microservices/
├── api-gateway/                    # API Gateway service
│   ├── src/
│   └── pom.xml
├── eureka-server/                  # Service discovery
│   ├── eureka-server/
│   │   ├── src/
│   │   └── pom.xml
├── Product Service/                # Product management
│   ├── Product-Service/
│   │   ├── src/
│   │   └── pom.xml
├── Order Service/                  # Order processing
│   ├── Order-Service/
│   │   ├── src/
│   │   └── pom.xml
├── inventory-service/              # Inventory management
│   ├── inventory-service/
│   │   ├── src/
│   │   └── pom.xml
├── Auth Service/                   # Authentication
│   ├── Auth-Service/
│   │   ├── src/
│   │   └── pom.xml
├── Notification Service/           # Notification handling
│   ├── Notification-Service/
│   │   ├── src/
│   │   └── pom.xml
├── frontend/                       # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   ├── package.json
│   └── vite.config.js
├── db/                            # Database scripts
│   ├── seed-data.sql
│   ├── seed-100-products.sql
│   └── seed-100-products-compat.sql
├── docs/                          # Documentation
│   ├── backendCode.md
│   ├── db-setup.sql
│   ├── openapi.yaml
│   └── postman_collection.json
├── docker-compose.yml             # Docker orchestration
└── README.md
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
  ```bash
  java -version
  ```

- **Maven 3.6+**
  ```bash
  mvn -version
  ```

- **Node.js 18+ and npm**
  ```bash
  node -version
  npm -version
  ```

- **Docker and Docker Compose**
  ```bash
  docker --version
  docker-compose --version
  ```

- **Git**
  ```bash
  git --version
  ```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Jaikumar96/Microservices-Based-E-Commerce-Platform.git
cd Microservices-Based-E-Commerce-Platform
```

### 2. Start Infrastructure Services (MySQL & Kafka)

```bash
docker-compose up -d
```

This will start:
- MySQL on port 3307
- Zookeeper on port 2181
- Kafka on port 9092

### 3. Initialize Database

```bash
# Connect to MySQL
docker exec -it mysql-ecommerce mysql -uroot -proot

# Create databases for each service
CREATE DATABASE product_service;
CREATE DATABASE order_service;
CREATE DATABASE inventory_service;
CREATE DATABASE auth_service;
exit

# Load seed data
docker exec -i mysql-ecommerce mysql -uroot -proot product_service < db/seed-data.sql
```

Or use the provided SQL scripts in the `db/` directory.

### 4. Build and Run Backend Services

**Start services in this order:**

#### Step 1: Start Eureka Server
```bash
cd "eureka-server/eureka-server"
mvn clean install
mvn spring-boot:run
```
Wait for Eureka to be fully up (check http://localhost:8761)

#### Step 2: Start API Gateway
```bash
cd "../../api-gateway"
mvn clean install
mvn spring-boot:run
```

#### Step 3: Start Microservices (in separate terminals)

**Product Service:**
```bash
cd "Product Service/Product-Service"
mvn clean install
mvn spring-boot:run
```

**Inventory Service:**
```bash
cd "inventory-service/inventory-service"
mvn clean install
mvn spring-boot:run
```

**Order Service:**
```bash
cd "Order Service/Order-Service"
mvn clean install
mvn spring-boot:run
```

**Auth Service:**
```bash
cd "Auth Service/Auth-Service"
mvn clean install
mvn spring-boot:run
```

**Notification Service:**
```bash
cd "Notification Service/Notification-Service"
mvn clean install
mvn spring-boot:run
```

### 5. Start Frontend Application

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🎯 Running the Application

### Access Points:

- **Frontend Application**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Product Service API**: http://localhost:8080/api/products
- **Order Service API**: http://localhost:8080/api/orders
- **Inventory Service API**: http://localhost:8080/api/inventory

### Service Ports:

| Service | Port |
|---------|------|
| Frontend | 5173 |
| API Gateway | 8080 |
| Eureka Server | 8761 |
| MySQL | 3307 |
| Kafka | 9092 |
| Zookeeper | 2181 |

## 📚 API Documentation

### Product Service Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Order Service Endpoints

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Place a new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user

### Inventory Service Endpoints

- `GET /api/inventory` - Check inventory
- `GET /api/inventory/{sku}` - Check product availability
- `PUT /api/inventory/{sku}` - Update inventory

For detailed API documentation, check:
- [OpenAPI Specification](docs/openapi.yaml)
- [Postman Collection](docs/postman_collection.json)

## ✨ Features

### Customer Features:
- 🛍️ Browse product catalog
- 🔍 Search and filter products
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 👤 User authentication and profile management

### Admin Features:
- 📊 Admin dashboard
- ➕ Product management (CRUD operations)
- 📋 Order management
- 👥 User management
- 📈 Inventory tracking

### Technical Features:
- 🔄 Service discovery with Eureka
- 🚪 API Gateway routing
- 💬 Event-driven architecture with Kafka
- 🔐 JWT-based authentication
- 📱 Responsive React UI
- 🐳 Docker containerization
- 🔍 Centralized logging (planned)
- 📊 Monitoring (planned)

## 🧪 Testing

### Backend Tests
```bash
cd <service-directory>
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🛠️ Development

### Building Individual Services

```bash
cd <service-directory>
mvn clean package
```

### Creating Docker Images (Future Enhancement)

```bash
cd <service-directory>
docker build -t ecommerce/<service-name>:latest .
```

## 📝 Configuration

### Application Properties

Each microservice has its own configuration in `src/main/resources/application.yml` or `application.properties`.

### Environment Variables

You can override default configurations using environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3307/product_service
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=root
export EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka/
```

## 🐛 Troubleshooting

### Common Issues:

1. **Eureka registration fails**
   - Ensure Eureka Server is running first
   - Check network connectivity
   - Verify `eureka.client.service-url.defaultZone` in application.yml

2. **Database connection errors**
   - Verify MySQL is running: `docker ps`
   - Check credentials and port (3307)
   - Ensure database exists

3. **Kafka connection issues**
   - Verify Kafka and Zookeeper are running
   - Check `KAFKA_ADVERTISED_LISTENERS` in docker-compose.yml

4. **Port already in use**
   - Check and kill process using the port
   - Windows: `netstat -ano | findstr :8080`
   - Kill process: `taskkill /PID <PID> /F`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Jaikumar** - [GitHub Profile](https://github.com/Jaikumar96)

## 🙏 Acknowledgments

- Spring Boot and Spring Cloud teams
- React and Vite communities
- Apache Kafka project
- All contributors and supporters

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Happy Coding! 🚀**
