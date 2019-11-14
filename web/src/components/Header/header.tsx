import React, { Component } from "react";
import { connect } from "react-redux";
import { Placeholder, Button, Modal, Icon, Input, Dropdown } from "semantic-ui-react";
import { updateCenter } from "../../store/actions";

/* Styles */
import "./_header.scss";

class Header extends Component<any, any> {
  readonly state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      loadingLocation: false,
      filterOpen: false
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
    this.setState({filterOpen: true});
  }

  toggleFilterClosed = () => {
    this.setState({filterOpen: false});
  }

  render() {
    const { loadingLocation, filterOpen } = this.state;
    return (
      <div className="header">
        <Button.Group style={{ marginRight: "8px" }}>
          <Button icon="search" />
          <Button icon="location arrow" onClick={this.getMyLocation} loading={loadingLocation} disabled={loadingLocation} />
          <Dropdown
            icon='filter'
            floating
            button
            className='icon'
            open={filterOpen}
            onClick={this.toggleFilterOpen}
            onBlur={this.toggleFilterClosed}
          >
            <Dropdown.Menu>
              <Input icon='search' iconPosition='left' name='search' />
              <Dropdown.Divider />
              <Dropdown.Item
                label={{ color: 'red', empty: true, circular: true }}
                text='Important'
              />
              <Dropdown.Item
                label={{ color: 'blue', empty: true, circular: true }}
                text='Announcement'
              />
              <Dropdown.Item
                label={{ color: 'black', empty: true, circular: true }}
                text='Discussion'
              />
            </Dropdown.Menu>
          </Dropdown>
        </Button.Group>
        <Modal
          dimmer={"blurring"}
          trigger={<Button icon="add" content="Create Event"></Button>}
        >
          <Modal.Header style={{ background: "#f2f4f8" }}>
            Create Event
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>Events can be created here</Modal.Description>
            <Icon
              size="massive"
              style={{ color: "#d8d8d8" }}
              name="image outline"
            />
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
