// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer
      className="text-center text-lg-start text-white"
      style={{ backgroundColor: "#1c2331" }}
    >
      {/* Section: Social media */}
      <section
        className="d-flex justify-content-between p-4"
        style={{ backgroundColor: "#6351ce" }}
      >
        
      </section>
      {/* Section: Social media */}

      {/* Section: Links */}
      <section className="">
        <div className="container text-center text-md-start mt-5">
          {/* Grid row */}
          <div className="row mt-3">
            {/* Grid column */}
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              {/* Content */}
              <h6 className="text-uppercase fw-bold">Paint Inventory Ltd.</h6>
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{
                  width: "60px",
                  backgroundColor: "#7c4dff",
                  height: "2px",
                }}
              />
              <p>
                This is a simple internal paint inventory tracker tool. Painter, Supply coordinator, Supervisors and Admin persons can use this
              </p>
            </div>
            {/* Grid column */}

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              {/* Links */}
              <h6 className="text-uppercase fw-bold">Contact</h6>
              <hr
                className="mb-4 mt-0 d-inline-block mx-auto"
                style={{
                  width: "60px",
                  backgroundColor: "#7c4dff",
                  height: "2px",
                }}
              />
              <p>
                <i className="fas fa-home mr-3"></i> British Columbia Head office
              </p>
              
            </div>
            {/* Grid column */}
          </div>
          {/* Grid row */}
        </div>
      </section>
      {/* Section: Links */}

      {/* Copyright */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2024 Copyright:
        <a className="text-white" href="">
          Paint Inventory Ltd.
        </a>
      </div>
      {/* Copyright */}
    </footer>
  );
};

export default Footer;
