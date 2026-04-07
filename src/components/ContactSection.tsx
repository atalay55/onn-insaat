import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { sendEmail, getEmailConfig, isEmailConfigured } from "@/lib/emailConfig";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Mesajı Firestore'a kaydet
      await addDoc(collection(db, "messages"), {
        name: formData.name + " " + formData.lastname,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        createdAt: new Date(),
      });

      // 2. Email gönder (TEK İSTEK - EmailJS Auto-Reply sekmesi gerisini halleder!)
      const contactEmail = getEmailConfig().contactEmail;

      if (isEmailConfigured() && contactEmail) {
        try {
          // Bu tek istek hem ONN İnşaat'a bildirimi atacak,
          // hem de EmailJS panelindeki Auto-Reply ayarın sayesinde müşteriye otomatik dönecek.
          await sendEmail({
            to_email: contactEmail, // Ana mailin gideceği adres (Şirket maili)
            from_name: formData.name + " " + formData.lastname, // Müşterinin Adı (Auto-Reply'da {{from_name}} olarak çıkar)
            from_email: formData.email, // Müşterinin Maili (Auto-Reply'da To Email kısmına {{from_email}} yazmalısın)
            phone: formData.phone,
            message: formData.message,
            reply_to: formData.email,
          });
        } catch (emailError) {
          console.warn("Email gönderilemedi ama Firestore'a kaydedildi:", emailError);
        }
      }

      setFormData({
        name: "",
        lastname: "",
        email: "",
        phone: "",
        message: "",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
      alert("Mesaj gönderilemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="reveal">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-4">
              İletişim
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
              Bize <span className="text-emerald-400">ulaşın</span>
            </h2>
            <p className="text-white/60 mb-10 leading-relaxed">
              Projelerimiz hakkında daha fazla bilgi almak için bize
              ulaşabilirsiniz. Uzman ekibimiz size yardımcı olmaktan mutluluk
              duyacaktır.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Adres</h4>
                  <p className="text-white/60">
                    Caddebostan Mah. Sarıgül Sk. Sera Apt. No: 22/17
                    <br />
                    Kadıköy / İSTANBUL
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Telefon</h4>
                  <p className="text-white/60">+90 216 349 38 31</p>
                  <p className="text-white/60">+90 546 276 66 27</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">E-posta</h4>
                  <a
                    href="mailto:onn@onn.com.tr"
                    className="text-white/60 hover:text-emerald-400 transition-colors"
                  >
                    onn@onn.com.tr
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
            <h3 className="text-2xl font-light text-white mb-6">
              Bize Mesaj Gönderin
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    Adınız
                  </label>
                  <Input
                    type="text"
                    placeholder="Adınız"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">
                    Soyadınız
                  </label>
                  <Input
                    type="text"
                    placeholder="Soyadınız"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">
                  E-posta
                </label>
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">
                  Telefon
                </label>
                <Input
                  type="tel"
                  placeholder="Telefon numaranız"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">
                  Mesajınız
                </label>
                <textarea
                  rows={4}
                  placeholder="Mesajınız..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
                  required
                  disabled={loading}
                />
              </div>

              {success && (
                <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-lg px-4 py-3 text-emerald-400 text-sm">
                  ✓ Mesajınız başarıyla gönderildi!
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
                disabled={loading}
              >
                {loading ? "Gönderiliyor..." : "Gönder"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}