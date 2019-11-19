import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Placeholder,
  Button,
  Modal,
  Input,
  Dropdown,
} from "semantic-ui-react";
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
      image: null
    };
  }

  componentDidMount = () => {
    this.setMyLocation();
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
        error => {
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }
  }
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
          <Placeholder className="header__icon"></Placeholder>
        </Link>
        <SearchPlaces onPlacesChanged={this.onSearch} />
        <Button.Group style={{ marginRight: "8px" }}>
          <Button
            icon="location arrow"
            onClick={this.getMyLocation}
            loading={loadingLocation}
            disabled={loadingLocation}
          />
          <Dropdown
            icon="filter"
            floating
            button
            className="icon"
            open={filterOpen}
            onClick={this.toggleFilterOpen}
            onBlur={this.toggleFilterClosed}
          >
            <Dropdown.Menu>
              <Input icon="search" iconPosition="left" name="search" />
              <Dropdown.Divider />
              <Dropdown.Item
                label={{ color: "red", empty: true, circular: true }}
                text="Important"
              />
              <Dropdown.Item
                label={{ color: "blue", empty: true, circular: true }}
                text="Announcement"
              />
              <Dropdown.Item
                label={{ color: "black", empty: true, circular: true }}
                text="Discussion"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Button.Group>
        <Link to='/create-event'>
          <Button icon="add" content="Create Event"></Button>
        </Link>
        <Placeholder className="header__icon"></Placeholder>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateCenter: (center: any) => dispatch(updateCenter(center)),
  updateLocation: (current_location: any) => dispatch(updateLocation(current_location))
});

const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
