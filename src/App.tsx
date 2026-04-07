import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AuthProvider } from "@/context/AuthContext";
import { type ProjectSummary } from "@/types/project";
import ProjectDetail from "@/pages/ProjectDetail";
import Eskizler from "@/pages/Eskizler";
import { LoginPage } from "@/pages/LoginPage";
import { AdminPanel } from "@/pages/AdminPanel";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

// Main App Content
function AppContent() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ProjectSummary, "id">),
        })) as ProjectSummary[];
        setProjects(projectsData);
      } catch (error) {
        console.error("Projeler Firestore'dan alınırken hata oluştu:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle scroll navigation for smooth scrolling
  useEffect(() => {
    if (location.pathname !== "/") return;

    const target = (location.state as { scrollTo?: string } | null)?.scrollTo || location.hash.substring(1);
    if (!target) return;

    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const timeout = window.setTimeout(scrollToTarget, 80);
    return () => window.clearTimeout(timeout);
  }, [location]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navigation />
            <main>
              <HeroSection />
              <AboutSection />
              <ProjectsSection projects={projects} loading={loadingProjects} />
              <TeamSection />
              <ContactSection />
            </main>
            <Footer />
          </>
        }
      />
      <Route path="/project/:projectId" element={<ProjectDetail />} />
      <Route path="/eskizler" element={<Eskizler />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-black">
          <AppContent />
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
