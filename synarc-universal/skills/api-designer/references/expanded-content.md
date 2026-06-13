
### Complete OpenAPI 3.1 Specification Walkthrough

This section provides a detailed, line-by-line walkthrough of a production-grade OpenAPI 3.1 specification for a complete Order Management API.

**Complete Spec:**

```yaml
openapi: "3.1.0"
info:
  title: "Order Management API"
  description: |
    The Order Management API provides endpoints for managing the complete order lifecycle.
    
    ## Capabilities
    - Create, retrieve, update, and cancel orders
    - Manage order items, shipments, and returns
    - Process payments and refunds
    - Track order status changes via webhooks
    - Generate order reports and analytics
    
    ## Authentication
    All API requests require authentication via Bearer JWT token.
    Obtain tokens from the Authorization Server at https://auth.example.com.
    
    ## Rate Limiting
    - Standard tier: 1,000 requests per minute
    - Enterprise tier: 10,000 requests per minute
    - See response headers for current rate limit status
    
    ## Pagination
    All list endpoints use cursor-based pagination.
    - `limit`: Number of items per page (default: 20, max: 100)
    - `cursor`: Opaque cursor from previous response
    - Response includes `nextCursor` and `hasMore`
    
    ## Errors
    Errors follow RFC 9457 (Problem Details) format.
    Every error response includes:
    - `type`: URI identifying the error type
    - `title`: Short human-readable summary
    - `status`: HTTP status code
    - `detail`: Human-readable explanation
    - `instance`: URI identifying the specific occurrence
    
    ## Idempotency
    POST and PATCH requests support idempotency via the `Idempotency-Key` header.
    Keys are valid for 24 hours and scoped per API key.
    
    ## Versioning
    This is version 2 of the Order Management API.
    Version is indicated in the URL path.
    See the changelog for version history.
    
  version: "2.3.0"
  contact:
    name: "API Support Team"
    email: "api-support@example.com"
    url: "https://developer.example.com/support"
  license:
    name: "Apache 2.0"
    url: "https://www.apache.org/licenses/LICENSE-2.0.html"
  termsOfService: "https://example.com/terms"
  x-logo:
    url: "https://cdn.example.com/brand/api-logo.svg"
    altText: "Company API Logo"
  x-default-sort: "-createdAt"
  x-rate-limits:
    standard: 1000
    enterprise: 10000

servers:
  - url: "https://api.example.com/v2"
    description: "Production environment"
    variables: {}
  - url: "https://staging-api.example.com/v2"
    description: "Staging environment for integration testing"
  - url: "http://localhost:3000/v2"
    description: "Local development environment"

tags:
  - name: "Orders"
    description: "Order CRUD and lifecycle operations"
    externalDocs:
      description: "Order management guide"
      url: "https://docs.example.com/guides/orders"
  - name: "Order Items"
    description: "Manage items within orders"
  - name: "Shipments"
    description: "Order shipping and tracking"
  - name: "Returns"
    description: "Order returns and refunds"
  - name: "Webhooks"
    description: "Webhook event subscriptions"
  - name: "Reports"
    description: "Order analytics and reporting"

paths:
  /orders:
    get:
      tags:
        - "Orders"
      operationId: "listOrders"
      summary: "List orders with filtering and pagination"
      description: |
        Retrieves a paginated list of orders based on the provided filters.
        
        ## Filter Examples
        - `?status=shipped` — Orders with status "shipped"
        - `?status=shipped,delivered` — Orders with status "shipped" or "delivered"
        - `?total[gte]=10000` — Orders with total >= 100.00
        - `?createdAt[gte]=2026-01-01&createdAt[lte]=2026-12-31` — Orders within date range
        - `?customerId=cust_123` — Orders for a specific customer
        - `?filter=status eq 'shipped' and total gte 10000` — Complex filter expression
        
        ## Sort Examples
        - `?sort=-createdAt` — Sort by creation date descending (newest first)
        - `?sort=total,status` — Sort by total ascending, then status ascending
        - `?sort=-priority,createdAt:asc` — Complex sort with direction
        
        ## Including Related Resources
        - `?include=items` — Include order items in response
        - `?include=items,customer` — Include items and customer
        - `?include=items.product` — Include items with nested product expansion
        
        ## Sparse Fieldsets
        - `?fields=id,orderNumber,total,status` — Only return specific fields
      parameters:
        - name: "status"
          in: "query"
          description: "Filter by order status (comma-separated for multiple values)"
          required: false
          schema:
            type: "string"
            example: "shipped,delivered"
        - name: "customerId"
          in: "query"
          description: "Filter by customer ID"
          required: false
          schema:
            type: "string"
            example: "cust_123"
        - name: "total"
          in: "query"
          description: "Filter by total amount"
          required: false
          schema:
            type: "object"
            properties:
              gte:
                type: "integer"
                description: "Greater than or equal"
              lte:
                type: "integer"
                description: "Less than or equal"
              gt:
                type: "integer"
                description: "Greater than"
              lt:
                type: "integer"
                description: "Less than"
            example: "{ \"gte\": 10000, \"lte\": 50000 }"
          style: "deepObject"
        - name: "createdAt"
          in: "query"
          description: "Filter by creation date range"
          required: false
          schema:
            type: "object"
            properties:
              gte:
                type: "string"
                format: "date-time"
              lte:
                type: "string"
                format: "date-time"
            example: "{ \"gte\": \"2026-01-01T00:00:00Z\", \"lte\": \"2026-12-31T23:59:59Z\" }"
          style: "deepObject"
        - name: "sort"
          in: "query"
          description: "Sort order (prefix with - for descending)"
          required: false
          schema:
            type: "string"
            example: "-createdAt"
        - name: "cursor"
          in: "query"
          description: "Pagination cursor from previous response"
          required: false
          schema:
            type: "string"
            example: "eyJpZCI6Im9yZF8xMjMifQ"
        - name: "limit"
          in: "query"
          description: "Number of items per page (max 100)"
          required: false
          schema:
            type: "integer"
            minimum: 1
            maximum: 100
            default: 20
            example: 20
        - name: "include"
          in: "query"
          description: "Related resources to include (comma-separated)"
          required: false
          schema:
            type: "string"
            example: "items,customer"
        - name: "fields"
          in: "query"
          description: "Sparse fieldset (comma-separated field names)"
          required: false
          schema:
            type: "string"
            example: "id,orderNumber,total,status"
      responses:
        "200":
          description: "Successful response with paginated order list"
          headers:
            RateLimit-Limit:
              schema:
                type: "integer"
              description: "Max requests per window"
            RateLimit-Remaining:
              schema:
                type: "integer"
              description: "Requests remaining in current window"
            RateLimit-Reset:
              schema:
                type: "integer"
              description: "Unix timestamp when rate limit resets"
            Request-Id:
              schema:
                type: "string"
                format: "uuid"
              description: "Unique request identifier for tracing"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                        format: "uuid"
                      timestamp:
                        type: "string"
                        format: "date-time"
                      pagination:
                        $ref: "#/components/schemas/Pagination"
                required:
                  - data
                  - meta
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    post:
      tags:
        - "Orders"
      operationId: "createOrder"
      summary: "Create a new order"
      description: |
        Creates a new order with the provided items and customer information.
        
        ## Idempotency
        Include an `Idempotency-Key` header to safely retry this request.
        The server will return the same response for the same key within 24 hours.
        
        ## Validation
        - At least one item is required
        - All product IDs must exist
        - Quantities must be positive integers
        - Shipping address is required for physical goods
        - Billing address is required for paid orders
        
        ## Webhook
        Successful order creation triggers an `order.created` webhook event.
      parameters:
        - name: "Idempotency-Key"
          in: "header"
          description: "Unique idempotency key for safe retries"
          required: false
          schema:
            type: "string"
            format: "uuid"
            example: "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateOrderRequest"
      responses:
        "201":
          description: "Order created successfully"
          headers:
            Location:
              schema:
                type: "string"
                format: "uri"
              description: "URL of the created order"
            Request-Id:
              schema:
                type: "string"
                format: "uuid"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
                        format: "date-time"
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "422":
          $ref: "#/components/responses/ValidationError"
        "429":
          $ref: "#/components/responses/TooManyRequests"

  /orders/{orderId}:
    get:
      tags:
        - "Orders"
      operationId: "getOrder"
      summary: "Get order details by ID"
      description: |
        Retrieves detailed information about a specific order.
        
        ## Including Related Resources
        Use the `include` parameter to embed related resources:
        - `items` — Order line items
        - `shipments` — Shipment details
        - `payments` — Payment information
        - `returns` — Return/refund details
        - `customer` — Customer information
        - `items.product` — Items with product details
        
        ## Sparse Fieldsets
        Use the `fields` parameter to limit response fields.
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          description: "Unique identifier of the order"
          schema:
            type: "string"
            pattern: "^ord_[a-zA-Z0-9]{20,30}$"
            example: "ord_abc123def456ghi789"
        - name: "include"
          in: "query"
          description: "Related resources to include (comma-separated)"
          required: false
          schema:
            type: "string"
            example: "items,shipments"
        - name: "fields"
          in: "query"
          description: "Sparse fieldset (comma-separated field names)"
          required: false
          schema:
            type: "string"
            example: "id,orderNumber,status,total"
      responses:
        "200":
          description: "Order details"
          headers:
            Request-Id:
              schema:
                type: "string"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
                        format: "date-time"
        "401":
          $ref: "#/components/responses/Unauthorized"
        "403":
          $ref: "#/components/responses/Forbidden"
        "404":
          $ref: "#/components/responses/NotFound"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    patch:
      tags:
        - "Orders"
      operationId: "updateOrder"
      summary: "Update order fields"
      description: |
        Performs a partial update on the specified order.
        
        ## Updatable Fields
        - `notes` — Order notes
        - `shippingAddress` — Shipping address
        - `billingAddress` — Billing address
        - `metadata` — Custom key-value pairs
        
        ## Non-Updatable Fields
        The following fields cannot be updated via PATCH:
        - `status` — Use dedicated status endpoints
        - `items` — Use order items endpoints
        - `total` — Computed from items
        - `createdAt` — Immutable
        
        ## Idempotency
        Include `Idempotency-Key` header for safe retries.
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "Idempotency-Key"
          in: "header"
          schema:
            type: "string"
            format: "uuid"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UpdateOrderRequest"
      responses:
        "200":
          description: "Order updated successfully"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
                    properties:
                      requestId:
                        type: "string"
                      timestamp:
                        type: "string"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"
        "409":
          $ref: "#/components/responses/Conflict"
        "422":
          $ref: "#/components/responses/ValidationError"
        "429":
          $ref: "#/components/responses/TooManyRequests"

    delete:
      tags:
        - "Orders"
      operationId: "cancelOrder"
      summary: "Cancel an order"
      description: |
        Cancels an order. Only orders in "pending" or "processing" status can be cancelled.
        Cancelled orders trigger the `order.cancelled` webhook event.
        
        ## Effects of Cancellation
        - Pending payments are voided
        - Completed payments are refunded
        - Shipped items cannot be cancelled (use returns endpoint)
        - Inventory is restocked
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "reason"
          in: "query"
          description: "Reason for cancellation"
          required: false
          schema:
            type: "string"
            example: "Customer requested cancellation"
      responses:
        "200":
          description: "Order cancelled successfully"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    $ref: "#/components/schemas/Order"
                  meta:
                    type: "object"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"
        "409":
          $ref: "#/components/responses/Conflict"
        "429":
          $ref: "#/components/responses/TooManyRequests"

  /orders/{orderId}/items:
    get:
      tags:
        - "Order Items"
      operationId: "listOrderItems"
      summary: "List items in an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of order items"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/OrderItem"
                  meta:
                    type: "object"

    post:
      tags:
        - "Order Items"
      operationId: "addOrderItem"
      summary: "Add an item to an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AddOrderItemRequest"
      responses:
        "201":
          description: "Item added to order"
          content:
            application/json:
              schema:
                type: "object"

  /orders/{orderId}/items/{itemId}:
    patch:
      tags:
        - "Order Items"
      operationId: "updateOrderItem"
      summary: "Update an order item (quantity)"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "itemId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: "object"
              properties:
                quantity:
                  type: "integer"
                  minimum: 0
                  description: "New quantity (0 removes the item)"
      responses:
        "200":
          description: "Item updated"

    delete:
      tags:
        - "Order Items"
      operationId: "removeOrderItem"
      summary: "Remove an item from an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "itemId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "204":
          description: "Item removed successfully"

  /orders/{orderId}/shipments:
    get:
      tags:
        - "Shipments"
      operationId: "listShipments"
      summary: "List shipments for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of shipments"

    post:
      tags:
        - "Shipments"
      operationId: "createShipment"
      summary: "Create a shipment for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateShipmentRequest"
      responses:
        "201":
          description: "Shipment created"

  /orders/{orderId}/shipments/{shipmentId}/track:
    get:
      tags:
        - "Shipments"
      operationId: "trackShipment"
      summary: "Track a shipment"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
        - name: "shipmentId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "Tracking information"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/TrackingInfo"

  /orders/{orderId}/returns:
    get:
      tags:
        - "Returns"
      operationId: "listReturns"
      summary: "List returns for an order"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "200":
          description: "List of returns"

    post:
      tags:
        - "Returns"
      operationId: "requestReturn"
      summary: "Request a return for an order item"
      parameters:
        - name: "orderId"
          in: "path"
          required: true
          schema:
            type: "string"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: "object"
              properties:
                itemId:
                  type: "string"
                quantity:
                  type: "integer"
                reason:
                  type: "string"
                  enum:
                    - "defective"
                    - "wrong_item"
                    - "not_as_described"
                    - "changed_mind"
                    - "other"
      responses:
        "201":
          description: "Return request created"

  /webhooks:
    get:
      tags:
        - "Webhooks"
      operationId: "listWebhookSubscriptions"
      summary: "List webhook subscriptions"
      responses:
        "200":
          description: "List of webhook subscriptions"

    post:
      tags:
        - "Webhooks"
      operationId: "createWebhookSubscription"
      summary: "Create a webhook subscription"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateWebhookRequest"
      responses:
        "201":
          description: "Webhook subscription created"

  /webhooks/{webhookId}:
    delete:
      tags:
        - "Webhooks"
      operationId: "deleteWebhookSubscription"
      summary: "Delete a webhook subscription"
      parameters:
        - name: "webhookId"
          in: "path"
          required: true
          schema:
            type: "string"
      responses:
        "204":
          description: "Webhook subscription deleted"

  /reports/orders:
    get:
      tags:
        - "Reports"
      operationId: "getOrdersReport"
      summary: "Get order analytics report"
      parameters:
        - name: "startDate"
          in: "query"
          required: true
          schema:
            type: "string"
            format: "date"
        - name: "endDate"
          in: "query"
          required: true
          schema:
            type: "string"
            format: "date"
        - name: "granularity"
          in: "query"
          schema:
            type: "string"
            enum: ["day", "week", "month"]
            default: "day"
        - name: "groupBy"
          in: "query"
          schema:
            type: "string"
            enum: ["status", "payment_method", "customer_segment"]
      responses:
        "200":
          description: "Order analytics report"

components:
  schemas:
    Order:
      type: "object"
      description: "Represents a customer order"
      required:
        - id
        - orderNumber
        - status
        - customerId
        - items
        - subtotal
        - total
        - currency
        - createdAt
        - updatedAt
      properties:
        id:
          type: "string"
          description: "Unique order identifier"
          example: "ord_abc123def456ghi789"
          pattern: "^ord_[a-zA-Z0-9]{20,30}$"
        orderNumber:
          type: "string"
          description: "Human-readable order number"
          example: "ORD-2026-0054321"
          pattern: "^ORD-\\d{4}-\\d{7}$"
        status:
          type: "string"
          description: "Current order status"
          enum:
            - "pending"
            - "pending_payment"
            - "processing"
            - "shipped"
            - "delivered"
            - "cancelled"
            - "returned"
            - "refunded"
          example: "shipped"
        customerId:
          type: "string"
          description: "Customer who placed the order"
          example: "cust_abc123"
        customer:
          $ref: "#/components/schemas/Customer"
        items:
          type: "array"
          description: "Order line items"
          items:
            $ref: "#/components/schemas/OrderItem"
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        subtotal:
          type: "integer"
          description: "Subtotal in smallest currency unit (cents)"
          example: 5998
          minimum: 0
        shipping:
          type: "integer"
          description: "Shipping cost in cents"
          example: 500
          minimum: 0
        tax:
          type: "integer"
          description: "Tax amount in cents"
          example: 599
          minimum: 0
        discount:
          type: "integer"
          description: "Discount amount in cents"
          example: 0
          minimum: 0
        total:
          type: "integer"
          description: "Total amount in cents (subtotal + shipping + tax - discount)"
          example: 7097
          minimum: 0
        currency:
          type: "string"
          description: "ISO 4217 currency code"
          example: "USD"
          pattern: "^[A-Z]{3}$"
        paymentMethod:
          type: "string"
          description: "Payment method used"
          enum: ["credit_card", "debit_card", "bank_transfer", "digital_wallet", "crypto"]
          example: "credit_card"
        paymentStatus:
          type: "string"
          description: "Payment status"
          enum: ["pending", "authorized", "captured", "failed", "refunded", "partially_refunded"]
          example: "captured"
        notes:
          type: "string"
          description: "Order notes"
          example: "Leave at front door"
          maxLength: 1000
        metadata:
          type: "object"
          description: "Custom key-value metadata"
          additionalProperties:
            type: "string"
          example:
            source: "web"
            campaign: "spring_sale_2026"
        shipments:
          type: "array"
          description: "Order shipments"
          items:
            $ref: "#/components/schemas/Shipment"
        returns:
          type: "array"
          description: "Order returns"
          items:
            $ref: "#/components/schemas/Return"
        createdAt:
          type: "string"
          description: "ISO 8601 creation timestamp"
          format: "date-time"
          example: "2026-05-27T14:30:00Z"
        updatedAt:
          type: "string"
          description: "ISO 8601 last update timestamp"
          format: "date-time"
          example: "2026-05-27T15:00:00Z"
        _links:
          type: "object"
          description: "HATEOAS links for API navigation"
          properties:
            self:
              $ref: "#/components/schemas/Link"
            items:
              $ref: "#/components/schemas/Link"
            shipments:
              $ref: "#/components/schemas/Link"
            payments:
              $ref: "#/components/schemas/Link"
            cancel:
              $ref: "#/components/schemas/Link"
    OrderItem:
      type: "object"
      description: "A single line item within an order"
      required:
        - id
        - productId
        - productName
        - quantity
        - unitPrice
        - totalPrice
      properties:
        id:
          type: "string"
          description: "Line item identifier"
          example: "item_abc123"
        productId:
          type: "string"
          description: "Product identifier"
          example: "prod_widget_001"
        productName:
          type: "string"
          description: "Product name at time of order"
          example: "Super Widget Black"
        sku:
          type: "string"
          description: "Stock keeping unit"
          example: "WGT-001-BLK"
        variantName:
          type: "string"
          description: "Variant name if applicable"
          example: "Black / Small"
        quantity:
          type: "integer"
          description: "Quantity ordered"
          example: 2
          minimum: 1
          maximum: 999
        unitPrice:
          type: "integer"
          description: "Price per unit in cents"
          example: 2999
          minimum: 0
        totalPrice:
          type: "integer"
          description: "Total line price in cents (quantity * unitPrice)"
          example: 5998
          minimum: 0
        imageUrl:
          type: "string"
          description: "Product image URL"
          format: "uri"
          example: "https://cdn.example.com/products/widget-black-1.jpg"
        product:
          $ref: "#/components/schemas/Product"
    Customer:
      type: "object"
      description: "Customer information"
      properties:
        id:
          type: "string"
          example: "cust_abc123"
        name:
          type: "string"
          example: "Alice Smith"
        email:
          type: "string"
          format: "email"
          example: "alice@example.com"
        phone:
          type: "string"
          example: "+1234567890"
    Address:
      type: "object"
      description: "Physical address"
      required:
        - street
        - city
        - country
      properties:
        street:
          type: "string"
          example: "123 Main St"
          maxLength: 255
        street2:
          type: "string"
          example: "Apt 4B"
          maxLength: 255
        city:
          type: "string"
          example: "Springfield"
          maxLength: 100
        state:
          type: "string"
          example: "IL"
          maxLength: 100
        zipCode:
          type: "string"
          example: "62701"
          maxLength: 20
        country:
          type: "string"
          example: "US"
          pattern: "^[A-Z]{2}$"
    Shipment:
      type: "object"
      description: "Order shipment information"
      properties:
        id:
          type: "string"
          example: "shp_abc123"
        carrier:
          type: "string"
          enum: ["fedex", "ups", "usps", "dhl"]
          example: "fedex"
        trackingNumber:
          type: "string"
          example: "1Z999AA10123456784"
        status:
          type: "string"
          enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"]
          example: "in_transit"
        estimatedDelivery:
          type: "string"
          format: "date"
          example: "2026-06-01"
        deliveredAt:
          type: "string"
          format: "date-time"
        items:
          type: "array"
          items:
            type: "string"
          description: "IDs of items in this shipment"
    Return:
      type: "object"
      description: "Return/refund information"
      properties:
        id:
          type: "string"
          example: "ret_abc123"
        itemId:
          type: "string"
          example: "item_abc123"
        quantity:
          type: "integer"
          example: 1
        reason:
          type: "string"
          enum: ["defective", "wrong_item", "not_as_described", "changed_mind", "other"]
        status:
          type: "string"
          enum: ["requested", "approved", "rejected", "shipped_back", "received", "refunded"]
        refundAmount:
          type: "integer"
          description: "Refund amount in cents"
          example: 2999
        requestedAt:
          type: "string"
          format: "date-time"
        refundedAt:
          type: "string"
          format: "date-time"
    Product:
      type: "object"
      description: "Product information"
      properties:
        id:
          type: "string"
          example: "prod_widget_001"
        name:
          type: "string"
          example: "Super Widget Black"
        imageUrl:
          type: "string"
          format: "uri"
        price:
          type: "integer"
          description: "Current price in cents"
          example: 2999
    TrackingInfo:
      type: "object"
      description: "Shipment tracking information"
      properties:
        carrier:
          type: "string"
        trackingNumber:
          type: "string"
        status:
          type: "string"
        estimatedDelivery:
          type: "string"
          format: "date"
        events:
          type: "array"
          items:
            type: "object"
            properties:
              timestamp:
                type: "string"
                format: "date-time"
              location:
                type: "string"
              description:
                type: "string"
              status:
                type: "string"
    Pagination:
      type: "object"
      description: "Cursor-based pagination information"
      properties:
        cursor:
          type: "string"
          description: "Opaque cursor for the next page"
          example: "eyJpZCI6Im9yZF8xMjMifQ"
          nullable: true
        hasMore:
          type: "boolean"
          description: "Whether there are more results"
          example: true
        limit:
          type: "integer"
          description: "Number of items per page"
          example: 20
    Link:
      type: "object"
      description: "HATEOAS link object"
      properties:
        href:
          type: "string"
          format: "uri"
          description: "Target URL"
        method:
          type: "string"
          description: "HTTP method"
          enum: ["GET", "POST", "PUT", "PATCH", "DELETE"]
        rel:
          type: "string"
          description: "Link relation"
    CreateOrderRequest:
      type: "object"
      description: "Request body for creating a new order"
      required:
        - items
        - shippingAddress
        - billingAddress
      properties:
        customerId:
          type: "string"
          description: "Customer ID (if not provided, creates a guest order)"
          example: "cust_abc123"
        items:
          type: "array"
          description: "Order items"
          minItems: 1
          maxItems: 100
          items:
            type: "object"
            required:
              - productId
              - quantity
            properties:
              productId:
                type: "string"
                description: "Product identifier"
                example: "prod_widget_001"
              variantId:
                type: "string"
                description: "Variant identifier (if applicable)"
                example: "var_001"
              quantity:
                type: "integer"
                description: "Quantity to order"
                minimum: 1
                maximum: 999
                example: 2
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        currency:
          type: "string"
          description: "ISO 4217 currency code (defaults to USD)"
          default: "USD"
          example: "USD"
        notes:
          type: "string"
          description: "Order notes"
          maxLength: 1000
          example: "Leave at front door"
        metadata:
          type: "object"
          description: "Custom metadata"
          additionalProperties:
            type: "string"
    UpdateOrderRequest:
      type: "object"
      description: "Request body for updating an order"
      properties:
        notes:
          type: "string"
          maxLength: 1000
        shippingAddress:
          $ref: "#/components/schemas/Address"
        billingAddress:
          $ref: "#/components/schemas/Address"
        metadata:
          type: "object"
          additionalProperties:
            type: "string"
    AddOrderItemRequest:
      type: "object"
      required:
        - productId
        - quantity
      properties:
        productId:
          type: "string"
        variantId:
          type: "string"
        quantity:
          type: "integer"
          minimum: 1
    CreateShipmentRequest:
      type: "object"
      required:
        - carrier
        - itemIds
      properties:
        carrier:
          type: "string"
          enum: ["fedex", "ups", "usps", "dhl"]
        itemIds:
          type: "array"
          items:
            type: "string"
          minItems: 1
        trackingNumber:
          type: "string"
    CreateWebhookRequest:
      type: "object"
      required:
        - url
        - events
      properties:
        url:
          type: "string"
          format: "uri"
          description: "Webhook endpoint URL"
          example: "https://consumer.example.com/webhooks"
        events:
          type: "array"
          description: "Events to subscribe to"
          items:
            type: "string"
            enum:
              - "order.created"
              - "order.updated"
              - "order.shipped"
              - "order.delivered"
              - "order.cancelled"
              - "order.returned"
              - "payment.completed"
              - "payment.failed"
              - "payment.refunded"
          example:
            - "order.created"
            - "order.shipped"
        description:
          type: "string"
          maxLength: 255
        secret:
          type: "string"
          description: "Webhook signing secret (auto-generated if not provided)"
        enabled:
          type: "boolean"
          default: true
        filter:
          type: "object"
          properties:
            customerId:
              type: "string"
            minTotal:
              type: "integer"
    ErrorResponse:
      type: "object"
      description: "RFC 9457 Problem Details error response"
      required:
        - type
        - title
        - status
        - detail
      properties:
        type:
          type: "string"
          format: "uri"
          description: "URI identifying the error type"
          example: "https://api.example.com/errors/validation-error"
        title:
          type: "string"
          description: "Short human-readable summary"
          example: "Validation Error"
        status:
          type: "integer"
          description: "HTTP status code"
          example: 422
        detail:
          type: "string"
          description: "Human-readable explanation"
          example: "The request body contains invalid fields."
        instance:
          type: "string"
          format: "uri"
          description: "URI identifying the specific error occurrence"
          example: "/api/logs/err-abc123"
        errors:
          type: "array"
          description: "Detailed error information"
          items:
            $ref: "#/components/schemas/ErrorDetail"
    ErrorDetail:
      type: "object"
      properties:
        field:
          type: "string"
          description: "Field that caused the error"
          example: "email"
        message:
          type: "string"
          description: "Error message for this field"
          example: "Must be a valid email address"
        code:
          type: "string"
          description: "Error code for programmatic handling"
          example: "INVALID_EMAIL_FORMAT"

  responses:
    BadRequest:
      description: "Bad request (malformed syntax or invalid parameters)"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/bad-request"
            title: "Bad Request"
            status: 400
            detail: "Invalid query parameter 'sort'. Allowed values: createdAt, updatedAt, total, status"
            instance: "/api/logs/err-bad-request-001"
    Unauthorized:
      description: "Authentication required or token invalid"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/unauthorized"
            title: "Unauthorized"
            status: 401
            detail: "Missing or invalid authentication token"
            instance: "/api/logs/err-auth-001"
    Forbidden:
      description: "Authenticated but not authorized"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/forbidden"
            title: "Forbidden"
            status: 403
            detail: "Insufficient permissions to access this resource"
            instance: "/api/logs/err-authz-001"
    NotFound:
      description: "Resource not found"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/not-found"
            title: "Not Found"
            status: 404
            detail: "Order with ID ord_nonexistent not found"
            instance: "/api/logs/err-404-001"
    ValidationError:
      description: "Validation error (semantic validation failed)"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/validation-error"
            title: "Validation Error"
            status: 422
            detail: "The request body contains invalid fields."
            instance: "/api/logs/err-validation-001"
            errors:
              - field: "items"
                message: "At least one item is required"
                code: "MIN_ITEMS"
              - field: "items[0].productId"
                message: "Product not found: prod_nonexistent"
                code: "PRODUCT_NOT_FOUND"
    Conflict:
      description: "Resource state conflict"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/conflict"
            title: "Conflict"
            status: 409
            detail: "Order cannot be cancelled because it has already been shipped"
            instance: "/api/logs/err-conflict-001"
    TooManyRequests:
      description: "Rate limit exceeded"
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"
          example:
            type: "https://api.example.com/errors/rate-limit-exceeded"
            title: "Too Many Requests"
            status: 429
            detail: "Rate limit exceeded. Retry after 45 seconds."
            instance: "/api/logs/err-ratelimit-001"

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "JWT Bearer token obtained from the authorization server"
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
      description: "Legacy API key authentication (deprecated, use bearer token)"

security:
  - bearerAuth: []
```




