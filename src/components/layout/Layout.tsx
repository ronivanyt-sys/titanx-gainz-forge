import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "../WhatsAppButton";
import CartPanel from "../CartPanel";

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Navbar />
    <CartPanel />
    <main className="pt-16">{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Layout;
