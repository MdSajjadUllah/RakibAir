export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Article {
  id: number;
  title: string;
  category: 'Airport Guide' | 'Travel Tips' | 'Lounge Review' | 'Gear Guide';
  author: string;
  authorInitials: string;
  date: string;
  rating: number;
  readTime: string;
  image: string;
  preview: string;
  content: string[];
  tags: string[];
  isPopular?: boolean;
  reviews?: Review[];
}
