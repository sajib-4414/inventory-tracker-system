import React from "react";
import { ErrorProps } from "../interfaces/ErrorProps";

const Error = ({ errors }) => {
  return (
    <div className="alert alert-danger">
      <strong>Error:</strong>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error.error_details}</li>
        ))}
      </ul>
    </div>
  );
};

export default Error;
