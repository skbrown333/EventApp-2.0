import React, { Component } from "react";
import { connect } from "react-redux";
import { Input } from "semantic-ui-react";

/* Styles */
import "./_sidebar.scss";

class Sidebar extends Component<any, any> {
  render() {
    return (
      <div className="sidebar">
        <Input icon="search" placeholder="Search..." />
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

export default connect(mapStateToProps, null)(Sidebar);
