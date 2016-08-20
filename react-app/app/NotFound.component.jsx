import React, { Component } from "react";

/**
 * View to be shown when user accesses non-existent route e.g. /asdf
 */
export default class NotFound extends Component {

  render() {
    return (
      <div>
        <p>Page not found.</p>
      </div>
    );
  }
}
