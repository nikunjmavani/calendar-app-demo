import React, { Component } from 'react';
import './App.css';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import BigCalendar from 'react-big-calendar';
import Toolbar from 'react-big-calendar/lib/Toolbar';
// import events from './events'
import moment from 'moment';
import CustomToolbar from './customToolbar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.scss';

const localizer = BigCalendar.momentLocalizer(moment);
let views = [BigCalendar.Views["MONTH"],BigCalendar.Views["WEEK"]]

class App extends Component {

  state = {
    events: [],
    isDialogOpen: false,
    openDialogDate: '',
    openDialogTitle: '',
    dropdownValue: 'Call with mate'
  }

  handleClickOnEvent = (e) => {
    this.setState({
      isDialogOpen: true,
      openDialogDate: e.start,
      openDialogTitle: e.title
    })
  }

  handleClickOnSlot = (e) => {
    if(e.action === "click") {
      this.setState({
        isDialogOpen: true,
        openDialogDate: e.start
      })
    }
  }
  
  handleClose = () => {
    this.setState({
      isDialogOpen: false,
      openDialogDate: '',
      openDialogTitle: ''
    })
  }

  // handle checkox change
  handleChangeCheckBox = event => {
    this.setState({ [event.target.name] : event.target.checked });
  };

  // handle dropdown change
  handleChangeDropDown = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  addEvent = (events, newEvent) => {

    let eventAdded = false;

    let updatedEvents = events.map(event => {
      if(event.start.getTime() === newEvent.start.getTime()) {
        if(event.title === newEvent.title) {
          eventAdded = true;
          return event
        } else {
          eventAdded = true;
          return newEvent;
        }
      } else {
        return event;
      }
    });

    if(eventAdded) {
      return updatedEvents
    } else {
      return [ ...updatedEvents, newEvent ]
    }
  } 

  generateEvents =  async () => {

    if(!this.state.checkbox) {

      let newEvent = {
          title: this.state.dropdownValue,
          // allDay: true,
          start: this.state.openDialogDate,
          end: moment(this.state.openDialogDate).endOf('day').toDate()
      };

      const updatedEvents = this.addEvent(this.state.events, newEvent);

      this.setState({
        events: updatedEvents,
        isDialogOpen: false,
        dropdownValue: 'Call with mate',
      });

    } else {
      let startDate = this.state.openDialogDate;
      let nextDate = startDate;
      let events = this.state.events;

      while(moment(nextDate).month() == moment(startDate).month()) {
        let newEvent = {
          title: this.state.dropdownValue,
          // allDay: true,
          start: nextDate,
          end: moment(nextDate).endOf('day').toDate()
        };
        events = await this.addEvent(events, newEvent);
        nextDate = moment(nextDate).add(1, 'week').toDate();
      }
      this.setState({
        events: events,
        isDialogOpen: false,
        checkbox: false,
        dropdownValue: 'Call with mate',
      })
    }
  }

  render() {
    const { openDialogDate, openDialogTitle } = this.state;
    const { classes } = this.props;

    return (
      <div className="App">

        {/* BigCalendar 
        events - all event we pass to calendar
        views - what views you want to show
        localizer - moment time zone
        onSelectEvent - when you click on any event */}
        <BigCalendar
          events={this.state.events}
          views={views}
          defaultDate={new Date(2015, 3, 1)}
          localizer={localizer}
          components = {{toolbar : CustomToolbar}}
          selectable={true}
          // onSelectEvent={event => this.handleClickOnEvent(event)}
          onSelectSlot={event => this.handleClickOnSlot(event) }
        />

        {/* Open this dialog box when click on any event */}
        <Dialog
          open={this.state.isDialogOpen}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth='xs'
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}> 
            <div> {moment(openDialogDate).format("dddd, MMMM Do YYYY")} </div> 
          </DialogTitle>
          <DialogContent>

            <div className="dialog-content" >
            <div> {openDialogTitle} </div>
              <select
                name="dropdownValue"
                style={{ marginTop: '12px' }}
                onChange={this.handleChangeDropDown}
              >
                <option value={'Call with mate'}>Call with mate</option>
                <option value={'Metting'}>Metting</option>
              </select>

              <div style={{ marginTop: '12px' }}> 
                <input type="checkbox" name="checkbox" onChange={this.handleChangeCheckBox} /> {`Apply to all ${moment(openDialogDate).format("dddd")} in this month`}
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

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: 12,
    minWidth: 120,
    maxWidth: 240,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});



export default withStyles(styles)(App);
