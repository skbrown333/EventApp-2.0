import * as React from "react";

/* Components */

import { EventPinProps } from "./EventPin.interfaces";

/* Services */

/* Styles */
import "./_event-pin.scss";

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
    return (
      <div className="event-pin">
        <img
          className={"event-pin__icon " + this.state.class}
          src={`https://s3.amazonaws.com/photos.priestly.app/users/5b59e45526bbe3154f60e53c/events/${this.props.event._id}/${this.props.event._id}.png`}
          alt=""
        />
      </div>
    );
  }
}
