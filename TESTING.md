# Testing Guide

This document provides instructions and scripts to easily test all functionality of the Social Media Feed Application.

## Prerequisites

Make sure your Docker containers are running:
```bash
docker-compose up -d
```

## Manual Testing Steps

### 1. API Endpoints Testing

#### Test All Posts
```bash
curl http://localhost:8001/posts
```

#### Test Paginated Posts
```bash
curl "http://localhost:8001/posts?_page=1&_limit=5"
```

#### Test Posts by User
```bash
curl "http://localhost:8001/posts?userId=1"
```

#### Test Specific Post
```bash
curl http://localhost:8001/posts/1
```

#### Test Users
```bash
curl http://localhost:8001/users
```

#### Test Specific User
```bash
curl http://localhost:8001/users/1
```

#### Test Comments
```bash
curl http://localhost:8001/comments
```

#### Test Create Post
```bash
curl -X POST http://localhost:8001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "imageUrl": "https://picsum.photos/600/400?random=999",
    "caption": "Test post created via API!",
    "likes": 0,
    "isLiked": false
  }'
```

#### Test Update Post (Like/Unlike)
```bash
curl -X PATCH http://localhost:8001/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"likes": 16, "isLiked": true}'
```

### 2. Application Feature Testing

#### Frontend Testing (Manual)
1. Open browser to http://localhost:3000
2. Verify the feed loads with posts
3. Test infinite scroll by scrolling to bottom
4. Test liking/unliking posts
5. Verify optimistic updates work (UI updates immediately)
6. Test opening and closing the Create Post modal
7. Test image upload functionality in modal
8. Test creating a new post
9. Navigate to a user profile by clicking their name/avatar
10. Verify profile page loads with user's posts

#### Automated Test Script

Create a test script to verify all functionality:

```bash
#!/bin/bash
# test-app.sh

echo "Starting Social Media Feed Application Tests..."

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Test API endpoints
echo "Testing API endpoints..."

echo "✓ Testing GET /posts..."
if curl -sf http://localhost:8001/posts > /dev/null; then
  echo "  SUCCESS: Posts endpoint reachable"
else
  echo "  ERROR: Posts endpoint not reachable"
fi

echo "✓ Testing GET /users..."
if curl -sf http://localhost:8001/users > /dev/null; then
  echo "  SUCCESS: Users endpoint reachable"
else
  echo "  ERROR: Users endpoint not reachable"
fi

echo "✓ Testing GET /comments..."
if curl -sf http://localhost:8001/comments > /dev/null; then
  echo "  SUCCESS: Comments endpoint reachable"
else
  echo "  ERROR: Comments endpoint not reachable"
fi

# Test creating a post
echo "✓ Testing POST /posts..."
NEW_POST_ID=$(curl -s -X POST http://localhost:8001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "imageUrl": "https://picsum.photos/600/400?random=test",
    "caption": "Test post for automated testing",
    "likes": 0,
    "isLiked": false
  }' | grep -o '"id":"[^"]*"' | cut -d '"' -f 4)

if [ ! -z "$NEW_POST_ID" ]; then
  echo "  SUCCESS: Created post with ID $NEW_POST_ID"
else
  echo "  ERROR: Failed to create post"
fi

# Test updating a post
echo "✓ Testing PATCH /posts..."
if curl -sf -X PATCH http://localhost:8001/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"likes": 999}' > /dev/null; then
  echo "  SUCCESS: Updated post successfully"
else
  echo "  ERROR: Failed to update post"
fi

# Test frontend accessibility
echo "✓ Testing frontend availability..."
if curl -sf http://localhost:3000 > /dev/null; then
  echo "  SUCCESS: Frontend is accessible"
else
  echo "  ERROR: Frontend is not accessible"
fi

echo ""
echo "Testing completed!"
echo "Remember to verify UI functionality manually:"
echo "- Infinite scroll works"
echo "- Optimistic updates work"
echo "- Image compression works"
echo "- Error boundaries work"
echo "- Post creation works"
```

### 3. Quick Test Commands

#### Simple Health Checks
```bash
# Check if API is running
curl -I http://localhost:8001/posts

# Check if frontend is running
curl -I http://localhost:3000

# Check Docker container status
docker ps
```

#### Load Testing (Basic)
```bash
# Test concurrent API requests
for i in {1..5}; do
  curl -s http://localhost:8001/posts > /dev/null &
done
wait
echo "Completed 5 concurrent requests"
```

### 4. Browser-Based Testing

1. **Open http://localhost:3000** in your browser
2. **Verify initial feed loads** - Should see posts immediately
3. **Test infinite scroll** - Scroll to bottom, verify more posts load
4. **Test skeleton loaders** - Observe loading states during API calls
5. **Test like functionality** - Click hearts, verify counts update immediately (optimistic update)
6. **Test error boundaries** - If you want to test, temporarily change a post's data to cause an error
7. **Test image compression** - Open browser console and verify `window.compressImage` exists
8. **Test post creation** - Click "Create Post", upload image, submit
9. **Test navigation** - Click user names to navigate to profile pages
10. **Test profile pages** - Verify user-specific posts load

### 5. Docker Container Verification

```bash
# Check container logs
docker logs virtualized-infinite-feed-api-1
docker logs virtualized-infinite-feed-app-1

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### 6. Troubleshooting Common Issues

#### If API isn't responding:
```bash
# Restart just the API container
docker-compose restart virtualized-infinite-feed-api-1
```

#### If frontend isn't responding:
```bash
# Restart just the app container
docker-compose restart virtualized-infinite-feed-app-1
```

#### If both aren't responding:
```bash
# Bring down and up the entire stack
docker-compose down && docker-compose up -d
```

### 7. Cleanup After Testing

```bash
# Stop containers when done testing
docker-compose down

# Optionally, remove containers and networks
docker-compose down -v
```

---

**Note**: For the most accurate testing, make sure to clear browser cache between tests and verify both the visual interface and API responses work as expected.