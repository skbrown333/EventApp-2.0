import * as React from "react";

/* UI */
import { Popover } from "antd";

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
  }

  render() {
    const { event } = this.props;
    const content = (
      <div className="event-pin__hover">
        <img
          className={"event-pin__icon " + this.state.class}
          src={`https://s3.amazonaws.com/photos.priestly.app/users/${event.cre_account}/events/${event._id}/${event._id}.png`}
          alt=""
        />
        <p>{event.title}</p>
      </div>
    );

    return (
      <Popover content={content} trigger="hover">
        <div className="event-pin">
          <img
            className={"event-pin__icon " + this.state.class}
            src={`https://s3.amazonaws.com/photos.priestly.app/users/${event.cre_account}/events/${event._id}/${event._id}.png`}
            alt=""
          />
        </div>
      </Popover>
    );
  }
}
