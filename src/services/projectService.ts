import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Senin UI kodlarındaki tipe birebir uyumlu Project interface'imiz
export interface Project {
  id?: string;
  name: string;
  slug: string; // URL'de görünecek kısım
  location: string;
  status: string;
  duration: string;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  createdAt?: any;
}

export const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Proje eklenirken hata:", error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(projectsQuery);
    
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error("Projeler çekilirken hata:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    console.error("Proje silinirken hata:", error);
    throw error;
  }
};