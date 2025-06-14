import React from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => (
  <>
    <TopBar />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout; 