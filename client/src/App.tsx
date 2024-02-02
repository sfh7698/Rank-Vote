import React from "react";
import { Navigator } from "react-onsenui";
import { Home } from "./pages";
import { Route } from "./types";

function App() {

  const renderPage = (route: Route, navigator: Navigator) => {
    route.props = route.props || {};
    route.props.navigator = navigator;
    return React.createElement(route.component, route.props);
  }

  const initialRoute: Route = {
    component: Home,
    props: {key: 'Home'}
  }

  return (
    <Navigator
      initialRoute={initialRoute}
      renderPage={renderPage}
    />
  )
}

export default App
