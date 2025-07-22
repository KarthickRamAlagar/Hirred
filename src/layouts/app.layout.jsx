import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background" />
      <main className="min-h-screen container ">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center text-xl bg-gray-800 mt-10">
        Made with 💗 by KarthickRamAlagar
      </div>
    </div>
  );
};

export default AppLayout;
