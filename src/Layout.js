import { Outlet, Link } from "react-router-dom";
import Login from "./Components/Login"; // Import Login

const Layout = () => {
  return (
    <>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <ul style={{ listStyle: "none", display: "flex", gap: "10px", margin: 0 }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/test-firebase">Test Firebase</Link>
          </li>
        </ul>
        {/* Login Component */}
        <Login />
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
