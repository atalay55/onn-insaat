import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface ProjectSummary {
  id: string;
  name: string;
  location: string;
  status: string;
  duration: string;
  image: string;
  slug: string;
}

interface ProjectsSectionProps {
  projects: ProjectSummary[];
  loading: boolean;
}

export function ProjectsSection({ projects, loading }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // EKLENEN KISIM: Yükleme bitene ve projeler gelene kadar animasyonu bekle!
    if (loading || projects.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [projects, loading]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-4">
            Projelerimiz
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            İstanbul'un <span className="text-emerald-400">en seçkin</span>{" "}
            bölgelerinde
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Her projemizde kalite, estetik ve fonksiyonelliği bir araya
            getiriyoruz.
          </p>
        </div>
        {loading ? (
          <div className="text-center py-20 text-white/70">
            Projeler yükleniyor...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-white/70">
            Henüz gösterilecek proje bulunamadı.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.slug}`}
                className="reveal group relative overflow-hidden rounded-2xl bg-zinc-900 cursor-pointer block"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        project.status.includes("TAMAMLANDI")
                          ? "bg-emerald-600/80 text-white"
                          : project.status.includes("SATIŞ")
                            ? "bg-amber-500/80 text-white"
                            : "bg-blue-500/80 text-white"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {project.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-2">
                    {project.location}
                  </p>
                  <p className="text-white/40 text-xs">{project.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}