## P15: Expanded API Testing Patterns

### API Testing Strategy

A comprehensive API testing strategy covers multiple levels of testing:

```
                    /\
                   /  \
                  /    \
                 / E2E \
                /--------\
               /          \
              / Integration \
             /--------------\
            /                \
           /   Contract       \
          /--------------------\
         /                      \
        /     Component          \
       /--------------------------\
      /                            \
     /          Unit                \
    /--------------------------------\
```

### Unit Testing Specifications

**OpenAPI Spec Validation Tests:**

```javascript
// spec-validation.test.js
const { validate } = require('@apidevtools/swagger-parser');
const fs = require('fs');
const path = require('path');
const spectral = require('@stoplight/spectral-core');
const { Spectral } = require('@stoplight/spectral-core');
const { fetch } = require('@stoplight/spectral-runtime');
const { httpAndFileResolver } = require('@stoplight/spectral-runtime');

describe('OpenAPI Specification Validation', () => {
  let spec;

  beforeAll(async () => {
    const specPath = path.join(__dirname, '..', 'specs', 'orders.yaml');
    spec = await validate(fs.readFileSync(specPath, 'utf8'));
  });

  test('spec is valid OpenAPI 3.1', () => {
    expect(spec.openapi).toMatch(/^3\.\d+\.\d+$/);
  });

  test('info section is complete', () => {
    expect(spec.info).toBeDefined();
    expect(spec.info.title).toBeDefined();
    expect(spec.info.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(spec.info.description).toBeDefined();
  });

  test('all paths have unique operationIds', () => {
    const operationIds = [];
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        if (operation.operationId) {
          expect(operationIds).not.toContain(operation.operationId);
          operationIds.push(operation.operationId);
        }
      });
    });
  });

  test('all paths follow kebab-case', () => {
    Object.keys(spec.paths).forEach(path => {
      expect(path).toMatch(/^\/v\d+\/[a-z0-9-_.{}]+(\/[a-z0-9-_.{}]+)*$/);
    });
  });

  test('all operations have summary and description', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        if (operation.summary) {
          expect(operation.summary.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('all responses have content schemas', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        Object.entries(operation.responses || {}).forEach(([code, response]) => {
          if (code.startsWith('2')) {
            expect(response.content).toBeDefined();
          }
        });
      });
    });
  });

  test('error responses use consistent format', () => {
    Object.values(spec.paths).forEach(path => {
      Object.values(path).forEach(operation => {
        Object.entries(operation.responses || {}).forEach(([code, response]) => {
          if (code.startsWith('4') || code.startsWith('5')) {
            const schema = response.content?.['application/json']?.schema;
            if (schema) {
              const props = schema.properties || schema.allOf?.[0]?.properties || {};
              expect(props.type || props.title).toBeDefined();
              expect(props.title || props.type).toBeDefined();
              expect(props.status || props.detail).toBeDefined();
            }
          }
        });
      });
    });
  });
});
```

