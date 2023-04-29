import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"
import React, { Component} from 'react'
import axios from "axios"
import './Courses.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import Select from "react-select"

export default class Courses extends Component {

  constructor()
  {
    super()
    this.state={
      res: [],
      mycourses: false,
      query_type: "",
      query:"",
      Selected_Course:null
    }
  }

  handleClick()
  {
    alert("Searched "+this.state.query)
    this.setState({
      query: ""
    })
  }

  handlemyCoursesClick()
  {
    if(this.state.mycourses)
    {
      this.setState({
        mycourses: false,
        res: []
      })
    }
    else{
      this.setState({
        mycourses: true
      })
      axios.get("http://localhost:5000/api/courses")
      .then(response => {
        console.log(response)
        this.setState({
          res: response.data
        })
      })
      console.log(this.state.res)
    }
  }

  handleCourseClick(e, name)
  {
    (this.state.Selected_Course === name) ? this.setState({Selected_Course : null}) : this.setState({Selected_Course : name})
  }

  handleAddClick()
  {
    axios.post("http://localhost:5000/api/courses",{
      "username" : localStorage.getItem("user"),
      "Coursename" : this.state.Selected_Course
    })
    .then(response => {console.log(response)})
  }

  handleChange(e)
  {
    const obj = e["value"]
    this.setState({
      query_type: obj
    })
  }

  handleinputChange(e)
  {
    //console.log(e.target.value)
    this.setState({
      query: e.target.value
    })
    //console.log(this.state.query)
  }

  render() {
    const options = [
      { value: 'Course name', label: 'Course name' },
      { value: 'Course code', label: 'Course code' }
    ]
    return (
    <div>
        <Navbar/>
        <Header pos="Courses"/>
        <div className = "CoursesWindow">
          <div className="Coursescontainer">
            <div className="Coursestitle">{this.state.mycourses ? "My Courses" : "All Courses"}</div>
            <div className="Coursesearchcontainer">
              <Select options={options} onChange={(e)=>this.handleChange(e)} placeholder="Select"/>
              <input placeholder={this.state.query_type} className="CourseSearchinput" onChange={(e)=>{this.handleinputChange(e)}}/>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="CourseSearch" onClick={()=>this.handleClick()}/>
            </div>
            <span className={`mycourses ${(this.state.mycourses) ? "active" : ""}`} onClick={()=>this.handlemyCoursesClick()}>My Courses</span>
          </div>
          <table className="Courseitemsborder">
                <tr className="Courserows"><th className="Courseitems">CourseCode</th> <th className="Courseitems">Course</th></tr>
                {this.state.res && this.state.res.map(res => <tr className={`Courserows ${(this.state.Selected_Course === res['name']) ? "active" : ""}`} onClick={(e)=>this.handleCourseClick(e,res['name'])}><td className="Courseitems">{res["code"]}</td><td className="Courseitems">{res["name"]}</td></tr>)}
          </table>
          {(this.state.Selected_Course === null) ? null : 
          ((this.state.mycourses) ? <div className="Buttonscontainer">
          <div className="ButtonsCourses">Max_CGPA</div>
          <div className="ButtonsCourses">CGPA</div>
          <div className="ButtonsCourses">Delete</div>
          </div> : <div className="Buttonscontainer" onClick={()=>this.handleAddClick()}><div className="ButtonsCourses">Add</div></div>)}
        </div>
    </div>
    )
  }
}