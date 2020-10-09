import React from "react";
import { useParams } from "react-router-dom";

const Detail: React.FC = () => {
  const params = useParams();
  console.log({ params });
  return <>Detail</>;
};

export default Detail;
