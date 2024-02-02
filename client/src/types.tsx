import { Navigator } from "react-onsenui";
type propTypes = any;

export type Route = {
  props: { 
    key: string,
    navigator?: Navigator
    [propName: string]: propTypes
  }
    component: (props: Route["props"]) => React.JSX.Element;
  }