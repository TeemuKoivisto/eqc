import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Nav from "../ui/Nav.container";

export default class App extends Component {

  render() {
    return (
      <div>
        <h1 className="fancy-header">Gradut Pikaisesti Pakettiin</h1>
        </div>
        <Nav />
        <main className="main-container m-top">
          {this.props.children}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
};
