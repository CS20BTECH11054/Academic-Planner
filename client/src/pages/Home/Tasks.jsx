import React, { Component } from 'react'
import './Tasks.css'

export default class Tasks extends Component {
  render() {
    return (
    <div className='Tasksmain'>
      <div className='titlehome'>Tasks</div>
      <div className='content'>On {this.props.date}</div>
      <div className='contentitems'>Complete SWE Project</div>
      <div className='contentitems'>Complete SWE Project</div>
      <div className='contentitems'>Complete SWE Project</div>
    </div>
    )
  }
}
