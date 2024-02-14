import { Navigator } from "react-onsenui";

export type Route = {
  props: { 
    key: string,
    navigator?: Navigator
    [propName: string]: any
  }
    component: (props: Route["props"]) => React.JSX.Element;
  }

  export type ApiError = {
    status: number,
    data: {
      message: string
    }
  }