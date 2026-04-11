import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TriagePage from "./pages/TriagePage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LanguageSelect from "./pages/LanguageSelect";

import ProtectedRoute from "./components/Protectedroute.jsx";

/* OPTIONAL (future ready) */
import Profile from "./pages/profile.jsx";
import About from "./pages/About";
import LandingPage from "./pages/LandingPage.jsx";
import NewPatientCard from "./pages/NewPatientCard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />

        {/* 🌍 LANGUAGE SELECT (AFTER LOGIN) */}
        <Route path="/language" element={<LanguageSelect />} />

        <Route path="/" element={<LandingPage />} />

        {/* 🏠 PROTECTED ROUTES */}
        <Route path="/homepage" element={<HomePage />} />

        <Route path="/triage" element={
          <ProtectedRoute>
            <TriagePage />
          </ProtectedRoute>
        } />

        <Route path="/result" element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* 🔥 NEW ROUTES (Navbar pages) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* <Route path="/about" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } /> */}


        <Route path="/about" element={<About />} />

        <Route path="/newpatient" element={<NewPatientCard />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 🚨 FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}