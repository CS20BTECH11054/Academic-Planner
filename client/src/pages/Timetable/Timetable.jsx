import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'

export default class Timetable extends Component {
  render() {
    return (
    <div>
        <Navbar/>
        <Header pos="Timetable"/>
        Timetable
    </div>
    )
  }
}