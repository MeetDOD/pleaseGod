import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./home/Navbar";
import Dashboard from "./Dashboard/Dashboard";
import { Toaster } from "sonner";
import UserLogin from "./auth/UserLogin";
import AuthenticatedRoute from "./routes/AuthenticatedRoute";
import NonAuthenticatedRoute from "./routes/NonAuthenticatedRoute";
import GoogleTranslate from "./services/GoogleTranslator";
import Loader from "./services/Loader";
import NotFound from "./pages/NotFound";
import AddDetailForm from "./home/AddDetailForm";
import Footer from "./home/Footer";
import LegalForm from "./components/legalForm/LegalForm";
import LegalDocuments from './components/LegalDocuments';
import LegalAid from "./Dashboard/LegalAid";
import LegalAidDetail from "./Dashboard/LegalAidDetail";
const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
          
          <AddDetailForm />
          <GoogleTranslate />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <NonAuthenticatedRoute>
                  <UserLogin />
                </NonAuthenticatedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
            />
            <Route path="/*" element={<NotFound />} />
            <Route path="/legal-form" element={<LegalForm />} />
            <Route
              path="/legal-documents"
              element={
                <AuthenticatedRoute>
                  <LegalDocuments />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/legal-assistant"
              element={
                <AuthenticatedRoute>
                  <LegalAid />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/legal-aid/:id"
              element={
                <AuthenticatedRoute>
                  <LegalAidDetail />
                </AuthenticatedRoute> 
              }
            />

          </Routes>
          <Toaster richColors />
        </div>
        <Footer />
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
