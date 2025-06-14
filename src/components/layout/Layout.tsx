
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TopBar from "./TopBar";
import LoadingWrapper from "./LoadingWrapper";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <LoadingWrapper>
        <TopBar />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </LoadingWrapper>
    </div>
  );
};

export default Layout;
