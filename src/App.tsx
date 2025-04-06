
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { DraggableInfoProvider } from './contexts/DraggableInfoContext';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { TextEditProvider } from '@/contexts/TextEditContext';

// Use lazy loading for non-critical paths
import HomePage from './pages/HomePage';
const Articles = lazy(() => import('./pages/Articles'));
const Article = lazy(() => import('./pages/Article'));
const Auth = lazy(() => import('./pages/Auth'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Profile = lazy(() => import('./pages/Profile'));

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-law-navy border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light" storageKey="lawsite-theme">
            <TextEditProvider>
              <DraggableInfoProvider>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/articles" element={
                    <Suspense fallback={<PageLoader />}>
                      <Articles />
                    </Suspense>
                  } />
                  <Route path="/articles/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <Article />
                    </Suspense>
                  } />
                  <Route path="/article/:id" element={
                    <Suspense fallback={<PageLoader />}>
                      <Article />
                    </Suspense>
                  } />
                  <Route path="/auth" element={
                    <Suspense fallback={<PageLoader />}>
                      <Auth />
                    </Suspense>
                  } />
                  <Route path="/profile" element={
                    <Suspense fallback={<PageLoader />}>
                      <Profile />
                    </Suspense>
                  } />
                  <Route path="/admin/*" element={
                    <Suspense fallback={<PageLoader />}>
                      <Admin />
                    </Suspense>
                  } />
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFound />
                    </Suspense>
                  } />
                </Routes>
                <SonnerToaster />
                <Toaster />
              </DraggableInfoProvider>
            </TextEditProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
