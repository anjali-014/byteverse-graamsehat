// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import HomePage from "./pages/HomePage";
// import TriagePage from "./pages/TriagePage";
// import ResultPage from "./pages/ResultPage";
// import DashboardPage from "./pages/DashboardPage";

// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import LanguageSelect from "./pages/LanguageSelect";

// import ProtectedRoute from "./components/Protectedroute.jsx";

// /* OPTIONAL (future ready) */
// import Profile from "./pages/profile.jsx";
// import About from "./pages/About";
// import LandingPage from "./pages/LandingPage.jsx";
// import NewPatientCard from "./pages/NewPatientCard";
// import MyPatientsPage from "./pages/MyPatientsPage";
// import SchedulePage from "./pages/SchedulePage";
// import ImmunisationPage from "./pages/ImmunisationPage";
// import HealthRecordsPage from "./pages/HealthRecordsPage";
// import ReportsPage from "./pages/ReportsPage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* 🔐 AUTH ROUTES */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/register" element={<Signup />} />

//         {/* 🌍 LANGUAGE SELECT (AFTER LOGIN) */}
//         <Route path="/language" element={<LanguageSelect />} />

//         <Route path="/" element={<LandingPage />} />

//         {/* 🏠 PROTECTED ROUTES */}
//         <Route path="/homepage" element={<HomePage />} />

//         <Route path="/triage" element={
//           <ProtectedRoute>
//             <TriagePage />
//           </ProtectedRoute>
//         } />

//         <Route path="/result" element={
//           <ProtectedRoute>
//             <ResultPage />
//           </ProtectedRoute>
//         } />

//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         } />

//         {/* 🔥 NEW ROUTES (Navbar pages) */}
//         <Route path="/profile" element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         } />

//         {/* <Route path="/about" element={
//           <ProtectedRoute>
//             <About />
//           </ProtectedRoute>
//         } /> */}

//         <Route path="/visitschedule" element={<VisitSchedule/>} />

//         <Route path="/immunisation" element={<ImmunisationPage />} />

//         <Route path="/healthrecords" element={<HealthRecordsPage />} />

//         <Route path="/reports" element={<ReportsPage />} />

//         <Route path="/newpatient" element={<NewPatientCard />} />

//         <Route path="/mypatients" element={
          
//             <MyPatientsPage />
          
//         }/>

//         <Route path="/dashboard" element={<DashboardPage />} />

//         {/* 🚨 FALLBACK ROUTE */}
//         <Route path="*" element={<Navigate to="/login" />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }






import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TriagePage from "./pages/TriagePage";
import ResultPage from "./pages/ResultPage";
import DashboardPage from "./pages/DashboardPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import LanguageSelect from "./pages/LanguageSelect";
import ProtectedRoute from "./components/Protectedroute.jsx";
import Profile from "./pages/profile.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import NewPatientCard from "./pages/NewPatientCard";
import MyPatientsPage from "./pages/MyPatientsPage";
import VisitSchedule from "./pages/VisitSchedule";   // ← was missing!
import ImmunisationPage from "./pages/ImmunisationPage";
import HealthRecordsPage from "./pages/HealthRecordsPage";
import ReportsPage from "./pages/ReportsPage";
import AIDiagnosis from "./pages/AIDiagnosis.jsx"; 

// Add these imports
import SettingsPage from "./pages/SettingsPage";
import HelpPage     from "./pages/HelpPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/signup"   element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/"         element={<LandingPage />} />
        <Route path="/homepage" element={<HomePage />} />

        {/* <Route path="/triage" element={<ProtectedRoute><TriagePage /></ProtectedRoute>} /> */}
        <Route path="/result" element={<ResultPage />} />
        <Route path="/aidiagnosis" element={<AIDiagnosis />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/visitschedule"  element={<VisitSchedule />} />
        <Route path="/immunisation"   element={<ImmunisationPage />} />
        <Route path="/healthrecords"  element={<HealthRecordsPage />} />
        <Route path="/reports"        element={<ReportsPage />} />
        <Route path="/newpatient"     element={<NewPatientCard />} />
        <Route path="/mypatients"     element={<MyPatientsPage />} />

        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help"     element={<HelpPage />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}