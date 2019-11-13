import React, { Component } from "react";
import { connect } from "react-redux";
import { Placeholder, Button, Modal, Icon } from "semantic-ui-react";

/* Styles */
import "./_header.scss";

class Header extends Component<any, any> {
  render() {
    return (
      <div className="header">
        <Modal trigger={<Button icon="add" content="Create Event"></Button>}>
          <Modal.Header style={{ background: "#f2f4f8" }}>
            Create Event
          </Modal.Header>
          <Modal.Content>
            <Modal.Description>Events can be created here</Modal.Description>
            <Icon
              round
              size="massive"
              style={{ color: "#d8d8d8" }}
              name="image outline"
            />
          </Modal.Content>
        </Modal>
        <Placeholder className="header__bar">
          <Placeholder.Image />
          <Placeholder.Image />
        </Placeholder>
        <Placeholder className="header__icon"></Placeholder>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    state: state,
    cookies: ownProps.cookies
  };
};

export default connect(mapStateToProps, null)(Header);
