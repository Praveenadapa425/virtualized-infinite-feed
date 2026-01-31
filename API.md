# API Documentation

This document describes the REST API endpoints used by the Social Media Feed Application. The API is powered by json-server and provides endpoints for posts, users, and comments.

## Base URL

The API base URL can be configured via the `VITE_API_BASE_URL` environment variable. By default:

- Development: `http://localhost:8001`
- Docker: `http://api:8000` (internal) or `http://localhost:8001` (external)

## Authentication

This API does not require authentication for development purposes. In a production environment, authentication headers would be required for write operations.

## Endpoints

### Posts

#### `GET /posts`
Get all posts with optional pagination.

**Query Parameters:**
- `_page` (optional): Page number for pagination
- `_limit` (optional): Number of posts per page
- `userId` (optional): Filter posts by user ID

**Response:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "imageUrl": "string",
    "caption": "string",
    "likes": "number",
    "isLiked": "boolean"
  }
]
```

**Example:**
- `GET /posts` - Get all posts
- `GET /posts?_page=1&_limit=10` - Get first 10 posts
- `GET /posts?userId=1` - Get posts by user ID

#### `GET /posts/:id`
Get a specific post by ID.

**Parameters:**
- `id` (path): Post ID

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "imageUrl": "string",
  "caption": "string",
  "likes": "number",
  "isLiked": "boolean"
}
```

#### `POST /posts`
Create a new post.

**Request Body:**
```json
{
  "userId": "string",
  "imageUrl": "string",
  "caption": "string",
  "likes": "number",
  "isLiked": "boolean"
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "imageUrl": "string",
  "caption": "string",
  "likes": "number",
  "isLiked": "boolean"
}
```

#### `PATCH /posts/:id`
Update a specific post (used for like/unlike functionality).

**Parameters:**
- `id` (path): Post ID

**Request Body:**
```json
{
  "likes": "number",
  "isLiked": "boolean"
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "imageUrl": "string",
  "caption": "string",
  "likes": "number",
  "isLiked": "boolean"
}
```

### Users

#### `GET /users`
Get all users.

**Response:**
```json
[
  {
    "id": "string",
    "username": "string",
    "avatarUrl": "string"
  }
]
```

#### `GET /users/:id`
Get a specific user by ID.

**Parameters:**
- `id` (path): User ID

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "avatarUrl": "string"
}
```

### Comments

#### `GET /comments`
Get all comments.

**Response:**
```json
[
  {
    "id": "string",
    "postId": "string" | "number",
    "userId": "string" | "number",
    "text": "string"
  }
]
```

## Usage in Application

The application uses SWR for data fetching and caching. Key usage patterns:

### Fetching Posts
```typescript
const { data, error } = useSWR('/posts', fetcher);
```

### Creating Posts
```typescript
await apiService.createPost({
  userId: '1',
  imageUrl: 'https://example.com/image.jpg',
  caption: 'My new post',
  likes: 0,
  isLiked: false
});
```

### Updating Posts (Like/Unlike)
```typescript
await apiService.likePost(postId, currentLikes, isCurrentlyLiked);
```

## Error Handling

The API follows standard HTTP status codes:
- `200` - Success for GET, PUT, PATCH requests
- `201` - Created for successful POST requests
- `400` - Bad Request for malformed requests
- `404` - Not Found for non-existent resources
- `500` - Internal Server Error for server issues

## Environment Configuration

The application uses the following environment variable:

**`.env.example`:**
```
VITE_API_BASE_URL=http://localhost:8001
```

This allows the application to connect to different API endpoints based on the environment (development, staging, production).

## Docker Integration

When running in Docker:
- The frontend container connects to the API using `http://api:8000`
- External access to the API is available at `http://localhost:8001`
- Health checks ensure both services are ready before allowing connections