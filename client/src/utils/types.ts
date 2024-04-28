import { Navigator } from "react-onsenui";
import { Participants } from "shared";

type props = {
    key: string, 
    navigator?: Navigator | undefined,
    participants?: Participants
}

export type Route = {
  props: props
    component: (props: Route["props"]) => React.JSX.Element;
  }

  export type ApiError = {
    status: number,
    data: {
      message: string
    }
  }