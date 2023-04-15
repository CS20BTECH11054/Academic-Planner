import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'

export default class Courses extends Component {
  render() {
    return (
    <div>
        <Navbar/>
        <Header pos="Courses"/>
        <div>Courses</div>
    </div>
    )
  }
}