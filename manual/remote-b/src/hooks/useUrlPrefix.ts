import { useRouteMatch } from "react-router-dom";

const useUrlPrefix = () => {
  const routeMatch = useRouteMatch("/b");
  return routeMatch ? `${routeMatch.path}/` : "/";
};

export default useUrlPrefix;
