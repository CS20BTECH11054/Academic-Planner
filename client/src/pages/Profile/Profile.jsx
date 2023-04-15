import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"
import React, { Component } from 'react'
import "./Profile.css"

export default class Profile extends Component {
  render() {
    return (
    <div>
        <Navbar/>
        <Header pos="Profile"/>
        <div className="profilecontainer">
          <div className="profiletitle">Profile</div>
          <input className="inputtext" placeholder="EmailID"></input>
          <input className="inputtext" placeholder="currentsemester"></input>
          <button className="submitbutton">Submit</button>
        </div>
    </div>
    )
  }
}