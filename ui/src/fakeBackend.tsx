import _ from "lodash";

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

export function getMovies() {
  return _.range(0, 15).map((i) => {
    return {
      id: String(i),
      title: `Title ${15 - i}`,
      genre: { id: String(i % 4), name: `Genre ${i % 4}` },
      numberInStock: i,
      dailyRentalRate: 1.5,
      publishDate: "2020-01-01",
      liked: false,
    };
  });
}

export function getGenres() {
  const movies = getMovies();
  const genrelist = movies.map((c) => c.genre);
  return _.uniqBy(genrelist, "name");
}
