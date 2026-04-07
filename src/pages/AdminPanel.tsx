import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SketchService, type Sketch } from '@/services/sketchService';
import { AdminService, type Project, type Message } from '@/services/adminService';
import { TeamService, type TeamMember } from '@/services/teamService';
import { useAuth } from '@/context/AuthContext';
import { AdminHeader } from '@/components/AdminHeader';
import { TabNavigation } from '@/components/admin/TabNavigation';
import { ProjectTab } from '@/components/admin/ProjectTab';
import { SketchTab } from '@/components/admin/SketchTab';
import { MessagesTab } from '@/components/admin/MessagesTab';
import { TeamTab } from '@/components/admin/TeamTab';
import { AlertCircle } from 'lucide-react';

const IS_TEST_MODE = !!localStorage.getItem('testAdmin');

export function AdminPanel() {
  const { signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'projects' | 'messages' | 'sketches' | 'team'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSketch, setEditingSketch] = useState<Sketch | null>(null);
  const [showSketchForm, setShowSketchForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [sketchFormData, setSketchFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
  });
  
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    role: '',
    email: '',
  });
  
  // 2. FORM STATE'İNE YENİ ALANLARI EKLEDİK (Text olarak tutuyoruz)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'PROJE AŞAMASINDA',
    duration: '',
    image: '',
    slug: '',
    description: '',
    imagesText: '',
    featuresText: '',
  });

  const fetchProjects = async () => {
    try {
      if (IS_TEST_MODE) {
        setProjects([]);
        return;
      }
      const projectsData = await AdminService.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Projeler alınırken hata:', error);
      setProjects([]);
    }
  };
  const fetchTeam = async () => {
    try {
      if (IS_TEST_MODE) {
        setTeam([]);
        return;
      }
      const data = await TeamService.getAllMembers();
      setTeam(data);
    } catch (error) {
      console.error('Ekip üyeleri yüklenirken hata:', error);
      setTeam([]);
    }
  };
  const fetchMessages = async () => {
    try {
      if (IS_TEST_MODE) {
        setMessages([]);
        return;
      }
      const messagesData = await AdminService.getAllMessages();
      setMessages(messagesData);
    } catch (error) {
      console.error('Mesajlar alınırken hata:', error);
      setMessages([]);
    }
  };

  const fetchSketches = async () => {
    try {
      if (IS_TEST_MODE) {
        setSketches([]);
        return;
      }
      const sketchesData = await SketchService.getAllSketches();
      setSketches(sketchesData);
    } catch (error) {
      console.error('Eskizler alınırken hata:', error);
      setSketches([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchMessages(), fetchSketches(), fetchTeam()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.slug) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    try {
      if (IS_TEST_MODE) {
        alert('Test Mode: Firestore bağlantısı yok. Firebase ayarlarını tamamlayın.');
        return;
      }

      // VİRGÜLLÜ METİNLERİ ARRAY'E ÇEVİRİYORUZ
      const featuresArray = formData.featuresText 
        ? formData.featuresText.split(',').map(item => item.trim()).filter(item => item !== '') 
        : [];
        
      const imagesArray = formData.imagesText 
        ? formData.imagesText.split(',').map(item => item.trim()).filter(item => item !== '') 
        : [];

      const dataToSave = {
        name: formData.name,
        location: formData.location,
        status: formData.status,
        duration: formData.duration,
        image: formData.image,
        slug: formData.slug,
        description: formData.description,
        features: featuresArray,
        images: imagesArray,
      };

      await AdminService.saveProject(dataToSave, editingProject?.id);
      
      setFormData({
        name: '', location: '', status: 'PROJE AŞAMASINDA', duration: '', 
        image: '', slug: '', description: '', imagesText: '', featuresText: '',
      });
      setEditingProject(null);
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      alert('Hata oluştu');
    }
  };

  const handleSaveSketch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sketchFormData.imageUrl) {
      alert('Lütfen resim URL\'sini giriniz');
      return;
    }

    try {
      if (editingSketch) {
        await SketchService.updateSketch(editingSketch.id, {
          imageUrl: sketchFormData.imageUrl,
          title: sketchFormData.title,
          description: sketchFormData.description,
        });
      } else {
        await SketchService.addSketch({
          imageUrl: sketchFormData.imageUrl,
          title: sketchFormData.title,
          description: sketchFormData.description,
        });
      }
      
      setSketchFormData({
        imageUrl: '',
        title: '',
        description: '',
      });
      setEditingSketch(null);
      setShowSketchForm(false);
      fetchSketches();
      alert('Eskiz başarıyla kaydedildi!');
    } catch (error) {
      console.error('Eskiz kaydedilirken hata:', error);
      alert('Eskiz kaydedilirken hata oluştu');
    }
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamFormData.name || !teamFormData.role || !teamFormData.email) {
      alert('Lütfen tüm alanları doldurunuz');
      return;
    }

    try {
      if (IS_TEST_MODE) {
        alert('Test Mode: Firestore bağlantısı yok. Firebase ayarlarını tamamlayın.');
        return;
      }

      const dataToSave = {
        name: teamFormData.name,
        role: teamFormData.role,
        email: teamFormData.email,
      };

      if (editingTeamMember && editingTeamMember.id) {
        await TeamService.updateMember(editingTeamMember.id, dataToSave);
      } else {
        await TeamService.saveMember(dataToSave);
      }
      
      setTeamFormData({
        name: '',
        role: '',
        email: '',
      });
      setEditingTeamMember(null);
      setShowTeamForm(false);
      fetchTeam();
      alert('Ekip üyesi başarıyla kaydedildi!');
    } catch (error) {
      console.error('Ekip üyesi kaydedilirken hata:', error);
      alert('Ekip üyesi kaydedilirken hata oluştu');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Bu ekip üyesini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      if (IS_TEST_MODE) {
        alert('Test Mode: Firestore bağlantısı yok. Firebase ayarlarını tamamlayın.');
        return;
      }

      await TeamService.deleteMember(id);
      fetchTeam();
      alert('Ekip üyesi başarıyla silindi!');
    } catch (error) {
      console.error('Ekip üyesi silinirken hata:', error);
      alert('Ekip üyesi silinirken hata oluştu');
    }
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamFormData({
      name: member.name,
      role: member.role,
      email: member.email,
    });
    setShowTeamForm(true);
  };

  const handleEditSketch = (sketch: Sketch) => {
    setEditingSketch(sketch);
    setSketchFormData({
      imageUrl: sketch.imageUrl,
      title: sketch.title || '',
      description: sketch.description || '',
    });
    setShowSketchForm(true);
  };

  const handleDeleteSketch = async (id: string) => {
    if (confirm('Eskizi silmek istediğinizden emin misiniz?')) {
      try {
        await SketchService.deleteSketch(id);
        fetchSketches();
      } catch (error) {
        console.error('Eskiz silinirken hata:', error);
        alert('Eskiz silinirken hata oluştu');
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Projeyi silmek istediğinizden emin misiniz?')) {
      try {
        if (IS_TEST_MODE) {
          alert('Test Mode: Firestore bağlantısı yok.');
          return;
        }
        await AdminService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Proje silinirken hata:', error);
        alert('Hata oluştu');
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      if (IS_TEST_MODE) {
        alert('Test Mode: Firestore bağlantısı yok.');
        return;
      }
      await AdminService.deleteMessage(id);
      fetchMessages();
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      alert('Hata oluştu');
    }
  };

  // 4. DÜZENLEME İŞLEMİNDE ARRAY'LERİ TEKRAR VİRGÜLLÜ METNE ÇEVİRİYORUZ
  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      location: project.location || '',
      status: project.status || 'PROJE AŞAMASINDA',
      duration: project.duration || '',
      image: project.image || '',
      slug: project.slug || '',
      description: project.description || '',
      imagesText: project.images?.join(', ') || '',
      featuresText: project.features?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/70">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader 
        onLogout={handleLogout} 
        onHome={() => navigate('/')}
        mobileMenuOpen={mobileMenuOpen} 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
      />
      
      <TabNavigation activeTab={tab} onTabChange={setTab} messagesCount={messages.length} sketchesCount={sketches.length} teamCount={team.length} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {IS_TEST_MODE && (
          <div className="mb-6 bg-blue-600/20 border border-blue-600/40 rounded-lg px-4 py-3 text-blue-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Test Mode Aktif</p>
              <p className="text-xs opacity-80 mt-1">Firestore bağlantısı kurulamadı. localStorage'de "testAdmin" bulundu.</p>
            </div>
          </div>
        )}

        {tab === 'projects' && (
          <ProjectTab
            projects={projects}
            showForm={showForm}
            editingProject={editingProject}
            formData={formData}
            loading={loading}
            onShowForm={() => {
              setEditingProject(null);
              setFormData({
                name: '', location: '', status: 'PROJE AŞAMASINDA', duration: '', 
                image: '', slug: '', description: '', imagesText: '', featuresText: '',
              });
              setShowForm(!showForm);
            }}
            onFormDataChange={setFormData}
            onSaveProject={handleSaveProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {tab === 'sketches' && (
          <SketchTab
            sketches={sketches}
            showForm={showSketchForm}
            sketchFormData={sketchFormData}
            editingSketch={editingSketch}
            onShowForm={() => {
              setEditingSketch(null);
              setSketchFormData({
                imageUrl: '',
                title: '',
                description: '',
              });
              setShowSketchForm(!showSketchForm);
            }}
            onFormDataChange={setSketchFormData}
            onSaveSketch={handleSaveSketch}
            onEditSketch={handleEditSketch}
            onDeleteSketch={handleDeleteSketch}
          />
        )}

        {tab === 'messages' && (
          <MessagesTab messages={messages} onDeleteMessage={handleDeleteMessage} />
        )}

        {tab === 'team' && (
          <TeamTab
            team={team}
            showForm={showTeamForm}
            teamFormData={teamFormData}
            editingTeamMember={editingTeamMember}
            onShowForm={() => {
              setEditingTeamMember(null);
              setTeamFormData({
                name: '',
                role: '',
                email: '',
              });
              setShowTeamForm(!showTeamForm);
            }}
            onFormDataChange={setTeamFormData}
            onSaveTeamMember={handleSaveTeamMember}
            onEditTeamMember={handleEditTeamMember}
            onDeleteTeamMember={handleDeleteTeamMember}
          />
        )}
      </div>
    </div>
  );
}