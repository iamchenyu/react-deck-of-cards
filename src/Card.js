import React from "react";
import "./Card.css";

const Card = ({ img, alt, angel }) => {
  return (
    <img
      className="Card"
      src={img}
      alt={alt}
      style={{ transform: `rotate(${angel}deg)` }}
    />
  );
};

export default Card;
