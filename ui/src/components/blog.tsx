
function Blog () {
  return (
      <div className="col">
        <button
          className="btn btn-primary my-3"
          onClick={() => {
            console.log("Clicked")
          }}
        >
          Add
        </button>
      </div>
  );
}
export default Blog;
