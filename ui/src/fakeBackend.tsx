import _ from "lodash";

function getMovies() {
  return _.range(0, 15).map((i) => {
    return {
      _id: String(i),
      title: `Title ${15 - i}`,
      genre: { _id: String(i % 4), name: `Genre ${i % 4}` },
      numberInStock: i,
      dailyRentalRate: 1.5,
      publishDate: "2020-01-01",
      liked: false,
    };
  });
}

function getGenres() {
  const movies = getMovies();
  const genrelist = movies.map((c) => c.genre);
  return _.uniqBy(genrelist, "name");
}
