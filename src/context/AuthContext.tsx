import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface UserData extends User {
  role?: 'admin' | 'user';
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setCurrentUser({ ...user, role: 'admin' } as UserData);
          } else {
            // Admin değilse veya tablosu yoksa zorla çıkış yaptır
            await firebaseSignOut(auth);
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Yetki kontrolü hatası:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    // Giriş yapmayı dener. Başarılı olursa onAuthStateChanged tetiklenir ve admin mi diye bakar.
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Giriş anında da hızlı bir kontrol yapıp hata fırlatabiliriz (UI'da göstermek için)
    const docRef = doc(db, 'users', userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists() || docSnap.data().role !== 'admin') {
      await firebaseSignOut(auth);
      throw new Error("Giriş başarısız: Yönetici yetkiniz bulunmuyor!");
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const changePassword = async (newPassword: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
    } else {
      throw new Error("Kullanıcı oturumu bulunamadı!");
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signOut,
    changePassword,
    isAdmin: currentUser?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth hooku AuthProvider içinde kullanılmalıdır!');
  }
  return context;
}