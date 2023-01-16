import { Route, Routes } from "react-router-dom";
import NavBar from "./navbar";

function Products(props: any) {
  return <div>These are the products</div>;
}

function Posts(props: any) {
  return <div>These are the posts</div>;
}

function SinglePageApp() {
  return (
    <div>
      <NavBar />
      <div className="content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </div>
    </div>
  );
}

export default SinglePageApp;
