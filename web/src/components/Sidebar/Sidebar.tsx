import React, { Component } from "react";
import { connect } from "react-redux";
import { Placeholder } from "semantic-ui-react";
import {
  Input,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Button,
  Skeleton,
  List,
  Avatar
} from "antd";

/* Store */
import { updateCenter, updateZoom } from "../../store/actions";

/* Styles */
import "./_sidebar.scss";
import { Link } from "react-router-dom";

const { Search } = Input;

class Sidebar extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      sort: "Distance"
    };
  }

  getDistance(event) {
    const { center } = this.props;

    if (event.lat == center.lat && event.lng == center.lng) {
      return 0;
    } else {
      let radlat1 = (Math.PI * event.lat) / 180;
      let radlat2 = (Math.PI * center.lat) / 180;
      let theta = event.lng - center.lng;
      let radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;

      if (dist >= 10) {
        dist = Math.round(dist);
      } else {
        dist = parseFloat((Math.round(dist * 4) / 4).toFixed(2));
      }

      return dist;
    }
  }

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
            <Skeleton
              avatar
              paragraph={{ rows: 2 }}
              className="event--skeleton"
            />
          </div>
          <Divider />
        </>
      );
    }

    return eventRows;
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item
          onClick={() => {
            this.setState({ sort: "distance" });
          }}
        >
          distance
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            this.setState({ sort: "interest" });
          }}
        >
          interest
        </Menu.Item>
      </Menu>
    );

    const { sort } = this.state;
    const { events } = this.props;

    return (
      <div className="sidebar">
        <Search
          className="sidebar__search"
          placeholder="Search..."
          size="large"
        />
        <div className="sidebar__sort-by">
          Sort By:
          <Dropdown overlay={menu} trigger={["hover"]}>
            <Button className="sidebar__sort-by__button">
              {sort}
              <Icon type="sliders" className="sidebar__sort-by__icon" />
            </Button>
          </Dropdown>
        </div>
        <List
          className="sidebar__list"
          itemLayout="vertical"
          dataSource={events}
          renderItem={(event: any) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.updateCenter({ lat: event.lat, lng: event.lng });
                this.props.updateZoom(13);
              }}
              actions={[
                <Icon
                  type="fire"
                  key="fire"
                  style={{ color: "orange" }}
                  onClick={() => {
                    console.log("Hello");
                  }}
                />,
                <Icon type="ellipsis" key="ellipsis" />,
                <Link to={`/events/${event._id}`}>
                  <Button type="link">View</Button>
                </Link>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://s3.amazonaws.com/photos.priestly.app/users/${event.cre_account}/events/${event._id}/${event._id}.png`}
                  />
                }
                title={<span>{event.title}</span>}
                description={this.getDistance(event) + " mi"}
              />
            </List.Item>
          )}
        />
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
    center: state.center,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
