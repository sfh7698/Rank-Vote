import React from "react";
import { Navigator } from "react-onsenui";
import { WaitingRoom } from "./pages";
import { Route } from "./utils";
import { useAppSelector } from "./hooks/useAppSelector";
import { selectPayloadFromToken } from "./app/slices/authSlice";
import { ErrorDisplay } from "./components";
import { homeRoute } from "./utils";
import { useSetToken } from "./hooks/useSetToken";

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

    if(!token){
      return homeRoute;
    }

    const currentTimeInSeconds = Date.now() / 1000;

    const tokenExp = payload?.exp;

    if (tokenExp && (tokenExp < currentTimeInSeconds - 10)) {
      localStorage.removeItem('accessToken');
      return homeRoute;
    }

    const waitingRoomRoute: Route = {
      component: WaitingRoom,
      props: {
        key: "WaitingRoom"
      }
    }

    return waitingRoomRoute;
  }

  return (
    <>
      <ErrorDisplay />
      <Navigator
        initialRoute={getInitialRoute()}
        renderPage={renderPage}
      />
    </>
  )
}

export default App
