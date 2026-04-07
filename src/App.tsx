import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AuthProvider } from "@/context/AuthContext";
import { type ProjectSummary } from "@/types/project";
import { TeamService, type TeamMember } from "@/services/teamService";
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

// Main App Content
function AppContent() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const location = useLocation();
  // Track if both data sources are ready
  const dataReadyRef = useRef(false);

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

    const fetchTeam = async () => {
      setLoadingTeam(true);
      try {
        const teamData = await TeamService.getAllMembers();
        setTeam(teamData);
      } catch (error) {
        console.error("Ekip verileri alınırken hata:", error);
        // Fallback hardcoded data
        setTeam([
          { name: "Nuri ÖZTÜRK", role: "Genel Müdür / Mimar", email: "nuri@onn.com.tr" },
          { name: "Onur ÖZTÜRK", role: "Genel Koordinatör / İç Mimar", email: "onur@onn.com.tr" },
          { name: "Ergül Şit", role: "Proje Müdürü / İnş. Müh.", email: "ergul@onn.com.tr" },
          { name: "Hamza Çerkez", role: "Şantiye Şefi / İnş. Müh.", email: "hamza@onn.com.tr" },
          { name: "Betül Mandalı", role: "Mimari Proje / Mimar", email: "betul@onn.com.tr" },
          { name: "Fatma Güler", role: "Muhasebe", email: "muhasebe@onn.com.tr" },
        ]);
      } finally {
        setLoadingTeam(false);
      }
    };

    fetchProjects();
    fetchTeam();
  }, []);

  // Mark data as ready when both are loaded
  useEffect(() => {
    if (!loadingProjects && !loadingTeam) {
      dataReadyRef.current = true;
    }
  }, [loadingProjects, loadingTeam]);

  // Handle scroll navigation — waits for data before scrolling
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo || location.hash.substring(1);
    if (!target) return;

    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    // If data is already ready (navigating back), scroll quickly
    // If not, wait for data to load
    if (dataReadyRef.current) {
      const timeout = window.setTimeout(scrollToTarget, 80);
      return () => window.clearTimeout(timeout);
    } else {
      // Wait for data to be ready, then scroll
      const interval = window.setInterval(() => {
        if (dataReadyRef.current) {
          clearInterval(interval);
          scrollToTarget();
        }
      }, 100);
      // Safety timeout — scroll anyway after 2s
      const fallback = window.setTimeout(() => {
        clearInterval(interval);
        scrollToTarget();
      }, 2000);
      return () => {
        clearInterval(interval);
        clearTimeout(fallback);
      };
    }
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
              <TeamSection teamData={team} loading={loadingTeam} />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
