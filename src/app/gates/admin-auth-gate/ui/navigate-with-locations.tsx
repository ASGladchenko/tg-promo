import { Navigate, NavigateProps, useLocation } from "react-router";

export function NavigateWithLocations({ state, ...rest }: NavigateProps) {
  const location = useLocation();

  return <Navigate {...rest} state={{ ...state, from: location }} />;
}