**JSON Schema Validation Tests:**

```javascript
// schema-validation.test.js
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  strictTypes: true,
  strictTuples: true,
});
addFormats(ajv);

describe('JSON Schema Validation', () => {
  let schemas;

  beforeAll(() => {
    const specPath = path.join(__dirname, '..', 'specs', 'orders.yaml');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    schemas = spec.components.schemas;
  });

  describe('Order schema', () => {
    const validate = ajv.compile(schemas.Order);

    test('valid order passes validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'shipped',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 5998,
        total: 7097,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      const valid = validate(order);
      expect(valid).toBe(true);
    });

    test('missing required fields fails validation', () => {
      const invalidOrder = { id: 'ord_123' };
      const valid = validate(invalidOrder);
      expect(valid).toBe(false);
      expect(validate.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ params: { missingProperty: 'orderNumber' } }),
        ])
      );
    });

    test('invalid status enum fails validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'invalid_status',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('negative total fails validation', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: -100,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('invalid currency format fails', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'US Dollars',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
      };
      expect(validate(order)).toBe(false);
    });

    test('additional properties are not allowed', () => {
      const order = {
        id: 'ord_abc123def456ghi789',
        orderNumber: 'ORD-2026-0054321',
        status: 'pending',
        customerId: 'cust_abc123',
        items: [],
        subtotal: 0,
        total: 0,
        currency: 'USD',
        createdAt: '2026-05-27T14:30:00Z',
        updatedAt: '2026-05-27T15:00:00Z',
        extraField: 'should not be here',
      };
      expect(validate(order)).toBe(false);
    });
  });

  describe('CreateOrderRequest schema', () => {
    const validate = ajv.compile(schemas.CreateOrderRequest);

    test('valid create request', () => {
      const request = {
        customerId: 'cust_abc123',
        items: [
          { productId: 'prod_widget_001', quantity: 2 },
        ],
        shippingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'US',
        },
        billingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          country: 'US',
        },
      };
      expect(validate(request)).toBe(true);
    });

    test('empty items fails validation', () => {
      const request = {
        items: [],
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('missing shipping address fails', () => {
      const request = {
        items: [{ productId: 'prod_1', quantity: 1 }],
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('quantity must be positive', () => {
      const request = {
        items: [{ productId: 'prod_1', quantity: 0 }],
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });

    test('too many items fails validation', () => {
      const items = Array.from({ length: 101 }, (_, i) => ({
        productId: `prod_${i}`,
        quantity: 1,
      }));
      const request = {
        items,
        shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      };
      expect(validate(request)).toBe(false);
    });
  });

  describe('Address schema', () => {
    const validate = ajv.compile(schemas.Address);

    test('valid US address', () => {
      const address = {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      };
      expect(validate(address)).toBe(true);
    });

    test('missing street fails', () => {
      expect(validate({ city: 'Springfield', country: 'US' })).toBe(false);
    });

    test('invalid country code fails', () => {
      expect(validate({
        street: '123 Main St',
        city: 'Springfield',
        country: 'USA',
      })).toBe(false);
    });

    test('street too long fails', () => {
      expect(validate({
        street: 'A'.repeat(256),
        city: 'Springfield',
        country: 'US',
      })).toBe(false);
    });
  });

  describe('Pagination schema', () => {
    const validate = ajv.compile(schemas.Pagination);

    test('valid pagination with more results', () => {
      expect(validate({
        cursor: 'eyJpZCI6Im9yZF8xMjMifQ',
        hasMore: true,
        limit: 20,
      })).toBe(true);
    });

    test('valid pagination at end', () => {
      expect(validate({
        cursor: null,
        hasMore: false,
        limit: 20,
      })).toBe(true);
    });

    test('hasMore must be boolean', () => {
      expect(validate({ cursor: null, hasMore: 'true', limit: 20 })).toBe(false);
    });
  });
});
```

