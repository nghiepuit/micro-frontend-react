import React from "react";
import { NavLink } from "react-router-dom";
import useUrlPrefix from "../../hooks/useUrlPrefix";

const List: React.FC = () => {
  const urlPrefix = useUrlPrefix();

  return (
    <ul>
      <li>
        <NavLink to={`${urlPrefix}details/1337`}>Item 1337</NavLink>
      </li>
      <li>
        <NavLink to={`${urlPrefix}details/4711`}>Item 4711</NavLink>
      </li>
    </ul>
  );
};

export default List;
