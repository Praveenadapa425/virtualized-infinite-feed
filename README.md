# Social Media Feed Application

A high-performance React-based social media feed application with infinite scroll, UI virtualization, and modern web development practices.

## Features

### Core Functionality
- **UI Virtualization**: Uses `react-window` to render only visible posts, improving performance for large datasets
- **Infinite Scroll**: Automatically loads more posts as the user scrolls to the bottom
- **Optimistic Updates**: Like button updates immediately without waiting for API response
- **Image Upload**: Create new posts with image upload and preview functionality
- **Client-side Image Compression**: Compresses images before upload to reduce bandwidth
- **Skeleton Loaders**: Shows loading placeholders while content is being fetched
- **Error Boundaries**: Handles individual post rendering errors gracefully
- **Toast Notifications**: Provides user feedback for actions like post creation
- **Client-side Routing**: React Router for navigation between feed and profile pages

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for global UI state
- **Data Fetching**: SWR for caching and automatic revalidation
- **Drag & Drop**: react-dropzone for image uploads
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Docker Containerization**: Production-ready deployment setup

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Virtualization**: react-window
- **Data Fetching**: SWR (stale-while-revalidate)
- **State Management**: Zustand
- **File Upload**: react-dropzone
- **Image Compression**: browser-image-compression
- **Notifications**: react-hot-toast
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Containerization**: Docker and Docker Compose
- **Mock API**: JSON Server

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (for production deployment)
- Git

## Getting Started

### Development Mode

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd virtualized-infinite-feed
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Start the mock API server (in a separate terminal):**
   ```bash
   npx json-server --watch api/db.json --port 8001
   ```

6. **Open your browser:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8001

### Production Mode (Docker)

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:3000
   - API: http://localhost:8001

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── UserAvatar.tsx
│   ├── feed/             # Feed-related components
│   │   ├── Feed.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostSkeleton.tsx
│   │   └── LikeButton.tsx
│   ├── modals/           # Modal components
│   │   └── CreatePostModal.tsx
│   └── profile/          # Profile page components
│       └── Profile.tsx
├── hooks/                # Custom React hooks
│   └── useImageCompression.ts
├── services/             # API service layer
│   └── api.ts
├── store/                # Global state management
│   ├── modalStore.ts
│   └── userStore.ts
├── types/                # TypeScript interfaces
│   └── index.ts
├── utils/                # Utility functions
│   └── imageCompression.ts
├── App.tsx               # Main application component
└── main.tsx              # Entry point
```

## API Endpoints

The mock API provides the following endpoints:

- `GET /posts` - Get all posts with pagination
- `GET /posts?_page=1&_limit=10` - Get paginated posts
- `GET /posts?userId=1` - Get posts by user ID
- `GET /posts/:id` - Get a specific post
- `PATCH /posts/:id` - Update a post (like/unlike)
- `POST /posts` - Create a new post
- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
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

### Error Boundaries
Each post is wrapped in an ErrorBoundary component that catches rendering errors and displays a fallback UI without crashing the entire application.

## Testing

### Verify Image Compression
1. Open the browser console
2. Check that `window.compressImage` is defined
3. Try uploading an image through the create post modal

### Test Core Features
1. **Infinite Scroll**: Scroll to the bottom of the feed to load more posts
2. **Like Functionality**: Click the like button on any post to see optimistic updates
3. **Create Post**: Click "Create Post" and upload an image
4. **Profile Navigation**: Click on any user's name to view their profile
5. **Error Handling**: The application should gracefully handle API errors

## Docker Configuration

The application is fully containerized with Docker Compose:
- `app` service: React frontend served by Nginx with health checks
- `api` service: JSON Server mock API with health checks
- Services start in the correct order with dependency management
- Environment variables configured for production deployment

## Environment Variables

Create a `.env` file with the following variables:

```bash
VITE_API_BASE_URL=http://localhost:8001  # API base URL
```

## Performance Optimizations

- **Virtualization**: Only renders visible posts
- **Code Splitting**: Profile page loaded on demand
- **Memoization**: React.memo for pure components
- **SWR Caching**: Automatic caching and revalidation
- **Lazy Loading**: Images load as they enter viewport
- **Bundle Optimization**: Vite's built-in optimizations

## Development Guidelines

### Component Design
- Break down UI into small, reusable components
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Follow React best practices

### State Management
- Use SWR for server state
- Use Zustand for client UI state
- Keep global state minimal
- Prefer local state when possible

### Performance
- Profile components with React DevTools
- Monitor bundle size
- Optimize images and assets
- Use appropriate loading states

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure the JSON server is running on port 8001
   - Check the `VITE_API_BASE_URL` environment variable

2. **Images Not Loading**
   - Verify CORS settings for image URLs
   - Check browser console for network errors

3. **Docker Build Failures**
   - Ensure Docker daemon is running
   - Check available disk space
   - Verify Docker Compose version

### Debugging Tips

1. Enable React DevTools for component inspection
2. Use browser network tab to monitor API requests
3. Check browser console for TypeScript errors
4. Use SWR DevTools for data fetching insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.