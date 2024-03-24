import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Container = ({ children }) => {
  return (
    <div>
      <Header />
      <div
        className="container"
        style={{ padding: "20px", marginBottom: "100px" }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default Container;