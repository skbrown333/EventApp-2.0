import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Avatar, Skeleton, Icon, Dropdown, Menu } from "antd";
import { updateCenter, updateLocation } from "../../store/actions";

import SearchPlaces from "../SearchPlaces/SearchPlaces";

/* Styles */
import "./_header.scss";
import { Link } from "react-router-dom";

class Header extends Component<any, any> {
  readonly state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      loadingLocation: false,
      filterOpen: false,
      image: null,
      width: window.innerWidth
    };
  }

  componentDidMount = () => {
    this.setMyLocation();
    window.addEventListener("resize", this.updateWindowDimensions);
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  shouldComponentUpdate(nextProps) {
    console.log("nextProps: ", nextProps);
    return true;
  }

  setMyLocation: any = () => {
    const location = window.navigator && window.navigator.geolocation;
    let myLocation;

    if (location) {
      location.getCurrentPosition(
        position => {
          myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.props.updateLocation(myLocation);
        },
        error => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  };
  getMyLocation: any = () => {
    this.setState({ loadingLocation: true });
    const location = window.navigator && window.navigator.geolocation;
    let myLocation;

    if (location) {
      location.getCurrentPosition(
        position => {
          myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.props.updateCenter(myLocation);
          this.props.updateLocation(myLocation);
          this.setState({ loadingLocation: false });
        },
        error => {
          this.setState({ loadingLocation: false });
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  };

  toggleFilterOpen = () => {
    this.setState({ filterOpen: true });
  };

  toggleFilterClosed = () => {
    this.setState({ filterOpen: false });
  };

  onSearch = (data: any[]) => {
    if (!data || !data.length) return;

    let _center = {
      lat: data[0].geometry.location.lat(),
      lng: data[0].geometry.location.lng()
    };

    this.props.updateCenter(_center);
  };

  render() {
    const { loadingLocation, filterOpen, image } = this.state;

    return (
      <div className="header">
        <Link to="/" className="logo">
          <Skeleton className="header__icon" avatar />
        </Link>
        <SearchPlaces onPlacesChanged={this.onSearch} />
        {!this.state.width || this.state.width > 600 ? (
          <>
            <Button.Group style={{ marginRight: "8px" }} size="large">
              <Button
                icon="environment"
                onClick={this.getMyLocation}
                loading={loadingLocation}
                disabled={
                  loadingLocation || this.props.location.pathname !== "/"
                }
              />
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>Filter</Menu.Item>
                  </Menu>
                }
              >
                <Button icon="filter" />
              </Dropdown>
            </Button.Group>
            <Link to="/create-event">
              <Button
                icon="plus"
                type="primary"
                size="large"
                style={{ fontWeight: "bold" }}
              >
                Create Event
              </Button>
            </Link>
          </>
        ) : (
          <></>
        )}
        <Avatar
          shape="square"
          icon="user"
          className="header__avatar"
          size="large"
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateCenter: (center: any) => dispatch(updateCenter(center)),
  updateLocation: (current_location: any) =>
    dispatch(updateLocation(current_location))
});

const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
