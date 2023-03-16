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
