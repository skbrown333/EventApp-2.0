import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

/* Components */
import GoogleMapReact from "google-map-react";
import { EventPin } from "./EventPin/EventPin";
import { LocationPin } from "./LocationPin/LocationPin";

/* Dialogs */

import { updateCenter, updateZoom } from "../../store/actions";

/* Styles */
import "./_map.scss";

//@ts-ignore
const API_KEY: any = process.env.REACT_APP_GOOGLE_MAPS_KEY;

interface State {
  readonly eventPins: Array<any>;
  readonly center: any;
  readonly zoom: number;
  readonly searchOpen: boolean;
  readonly createEventOpen: boolean;
  readonly loading: boolean;
}

export class MapComponent extends React.Component<any, State> {
  readonly state: State;
  mapOptions: any;

  constructor(props: any) {
    super(props);

    this.state = {
      eventPins: [],
      center: this.props.center,
      zoom: this.props.zoom,
      searchOpen: false,
      createEventOpen: false,
      loading: false
    };

    this.mapOptions = {
      disableDefaultUI: true,
      gestureHandling: this.props.hideActions ? "none" : "greedy",
      enableHighAccuracy: true,
      clickableIcons: false
    };
  }

  /* LIFE CYCLE */
  componentDidMount() {
    this.setEventPins();
  }

  componentDidUpdate(nextProps) {
    console.log("nextProps: ", nextProps);
  }

  isLoading = () => {
    if (this.state.loading) {
      return null;
    } else {
      return null;
    }
  };

  /* LOCATION */
  onMapChange = (properties: any) => {
    if (!this.props.noUpdate) this.props.updateCenter(properties.center);
    //@ts-ignore
    this.props.history.push({
      pathname: "/",
      search:
        "?" +
        new URLSearchParams({
          lat: properties.center.lat,
          lng: properties.center.lng,
          zoom: properties.zoom
        }).toString()
    });
    this.props.updateZoom(properties.zoom);
  };

  setEventPins = () => {
    let events = this.props.events || [];
    let accounts = this.props.accounts || [];
    let eventPins = events.map((event: any) => {
      accounts.forEach((account: any) => {
        if (account._id === event.account) {
          event.account = account;
        }
      });
      return (
        <EventPin
          key={event._id}
          lat={event.lat}
          lng={event.lng}
          event={event}
        />
      );
    });
    this.setState({ eventPins: eventPins });
  };

  render() {
    const { current_location } = this.props;
    let locationPin;

    if (Object.keys(current_location).length) {
      locationPin = (
        <LocationPin
          key={"location-pin"}
          lat={current_location.lat}
          lng={current_location.lng}
          event={null}
        />
      );
    }
    return (
      <div className="map">
        {this.isLoading()}
        <GoogleMapReact
          ref="map"
          bootstrapURLKeys={{ key: API_KEY }}
          defaultCenter={{
            lat: 43.079,
            lng: -89.386408
          }}
          center={this.props.center}
          zoom={this.props.zoom}
          defaultZoom={15}
          onChange={this.onMapChange}
          options={this.mapOptions}
        >
          {this.state.eventPins}
          {locationPin}
        </GoogleMapReact>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    events: state.events,
    accounts: state.accounts,
    current_location: state.current_location,
    center: ownProps.center ? ownProps.center : state.center,
    zoom: state.zoom,
    cookies: ownProps.cookies
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateCenter: (center: any) => dispatch(updateCenter(center)),
  updateZoom: (zoom: any) => dispatch(updateZoom(zoom))
});

export const Map = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MapComponent));

export default Map;
