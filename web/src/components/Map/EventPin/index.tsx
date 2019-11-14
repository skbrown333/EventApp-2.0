import * as React from "react";

/* Components */

import { EventPinProps } from "./EventPin.interfaces";

/* Services */

/* Icons */

interface State {
  readonly open: boolean;
  readonly class: string;
}

export class EventPin extends React.Component<EventPinProps, State> {
  readonly state: State = {
    open: false,
    class: ""
  };

  componentDidMount() {
    if (!this.props.event) return;
    let account: any = this.props.event.account;
  }

  render() {
    let event = this.props.event;
    return (
      <div className="event-pin">
        <img
          className={"event-pin__icon " + this.state.class}
          src="https://react.semantic-ui.com/images/wireframe/square-image.png"
          alt="https://react.semantic-ui.com/images/wireframe/square-image.png"
        />
      </div>
    );
  }
}
