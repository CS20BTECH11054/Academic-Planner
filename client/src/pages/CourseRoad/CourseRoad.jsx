//import React from "react"
import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'

export default class CourseRoad extends Component {
  render() {
    return (
      <div>
        <Navbar/>
        <Header pos="CourseRoad"/>
        <div>CourseRoad</div>
      </div>
    )
  }
}