### Integration Testing

```javascript
// orders-api.integration.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Orders API Integration Tests', () => {
  let authToken;

  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /v2/orders', () => {
    test('creates a new order successfully', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', '550e8400-e29b-41d4-a716-446655440000')
        .send({
          customerId: 'cust_abc123',
          items: [
            { productId: 'prod_widget_001', variantId: 'var_001', quantity: 2 },
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'US',
          },
          billingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            country: 'US',
          },
          notes: 'Leave at front door',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toMatch(/^ord_/);
      expect(response.body.data.orderNumber).toMatch(/^ORD-\d{4}-\d{7}$/);
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.total).toBeGreaterThan(0);
      expect(response.headers.location).toMatch(/\/orders\/ord_/);
    });

    test('returns 422 for invalid product', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId: 'prod_nonexistent', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.type).toBeDefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].code).toBe('PRODUCT_NOT_FOUND');
    });

    test('returns 422 for empty items', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].field).toBe('items');
    });

    test('returns 401 without auth token', async () => {
      const response = await request(app)
        .post('/v2/orders')
        .send({
          items: [{ productId: 'prod_1', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(response.status).toBe(401);
    });

    test('returns 429 on rate limit exceeded', async () => {
      const promises = Array.from({ length: 1100 }, (_, i) =>
        request(app)
          .post('/v2/orders')
          .set('Authorization', `Bearer ${authToken}`)
          .set('Idempotency-Key', `key-${i}`)
          .send({
            items: [{ productId: 'prod_1', quantity: 1 }],
            shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
            billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          })
      );

      const responses = await Promise.all(promises);
      const rateLimited = responses.filter(r => r.status === 429);
      expect(rateLimited.length).toBeGreaterThan(0);
    });

    test('idempotency returns same result for same key', async () => {
      const idempotencyKey = '550e8400-e29b-41d4-a716-446655440001';

      const firstResponse = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      const secondResponse = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      expect(firstResponse.status).toBe(201);
      expect(secondResponse.status).toBe(201);
      expect(secondResponse.body.data.id).toBe(firstResponse.body.data.id);
    });

    test('idempotency key with different body fails', async () => {
      const idempotencyKey = '550e8400-e29b-41d4-a716-446655440002';

      await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 1 }],
          shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
        });

      const response = await request(app)
        .post('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Idempotency-Key', idempotencyKey)
        .send({
          items: [{ productId: 'prod_widget_001', quantity: 5 }],
          shippingAddress: { street: '456 Oak Ave', city: 'Chicago', country: 'US' },
          billingAddress: { street: '456 Oak Ave', city: 'Chicago', country: 'US' },
        });

      expect(response.status).toBe(422);
      expect(response.body.errors[0].code).toBe('IDEMPOTENCY_KEY_REUSED');
    });
  });

  describe('GET /v2/orders', () => {
    test('returns paginated orders', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta.pagination).toBeDefined();
      expect(response.body.meta.pagination.limit).toBe(10);
    });

    test('filters by status', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'shipped' });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(order.status).toBe('shipped');
      });
    });

    test('filters by date range', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          'createdAt[gte]': '2026-01-01T00:00:00Z',
          'createdAt[lte]': '2026-12-31T23:59:59Z',
        });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(new Date(order.createdAt)).toBeDefined();
      });
    });

    test('sorts by total descending', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sort: '-total', limit: 100 });

      expect(response.status).toBe(200);
      for (let i = 1; i < response.body.data.length; i++) {
        expect(response.body.data[i].total).toBeLessThanOrEqual(response.body.data[i - 1].total);
      }
    });

    test('returns sparse fields', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ fields: 'id,orderNumber,status', limit: 5 });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(Object.keys(order)).toEqual(['id', 'orderNumber', 'status']);
      });
    });

    test('includes related resources', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ include: 'items', limit: 5 });

      expect(response.status).toBe(200);
      response.body.data.forEach(order => {
        expect(order.items).toBeDefined();
      });
    });

    test('default page size is 20', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.body.meta.pagination.limit).toBe(20);
    });

    test('max page size is 100', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 200 });

      expect(response.body.meta.pagination.limit).toBe(100);
    });

    test('includes rate limit headers', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });

    test('includes request ID', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.headers['request-id']).toBeDefined();
    });

    test('returns 400 for invalid sort field', async () => {
      const response = await request(app)
        .get('/v2/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sort: 'invalidField' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /v2/orders/:orderId', () => {
    test('returns order by ID', async () => {
      const response = await request(app)
        .get('/v2/orders/ord_abc123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe('ord_abc123');
      expect(response.body.data._links).toBeDefined();
      expect(response.body.data._links.self).toBeDefined();
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.type).toMatch(/not-found/);
    });
  });

  describe('PATCH /v2/orders/:orderId', () => {
    test('updates order notes', async () => {
      const response = await request(app)
        .patch('/v2/orders/ord_abc123')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: 'Updated notes' });

      expect(response.status).toBe(200);
      expect(response.body.data.notes).toBe('Updated notes');
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .patch('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notes: 'test' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /v2/orders/:orderId', () => {
    test('cancels pending order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_pending_123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('cancelled');
    });

    test('returns 409 for shipped order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_shipped_123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(409);
      expect(response.body.type).toMatch(/conflict/);
    });

    test('returns 404 for non-existent order', async () => {
      const response = await request(app)
        .delete('/v2/orders/ord_nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});

// Helper function
async function getAuthToken() {
  const response = await request(app)
    .post('/auth/token')
    .send({
      grant_type: 'client_credentials',
      client_id: 'test_client',
      client_secret: 'test_secret',
      scope: 'orders:read orders:write',
    });
  return response.body.access_token;
}
```

