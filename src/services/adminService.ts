import {
  collection,
  query,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Project {
  id: string;
  name: string;
  location: string;
  status: string;
  duration: string;
  image: string;
  slug: string;
  description?: string;
  images?: string[];
  features?: string[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
}

export class AdminService {
  /**
   * Tüm projeleri Firestore'dan getirir
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      const q = query(collection(db, 'projects'));
      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      return projects;
    } catch (error) {
      console.error('Projeler alınırken hata:', error);
      throw error;
    }
  }

  /**
   * Yeni proje ekler veya mevcut projeyi günceller
   */
  static async saveProject(project: Omit<Project, 'id'>, projectId?: string): Promise<void> {
    try {
      if (projectId) {
        // Güncelle
        await updateDoc(doc(db, 'projects', projectId), project);
      } else {
        // Yeni ekle
        await addDoc(collection(db, 'projects'), {
          ...project,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      throw error;
    }
  }

  /**
   * Projeyi ID'ye göre siler
   */
  static async deleteProject(projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      throw error;
    }
  }

  /**
   * Tüm mesajları Firestore'dan getirir (en yeni başta)
   */
  static async getAllMessages(): Promise<Message[]> {
    try {
      const q = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      return messages;
    } catch (error) {
      console.error('Mesajlar alınırken hata:', error);
      throw error;
    }
  }

  /**
   * Mesajı ID'ye göre siler
   */
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      console.error('Mesaj silinirken hata:', error);
      throw error;
    }
  }
}
