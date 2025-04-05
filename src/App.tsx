
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import Articles from '@/pages/Articles';
import Article from '@/pages/Article';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import { AuthProvider } from './contexts/AuthContext';

// Create a new query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* New routes for expertise areas that redirect to filtered articles */}
            <Route path="/expertise/:area" element={<Articles />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
