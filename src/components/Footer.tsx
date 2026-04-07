import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">
              ONN <span className="text-emerald-400">İNŞAAT</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <a
              href="#hero"
              className="text-white/60 hover:text-emerald-400 transition-colors text-sm"
            >
              Ana Sayfa
            </a>
            <a
              href="#about"
              className="text-white/60 hover:text-emerald-400 transition-colors text-sm"
            >
              Hakkımızda
            </a>
            <a
              href="#projects"
              className="text-white/60 hover:text-emerald-400 transition-colors text-sm"
            >
              Projeler
            </a>
            <a
              href="#contact"
              className="text-white/60 hover:text-emerald-400 transition-colors text-sm"
            >
              İletişim
            </a>
          </div>

          <p className="text-white/40 text-sm">
            © 2026 ONN İNŞAAT A.Ş. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}