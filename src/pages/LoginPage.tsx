import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Lock, Loader } from 'lucide-react';

const TEST_ADMIN_EMAIL = import.meta.env.VITE_TEST_ADMIN_EMAIL || 'onninsaat9@gmail.com';
const TEST_ADMIN_PASSWORD = import.meta.env.VITE_TEST_ADMIN_PASSWORD || '';
const IS_TEST_MODE = false ;

export function LoginPage() {
  const [email, setEmail] = useState(TEST_ADMIN_EMAIL);
  const [password, setPassword] = useState(TEST_ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Test mode: Demo amaçlı giriş
      if (IS_TEST_MODE && email === TEST_ADMIN_EMAIL && password === TEST_ADMIN_PASSWORD) {
        localStorage.setItem('testAdmin', JSON.stringify({
          uid: 'test-admin-123',
          email: TEST_ADMIN_EMAIL,
          role: 'admin',
        }));
        navigate('/admin');
        return;
      }

      // Normal Firebase girişi
      if (true) {
        console.log("🚀 ~ handleEmailLogin ~ email, password:", email, password)
        // 1. Firebase Auth ile giriş yapmayı dene
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("🚀 ~ handleEmailLogin ~ userCredential:", userCredential)
        
        // 2. Firestore'da bu kullanıcının dokümanını bul
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        console.log("🚀 ~ handleEmailLogin ~ userDoc:", userDoc)
        
        // 3. GÜVENLİK KONTROLÜ: Doküman yoksa veya rolü admin DEĞİLSE içeri alma!
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          // Firebase'den hemen çıkış yaptır ki oturum açık kalmasın
          await signOut(auth);
          throw new Error('Giriş reddedildi: Bu işlem için yönetici yetkiniz bulunmuyor!');
        }

        // Kontrollerden geçerse admin paneline yönlendir
        navigate('/admin');
        return;
      }

      // Test mode'da yanlış credential
      setError('E-posta veya şifre hatalı');
    } catch (err: any) {
      // Hata mesajlarını yakala (Kendi fırlattığımız "Giriş reddedildi" hatası dahil)
      const errorMessage = err.message === 'Giriş reddedildi: Bu işlem için yönetici yetkiniz bulunmuyor!'
        ? err.message
        : err.code === 'auth/user-not-found'
        ? 'Kullanıcı bulunamadı'
        : err.code === 'auth/wrong-password'
        ? 'Yanlış şifre'
        : err.code === 'auth/invalid-email'
        ? 'Geçersiz e-posta'
        : err.code === 'auth/invalid-credential'
        ? 'E-posta veya şifre hatalı'
        : 'Giriş başarısız: ' + err.message;
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-white mb-2">
            ONN <span className="text-emerald-400">İNŞAAT</span>
          </h1>
          <p className="text-white/60">Admin Paneli</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label className="text-white/60 text-sm mb-2 block">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-white/30"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white/60 text-sm mb-2 block">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
              <Input
                type="password"
                placeholder="Şifreniz"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-white/30"
                disabled={loading}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600/40 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {IS_TEST_MODE && (
            <div className="bg-blue-600/20 border border-blue-600/40 rounded-lg px-4 py-3 text-blue-400 text-sm">
              🧪 Test Mode Aktif - Varsayılan credentials doldurulmuştur
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Giriş yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </Button>
        </form>

        <div className="text-center text-white/40 text-xs space-y-2">
          <p>Admin Paneli - Sadece yetkili kişiler</p>
          {IS_TEST_MODE && <p className="text-blue-400">Test Mode: DEV/TEST amaçlıdır</p>}
        </div>
      </div>
    </div>
  );
}