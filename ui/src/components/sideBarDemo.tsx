import { Link, Route, Routes } from "react-router-dom";

function SideBar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/products/old">Old</Link>
        </li>
        <li>
          <Link to="/products/new">New</Link>
        </li>
      </ul>
    </div>
  );
}

function Product(props: { state: string }) {
  return <h2>This is {props.state} section</h2>;
}

export default function Products(props: any) {
  return (
    <div>
      <h1>These are the product options</h1>
      <SideBar />
      <Routes>
        <Route path="old" element={<Product state={"old"} />} />
        <Route path="new" element={<Product state={"new"} />} />
      </Routes>
    </div>
  );
}
