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
import Footer from "./home/Footer";
import LegalForm from "./Dashboard/LegalForm";
import LegalDocuments from './components/LegalDocuments';
import LegalAid from "./Dashboard/LegalAid";
import LegalAidDetail from "./Dashboard/LegalAidDetail";
import Legalscenarios from "./pages/Legalscenarios";
import Legalbasics from "./pages/Legalbasics";
import Caseexplorer from "./pages/Caseexplorer";
import Proplans from "./pages/Proplans";
import MockInterviewForm from "./AIConsultant/MockInterviewForm";
import InterviewScreen from "./AIConsultant/InterviewScreen";
import Questions from "./Community/Questions";
import ViewQuestion from "./Community/ViewQuestion";
import Allpodcast from "./AIPodcast/ALLPodcast";
const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
          <GoogleTranslate />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/legalscenarios" element={<Legalscenarios />} />
            <Route path="/legalbasics" element={<Legalbasics />} />
            <Route path="/caseexplorer" element={<Caseexplorer />} />
            <Route path="/proplans" element={<Proplans />} />
            <Route path="/community" element={<Questions />} />
            <Route
              path="/login"
              element={
                <NonAuthenticatedRoute>
                  <UserLogin />
                </NonAuthenticatedRoute>
              }
            />
            <Route
              path="/podcast"
              element={
                <AuthenticatedRoute>
                  <Allpodcast />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/question/:id"
              element={
                <AuthenticatedRoute>
                  <ViewQuestion />
                </AuthenticatedRoute>
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
            <Route path="/legalaid" element={
              <AuthenticatedRoute>
                <LegalForm />
              </AuthenticatedRoute>
            } />
            <Route path="/aiconsultant" element={
              <AuthenticatedRoute>
                <MockInterviewForm />
              </AuthenticatedRoute>
            } />
            <Route
              path="/interviewscreen"
              element={
                <AuthenticatedRoute>
                  <InterviewScreen />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/legal-documents"
              element={
                <AuthenticatedRoute>
                  <LegalDocuments />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/mylegalaids"
              element={
                <AuthenticatedRoute>
                  <LegalAid />
                </AuthenticatedRoute>
              }
            />

            <Route
              path="/mylegalaids/:id"
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