//                   Necesary Imports
// ---------------x--------------------x---------------
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
//                    UI Components
// ---------------x--------------------x---------------
import { Typography } from "@material-ui/core";
//                   Custom Components
// ---------------x--------------------x---------------
import NotesContainer from "./NotesContainer";
import NavBar from "./NavBar";
import ShowNote from "./ShowNote";
import NewForm from "./NewForm";
import EditForm from "./EditForm";
//                       Actions
// ---------------x--------------------x---------------
import { fetchNotes } from "../actions/fetchNotes";
import { deleteNote } from "../actions/deleteNote";
import { markAsDone } from "../actions/markAsDone";
//                    Dashboard Page
// ---------------x--------------------x---------------
class Dashboard extends Component {
  //      Send LOGOUT action to store and re-directs
  // ---------------x--------------------x---------------
  handleLogoutClick = () => {
    axios
      .delete("http://localhost:3001/logout", {
        withCredentials: true,
      })
      .then((response) => {
        this.props.handleLogout();
        this.props.history.push("/login");
      })
      .catch((error) => console.log("Error", error));
  };

  //              Fetch Note Data from API
  // ---------------x--------------------x---------------
  componentDidMount() {
    if (this.props.user.id) {
      const userId = this.props.user.id;
      const API = `http://localhost:3001/users/${userId}/notes`;
      fetch(API)
        .then((response) => response.json())
        .then((data) => this.props.fetchNotes(data.notes))
        .catch((error) => console.log(error));
    }
  }

  //       Fetches data if there is already a cookie
  // ---------------x--------------------x---------------
  componentDidUpdate(prevProps) {
    if (!prevProps.user.id) {
      const userId = this.props.user.id;
      const API = `http://localhost:3001/users/${userId}/notes`;

      fetch(API)
        .then((response) => response.json())
        .then((data) => this.props.fetchNotes(data.notes))
        .catch((error) => console.log(error));
    }
  }
  //                   Deletes a note
  // ---------------x--------------------x---------------
  handleDelete = (noteId) => {
    const API = `http://localhost:3001/notes/${noteId}`;
    axios.delete(API).then((response) => console.log(response));
    this.props.deleteNote(noteId);
  };

  //              Marks a note as completed
  // ---------------x--------------------x---------------
  handleDone = (noteObj) => {
    const { id, title, description, done } = noteObj;
    const API = `http://localhost:3001/notes/${id}`;

    axios
      .patch(API, {
        title: title,
        description: description,
        done: !done,
      })
      .then((response) => console.log("RESPONSE ---", response));

    this.props.markAsDone(noteObj);
  };

  //   Displays the New Form when the button is clicked
  // ---------------x--------------------x---------------
  handleNewClick = () => {
    this.props.history.push("/notes/new");
  };

  //                  Renders: NavBar, NotesContainer
  //                  Routes: /notes => Dashboard
  //                          /notes/:noteId/edit => EditForm
  //                          /notes/new => NewForm
  //                          /notes/:noteId => ShowNote
  // ---------------x--------------------x---------------
  render() {
    return (
      <div id="page-container">
        <NavBar
          user={this.props.user}
          handleLogoutClick={this.handleLogoutClick}
          handleNewClick={this.handleNewClick}
        />
        <Switch>
          <Route
            exact
            path={"/notes"}
            render={(routerProps) => (
              <div>
                <Typography
                  variant="h1"
                  style={{
                    marginTop: "100px",
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#FFF",
                    fontSize: "70px",
                  }}
                >
                  <span style={{ color: "#66e2d5" }}># </span>
                  Dashboard
                </Typography>
                <NotesContainer
                  {...routerProps}
                  handleDelete={this.handleDelete}
                  handleDone={this.handleDone}
                />
              </div>
            )}
          />

          <Route
            exact
            path={"/notes/new"}
            render={(routerProps) => (
              <NewForm {...routerProps} userId={this.props.user.id} />
            )}
          />

          <Route
            exact
            path={"/notes/:noteId"}
            render={(routerProps) => (
              <ShowNote {...routerProps} handleDelete={this.handleDelete} />
            )}
          />

          <Route
            exact
            path={"/notes/:noteId/edit"}
            render={(routerProps) => (
              <EditForm {...routerProps} userId={this.props.user.id} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { notes: state.notes };
};

export default connect(mapStateToProps, { fetchNotes, deleteNote, markAsDone })(
  Dashboard
);
