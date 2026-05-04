# Ecommerce Backend

## Overview

This is a Spring Boot backend for an ecommerce application. It provides user authentication, product browsing, cart management, and user address management. The application is secured using JWT tokens and includes Swagger API documentation.

## Features

- User registration and login with JWT authentication
- Password hashing using BCrypt
- Product catalog with:
  - pagination
  - search by title or description
  - product detail retrieval
- Cart functionality for authenticated users:
  - add product to cart
  - update cart item quantity
  - remove cart item
  - fetch current cart items
- User address management for authenticated users:
  - add new address
  - list addresses
  - get address by ID
  - update address
  - delete address
  - default address handling
- Swagger/OpenAPI documentation
- Kafka support for order event publishing and consumption

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate and receive JWT token

### Products

- `GET /products` - List all products (supports `page`, `limit` query parameters)
- `GET /products/{id}` - Get product details by ID
- `GET /products/search?q={query}` - Search products by title or description

### Cart (Authenticated)

- `POST /cart/items` - Add item to cart
- `PUT /cart/items/{id}` - Update quantity of a cart item
- `DELETE /cart/items/{id}` - Remove a cart item
- `GET /cart` - Retrieve cart items for the current user

### User Addresses (Authenticated)

- `POST /user/addresses` - Add a new address
- `GET /user/addresses` - List addresses for the current user
- `GET /user/addresses/{id}` - Get address by ID
- `PUT /user/addresses/{id}` - Update an existing address
- `DELETE /user/addresses/{id}` - Delete an address

## Security

- JWT authentication for protected APIs
- Stateless session management
- CORS configured to allow all origins and standard HTTP methods
- Public access for `/auth/**` and `/products/**`

## Kafka Messaging

The project includes a Kafka producer and consumer:

- `com.example.ecommerce.kafka.Producer` publishes order events to the `order-topic`
- `com.example.ecommerce.kafka.Consumer` listens on `order-topic`

> Note: The current implementation includes Kafka support, but the order event producer is not wired to a public order endpoint in the controller layer.

## Database Design

### Tables and Relationships

- `users`
  - `id` (PK)
  - `username` (unique)
  - `email` (unique)
  - `password`
  - `name`
  - `is_active`

- `addresses`
  - `id` (PK)
  - `user_id` (FK -> users.id)
  - `full_name`
  - `phone_number`
  - `address_line1`
  - `address_line2`
  - `city`
  - `state`
  - `postal_code`
  - `country`
  - `is_default`

- `cart`
  - `id` (PK)
  - `user_id` (FK reference by application logic)
  - `created_at`

- `cart_item`
  - `id` (PK)
  - `cart_id` (FK -> cart.id)
  - `product_id`
  - `quantity`

- `product`
  - `id` (PK)
  - `title`
  - `description`
  - `category`
  - `price`
  - `discount_percentage`
  - `rating`
  - `stock`
  - `brand`
  - `thumbnail`
  - `version`

- `product_image`
  - `id` (PK)
  - `image_url`
  - `product_id` (FK -> product.id)

- `order`
  - `id` (PK)
  - `user_id`
  - `status`
  - `total_amount`

- `order_item`
  - `id` (PK)
  - `order_id`
  - `product_id`
  - `quantity`
  - `price`

### Entity Relationship Summary

- `User` has many `Address`
- `Product` has many `ProductImage`
- `Cart` belongs to a user by `userId`
- `CartItem` belongs to a `Cart`
- `Order` and `OrderItem` exist for order modeling

## Running the Application

1. Configure the database connection in `src/main/resources/application.properties`
2. Run with Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
3. Open Swagger API docs at:
   ```
   http://localhost:8080/swagger-ui.html
   ```

## Notes

- The application currently uses PostgreSQL configuration in `application.properties`.
- Change database credentials and JWT secret values before deploying to production.
- The project includes order entity models and Kafka support, but order endpoints are not exposed in the current controller layer.
