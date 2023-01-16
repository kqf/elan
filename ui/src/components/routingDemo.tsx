import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AuthDemo from "./authDemo";
import AppMenu from "./menuComponent";
import Movies from "./movies";

function Products(props: any) {
  return <div>These are the products</div>;
}

function Posts(props: any) {
  return <div>These are the posts</div>;
}

function SinglePageApp() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/calc">Calculator</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            <li>
              <Link to="/auth">Auth</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/products" element={<Products />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/auth" element={<AuthDemo />} />
            <Route path="/calc" element={<AppMenu />} />
            <Route path="/" element={<Movies />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default SinglePageApp;
