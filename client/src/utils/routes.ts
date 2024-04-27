import { Route } from "."
import { WaitingRoom, Results } from "../pages"

export const waitingRoomRoute: Route = {
  component: WaitingRoom,
  props: {
    key: "WaitingRoom"
  }
}

export const resultsRoute: Route = {
  props: {
      key: "Results",
  },
  component: Results
}
