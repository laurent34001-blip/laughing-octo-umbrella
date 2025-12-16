import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateAnnonce from "./pages/CreateAnnonce";
import EditAnnonce from "./pages/EditAnnonce";
import AnnonceDetail from "./pages/AnnonceDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import SplashScreen from "./components/SplashScreen";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creer-annonce"
          element={
            <ProtectedRoute>
              <CreateAnnonce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/annonce/:id/edit"
          element={
            <ProtectedRoute>
              <EditAnnonce />
            </ProtectedRoute>
          }
        />
        <Route path="/annonce/:id" element={<AnnonceDetail />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        {showSplash && <SplashScreen onLoadingComplete={handleSplashComplete} />}
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
