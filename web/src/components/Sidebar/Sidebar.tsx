import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Placeholder } from "semantic-ui-react";

/* Store */
import { updateCenter } from "../../store/actions";

/* Styles */
import "./_sidebar.scss";

class Sidebar extends Component<any, any> {
  getEvents = () => {
    let eventRows = [];
    let events = this.props.events;
    for (var i = 0; i < events.length; i++) {
      let event = events[i];

      eventRows.push(
        <div
          className="event"
          key={event._id}
          onClick={() => {
            this.props.updateCenter({ lat: event.lat, lng: event.lng });
          }}
        >
          <Placeholder className="header__icon"></Placeholder>
          <div className="name">{event.title}</div>
        </div>
      );
    }

    return eventRows;
  };

  render() {
    return (
      <div className="sidebar">
        <Input icon="search" placeholder="Search..." />
        {this.getEvents()}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateCenter: (center: any) => dispatch(updateCenter(center))
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    events: state.events,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
