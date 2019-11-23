import * as React from "react";
import * as ReactDOM from "react-dom";

import "./_search-places.scss";

// @ts-ignore
const google = window.google;

interface SearchPlacesProps {
  onPlacesChanged: any;
}

class SearchPlaces extends React.Component<SearchPlacesProps> {
  searchBar: any;
  searchBarListener: any;

  constructor(props: SearchPlacesProps) {
    super(props);

    this.onPlacesChanged = this.onPlacesChanged.bind(this);
  }
  onPlacesChanged() {
    if (this.props.onPlacesChanged) {
      this.searchBar.getPlaces();

      let data = this.searchBar.getPlaces();
      this.props.onPlacesChanged(data);
    }
  }
  componentDidMount() {
    let input = ReactDOM.findDOMNode(this.refs.input);

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
    let input: any = ReactDOM.findDOMNode(this.refs.input);
    input.value = "";
  };

  render() {
    return (
      <div className="ui large icon input search-places" style={{ height: 40 }}>
        <input
          ref="input"
          id="search-input"
          type="text"
          onChange={this.onPlacesChanged}
          onClick={this.clearInput}
          placeholder="Search..."
        />
        <i aria-hidden="true" className="search icon"></i>
      </div>
    );
  }
}

export default SearchPlaces;
