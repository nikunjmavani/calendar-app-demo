import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RightArrowIcon from '@material-ui/icons/ChevronRight';
import LeftArrowIcon from '@material-ui/icons/ChevronLeft';

import './App.css';

export default class CalendarToolbar extends Toolbar {

	componentDidMount() {
		const view = this.props.view;
    }

	render() {
		return (
			<div className="custom-toolbar">
				<div className="rbc-btn-group">
                    <IconButton onClick={() => this.navigate('PREV')}><LeftArrowIcon fontSize="small" /></IconButton> 
                    <Button size="large" onClick={() => this.navigate('TODAY')}>
                        Today
                    </Button>
                    <IconButton onClick={() => this.navigate('NEXT')}><RightArrowIcon fontSize="small" /></IconButton>                    
				</div>
				<div className="rbc-toolbar-label">{this.props.label}</div>
				<div className="rbc-btn-group">
                    <Button variant={this.props.view === 'month' ? "outlined" : ""} size="large" onClick={this.view.bind(null, 'month')}>
                        Month
                    </Button>
                    <Button variant={this.props.view === 'week' ? "outlined" : ""} size="large" onClick={this.view.bind(null, 'week')}>
                        Week
                    </Button>
				</div>
			</div>
		);
	}
}