### Contract Testing (Pact)

```javascript
// orders-api.pact.test.js
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const { like, term, eachLike, iso8601DateTime } = MatchersV3;

const provider = new PactV3({
  consumer: 'FrontendApp',
  provider: 'OrdersAPI',
  pactfileWriteMode: 'merge',
});

describe('Orders API Pact Tests', () => {
  describe('List Orders', () => {
    test('returns paginated orders list', async () => {
      provider
        .given('orders exist with various statuses')
        .uponReceiving('a request for the first page of orders')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          query: { limit: '20' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'RateLimit-Limit': '1000',
            'RateLimit-Remaining': '999',
            'Request-Id': like('req-abc123'),
          },
          body: {
            data: eachLike({
              id: like('ord_abc123'),
              orderNumber: like('ORD-2026-001234'),
              status: term({ generate: 'shipped', matcher: '^(pending|processing|shipped|delivered|cancelled)$' }),
              customerId: like('cust_abc123'),
              total: like(7097),
              currency: term({ generate: 'USD', matcher: '^[A-Z]{3}$' }),
              createdAt: iso8601DateTime(),
              updatedAt: iso8601DateTime(),
            }),
            meta: {
              requestId: like('req-abc123'),
              timestamp: iso8601DateTime(),
              pagination: {
                cursor: like('eyJpZCI6Im9yZF8xMjMifQ'),
                hasMore: like(true),
                limit: 20,
              },
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders?limit=20`, {
          headers: { Authorization: 'Bearer valid_token' },
        });
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data[0].id).toBeDefined();
        expect(body.data[0].orderNumber).toBeDefined();
        expect(body.meta.pagination.limit).toBe(20);
      });
    });

    test('returns filtered orders by status', async () => {
      provider
        .given('orders with status "shipped" exist')
        .uponReceiving('a request for shipped orders')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          query: { status: 'shipped', limit: '20' },
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data: eachLike({
              id: like('ord_abc123'),
              status: 'shipped',
            }),
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
              pagination: {
                cursor: null,
                hasMore: false,
                limit: 20,
              },
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders?status=shipped&limit=20`, {
          headers: { Authorization: 'Bearer valid_token' },
        });
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Create Order', () => {
    test('creates order successfully', async () => {
      provider
        .given('a valid product exists')
        .uponReceiving('a request to create a new order')
        .withRequest({
          method: 'POST',
          path: '/v2/orders',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: {
            customerId: like('cust_abc123'),
            items: eachLike({
              productId: like('prod_widget_001'),
              quantity: like(2),
            }),
            shippingAddress: {
              street: like('123 Main St'),
              city: like('Springfield'),
              country: term({ generate: 'US', matcher: '^[A-Z]{2}$' }),
            },
            billingAddress: {
              street: like('123 Main St'),
              city: like('Springfield'),
              country: 'US',
            },
          },
        })
        .willRespondWith({
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            Location: like('/v2/orders/ord_new_123'),
          },
          body: {
            data: {
              id: like('ord_new_123'),
              orderNumber: like('ORD-2026-0054321'),
              status: 'pending',
              customerId: like('cust_abc123'),
              items: eachLike({
                id: like('item_001'),
                productId: like('prod_widget_001'),
                quantity: like(2),
                unitPrice: like(2999),
                totalPrice: like(5998),
              }),
              subtotal: like(5998),
              total: like(7097),
              currency: 'USD',
              createdAt: iso8601DateTime(),
              updatedAt: iso8601DateTime(),
            },
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: JSON.stringify({
            customerId: 'cust_abc123',
            items: [{ productId: 'prod_widget_001', quantity: 2 }],
            shippingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
            billingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
          }),
        });

        expect(response.status).toBe(201);
        const body = await response.json();
        expect(body.data.id).toBeDefined();
        expect(body.data.status).toBe('pending');
      });
    });

    test('returns validation error for invalid request', async () => {
      provider
        .given('API is operational')
        .uponReceiving('a request with empty items array')
        .withRequest({
          method: 'POST',
          path: '/v2/orders',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: {
            items: [],
            shippingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
            billingAddress: {
              street: '123 Main St',
              city: 'Springfield',
              country: 'US',
            },
          },
        })
        .willRespondWith({
          status: 422,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/validation-error'),
            title: like('Validation Error'),
            status: 422,
            detail: like('The request body contains invalid fields.'),
            errors: eachLike({
              field: like('items'),
              message: like('At least one item is required'),
              code: like('MIN_ITEMS'),
            }),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid_token',
          },
          body: JSON.stringify({
            items: [],
            shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
            billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
          }),
        });

        expect(response.status).toBe(422);
      });
    });
  });

  describe('Cancel Order', () => {
    test('cancels pending order', async () => {
      provider
        .given('an order exists with status "pending"')
        .uponReceiving('a request to cancel a pending order')
        .withRequest({
          method: 'DELETE',
          path: '/v2/orders/ord_pending_123',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: {
            data: {
              id: like('ord_pending_123'),
              status: 'cancelled',
            },
            meta: {
              requestId: like('req-123'),
              timestamp: iso8601DateTime(),
            },
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders/ord_pending_123`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.data.status).toBe('cancelled');
      });
    });

    test('refuses to cancel shipped order', async () => {
      provider
        .given('an order exists with status "shipped"')
        .uponReceiving('a request to cancel a shipped order')
        .withRequest({
          method: 'DELETE',
          path: '/v2/orders/ord_shipped_123',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 409,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/conflict'),
            title: like('Conflict'),
            status: 409,
            detail: like('Order cannot be cancelled because it has already been shipped'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders/ord_shipped_123`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(409);
      });
    });
  });

  describe('Error Handling', () => {
    test('returns 401 for missing auth', async () => {
      provider
        .given('API requires authentication')
        .uponReceiving('a request without auth token')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
        })
        .willRespondWith({
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          body: {
            type: like('https://api.example.com/errors/unauthorized'),
            title: like('Unauthorized'),
            status: 401,
            detail: like('Missing or invalid authentication token'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`);
        expect(response.status).toBe(401);
      });
    });

    test('returns 429 when rate limited', async () => {
      provider
        .given('rate limit is exceeded for the client')
        .uponReceiving('a request when rate limited')
        .withRequest({
          method: 'GET',
          path: '/v2/orders',
          headers: { Authorization: 'Bearer valid_token' },
        })
        .willRespondWith({
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '45',
            'RateLimit-Limit': '1000',
            'RateLimit-Remaining': '0',
          },
          body: {
            type: like('https://api.example.com/errors/rate-limit-exceeded'),
            title: like('Too Many Requests'),
            status: 429,
            detail: like('Rate limit exceeded. Retry after 45 seconds.'),
          },
        });

      await provider.executeTest(async (mockServer) => {
        const response = await fetch(`${mockServer.url}/v2/orders`, {
          headers: { Authorization: 'Bearer valid_token' },
        });

        expect(response.status).toBe(429);
        expect(response.headers.get('Retry-After')).toBeDefined();
      });
    });
  });
});
```

### Performance Testing

```javascript
// k6/load-test.js
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const orderCreationTime = new Trend('order_creation_time');
const orderListTime = new Trend('order_list_time');
const errorRate = new Rate('error_rate');
const totalOrders = new Counter('total_orders_created');

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 VUs
    { duration: '5m', target: 100 },  // Ramp to 100 VUs
    { duration: '5m', target: 200 },  // Ramp to 200 VUs
    { duration: '10m', target: 200 }, // Stay at 200 VUs
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],
    order_creation_time: ['p(95)<1000'],
    order_list_time: ['p(95)<300'],
    error_rate: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3000/v2';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'test_token';

