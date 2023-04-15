import "./Navbar.css"

import React, { Component } from 'react'

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <div className="navbar">
            <div className="navbarcontainer">
                <div className="navtitle">
                    <span className="title">Academic Planner</span>
                </div>
                <div className="navbutton">
                    <button className="Loginbutton">Login</button>
                </div>
            </div>
        </div>
      </div>
    )
  }
}