export interface Genre {
  id: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
  publishDate: string;
  liked: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Lesson {
  id: string;
  title: string;
  level: string;
  topic: string;
  pairs: Array<any>;
}
