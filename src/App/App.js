import React, { Component } from "react";
import "./App.css";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

import BigCalendar from "react-big-calendar";
import Toolbar from "react-big-calendar/lib/Toolbar";
// import events from './events'
import moment from "moment";
import CustomToolbar from "./customToolbar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.scss";

const localizer = BigCalendar.momentLocalizer(moment);
let views = [
  BigCalendar.Views["MONTH"],
  BigCalendar.Views["WEEK"]
];


// Main APP component
class App extends Component {
  state = {
    events: this.getEventsFromLocalStorage(),
    isDialogOpen: false,
    dialogDate: "",
    dialogTitle: "",
    dropdownValue: "Call with mate"
  };

  // Get events from local storage when you refresh the page 
  // If there isn't, It will return empty array
  getEventsFromLocalStorage() {
    if(localStorage.getItem("events")) {
      let events = JSON.parse(localStorage.getItem("events")) || [];
      events = events.map(event => {
        let obj = event;
        obj.start = new Date(event.start);
        obj.end = new Date(event.end);
        return obj; 
      });
      return events;
    } else {
      return []
    }
  }

  // Hanld click on slot - slot means every day box
  // If you click on that box or on date, below function will handle click event
  // and set clicked date to state.
  handleClickOnSlot = e => {
    if (e.action === "click") {
      this.setState({
        isDialogOpen: true,
        dialogDate: e.start
      });
    }
  };

  // When we close the  dialog box, below function will handle and set 
  // state appropriately
  handleClose = () => {
    this.setState({
      isDialogOpen: false,
      dialogDate: "",
      dialogTitle: ""
    });
  };

  // handle checkox which is there in dialog box change
  // when you checked the checkbox, below function will set state accordingly
  handleChangeCheckBox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  // handle dropdown which is there in dialog box change
  // when you change dropdown, below function will set state accordingly
  handleChangeDropDown = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Add event in events
  // It will hanlde if there is event already, then update the same.
  addEvent = (events, newEvent) => {
    let eventAdded = false;

    let updatedEvents = events.map(event => {
      if (event.start.getTime() === newEvent.start.getTime()) {
        if (event.title === newEvent.title) {
          eventAdded = true;
          return event;
        } else {
          eventAdded = true;
          return newEvent;
        }
      } else {
        return event;
      }
    });

    if (eventAdded) {
      return updatedEvents;
    } else {
      return [...updatedEvents, newEvent];
    }
  };

  // Generate the events when you submit the dialog box
  // Interanlly it uses add event function
  generateEvents = async () => {

    if (!this.state.checkbox) {

      // if checkbox isn't checked in modal, we only add one event
      let newEvent = {
        title: this.state.dropdownValue,
        allDay: true,
        start: this.state.dialogDate,
        end: moment(this.state.dialogDate)
          .endOf("day")
          .toDate()
      };

      const events = this.addEvent(this.state.events, newEvent);

      // store the events in local storage
      localStorage.setItem("events", JSON.stringify(events));

      // set events to state and reset the state
      this.setState({
        events: events,
        isDialogOpen: false,
        dropdownValue: "Call with mate"
      });
    } else {

      // if checkbox is checked in modal, we've to add for all coming same weekdays
      let startDate = this.state.dialogDate;
      let nextDate = startDate;
      let events = this.state.events;

      while (moment(nextDate).month() == moment(startDate).month()) {
        let newEvent = {
          title: this.state.dropdownValue,
          allDay: true,
          start: nextDate,
          end: moment(nextDate)
            .endOf("day")
            .toDate()
        };
        events = await this.addEvent(events, newEvent);
        nextDate = moment(nextDate)
          .add(1, "week")
          .toDate();
      }

      // store the events in local storage
      localStorage.setItem("events", JSON.stringify(events))

      console.log("development")

      // set events to state and reset the state
      this.setState({
        events: events,
        isDialogOpen: false,
        checkbox: false,
        dropdownValue: "Call with mate"
      });
    }
  };

  // render method will render main page
  render() {
    const { dialogDate, dialogTitle } = this.state;
    const { classes } = this.props;

    return (
      <div className="App">
        <div>
          <div className="info-div-wrapper">
            <div className="info-div">
              <div className="info-row">
                <InputLabel>
                  <strong> Whs : </strong>
                </InputLabel>
                <InputLabel>
                  <strong> Year : </strong> 2012
                </InputLabel>
              </div>
              <div className="info-row">
                <InputLabel>
                  <strong> Vendor ID : </strong>
                </InputLabel>
                <div />
              </div>
              <div className="info-row">
                <InputLabel>
                  <strong> SubV : </strong>
                </InputLabel>
                <InputLabel>
                  <strong> Type : </strong> RT - Receipt Date
                </InputLabel>
              </div>
              <div className="info-row">
                <InputLabel>
                  <strong> ItemID : </strong>
                </InputLabel>
                <div />
              </div>
            </div>
          </div>

          {/* BigCalendar 
              This is the calendar component, we use for different month and week view.
              Below is the props information, which we've passed
              /############/
              events - all event we pass to calendar component
              views - what views you want to show [ MONTH, WEEK ]
              localizer - moment time zone  - localize 
              components - Designed custom toolbar
              onSelectEvent - when you click on any event */}
          <BigCalendar
            events={this.state.events}
            views={views}
            defaultDate={new Date()}
            localizer={localizer}
            components={{ toolbar: CustomToolbar }}
            selectable={true}
            onSelectSlot={event => this.handleClickOnSlot(event)}
          />
        </div>

        {/* Open this dialog box when click on any event */}
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth="xs"
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <div> {moment(dialogDate).format("dddd, MMMM Do YYYY")} </div>
          </DialogTitle>
          <DialogContent>
            <div className="dialog-content">
              <div> {dialogTitle} </div>
              <span> RC - Receive </span>
              <select
                name="dropdownValue"
                style={{ marginTop: "12px" }}
                onChange={this.handleChangeDropDown}
              >
                <option value={"Call with mate"}>Call with mate</option>
                <option value={"Metting"}>Metting</option>
              </select>

              <div style={{ marginTop: "12px" }}>
                <input
                  type="checkbox"
                  name="checkbox"
                  onChange={this.handleChangeCheckBox}
                />
                {`Apply to all ${moment(dialogDate).format("dddd")} in this month`}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button onClick={this.generateEvents}> OK </button>
            <button onClick={this.handleClose}> Cancel </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// Styel we apply to current component only
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  formControl: {
    marginTop: 12,
    minWidth: 120,
    maxWidth: 240
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

// Dialog title for close button on right
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default withStyles(styles)(App);
