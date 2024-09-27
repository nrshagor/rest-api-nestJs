## REST API : User, Product, and Order Management System

### Project Overview

This is a REST API built using NestJS to manage users, products, and orders. It supports user authentication with JWT, product management for Admin ,Users and allows users to place and view their order history. The project uses PostgreSQL for the database, and features caching for product listings to improve performance.

### 1. Installation and Setup

#### Prerequisites:

- Node.js (v20 or above)
- PostgreSQL database

#### Clone the repository:

```bash
git clone https://github.com/nrshagor/rest-api-nestJs.git

```

#### Go to the project directory

```bash
  cd rest-api-nestJs
```

#### Install the dependencies:

```bash
npm install
```

#### Start the server

```bash
  npm run start:dev
```

### 2. Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST=localhost`

`DB_PORT=3306`

`DB_USERNAME=root`

`DB_PASSWORD=your_db_password`

`DB_NAME=your_db_name`

`JWT_SECRET=your_jwt_secret`

### 3. API Reference

#### - User Management

- Register a User

```http
  POST /auth/register
```

| Parameter  | Type     |
| :--------- | :------- |
| `name`     | `string` |
| `email`    | `string` |
| `password` | `string` |

- Login a User

```http
  POST /auth/register
```

| Parameter  | Type     |
| :--------- | :------- |
| `email`    | `string` |
| `password` | `string` |

- Admin

  ```bash
  email: 'personone@gmail.com',
  password: '12345678',
  ```

- user

  ```bash
  email: 'persontwo@gmail.com',
  password: '12345678',
  ```

- Token Refresh

```http
  POST /auth/refresh-toekn
```

| Parameter      | Type     | Request Header                    |
| :------------- | :------- | :-------------------------------- |
| `refreshToken` | `string` | `Authorization: Bearer JWT_TOKEN` |

#### - Product Management

- List All Products (Public)

```http
 GET /products
```

- Create a Product (Admin Only)

```http
POST /products
```

Request Header: Authorization: Bearer JWT_TOKEN (Admin Token)

```bash
{
  "name": "Product A",
  "price": 100,
  "stock": 20
}

```

- Update a Product (Admin Only)

```http
PATCH /products/:id
```

Request Header: Authorization: Bearer JWT_TOKEN (Admin Token)

```bash
{
  "name": "Product A",
  "price": 100,
  "stock": 20
}

```

#### - Order Management

- Place an Order

```http
POST /order
```

Request Header: Authorization: Bearer JWT_TOKEN

```bash
{
  "order_items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

- View Order History

```http
GET /order
```

Request Header: Authorization: Bearer JWT_TOKEN

```bash
[
  {
    "id": 1,
    "total_amount": 200,
    "created_at": "2024-09-27T12:00:00Z",
    "order_items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 100
      }
    ]
  }
]

```

### 4. Bonus Points: Caching

For improved performance, product listings are cached for 60 seconds. The caching mechanism is implemented using NestJS's CacheInterceptor.

#### Example of Cached Endpoint:

- `Endpoint: GET /products`

- `Cached for 60 seconds.`

## Authors

- [@nrshagor](https://github.com/nrshagor)
