
import React from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import PageTransition from "../ui/PageTransition";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
