import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Table, Thead, Th, unsafe } from "reactable";
import moment from "moment";
import ThesisList from "../thesis/ThesisList.component";

export class CouncilmeetingShow extends Component {
  constructor() {
    super();
    this.state = {
      index: "",
      previousMeeting: {},
      currentMeeting: {},
      nextMeeting: {},
      filteredTheses: [],
      selectedTheses: [],
      searchedTheses: [],
    };
  }

  componentWillMount() {
    const foundIndex = this.findIndexFromProps(this.props);
    const previousMeeting = foundIndex > 0 ? this.props.councilmeetings[foundIndex - 1] : "";
    const currentMeeting = this.props.councilmeetings[foundIndex];
    const nextMeeting = foundIndex === this.props.councilmeetings.length - 1 ? "" : this.props.councilmeetings[foundIndex + 1];
    const filteredTheses = this.filterThesesByMeeting(this.props.theses, currentMeeting);
    this.setState({
      index: foundIndex,
      previousMeeting,
      currentMeeting,
      nextMeeting,
      filteredTheses,
      selectedTheses: [],
      searchedTheses: [],
    });
  }

  // componentWillReceiveProps(newProps) {
  //   this.findCMFromProps(newProps);
  // }

  incrementIndex(forward) {
    const index = forward ? this.state.index + 1 : this.state.index - 1;
    const previousMeeting = index > 0 ? this.props.councilmeetings[index - 1] : "";
    const currentMeeting = this.props.councilmeetings[index];
    const nextMeeting = index === this.props.councilmeetings.length - 1 ? "" : this.props.councilmeetings[index + 1];
    const filteredTheses = this.filterThesesByMeeting(this.props.theses, currentMeeting);
    this.setState({
      index,
      previousMeeting,
      currentMeeting,
      nextMeeting,
      filteredTheses,
      selectedTheses: [],
      searchedTheses: [],
    });
  }

  filterThesesByMeeting(theses, meeting) {
    return theses.filter(thesis => {
      if (thesis.CouncilMeetingId === meeting.id) {
        return thesis;
      }
    });
  }

  findIndexFromProps(props) {
    let foundIndex;
    if (props.params.id !== "next") {
      let cmID;
      try {
        cmID = parseInt(props.params.id, 10);
      } catch (e) {
        return;
      }
      foundIndex = props.councilmeetings.findIndex(meeting => {
        if (meeting.id === cmID) {
          return meeting;
        }
      });
    } else {
      foundIndex = this.findNextMeeting(new Date(), props.councilmeetings);
    }
    return foundIndex;
  }

  /**
   * Finds the index of closest date including today from sorted list of CouncilMeetings
   */
  findNextMeeting(starting, meetings) {
    return meetings.findIndex(meeting => {
      const date = new Date(meeting.date);
      if (date >= starting || date.toDateString() === starting.toDateString()) {
        return meeting;
      }
    });
  }

  handleClick(name, event) {
    event.preventDefault();
    if (name === "download") {
      const IDs = this.state.filteredTheses.reduce((previousValue, currentValue, index) => {
        if (this.state.selectedTheses[index] && this.state.searchedTheses[index]) {
          return [...previousValue, currentValue.id];
        }
        return previousValue;
      }, []);
      this.props.downloadTheses(IDs);
    } else if (name === "previous" && this.state.previousMeeting.id !== undefined) {
      browserHistory.replace(`/councilmeeting/${this.state.previousMeeting.id}`);
      this.incrementIndex(false);
    } else if (name === "next" && this.state.nextMeeting.id !== undefined) {
      browserHistory.replace(`/councilmeeting/${this.state.nextMeeting.id}`);
      this.incrementIndex(true);
    }
  }

  render() {
    return (
      <div>
        <div className="m-bot">
          { this.state.previousMeeting.date !== undefined ?
            <button className="ui button blue" onClick={this.handleClick.bind(this, "previous")}>Previous</button>
              :
            <span></span>
          }
          { this.state.nextMeeting.date !== undefined ?
            <button className="ui button blue" onClick={this.handleClick.bind(this, "next")}>Next</button>
              :
            <span></span>
          }
          <h2 className="ui dividing header" style={{ "marginTop": "10px" }}>
            { this.state.currentMeeting !== undefined ?
              <span>
                Councilmeeting of { moment(new Date(this.state.currentMeeting.date)).format("DD/MM/YYYY") }
              </span>
              :
              <span>
                No Councilmeeting found
              </span>
            }
          </h2>

          <p>
            It will take approximately 30 seconds for 20 theses to be bundled into one
            downloadable document.
          </p>
          <button className="ui button blue" onClick={this.handleClick.bind(this, "download")}>Download selected</button>
        </div>
        <ThesisList theses={this.state.filteredTheses} selected={this.state.selectedTheses}
          searched={this.state.searchedTheses}
        />
      </div>
    );
  }
}

import { connect } from "react-redux";
import { getTheses, downloadTheses } from "../thesis/thesis.actions";

const mapStateToProps = (state) => {
  const auth = state.get("auth");
  const cm = state.get("councilmeeting");
  const thesis = state.get("thesis");
  return {
    user: auth.get("user").toJS(),
    councilmeetings: cm.get("councilmeetings").toJS(),
    theses: thesis.get("theses").toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  getTheses() {
    dispatch(getTheses());
  },
  downloadTheses(theses) {
    dispatch(downloadTheses(theses));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CouncilmeetingShow);
