import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'

export default class Login extends Component {
  render() {
    return (
    <div>
        <Navbar/>
        <Header pos="Login"/>
       <div>Login</div>
    </div>
    )
  }
}