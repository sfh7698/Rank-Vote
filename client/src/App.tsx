import React from "react";
import { Navigator } from "react-onsenui";
import { Home, WaitingRoom } from "./pages";
import { Route } from "./utils";
import { useAppSelector } from "./hooks/useAppSelector";
import { selectPayloadFromToken, setToken } from "./app/slices/authSlice";
import { useAppDispatch } from "./hooks/useAppDispatch";

function App() {

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

    const payload = useAppSelector(selectPayloadFromToken);
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

    useAppDispatch()(setToken(token));

    return waitingRoomRoute;
  }

  return (
    <Navigator
      initialRoute={getInitialRoute()}
      renderPage={renderPage}
    />
  )
}

export default App
