import Landing from "./pages/Landing";
import HrDashboard from "./pages/HrDashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import CandidateJobs from "./pages/CandidateJobs";
import JobDetails from "./pages/JobDetails";
import Assessments from "./pages/Assessments";
import AssessmentBuilder from "./pages/AssessmentBuilder";
import AssessmentPreview from "./pages/AssessmentPreview";
import AssessmentResults from "./pages/AssessmentResults";
import CandidateProfile from "./pages/CandidateProfile";
import HrLayout from "./components/layout/HrLayout";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/jobs" element={<CandidateJobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/hr-login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<HrLayout />}>
        <Route index element={<HrDashboard />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="assessments" element={<Assessments />} />
      </Route>
      <Route
        path="/assessments/builder/:jobId"
        element={<AssessmentBuilder />}
      />
      <Route
        path="/assessments/preview/:jobId"
        element={<AssessmentPreview />}
      />
      <Route
        path="/assessments/results/:jobId"
        element={<AssessmentResults />}
      />
      <Route path="/candidates/:id" element={<CandidateProfile />} />
    </Routes>
  );
}

export default App;
