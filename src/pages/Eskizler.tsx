import { useEffect, useRef, useState } from 'react';
import { Aperture, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { SketchService,type Sketch } from '@/services/sketchService';

export default function Eskizler() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sketches, setSketches] = useState<Sketch[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedIndex = selectedImage ? sketches.findIndex(s => s.imageUrl === selectedImage) : -1;

  const prevLightboxImage = () => {
    if (selectedIndex <= 0) return;
    setSelectedImage(sketches[selectedIndex - 1].imageUrl);
  };

  const nextLightboxImage = () => {
    if (selectedIndex < 0 || selectedIndex >= sketches.length - 1) return;
    setSelectedImage(sketches[selectedIndex + 1].imageUrl);
  };

  // Firebase'den eskizleri çek
  useEffect(() => {
    const fetchSketches = async () => {
      try {
        const sketchesData = await SketchService.getAllSketches();
        setSketches(sketchesData);
      } catch (error) {
        console.error('Eskizler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSketches();
  }, []);

  // Ana sayfada kullandığın kayarak gelme (reveal) efekti
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Sayfa yüklendiğinde scroll'u top'a sıfırla
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black relative selection:bg-emerald-500/30">
      <Navigation />

      <main 
        ref={sectionRef} 
        className="pt-32 pb-24 px-6 lg:px-8 max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center"
      >
        
        {/* Üst Kısım: Logo, Başlık ve Metin */}
        <div className="reveal text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <Aperture className="w-12 h-12 text-white/80" strokeWidth={1} />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-light text-white tracking-[0.4em] uppercase mb-10">
            Sketch
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
            ONN İnşaat A.Ş. olarak tasarımdan anahtar teslime kadar tüm sürecin
            sorumluluğunu kendimiz taşıyoruz. Mimari tasarım, proje müellifliği, iç
            mimari tasarım ve tüm uygulama süreci <span className="text-white font-medium">Mimar Nuri ÖZTÜRK</span>'ün
            liderliğindeki teknik ekibimiz tarafından yönetiliyor.
          </p>
        </div>

        {/* Alt Kısım: Eskiz Karuseli */}
        <div className="reveal w-full relative group mt-8">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-white/70">Eskizler yükleniyor...</div>
            </div>
          ) : sketches.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-white/70">Henüz eskiz bulunmuyor.</div>
            </div>
          ) : (
            <>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/10 to-zinc-600/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition duration-1000" />
              
              <Carousel autoplay={true} autoplayDelay={5000}>
                <CarouselPrevious className="bg-black/60 text-white hover:bg-black/70" />
                <CarouselNext className="bg-black/60 text-white hover:bg-black/70" />
                <CarouselContent className="h-[500px]">
                  {sketches.map((sketch) => (
                    <CarouselItem key={sketch.id}>
                      <div className="h-[500px] overflow-hidden rounded-3xl">
                        <img
                          src={sketch.imageUrl}
                          alt={sketch.title || `Eskiz ${sketch.id}`}
                          className="w-full h-full object-cover cursor-pointer duration-700 hover:scale-105"
                          onClick={() => setSelectedImage(sketch.imageUrl)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </>
          )}
        </div>
      </main>

      {selectedImage !== null && selectedIndex >= 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightboxImage();
            }}
            className="absolute left-4 md:left-12 z-50 p-4 rounded-full text-white/50 hover:text-white bg-black/50 hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={selectedIndex === 0}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={sketches[selectedIndex].imageUrl}
            alt={sketches[selectedIndex].title || 'Eskiz'}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightboxImage();
            }}
            className="absolute right-4 md:right-12 z-50 p-4 rounded-full text-white/50 hover:text-white bg-black/50 hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={selectedIndex === sketches.length - 1}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Sayaç */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm tracking-widest font-light">
            {selectedIndex + 1} <span className="text-emerald-500 mx-2">/</span> {sketches.length}
          </div>

          {/* Başlık ve Açıklama */}
          {(sketches[selectedIndex].title || sketches[selectedIndex].description) && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center max-w-md">
              {sketches[selectedIndex].title && (
                <h3 className="text-white font-medium mb-2">{sketches[selectedIndex].title}</h3>
              )}
              {sketches[selectedIndex].description && (
                <p className="text-white/60 text-sm">{sketches[selectedIndex].description}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}