export default function () {
  group('Order List Endpoint', () => {
    const responses = http.batch([
      ['GET', `${BASE_URL}/orders?limit=20&status=shipped`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
      ['GET', `${BASE_URL}/orders?limit=50&sort=-total`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
      ['GET', `${BASE_URL}/orders?limit=10&include=items`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }],
    ]);

    responses.forEach(res => {
      orderListTime.add(res.timings.duration);
      errorRate.add(res.status >= 400);
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has data array': (r) => JSON.parse(r.body).data !== undefined,
        'has pagination': (r) => JSON.parse(r.body).meta?.pagination !== undefined,
      });
    });
  });

  group('Order Creation Endpoint', () => {
    const payload = JSON.stringify({
      customerId: `cust_${__VU}_${__ITER}`,
      items: [
        { productId: 'prod_widget_001', variantId: 'var_001', quantity: Math.floor(Math.random() * 5) + 1 },
        { productId: 'prod_gadget_002', quantity: Math.floor(Math.random() * 3) + 1 },
      ],
      shippingAddress: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      },
      billingAddress: {
        street: `${Math.floor(Math.random() * 9999)} Main St`,
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'US',
      },
    });

    const res = http.post(`${BASE_URL}/orders`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Idempotency-Key': `${__VU}-${__ITER}-${Date.now()}`,
      },
    });

    orderCreationTime.add(res.timings.duration);
    totalOrders.add(1);
    errorRate.add(res.status >= 400);

    check(res, {
      'status is 201': (r) => r.status === 201,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has order id': (r) => JSON.parse(r.body).data?.id !== undefined,
      'has location header': (r) => r.headers.Location !== undefined,
    });
  });

  group('Error Handling', () => {
    // Test validation error
    const invalidPayload = JSON.stringify({
      items: [],
      shippingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
      billingAddress: { street: '123 Main St', city: 'Springfield', country: 'US' },
    });

    const validationRes = http.post(`${BASE_URL}/orders`, invalidPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    check(validationRes, {
      'validation returns 422': (r) => r.status === 422,
      'has error details': (r) => JSON.parse(r.body).errors !== undefined,
      'error in RFC 9457 format': (r) => {
        const body = JSON.parse(r.body);
        return body.type && body.title && body.status && body.detail;
      },
    });

    // Test 404
    const notFoundRes = http.get(`${BASE_URL}/orders/ord_nonexistent`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });

    check(notFoundRes, {
      'not found returns 404': (r) => r.status === 404,
      'error type matches': (r) => JSON.parse(r.body).type.includes('not-found'),
    });
  });

  sleep(1);
}

