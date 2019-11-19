import * as React from "react";
import * as ReactDOM from "react-dom";
import { Input } from "semantic-ui-react";

// @ts-ignore
const google = window.google;

interface State {
  readonly value: string;
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
      value: ""
    };

    this.placesChanged = this.placesChanged.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let input = ReactDOM.findDOMNode(this.refs.location_input);

    this.searchBar = new google.maps.places.SearchBox(input);
    this.searchBarListener = this.searchBar.addListener(
      "places_changed",
      this.placesChanged
    );
  }

  componentWillUnmount() {
    google.maps.event.removeListener(this.searchBarListener);
  }
  //@ts-ignore
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  placesChanged() {
    this.searchBar.getPlaces();
    let data = this.searchBar.getPlaces();

    if (!data || !data.length) return;

    let lat = data[0].geometry.location.lat();
    let lng = data[0].geometry.location.lng();
    let address = data[0].formatted_address;

    this.props.onChange({ lat: lat, lng: lng, address: address });
  }

  render() {
    return (
      <div className="ui large icon input location-input">
        <input
          data-lpignore
          ref="location_input"
          id="location-input"
          type="text"
          onChange={this.placesChanged}
          onFocus={() => {
            // @ts-ignore
            ReactDOM.findDOMNode(this.refs.location_input).value = "";
          }}
          placeholder=""
        />
      </div>
    );
  }
}
