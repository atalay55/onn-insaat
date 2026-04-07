import { useEffect, useRef, useState } from "react";
import { Mail, Users } from "lucide-react";
import { TeamService, type TeamMember } from "@/services/teamService";

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 },
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [team]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        console.log("TeamSection: Firebase'den ekip üyeleri çekiliyor...");
        const teamData = await TeamService.getAllMembers();
        console.log("TeamSection: Çekilen ekip üyeleri:", teamData);
        setTeam(teamData);
        console.log("TeamSection: team state güncellendi, yeni değer:", teamData);
      } catch (error) {
        console.error("Çalışanlar yüklenirken hata:", error);
        // Fallback: Eski hardcoded veriler
        console.log("TeamSection: Firebase başarısız, fallback veriler kullanılıyor");
        setTeam([
          {
            name: "Nuri ÖZTÜRK",
            role: "Genel Müdür / Mimar",
            email: "nuri@onn.com.tr",
          },
          {
            name: "Onur ÖZTÜRK",
            role: "Genel Koordinatör / İç Mimar",
            email: "onur@onn.com.tr",
          },
          {
            name: "Ergül Şit",
            role: "Proje Müdürü / İnş. Müh.",
            email: "ergul@onn.com.tr",
          },
          {
            name: "Hamza Çerkez",
            role: "Şantiye Şefi / İnş. Müh.",
            email: "hamza@onn.com.tr",
          },
          {
            name: "Betül Mandalı",
            role: "Mimari Proje / Mimar",
            email: "betul@onn.com.tr",
          },
          {
            name: "Fatma Güler",
            role: "Muhasebe",
            email: "muhasebe@onn.com.tr",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section id="team" ref={sectionRef} className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/60">Çalışanlar yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  console.log("TeamSection render: team state =", team);
  console.log("TeamSection render: team length =", team.length);

  return (
    <section id="team" ref={sectionRef} className="py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-4">
            Ekibimiz
          </p>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Projelerinizi <span className="text-emerald-400">uzman ellere</span>{" "}
            emanet edin
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-white/60">Henüz ekip üyesi bulunamadı.</p>
            </div>
          ) : (
            team.map((member, index) => (
              <div
                key={member.id || member.name}
                className="reveal p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mb-6">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-emerald-400" />
                  )}
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-emerald-400 text-sm mb-4">{member.role}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="text-white/50 text-sm hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
                {member.phone && (
                  <p className="text-white/40 text-sm mt-2">{member.phone}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}