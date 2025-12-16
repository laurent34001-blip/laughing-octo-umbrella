import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateAnnonce from "./pages/CreateAnnonce";
import EditAnnonce from "./pages/EditAnnonce";
import AnnonceDetail from "./pages/AnnonceDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />   {/* ⬅ Navbar ajoutée ici */}

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
        <Footer />   {/* ⬅ Footer ajoutée ici */}
      </BrowserRouter>
    </AuthProvider>
  );
}
