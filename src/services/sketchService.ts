import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Sketch {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  createdAt?: any;
}

export class SketchService {
  private static collectionName = 'sketches';

  /**
   * Tüm eskizleri getir
   */
  static async getAllSketches(): Promise<Sketch[]> {
    try {
      const sketchesRef = collection(db, this.collectionName);
      const q = query(sketchesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const sketchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Sketch[];
      return sketchesData;
    } catch (error) {
      console.error('Eskizler yüklenirken hata:', error);
      throw error;
    }
  }

  /**
   * Yeni eskiz ekle
   */
  static async addSketch(sketchData: Omit<Sketch, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, this.collectionName), {
        ...sketchData,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Eskiz eklenirken hata:', error);
      throw error;
    }
  }

  /**
   * Eskiz güncelle
   */
  static async updateSketch(id: string, sketchData: Partial<Omit<Sketch, 'id'>>): Promise<void> {
    try {
      const sketchRef = doc(db, this.collectionName, id);
      await updateDoc(sketchRef, sketchData);
    } catch (error) {
      console.error('Eskiz güncellenirken hata:', error);
      throw error;
    }
  }

  /**
   * Eskiz sil
   */
  static async deleteSketch(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error('Eskiz silinirken hata:', error);
      throw error;
    }
  }
}