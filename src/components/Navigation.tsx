import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, signOut, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOnSubPage = location.pathname === "/eskizler" || location.pathname.startsWith("/project/");

  const navLinks = [
    { name: "Ana Sayfa", hash: "hero" },
    { name: "Hakkımızda", hash: "about" },
    { name: "Projeler", hash: "projects" },
    { name: "Ekip", hash: "team" },
    { name: "İletişim", hash: "contact" },
    { name: "Eskizler", to: "/eskizler" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/30 shadow-2xl shadow-emerald-900/20" 
          : "bg-transparent py-6 border-b border-transparent shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/50">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              ONN <span className="text-emerald-400">İNŞAAT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.name}
                  to={link.to}
                  className="text-sm text-white/80 hover:text-emerald-400 transition-colors duration-300 tracking-wide"
                >
                  {link.name}
                </Link>
              ) : isOnSubPage ? (
                <Link
                  key={link.name}
                  to="/"
                  state={{ scrollTo: link.hash }}
                  className="text-sm text-white/80 hover:text-emerald-400 transition-colors duration-300 tracking-wide"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={`#${link.hash}`}
                  className="text-sm text-white/80 hover:text-emerald-400 transition-colors duration-300 tracking-wide"
                >
                  {link.name}
                </a>
              )
            )}

            <div className="flex items-center gap-3 pl-8 border-l border-white/10">
              {currentUser && isAdmin ? (
                <>
                  <Link to="/admin">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/30"
                    >
                      Admin Panel
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    size="sm"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-white/80 hover:text-emerald-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : isOnSubPage ? (
                  <Link
                    key={link.name}
                    to="/"
                    state={{ scrollTo: link.hash }}
                    className="text-white/80 hover:text-emerald-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={`#${link.hash}`}
                    className="text-white/80 hover:text-emerald-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              )}

              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                {currentUser && isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Admin Panel
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}