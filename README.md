<<<<<<< HEAD
# Virtualized Infinite Feed

A high-performance React-based social media feed application with infinite scroll and UI virtualization.

## Features

- **UI Virtualization**: Uses `react-window` to render only visible posts, improving performance for large datasets
- **Infinite Scroll**: Automatically loads more posts as the user scrolls to the bottom
- **Optimistic Updates**: Like button updates immediately without waiting for API response
- **Image Upload**: Create new posts with image upload and preview functionality
- **Client-side Image Compression**: Compresses images before upload to reduce bandwidth
- **Skeleton Loaders**: Shows loading placeholders while content is being fetched
- **Error Boundaries**: Handles individual post rendering errors gracefully
- **Toast Notifications**: Provides user feedback for actions like post creation

## Technologies Used

- React 18 with TypeScript
- Vite for build tooling
- react-window for virtualization
- SWR for data fetching and caching
- Zustand for state management
- react-dropzone for file uploads
- browser-image-compression for client-side image compression
- react-hot-toast for notifications
- Tailwind CSS for styling
- Docker for containerization

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose

## Getting Started

### Development Mode

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Start the mock API server (in a separate terminal):
   ```bash
   npx json-server --watch api/db.json --port 8000
   ```

### Production Mode (Docker)

1. Build and start all services:
   ```bash
   docker-compose up --build
   ```

2. The application will be available at:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000

## Project Structure

```
src/
├── components/          # React components
│   ├── Feed.tsx        # Main feed component with virtualization
│   ├── PostCard.tsx    # Individual post card
│   ├── LikeButton.tsx  # Like button with optimistic update
│   ├── CreatePostModal.tsx  # Post creation modal
│   └── PostSkeleton.tsx     # Loading skeleton
├── store/              # Zustand stores
│   └── modalStore.ts   # Modal state management
├── utils/              # Utility functions
│   └── imageCompression.ts  # Image compression utilities
├── App.tsx             # Main application component
└── main.tsx            # Entry point
```

## API Endpoints

The mock API provides the following endpoints:

- `GET /posts` - Get all posts with pagination
- `GET /posts?_page=1&_limit=10` - Get paginated posts
- `PATCH /posts/:id` - Update a post (like/unlike)
- `POST /posts` - Create a new post
- `GET /users` - Get all users
- `GET /comments` - Get all comments

## Key Features Implementation

### Virtualization
The feed uses `react-window`'s `FixedSizeList` and `InfiniteLoader` to render only the posts that are currently visible in the viewport, significantly improving performance when dealing with large datasets.

### Infinite Scroll
The `useSWRInfinite` hook handles pagination automatically, fetching new pages of data as the user scrolls near the bottom of the feed.

### Optimistic Updates
When a user likes a post, the UI updates immediately while the PATCH request is sent to the server in the background. If the request fails, the UI reverts to its previous state.

### Image Compression
Client-side image compression is implemented using `browser-image-compression` to reduce file sizes before upload. A global function `window.compressImage` is available for verification.

## Testing

To verify the image compression functionality:
1. Open the browser console
2. Check that `window.compressImage` is defined
3. Try uploading an image through the create post modal

## Docker Configuration

The application is fully containerized with Docker Compose:
- `app` service: React frontend served by Nginx
- `api` service: JSON Server mock API
- Health checks ensure services are running correctly
- The frontend waits for the API to be healthy before starting

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the API (defaults to http://localhost:8000)
=======
"# virtualized-infinite-feed" 
>>>>>>> b5c0dff1d114b4e72f47f7769eb31918d8acdd67
