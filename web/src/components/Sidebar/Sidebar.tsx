import React, { Component } from "react";
import { connect } from "react-redux";
import { Placeholder } from "semantic-ui-react";
import { Input, Divider } from "antd";

/* Store */
import { updateCenter, updateZoom } from "../../store/actions";

/* Styles */
import "./_sidebar.scss";

const { Search } = Input;

class Sidebar extends Component<any, any> {
  getEvents = () => {
    let eventRows = [];
    let events = this.props.events;
    for (var i = 0; i < events.length; i++) {
      let event = events[i];

      eventRows.push(
        <>
          <div
            className="event"
            key={event._id}
            onClick={() => {
              this.props.updateCenter({ lat: event.lat, lng: event.lng });
              this.props.updateZoom(13);
            }}
          >
            <Placeholder className="header__icon"></Placeholder>
            <div className="name">{event.title}</div>
          </div>
          <Divider />
        </>
      );
    }

    return eventRows;
  };

  render() {
    return (
      <div className="sidebar">
        <Search className="sidebar__search" placeholder="Search..." />
        <div className="sidebar__list">{this.getEvents()}</div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateCenter: (center: any) => dispatch(updateCenter(center)),
    updateZoom: (zoom: any) => dispatch(updateZoom(zoom))
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    events: state.events,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
