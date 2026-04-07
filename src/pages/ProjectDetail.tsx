import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Building2 } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProjectData {
  id?: string;
  name: string;
  location: string;
  status: string;
  duration: string;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  slug?: string;
}

function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setProject(null);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'projects'),
          where('slug', '==', projectId.toLowerCase()),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setProject(null);
        } else {
          const doc = snapshot.docs[0];
          setProject({
            id: doc.id,
            ...(doc.data() as ProjectData),
          });
        }
      } catch (error) {
        console.error('Proje Firestore’dan alınırken hata oluştu:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleContactClick = () => {
    navigate('/');
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white/70">Proje yükleniyor...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-light text-white mb-4">Proje Bulunamadı</h1>
          <Link to="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const projectImages = project.images && project.images.length > 0 ? project.images : [project.image];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
        <div className="absolute top-6 left-6 z-10">
          <Link to="/">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-3 py-1 rounded-full ${
                project.status.includes('TAMAMLANDI')
                  ? 'bg-emerald-600/80 text-white'
                  : project.status.includes('SATIŞ')
                  ? 'bg-amber-500/80 text-white'
                  : 'bg-blue-500/80 text-white'
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-white mb-4">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{project.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-16">
            {/* Proje Galerisi */}
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-medium text-white">Proje Galerisi</h3>
                  <p className="text-sm text-white/60">{projectImages.length} görsel</p>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden">
                <Carousel autoplay={true} autoplayDelay={5000}>
                  <CarouselPrevious className="bg-black/60 text-white hover:bg-black/70" />
                  <CarouselNext className="bg-black/60 text-white hover:bg-black/70" />
                  <CarouselContent className="h-[500px]">
                    {projectImages.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="h-[500px] overflow-hidden rounded-3xl">
                          <img
                            src={src}
                            alt={`${project.name} slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>

            {/* Proje Hakkında ve Bilgileri */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Proje Hakkında */}
              <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-white mb-6">Proje Hakkında</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-white/70 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-4">Özellikler</h4>
                    <ul className="space-y-2">
                      {project.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-white/70">
                          <Building2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Proje Bilgileri */}
              <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                <h3 className="text-2xl font-medium text-white mb-6">Proje Bilgileri</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-zinc-800">
                    <span className="text-white/60">Konum</span>
                    <span className="text-white font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-zinc-800">
                    <span className="text-white/60">Durum</span>
                    <span className="text-white font-medium">{project.status}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-white/60">Süre</span>
                    <span className="text-white font-medium">{project.duration}</span>
                  </div>
                </div>
                <div className="text-center mt-8">
                  <Button
                    onClick={handleContactClick}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-base"
                  >
                    İletişime Geçin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetail;