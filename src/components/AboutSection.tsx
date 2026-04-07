import { useEffect, useRef } from "react";
import { Building2, Home, Award, Users } from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-4">
              Hakkımızda
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
              Mimariden anahtar teslime
              <span className="text-emerald-400">tam hizmet</span>
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Yapı sektöründe faaliyet gösteren firmamız, ticaret hayatına
                1979 yılında Öz İnşaat olarak başladı.
              </p>
              <p>
                İnşaat Mühendisi Fahrettin Öztürk ve Mimar Nuri Öztürk'ün
                ortaklığında 1996 yılında bir aile şirketi olarak kurulan Öz-Fa
                İnşaat Taahhüt Ltd. Şti. ile ticari hayatına devam etti.
              </p>
              <p>
                2012 yılında yapı sektöründe ikinci nesil olarak kurulan ONN
                İNŞAAT A.Ş. ile inşaat taahhüt işlerinde Nuri Öztürk ve N.Onur
                Öztürk yönetiminde faaliyet göstermeye devam ediyoruz...
              </p>

              <p>
                Projelerimizde, tasarımdan anahtar teslimine kadar her aşamada
                "mükemmele en yakın" yaşam alanları oluşturmaya yönelik
                çalışmalara imza atıyoruz.
              </p>
            </div>
          </div>
          <div className="reveal grid grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <Building2 className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-3xl font-light text-white mb-2">10+</h3>
                <p className="text-white/60 text-sm">Tamamlanan Proje</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <Home className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-3xl font-light text-white mb-2">500+</h3>
                <p className="text-white/60 text-sm">Mutlu Aile</p>
              </div>
            </div>
            <div className="space-y-6 pt-12">
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <Award className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-3xl font-light text-white mb-2">19</h3>
                <p className="text-white/60 text-sm">Yıllık Deneyim</p>
              </div>
              <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <Users className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-3xl font-light text-white mb-2">15+</h3>
                <p className="text-white/60 text-sm">Uzman Ekip</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}