export function teardown(data) {
  console.log(`Total orders created: ${totalOrders.name}`);
  console.log(`Error rate: ${errorRate.name}`);
}
```




## P16: API Performance & Caching

### Caching Strategies

**HTTP Caching Headers:**

```yaml
# Cache-Control directives
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=300, stale-if-error=86400

# Components of Cache-Control:
# public/proxy-replicatable
# private (browser only)
# no-cache (must revalidate)
# no-store (never cache)
# max-age=<seconds>
# s-maxage=<seconds> (shared cache max age)
# stale-while-revalidate=<seconds> (serve stale while revalidating)
# stale-if-error=<seconds> (serve stale if origin error)
# must-revalidate (strict revalidation)
# proxy-revalidate (shared caches must revalidate)
```

**ETag Generation Strategies:**

```javascript
// Strong ETag (content hash)
function generateStrongETag(content) {
  const crypto = require('crypto');
  return `"${crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex')}"`;
}

// Weak ETag (for semantically equivalent content)
function generateWeakETag(content) {
  return `W/"${content.updatedAt.getTime()}-${content.version}"`;
}

// Conditional request handling
app.get('/api/v2/orders/:id', async (req, res) => {
  const order = await getOrder(req.params.id);
  const etag = generateStrongETag(order);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'private, max-age=60, stale-while-revalidate=30');
  res.json({ data: order });
});
```

**CDN Caching Strategy:**

```yaml
# CDN cache rules
cache_rules:
  - pattern: "/api/v2/products/*"
    ttl: 3600           # 1 hour
    stale_while_revalidate: 300
    surrogate_key: "products"

  - pattern: "/api/v2/categories"
    ttl: 86400          # 24 hours
    stale_while_revalidate: 3600
    surrogate_key: "categories"

  - pattern: "/api/v2/orders/*"
    ttl: 0              # Never cache (private data)
    bypass: true

  - pattern: "/api/v2/static/*"
    ttl: 31536000       # 1 year
    immutable: true
```

**GraphQL Response Caching:**

```javascript
// Apollo Server response caching
const { ApolloServer } = require('@apollo/server');
const responseCachePlugin = require('@apollo/server-plugin-response-cache');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    responseCachePlugin({
      sessionId: (requestContext) => {
        // Group cache by user or anonymous
        return requestContext.context?.auth?.userId || 'anonymous';
      },
      shouldReadFromCache: (requestContext) => {
        // Only cache GET requests (not subscriptions)
        return requestContext.request.http?.method === 'GET';
      },
      extraCacheKeyData: (requestContext) => {
        return {
          locale: requestContext.context?.locale || 'en',
        };
      },
    }),
  ],
});

// Schema directives for cache hints
type Product @cacheControl(maxAge: 300) {
  id: ID!
  name: String!
  price: Int!
  description: String @cacheControl(maxAge: 600)
}

type Query {
  products: [Product!]! @cacheControl(maxAge: 60)
  orders: [Order!]! @cacheControl(maxAge: 0, scope: PRIVATE)
}
```

**Redis Caching Layer:**

```javascript
// Redis cache manager
const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

class CacheManager {
  constructor(redis) {
    this.redis = redis;
    this.defaultTTL = 300; // 5 minutes
  }

  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    // Try cache first
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss - fetch data
    const data = await fetchFn();

    // Store in cache (don't wait for completion)
    this.redis.setex(key, ttl, JSON.stringify(data)).catch(err => {
      console.error('Cache set error:', err);
    });

    return data;
  }

  async invalidate(pattern) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  async invalidateByTag(tag) {
    // Tag-based invalidation
    const keys = await this.redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
      await this.redis.del(`tag:${tag}`);
    }
  }

  async setWithTag(key, data, tags, ttl = this.defaultTTL) {
    await this.redis.setex(key, ttl, JSON.stringify(data));
    for (const tag of tags) {
      await this.redis.sadd(`tag:${tag}`, key);
      await this.redis.expire(`tag:${tag}`, ttl + 3600);
    }
  }

  async getCacheHealth() {
    try {
      await this.redis.ping();
      const info = await this.redis.info('stats');
      return { status: 'healthy', info };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

const cacheManager = new CacheManager(redis);

// Usage in endpoints
app.get('/api/v2/products/:id', async (req, res) => {
  const data = await cacheManager.getOrSet(
    `product:${req.params.id}`,
    () => getProduct(req.params.id),
    3600 // 1 hour TTL
  );

  if (!data) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
  }

  res.json({ data });
});

// Invalidating cache on write
app.post('/api/v2/products', async (req, res) => {
  const product = await createProduct(req.body);

  // Invalidate related caches
  await cacheManager.invalidate('products:list*');
  await cacheManager.invalidateByTag('category:' + product.categoryId);

  res.status(201).json({ data: product });
});
```

### Compression

```javascript
// Dynamic compression with content negotiation
const compression = require('compression');

app.use(compression({
  // Compression levels: 1 (fast) to 9 (best)
  level: 6,
  // Only compress responses >= 1KB
  threshold: 1024,
  // Skip compression for already compressed responses
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    // Skip for SSE
    if (req.headers.accept === 'text/event-stream') {
      return false;
    }
    return compression.filter(req, res);
  },
  // Use brotli if available
  brotli: {
    enabled: true,
    quality: 4,
  },
}));

// Or manual compression for specific endpoints
app.get('/api/v2/reports/export', async (req, res) => {
  const zlib = require('zlib');
  const { pipeline } = require('stream');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="orders-export.json"');

  const acceptEncoding = req.headers['accept-encoding'] || '';
  let compressionStream;

  if (acceptEncoding.includes('br')) {
    res.setHeader('Content-Encoding', 'br');
    compressionStream = zlib.createBrotliCompress();
  } else if (acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    compressionStream = zlib.createGzip();
  } else if (acceptEncoding.includes('deflate')) {
    res.setHeader('Content-Encoding', 'deflate');
    compressionStream = zlib.createDeflate();
  } else {
    compressionStream = new PassThrough();
  }

  const orderStream = await createOrderExportStream();
  pipeline(orderStream, compressionStream, res, (err) => {
    if (err) console.error('Export error:', err);
  });
});
```

### Connection Pooling

```javascript
// HTTP connection pooling
const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 20,
  scheduling: 'lifo',
  timeout: 60000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  maxFreeSockets: 20,
  scheduling: 'lifo',
  timeout: 60000,
  rejectUnauthorized: true,
});

