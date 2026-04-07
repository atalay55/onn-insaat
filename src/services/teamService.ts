import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Date | { seconds: number; nanoseconds: number };
}

export class TeamService {
  private static collectionName = "team";

  private static getTimestamp(member: TeamMember): number {
    if (!member.createdAt) return 0;
    if (member.createdAt instanceof Date) return member.createdAt.getTime();
    return member.createdAt.seconds * 1000 + Math.floor(member.createdAt.nanoseconds / 1_000_000);
  }

  static async getAllMembers(): Promise<TeamMember[]> {
    try {
      console.log("TeamService: 'team' collection'ından veri çekiliyor...");
      const snapshot = await getDocs(collection(db, this.collectionName));
      console.log("TeamService: Firestore snapshot:", snapshot);
      console.log("TeamService: Doküman sayısı:", snapshot.docs.length);
      
      const members = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TeamMember, "id">),
      })) as TeamMember[];

      console.log("TeamService: İşlenmiş üyeler:", members);

      const activeMembers = members
        .filter(member => member.isActive !== false)
        .sort((a, b) => {
          if (typeof a.order !== "undefined" || typeof b.order !== "undefined") {
            return (b.order ?? 0) - (a.order ?? 0);
          }
          return this.getTimestamp(a) - this.getTimestamp(b);
        });
        
      console.log("TeamService: Aktif ve sıralanmış üyeler:", activeMembers);
      return activeMembers;
    } catch (error) {
      console.error("Çalışanlar alınırken hata:", error);
      throw error;
    }
  }

  static async saveMember(member: Omit<TeamMember, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...member,
        isActive: member.isActive ?? true,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Çalışan kaydedilirken hata:", error);
      throw error;
    }
  }

  static async updateMember(id: string, member: Partial<TeamMember>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...member,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Çalışan güncellenirken hata:", error);
      throw error;
    }
  }

  static async deleteMember(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Çalışan silinirken hata:", error);
      throw error;
    }
  }
}