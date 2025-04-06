
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { TextEditProvider } from "@/contexts/TextEditContext";
import { initializeDatabase } from "@/utils/initDatabase";
import React, { useEffect } from "react";
import { he } from "date-fns/locale";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Article = lazy(() => import("./pages/Article"));
const Articles = lazy(() => import("./pages/Articles"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./pages/Admin"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-law-light">
    <div className="text-center">
      <Loader className="h-10 w-10 text-law-navy animate-spin mx-auto mb-4" />
      <p className="text-law-gray font-medium">טוען...</p>
    </div>
  </div>
);

// Create a new query client with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  // Initialize database on app startup
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AdminProvider>
              <TextEditProvider>
                <TooltipProvider>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/article/:id" element={<Article />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="/404" element={<NotFound />} />
                      {/* Redirect unknown paths to 404 */}
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </Suspense>
                  <Toaster />
                  <Sonner />
                </TooltipProvider>
              </TextEditProvider>
            </AdminProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