// Database connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500,
  allowExitOnIdle: true,
});

// Monitor pool health
setInterval(async () => {
  const { totalCount, idleCount, waitingCount } = pool;
  console.log(`DB Pool - Total: ${totalCount}, Idle: ${idleCount}, Waiting: ${waitingCount}`);

  if (waitingCount > 5) {
    console.warn('High pool wait count, consider increasing pool size');
  }
}, 30000);
```

### Response Optimization

```javascript
// Response size optimization middleware
function responseOptimizer(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // Remove null fields
    if (req.query.stripNulls !== 'false') {
      body = removeNullFields(body);
    }

    // Apply sparse fields
    if (req.query.fields) {
      body = applySparseFields(body, req.query.fields);
    }

    // Apply compression
    if (shouldCompress(req, body)) {
      res.setHeader('Content-Encoding', 'gzip');
      // ... compression logic
    }

    return originalJson(body);
  };

  next();
}

function removeNullFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeNullFields);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, removeNullFields(v)])
    );
  }
  return obj;
}

function applySparseFields(data, fieldsString) {
  const fields = fieldsString.split(',').map(f => f.trim());
  if (Array.isArray(data)) {
    return data.map(item => applySparseFieldsToObject(item, fields));
  }
  if (data && typeof data === 'object') {
    return applySparseFieldsToObject(data, fields);
  }
  return data;
}

function applySparseFieldsToObject(obj, fields) {
  const result = {};
  fields.forEach(field => {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
  });
  return result;
}
```

### API Gateway Caching

```yaml
# Kong API Gateway caching configuration
plugins:
  - name: proxy-cache
    config:
      content_type:
        - "application/json"
      cache_ttl: 300
      strategy: "memory"
      memory:
        dictionary_name: "api_cache"
        max_size_mb: 100
      response_code:
        - 200
        - 301
        - 404
      request_method:
        - "GET"
        - "HEAD"
      vary_by_query_params:
        - "fields"
        - "limit"

  - name: rate-limiting
    config:
      second: 100
      minute: 1000
      hour: 50000
      policy: "local"
      fault_tolerant: true
      hide_client_headers: false
      redis:
        host: "redis"
        port: 6379
        database: 0
        timeout: 2000

  - name: request-size-limiting
    config:
      allowed_payload_size: 10  # MB

  - name: correlation-id
    config:
      header_name: "X-Request-Id"
      generator: "uuid"
      echo_downstream: true
```

### Advanced Pagination Patterns

```javascript
// Keyset pagination with composite cursors
function encodeCursor(values) {
  const cursor = values.map(v => String(v)).join('|');
  return Buffer.from(cursor).toString('base64url');
}

function decodeCursor(cursor) {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
  return decoded.split('|');
}

app.get('/api/v2/orders', async (req, res) => {
  const { cursor, limit = 20, sort = '-createdAt' } = req.query;
  const parsedLimit = Math.min(parseInt(limit, 10), 100);

  // Parse sort
  const sortFields = sort.split(',').map(f => {
    const dir = f.startsWith('-') ? 'desc' : 'asc';
    const field = f.replace(/^[-+]/, '');
    return { field, direction: dir };
  });

  // Build query
  let query = 'SELECT * FROM orders';
  const params = [];
  const conditions = [];

  // Add cursor condition for keyset pagination
  if (cursor) {
    const cursorValues = decodeCursor(cursor);
    const sortConditions = sortFields.map((sf, i) => {
      const value = cursorValues[i];
      const operator = sf.direction === 'desc' ? '<' : '>';
      return `${sf.field} ${operator} $${params.length + 1}`;
    });
    conditions.push(`(${sortConditions.join(' AND ')})`);
    cursorValues.forEach(v => params.push(v));
  }

  // Apply other filters
  if (req.query.status) {
    const statuses = req.query.status.split(',');
    const placeholders = statuses.map((_, i) => `$${params.length + i + 1}`);
    conditions.push(`status IN (${placeholders.join(',')})`);
    params.push(...statuses);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Add sort
  query += ' ORDER BY ' + sortFields.map(sf => `${sf.field} ${sf.direction}`).join(', ');

  // Add limit (fetch one extra to determine if more)
  query += ` LIMIT $${params.length + 1}`;
  params.push(parsedLimit + 1);

  const results = await pool.query(query, params);
  const hasMore = results.rows.length > parsedLimit;
  if (hasMore) results.rows.pop(); // Remove extra row

  // Generate next cursor
  let nextCursor = null;
  if (hasMore && results.rows.length > 0) {
    const lastRow = results.rows[results.rows.length - 1];
    const cursorValues = sortFields.map(sf => lastRow[sf.field]);
    nextCursor = encodeCursor(cursorValues);
  }

  res.json({
    data: results.rows,
    meta: {
      pagination: {
        cursor: nextCursor,
        hasMore,
        limit: parsedLimit,
      },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    },
  });
});
```

### Performance Monitoring

```javascript
// API performance monitoring middleware
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestSize = new prometheus.Histogram({
  name: 'http_request_size_bytes',
  help: 'HTTP request size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
});

const httpResponseSize = new prometheus.Histogram({
  name: 'http_response_size_bytes',
  help: 'HTTP response size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 10000, 100000, 1000000],
});

const activeRequests = new prometheus.Gauge({
  name: 'http_requests_active',
  help: 'Number of active HTTP requests',
});

const cacheHitRatio = new prometheus.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits vs misses',
  labelNames: ['cache', 'result'],
});

// Middleware
function performanceMiddleware(req, res, next) {
  const start = Date.now();
  activeRequests.inc();

  // Track request size
  const reqSize = parseInt(req.headers['content-length']) || 0;
  httpRequestSize.observe({ method: req.method, route: req.route?.path || 'unknown' }, reqSize);

  // Record response size on finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route?.path || 'unknown',
      status_code: res.statusCode,
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);

    const resSize = parseInt(res.getHeader('content-length')) || 0;
    httpResponseSize.observe({ method: req.method, route: req.route?.path || 'unknown' }, resSize);

    activeRequests.dec();
  });

  next();
}

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabaseHealth(),
      redis: await checkRedisHealth(),
      memory: checkMemoryUsage(),
    },
  };

  const isHealthy = Object.values(health.checks).every(c => c.status === 'healthy');
  res.status(isHealthy ? 200 : 503).json(health);
});

async function checkDatabaseHealth() {
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    return { status: 'healthy', latency: Date.now() - start };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkRedisHealth() {
  try {
    const start = Date.now();
    await redis.ping();
    return { status: 'healthy', latency: Date.now() - start };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

function checkMemoryUsage() {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);

  return {
    status: heapUsedMB < heapTotalMB * 0.9 ? 'healthy' : 'warning',
    heapUsedMB,
    heapTotalMB,
    rssMB,
    externalMB: Math.round(usage.external / 1024 / 1024),
  };
}

// Performance alerts
function checkPerformanceAlerts() {
  setInterval(async () => {
    const metrics = await prometheus.register.getSingleMetricAsString('http_request_duration_seconds');
    // Check p99 latency
    // Check error rate
    // Check active requests
    // Send alerts if thresholds exceeded
  }, 60000);
}
```

### Performance Budget

```yaml
# Performance budget for API endpoints
performance_budget:
  global:
    p50_latency_ms: 100
    p95_latency_ms: 500
    p99_latency_ms: 2000
    error_rate_percent: 1
    throughput_rps: 1000

  endpoints:
    /v2/orders:
      GET:
        p50: 50
        p95: 200
        p99: 500
      POST:
        p50: 200
        p95: 500
        p99: 1000

    /v2/orders/{id}:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/orders/{id}/items:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/products:
      GET:
        p50: 30
        p95: 100
        p99: 300

    /v2/products/{id}:
      GET:
        p50: 20
        p95: 50
        p99: 200
```



