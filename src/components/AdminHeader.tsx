import { useState } from 'react';
import { LogOut, Home, Menu, X, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminHeaderProps {
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onLogout: () => void;
  onHome: () => void;
}

export function AdminHeader({
  mobileMenuOpen,
  onMobileMenuToggle,
  onLogout,
  onHome,
}: AdminHeaderProps) {
  const { changePassword } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Şifre en az 6 karakter olmalıdır!");
      return;
    }
    try {
      setLoading(true);
      await changePassword(newPassword);
      toast.success("Şifreniz başarıyla değiştirildi. Lütfen yeni şifrenizle giriş yapın.");
      setIsPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      
      // Şifre değiştikten sonra Firebase Auth token'ları geçersiz kılınabileceğinden
      // ve yeni şifreyle girişin test edilmesi için çıkışa zorluyoruz:
      setTimeout(() => {
        onLogout();
      }, 2000);
      
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        toast.error("Güvenlik nedeniyle şifre değiştirmeden önce tekrar giriş yapmalısınız. Lütfen çıkış yapıp tekrar giriş yapın.");
      } else {
        toast.error("Şifre değiştirilirken bir hata oluştu: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-light text-white tracking-[0.1em]">ADMIN PANEL</h1>
            <p className="text-white/50 text-sm mt-1">ONN İnşaat Yönetim Sistemi</p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            <Button
              onClick={onHome}
              variant="outline"
              className="border-emerald-600/40 text-emerald-400 hover:bg-emerald-600/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button
              onClick={() => setIsPasswordDialogOpen(true)}
              variant="outline"
              className="border-zinc-700 text-white hover:bg-zinc-900"
            >
              <Key className="w-4 h-4 mr-2" />
              Şifre Değiştir
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-zinc-700 text-red-400 hover:bg-zinc-900 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden text-white hover:bg-zinc-800 p-2 rounded transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 px-6 py-4 bg-zinc-900 space-y-3">
            <Button
              onClick={onHome}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfa
            </Button>
            <Button
              onClick={() => {
                setIsPasswordDialogOpen(true);
                onMobileMenuToggle();
              }}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
            >
              <Key className="w-4 h-4 mr-2" />
              Şifre Değiştir
            </Button>
            <Button
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        )}
      </header>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Şifre Değiştir</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Admin hesabınızın şifresini değiştirebilirsiniz. Güvenlik nedeniyle yakın zamanda giriş yapmamışsanız işlem başarısız olabilir.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordChange} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-950 border-zinc-800 focus:border-zinc-700 text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPasswordDialogOpen(false)}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800 focus:bg-zinc-800"
              >
                İptal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Değiştiriliyor..." : "Şifreyi Güncelle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}