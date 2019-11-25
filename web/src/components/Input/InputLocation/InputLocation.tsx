import * as React from "react";
import * as ReactDOM from "react-dom";
import { Input } from "antd";

// @ts-ignore
const google = window.google;

const { Search } = Input;

interface State {
  readonly location: string;
}
interface InputProps {
  onChange: any;
}
export class InputLocation extends React.Component<InputProps, State> {
  readonly state: State;
  searchBar: any;
  searchBarListener: any;

  constructor(props: InputProps) {
    super(props);

    this.state = {
      location: ""
    };
  }

  componentDidMount = () => {
    let input = document.getElementById("location-input");

    this.searchBar = new google.maps.places.SearchBox(input);
    this.searchBarListener = this.searchBar.addListener(
      "places_changed",
      this.placesChanged
    );
  };

  componentWillUnmount() {
    google.maps.event.removeListener(this.searchBarListener);
  }

  placesChanged = () => {
    let data = this.searchBar.getPlaces();

    if (!data || !data.length) return;

    let lat = data[0].geometry.location.lat();
    let lng = data[0].geometry.location.lng();
    let address = data[0].formatted_address;

    this.setState({ location: data[0].formatted_address });
    this.props.onChange({ lat: lat, lng: lng, address: address });
  };

  clearInput = () => {
    this.setState({ location: "" });
  };

  render() {
    return (
      <Input
        id="location-input"
        value={this.state.location}
        placeholder="Search Location..."
        onBlur={this.placesChanged}
        onChange={e => {
          this.setState({ location: e.target.value });
        }}
        onClick={this.clearInput}
        size="large"
      />
    );
  }
}
