import React from "react";
import { Navigator } from "react-onsenui";
import { Route, waitingRoomRoute } from "./utils";
import { useAppSelector, useSetToken } from "./hooks";
import { selectPayloadFromToken } from "./app/slices/authSlice";
import { ErrorDisplay } from "./components";
import { isJwtPayload } from "./utils";
import { Home } from "./pages";

function App() {

  const payload = useAppSelector(selectPayloadFromToken);
  useSetToken();

  const renderPage = (route: Route, navigator: Navigator) => {
    route.props = route.props || {};
    route.props.navigator = navigator;
    return React.createElement(route.component, route.props);
  }
  
  function getInitialRoute(): Route {
    const token = localStorage.getItem('accessToken');
    
    const homeRoute: Route = {
      component: Home,
      props: {key: 'Home'}
    }

    if(!token){
      return homeRoute;
    }

    const currentTimeInSeconds = Date.now() / 1000;

    const tokenExp = isJwtPayload(payload) ? payload?.exp : null;
    
    if (tokenExp && (tokenExp < currentTimeInSeconds - 10)) {
      localStorage.removeItem('accessToken');
      return homeRoute;
    }

    return waitingRoomRoute;
  }

  return (
    <>
      <ErrorDisplay duration={3000} />
      <Navigator
        initialRoute={getInitialRoute()}
        renderPage={renderPage}
      />
    </>
  )
}

export default App
