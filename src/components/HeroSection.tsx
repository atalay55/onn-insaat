import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-building.jpg"
          alt="ONN İnşaat"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <p className="text-emerald-400 text-sm tracking-[0.3em] uppercase mb-6">
            İstanbul · 2005'ten Beri
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 tracking-tight">
            ONN <span className="font-medium">İNŞAAT</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-4 italic">
            mükemmele en yakın...
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tasarımdan anahtar teslime kadar tüm sürecin sorumluluğunu taşıyan,
            İstanbul'un en seçkin bölgelerinde yaşam alanları oluşturan inşaat
            şirketi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-base"
              asChild
            >
              <a href="#projects">
                Projelerimizi Keşfedin
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
              asChild
            >
              <a href="#contact">Bize Ulaşın</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-emerald-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}