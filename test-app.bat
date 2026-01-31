@echo off
echo Starting Social Media Feed Application Tests...

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Test API endpoints
echo Testing API endpoints...

echo Testing GET /posts...
curl -sf http://localhost:8001/posts > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Posts endpoint reachable
) else (
  echo   ERROR: Posts endpoint not reachable
)

echo Testing GET /users...
curl -sf http://localhost:8001/users > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Users endpoint reachable
) else (
  echo   ERROR: Users endpoint not reachable
)

echo Testing GET /comments...
curl -sf http://localhost:8001/comments > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Comments endpoint reachable
) else (
  echo   ERROR: Comments endpoint not reachable
)

REM Test creating a post
echo Testing POST /posts...
curl -X POST http://localhost:8001/posts ^
  -H "Content-Type: application/json" ^
  -d "{^^^^\"userId^^^^\": ^^^^\"1^^^^\", ^^^^\"imageUrl^^^^\": ^^^^\"https://picsum.photos/600/400?random=test^^^^\", ^^^^\"caption^^^^\": ^^^^\"Test post for automated testing^^^^\", ^^^^\"likes^^^^\": 0, ^^^^\"isLiked^^^^\": false}" > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Created post successfully
) else (
  echo   ERROR: Failed to create post
)

REM Test updating a post
echo Testing PATCH /posts...
curl -X PATCH http://localhost:8001/posts/1 ^
  -H "Content-Type: application/json" ^
  -d "{^^^^\"likes^^^^\": 999}" > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Updated post successfully
) else (
  echo   ERROR: Failed to update post
)

REM Test frontend accessibility
echo Testing frontend availability...
curl -sf http://localhost:3000 > nul
if %errorlevel% == 0 (
  echo   SUCCESS: Frontend is accessible
) else (
  echo   ERROR: Frontend is not accessible
)

echo.
echo Testing completed!
echo Remember to verify UI functionality manually:
echo - Infinite scroll works
echo - Optimistic updates work
echo - Image compression works
echo - Error boundaries work
echo - Post creation works