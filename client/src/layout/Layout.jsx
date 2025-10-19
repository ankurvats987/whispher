import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="bg-gradient-to-br from-rose-50 via-purple-50 to-teal-50">
      <Outlet />
    </div>
  );
};

export default Layout;
