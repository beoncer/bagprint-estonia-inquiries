
import React from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingWrapper from "./LoadingWrapper";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => (
  <LoadingWrapper>
    <TopBar />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </LoadingWrapper>
);

export default MainLayout;
