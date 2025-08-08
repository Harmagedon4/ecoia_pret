import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

// Pages
import Index from "./pages/Index";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Accueil from "./pages/Accueil";
import FaireDemande from "./pages/FaireDemande";
import ListeDemande from "./pages/ListeDemande";
import MethodePaiement from "./pages/MethodePaiement";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileView from "./pages/ProfileView";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

// Components
import Preloader from "./components/Preloader";
import { AppLayout } from "./components/Layout/AppLayout";

const queryClient = new QueryClient();

// Theme Context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Auth Context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: (userData: any) => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Notification Context
const NotificationContext = createContext({
  notifications: [],
  addNotification: (notification: any) => {},
  removeNotification: (id: string) => {},
  markAsRead: (id: string) => {},
});

export const useNotifications = () => useContext(NotificationContext);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Initialize app
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Check for saved theme
    const savedTheme = localStorage.getItem("ecoia-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Check for saved auth
    const savedAuth = localStorage.getItem("ecoia-auth");
    if (savedAuth) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedAuth));
    }

    return () => clearTimeout(timer);
  }, []);

  // Theme functions
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("ecoia-theme", newTheme ? "dark" : "light");
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Auth functions
  const login = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("ecoia-auth", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("ecoia-auth");
  };

  // Notification functions
  const addNotification = (notification: any) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
          <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            <NotificationContext.Provider value={{ 
              notifications, 
              addNotification, 
              removeNotification, 
              markAsRead 
            }}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/connexion" element={<Connexion />} />
                  <Route path="/inscription" element={<Inscription />} />
                  
                  {/* Protected routes with layout */}
                  <Route path="/accueil" element={<AppLayout><Accueil /></AppLayout>} />
                  <Route path="/faire-demande" element={<AppLayout><FaireDemande /></AppLayout>} />
                  <Route path="/liste-demande" element={<AppLayout><ListeDemande /></AppLayout>} />
                  <Route path="/methode-paiement" element={<AppLayout><MethodePaiement /></AppLayout>} />
                  <Route path="/profile-edit" element={<AppLayout><ProfileEdit /></AppLayout>} />
                  <Route path="/profile-view" element={<AppLayout><ProfileView /></AppLayout>} />
                  <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </NotificationContext.Provider>
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;