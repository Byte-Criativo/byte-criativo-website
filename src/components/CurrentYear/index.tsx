import React from "react";

const CurrentYear: React.FC = () => {
  const year = new Date().getFullYear();

  return <span>{year}</span>;
};

export default CurrentYear;
