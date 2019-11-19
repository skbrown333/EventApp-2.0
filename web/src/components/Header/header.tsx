import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Placeholder,
  Button,
  Modal,
  Icon,
  Input,
  Dropdown,
  Form
} from "semantic-ui-react";
import { updateCenter } from "../../store/actions";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";
import SearchPlaces from "../SearchPlaces/SearchPlaces";
import { InputLocation } from "../Input/InputLocation/InputLocation";
import Dropzone from "react-dropzone";

/* Styles */
import "./_header.scss";

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
        <Modal trigger={<Button icon="add" content="Create Event"></Button>}>
          <Modal.Header style={{ background: "#f2f4f8" }}>
            Create Event
          </Modal.Header>
          <Modal.Content
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Dropzone
              onDrop={acceptedFiles => {
                const reader = new FileReader();

                reader.onabort = () => console.log("file reading was aborted");
                reader.onerror = () => console.log("file reading has failed");
                reader.onload = () => {
                  // Do whatever you want with the file contents
                  let image = reader.result;
                  this.setState({ image });
                };
                reader.readAsDataURL(acceptedFiles[0]);
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone-container">
                  <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {!image ? (
                      <Icon
                        size="massive"
                        style={{ color: "#d8d8d8" }}
                        name="image outline"
                      />
                    ) : null}
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        style={{ width: "200px", height: "200px" }}
                      />
                    ) : null}
                  </div>
                </section>
              )}
            </Dropzone>
            <Form className="event-form">
              <Form.Field className="container">
                <label>Title</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container">
                <label>Date</label>
                <SemanticDatepicker />
              </Form.Field>
              <Form.Field className="container">
                <label>Start Time</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container">
                <label>End Time</label>
                <input data-lpignore="true" placeholder="" />
              </Form.Field>
              <Form.Field className="container location">
                <label>Location</label>
                <InputLocation onChange={() => {}} />
              </Form.Field>
              <Form.Field className="container location">
                <label>Description</label>
                <textarea />
              </Form.Field>
              <Button className="submit-event" type="submit" fluid primary>
                Submit
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
        <Placeholder className="header__icon"></Placeholder>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateCenter: (center: any) => dispatch(updateCenter(center))
});

const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
