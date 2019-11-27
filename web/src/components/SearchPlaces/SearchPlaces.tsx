import * as React from "react";
import * as ReactDOM from "react-dom";

import { Input } from "antd";

import "./_search-places.scss";

// @ts-ignore
const google = window.google;

const { Search } = Input;

interface SearchPlacesProps {
  onPlacesChanged: any;
}

class SearchPlaces extends React.Component<SearchPlacesProps> {
  searchBar: any;
  searchBarListener: any;
  readonly state: any;

  constructor(props: SearchPlacesProps) {
    super(props);

    this.state = {
      location: ""
    };
  }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      if (!this.state.location.length) return this.props.onPlacesChanged(null);
      let data = this.searchBar.getPlaces();
      if (data && data[0].formatted_address)
        this.setState({ location: data[0].formatted_address });

      this.props.onPlacesChanged(data);
    }
  };
  componentDidMount() {
    let input = document.getElementById("search-text");

    this.searchBar = new google.maps.places.SearchBox(input);
    this.searchBarListener = this.searchBar.addListener(
      "places_changed",
      this.onPlacesChanged
    );
  }
  componentWillUnmount() {
    google.maps.event.removeListener(this.searchBarListener);
  }

  clearInput = () => {
    this.setState({ location: "" });
  };

  render() {
    return (
      <Search
        id="search-text"
        value={this.state.location}
        placeholder="Search Location..."
        onChange={e => {
          this.setState({ location: e.target.value });
        }}
        onSearch={this.onPlacesChanged}
        onClick={this.clearInput}
        className="search-places"
        size="large"
      />
    );
  }
}

export default SearchPlaces;
