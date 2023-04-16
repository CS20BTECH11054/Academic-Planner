import "./Navbar.css"
import {withRouter} from "../../withRouter"
import React, { Component } from 'react'

class Navbar extends Component {
  handleClick()
  {
    this.props.navigate('/Login')
  }

  render() {
    let button = <div className="navbutton"><button className="Loginbutton" onClick={()=>this.handleClick()}>Login</button></div>
    if(localStorage.getItem('user') !== "null")
    {
      button = <div className="Loginuser">Hi {localStorage.getItem('user')}</div>
    }
    return (
      <div>
        <div className="navbar">
            <div className="navbarcontainer">
                <div className="navtitle">
                    <span className="title">Academic Planner</span>
                </div>
                {button}
            </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)