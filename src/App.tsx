
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import HomePage from './pages/HomePage';
import Articles from './pages/Articles';
import Article from './pages/Article';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { DraggableInfoProvider } from './contexts/DraggableInfoContext';
import { Toaster as Sonner } from 'sonner';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { TextEditProvider } from '@/contexts/TextEditContext';
import Profile from '@/pages/Profile';

const queryClient = new QueryClient();

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
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:id" element={<Article />} />
                  <Route path="/article/:id" element={<Article />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Sonner />
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
