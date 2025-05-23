export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl: string;
  createdAt?: any;
  uploadedBy: string;     // UID o nombre del usuario
  likes: number;
}
