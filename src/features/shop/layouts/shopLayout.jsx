import NavBar from "../components/navbar";
import Footer from "../../../shared/components/footer";
import { Outlet } from "react-router-dom";

function ShopLayout({ children }) {
  return (
    <div className="theme-page flex min-h-screen flex-col">
      <NavBar></NavBar>
      <main className="flex-1">{children || <Outlet/>}</main>
      <Footer></Footer>
    </div>
  );
}

export default ShopLayout;
