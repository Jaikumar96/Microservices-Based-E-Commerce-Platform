# Backend code

## 1) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\api-gateway\\src\\main\\resources\\application.yaml

```yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**
        - id: inventory-service
          uri: lb://inventory-service
          predicates:
            - Path=/api/inventory/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    fetch-registry: true
    register-with-eureka: true
```

---

## 2) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\eureka-server\\eureka-server\\src\\main\\resources\\application.yml

```yaml
server:
  port: 8761

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false

spring:
  application:
    name: eureka-server
```

---

## 3) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\Product Service\\Product-Service\\src\\main\\java\\com\\ecommerce\\Product\\Service\\controller\\ProductController.java

```java
package com.ecommerce.Product.Service.controller;

import com.ecommerce.Product.Service.dto.ProductRequest;
import com.ecommerce.Product.Service.dto.ProductResponse;
import com.ecommerce.Product.Service.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createProduct(@RequestBody ProductRequest request) {
        productService.createProduct(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts();
    }
}
```

---

## 4) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\inventory-service\\inventory-service\\src\\main\\java\\com\\ecommerce\\inventory_service\\controller\\InventoryController.java

```java
package com.ecommerce.inventory_service.controller;

import com.ecommerce.inventory_service.dto.InventoryResponse;
import com.ecommerce.inventory_service.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> isInStock(@RequestParam List<String> skuCode) {
        return inventoryService.isInStock(skuCode);
    }
}
```

---

## 5) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\Order Service\\Order-Service\\src\\main\\java\\com\\ecommerce\\Order\\Service\\controller\\OrderController.java

```java
package com.ecommerce.Order.Service.controller;

import com.ecommerce.Order.Service.dto.OrderRequest;
import com.ecommerce.Order.Service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(orderRequest);
    }
}
```

---

## 6) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\Order Service\\Order-Service\\src\\main\\java\\com\\ecommerce\\Order\\Service\\event\\OrderPlacedEvent.java

```java
package com.ecommerce.Order.Service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPlacedEvent {
    private String orderNumber;
}
```

---

## 7) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\Notification Service\\Notification-Service\\src\\main\\java\\com\\ecommerce\\Notification\\Service\\service\\NotificationService.java

```java
package com.ecommerce.Notification.Service.service;

import com.ecommerce.Notification.Service.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "notificationTopic", groupId = "notificationId")
    public void handleNotification(OrderPlacedEvent orderPlacedEvent) {
        // Send email notification (we'll simulate it with logging)
        log.info("========================================");
        log.info("\uD83D\uDCE7 NOTIFICATION SENT!");
        log.info("Order Number: {}", orderPlacedEvent.getOrderNumber());
        log.info("Email sent to customer about order placement");
        log.info("========================================");

        // In real implementation, you would use JavaMailSender here
        // Example:
        // mailSender.send(prepareEmail(orderPlacedEvent));
    }
}
```

---

## 8) c:\\Users\\jaiku\\Documents\\ecommerce-microservices\\docker-compose.yml

```yaml
services:
  mysql:
    image: mysql:8.0
    container_name: mysql-ecommerce
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: product_service
    ports:
      - "3307:3306"  
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0  # Specific version instead of :latest
    container_name: zookeeper-ecommerce
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0 
    container_name: kafka-ecommerce
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1

volumes:
  mysql_data:
```

> Note: If you run this compose file directly, the MySQL volume mapping line currently shown under `ports` should typically live under a `volumes:` section for the `mysql` service:
>
> ```yaml
> services:
>   mysql:
>     ...
>     ports:
>       - "3307:3306"
>     volumes:
>       - mysql_data:/var/lib/mysql
> ```
> The bottom-level `volumes:` block defines the named volume `mysql_data`.
