import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"
import React, { Component } from 'react'
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import Tasks from "./Tasks";
import "./Home.css"
import Daily from "./Daily";
import Weekly from "./Weekly";
import moment from "moment/moment";

export default class Home extends Component {
  constructor()
  {
    super()
    this.state = {
      date : moment().format("MM/DD/YYYY")
    }
  }
  handleCalendar=(e,value)=>{
    //console.log(e.toLocaleDateString())
    this.setState({
      date: e.toLocaleDateString()
    })
    console.log(this.state.date)
  }

  render() {
    return (
    <div>
        <Navbar/>
        <Header/>
        <div className="Tasks">
          <Calendar onChange={this.handleCalendar} value={this.state.date}/>
          <Tasks date={this.state.date}/>
        </div>
        <div className="Daily">
          <span className="DailyTitle"> Daily Tasks </span>
          <Daily/>
          <span className="WeeklyTitle"> Weekly Tasks </span>
          <Weekly/>
        </div>
    </div>
    )
  }
}