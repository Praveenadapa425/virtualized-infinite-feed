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
if curl -sf -X POST http://localhost:8001/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1",
    "imageUrl": "https://picsum.photos/600/400?random=test",
    "caption": "Test post for automated testing",
    "likes": 0,
    "isLiked": false
  }' > /dev/null; then
  echo "  SUCCESS: Created post successfully"
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