import * as React from "react";

/* UI */
import { Popover, Card, Icon } from "antd";

/* Components */
import { EventPinProps } from "./EventPin.interfaces";

/* Services */

/* Styles */
import "./_event-pin.scss";

const { Meta } = Card;

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
      <Card
        style={{ width: 286 }}
        className="event-pin__hover"
        bordered={false}
        cover={
          <img
            src={`https://s3.amazonaws.com/photos.priestly.app/users/${event.cre_account}/events/${event._id}/${event._id}.png`}
          />
        }
        actions={[
          <Icon type="fire" key="fire" style={{ color: "orange" }} />,
          <Icon type="edit" key="edit" />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
      >
        <Meta title={event.title} description="This is the description" />
      </Card>
      // <div className="event-pin__hover">
      //   <img
      //     className={"event-pin__icon " + this.state.class}
      //     src={`https://s3.amazonaws.com/photos.priestly.app/users/${event.cre_account}/events/${event._id}/${event._id}.png`}
      //     alt=""
      //   />
      //   <Meta
      //     avatar={
      //       <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      //     }
      //     title="Card title"
      //     description="This is the description"
      //   />
      // </div>
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
