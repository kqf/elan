const movies = ["1", "2", "3", "4"].map((i) => {
  return {
    _id: "1",
    title: "Title 1",
    genre: { _id: i, name: `name ${i}` },
    numberInStock: i,
    dailyRentalRate: 1.5,
    publishDate: "2020-01-01",
  };
});

function Movies() {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Genere</th>
          <th>Stock</th>
          <th>Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>a</td>
          <td>b</td>
          <td>c</td>
          <td>d</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Movies;
