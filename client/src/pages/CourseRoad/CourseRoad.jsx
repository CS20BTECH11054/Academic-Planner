//import React from "react"
import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'
//import Draggable from "react-draggable"
import Select from "react-select"
import './CourseRoad.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faMagnifyingGlass, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import Draggable from "react-draggable"

class Course{
  constructor(name, code, credits, dept, slot, prerequisites, sem){
      this.name = name
      this.code = code
      this.credits = credits
      this.dept = dept
      this.slot = slot
      this.prerequisites = prerequisites
      this.sem = sem
      this.msg = []
  }

  setMsg(str)
  {
    this.msg = this.msg.concat(str)
  }
}

export default class CourseRoad extends Component {

  constructor(){
    super()
    this.CourseRef = [React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef()]
    this.state={
      SelectedDep : "",
      currentDep : "",
      SelectedSem: "",
      SelectedPlusSem: "",
      SelectedCourse: null,
      SelectedCourseAdd: null,
      SearchRes: [],
      DragprevSem: "",
      Input: "",
      SetLoading: true,
      Courses: [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      ]
    }
  }
  checkForPrereq(course)
  {
    for(var i=0; i<course.prerequisites.length; i++)
    {
      var check = false;
      for(var j=0; j<course.sem-1;j++)
      {
        const prereq = course.prerequisites[i]
        const newArray = this.state.Courses[j].filter(Course => Course.code === prereq)
        if(newArray.length !== 0)
        {
          check = true;
          break;
        }
      }
      if(check === false)
      {
        course.setMsg(`The prerequisite ${course.prerequisites[i]} is not satisfied \n`)
      }
    }
  }
  checkForTimetableClash(course)
  {
    const clashCourses = this.state.Courses[course.sem-1].filter(Course => (Course.slot === course.slot && Course !== course) )
    if(clashCourses.length !== 0)
    {
      for(var i=0; i<clashCourses.length;i++)
      {
        course.setMsg(`Timetable is clashing with ${clashCourses[i].code}`)
      }
    }
  }
  updateMsg()
  {
    for(var i = 0; i < this.state.Courses.length; i++)
    {
      for(var j=0; j< this.state.Courses[i].length; j++)
      {
        const c = this.state.Courses[i][j]
        c.msg = []
        this.checkForPrereq(this.state.Courses[i][j])
        this.checkForTimetableClash(this.state.Courses[i][j])
      }
    }
  }
  AddCourse(course)
  {
    const newArray = this.state.Courses[(course.sem-1)].concat(course)
    this.setState({
      Courses : [
        ...this.state.Courses.slice(0, course.sem-1),
        newArray,
        ...this.state.Courses.slice(course.sem)
      ]
    }, function(){
       this.checkForPrereq(course)
       this.checkForTimetableClash(course)
       this.updateMsg()
    })
  }
  DeleteCourse(course)
  {
    const oldArray = this.state.Courses[(course.sem-1)].filter(Course => Course !== course)
    this.setState({
      Courses : [
        ...this.state.Courses.slice(0, course.sem-1),
        oldArray,
        ...this.state.Courses.slice(course.sem)
      ]
    }, function(){
      this.updateMsg()
    })
  }
  handleDeptClick()
  {
    this.setState({
      SetLoading: false
    })
    this.setState({
      SelectedDep : this.state.currentDep
    }, function(){
      var sem = 0
      const handleCourseRoad = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/user/courseRoad?dept=${this.state.SelectedDep}&sem=${sem}`);
          for(var i=0; i<res.data.length; i++)
          {
            const course = new Course(res.data[i].name, res.data[i].code, res.data[i].credits, res.data[i].dept, res.data[i].slot, res.data[i].prerequisites, res.data[i].sem)
            this.AddCourse(course)
          }
          sem = sem + 1;
          if (sem === 8)
          {
            this.setState({
              SetLoading: true
            })
          }
          else
          {
            handleCourseRoad()
          }
        } catch (error) {
          sem = sem + 1;
          if (sem === 8)
          {
            this.setState({
              SetLoading: true
            })
          }
          else
          {
            handleCourseRoad();
          }
          }
        }
        handleCourseRoad()
    })
  }
  handleDeptSelChange(e)
  {
    const obj = e["name"]
    this.setState({
      currentDep : obj
    })
  }
  handleSemClick(Sem)
  {
    (this.state.SelectedSem !== Sem) ?
    this.setState({
      SelectedSem : Sem
    }) : this.setState({SelectedSem : ""})
  }
  handlePlusClick(Sem)
  {
    (this.state.SelectedPlusSem !== Sem) ?
    this.setState({
      SelectedPlusSem : Sem
    }) : this.setState({SelectedPlusSem : ""})
  }
  handleInputChange(e)
  {
    this.setState({
      Input: e.target.value
    })
  }
  handleCourseAddOk()
  {
    const Stringtonum = {
      "First" : 1,"Second" : 2,"Third" : 3,"Fourth" : 4,"Fifth" : 5,"Sixth" : 6,"Seventh" : 7,"Eighth" : 8
    }
    if(this.state.SelectedCourseAdd === null)
    {
      alert("Please search for course before adding it")
      return
    }
    var selcourse = this.state.SelectedCourseAdd
    var newcourse = new Course(selcourse.name, selcourse.code, selcourse.credits,selcourse.dept, selcourse.slot, selcourse.prerequisites, selcourse.sem)
    newcourse.sem = Stringtonum[this.state.SelectedPlusSem]
    this.AddCourse(newcourse)
    this.setState({
      Input: "",
      SelectedPlusSem: "",
      SelectedCourseAdd: null
    })
  }
  handleCourseClick(course)
  {
    (this.state.SelectedCourse !== course)?
    this.setState({
      SelectedCourse: course
    }) : this.setState({
      SelectedCourse: null
    })
  }

  handleDragstart(Sem)
  {
    this.setState({
      DragprevSem : Sem
    })
  }
  
  handleDragend(e,data, course)
  {
    const Course_curr_y = e.clientY
    var currSem = 0
    for(var i=0; i<8; i++)
    {
      var top = this.CourseRef[i].current.getBoundingClientRect().top
      var height = this.CourseRef[i].current.getBoundingClientRect().height
      if(top < Course_curr_y && Course_curr_y < top + height)
      {
        currSem = i;
        break;
      }
    }
    const Stringtonum = {
      "First" : 1,"Second" : 2,"Third" : 3,"Fourth" : 4,"Fifth" : 5,"Sixth" : 6,"Seventh" : 7,"Eighth" : 8
    }
    const oldSem = Stringtonum[this.state.DragprevSem]-1
    if(oldSem === currSem)
    {
      return
    }
    const newCourse = new Course(course.name,course.code,course.credits,course.dept,course.slot,course.prerequisites, currSem+1)
    const oldArray = this.state.Courses[(course.sem-1)].filter(Course => Course !== course)
    this.setState({
      Courses : [
        ...this.state.Courses.slice(0, course.sem-1),
        oldArray,
        ...this.state.Courses.slice(course.sem)
      ]
    }, function(){
      this.AddCourse(newCourse)
    })
  }

  handleSearchClick()
  {
    const handleCourseSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/courses/search?name=${this.state.Input}`);
      this.setState({
        SearchRes: res.data
      })
    } catch (error) {
      console.log(error)
      }
    }
    handleCourseSearch()
  }

  handleCourseAdding(course)
  {
    (this.state.SelectedCourseAdd !== course) ? this.setState({
      SelectedCourseAdd: course
    }) : this.setState({
      SelectedCourseAdd: null
    })
  }

  handleDeleteClick()
  {
    var course =  this.state.SelectedCourse
    const oldArray = this.state.Courses[(course.sem-1)].filter(Course => Course !== course)
    this.setState({
      Courses : [
        ...this.state.Courses.slice(0, course.sem-1),
        oldArray,
        ...this.state.Courses.slice(course.sem)
      ]
    }, function(){
      this.updateMsg()
      this.setState({
        SelectedCourse: null
      })
    })
  }

  getTotalCred()
  {
    var cred = 0
    const Stringtonum = {
      "First" : 1,"Second" : 2,"Third" : 3,"Fourth" : 4,"Fifth" : 5,"Sixth" : 6,"Seventh" : 7,"Eighth" : 8
    }
    const currSem = Stringtonum[this.state.SelectedSem]-1
    for(var i=0; i<this.state.Courses[currSem].length; i++)
    {
      cred = cred + this.state.Courses[currSem][i].credits
    }
    return cred
  }

  

  render() {
    const options = [{
      "name": "CSE", "label":"CSE"
    }]
    const ElectiveTypeoptions = [
      { "name": "Core", "label":"Core"},
      { "name": "Departmental", "label":"Departmental"},
      { "name": "Free", "label":"Free"},
      { "name": "LA/CA", "label":"LA/CA"}
    ]
    return (
      <div>
        <Navbar/>
        <Header pos="CourseRoad"/>
        {this.state.SetLoading && (this.state.SelectedSem !== "") ? <div>
          <div className="SemCredInfoContainer">
            <div className="SemCredInfoItems">{this.state.SelectedSem} Semester</div>
            <div className="SemCredInfoItems">Total Cred: {this.getTotalCred()}</div>
            <div className="SemCredInfoItems">Rem Dept Elec: </div>
            <div className="SemCredInfoItems">Rem Free Elec: </div>
            <div className="SemCredInfoItems">Rem LA/CA: </div>
          </div>
        </div> : null}
        {(this.state.SelectedDep === "") ? <div className="DeptSelectWindow">
          <div className="DeptSelectQs">Department:</div>
          <Select options={options} onChange={(e)=>this.handleDeptSelChange(e)} placeholder="Select"/>
          <div className="DeptSelectOkbtn" onClick={()=>this.handleDeptClick()}>Ok</div>
        </div> : null}
        {this.state.SetLoading && (this.state.SelectedDep !== "") ? <div className="CourseRoadWindow">
          <div ref = {this.CourseRef[0]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "First") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("First")}>First Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("First")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div id = "First" className="CourseRoadSemCourseContainer">
              {this.state.Courses[0] && this.state.Courses[0].map(course => <Draggable onStart={()=>this.handleDragstart("First")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow" >{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[1]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Second") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Second")}>Second Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Second")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div id = "Second" className="CourseRoadSemCourseContainer">
            {this.state.Courses[1] && this.state.Courses[1].map(course => <Draggable onStart={()=>this.handleDragstart("Second")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[2]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Third") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Third")}>Third Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Third")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[2] && this.state.Courses[2].map(course => <Draggable onStart={()=>this.handleDragstart("Third")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[3]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Fourth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Fourth")}>Fourth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Fourth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[3] && this.state.Courses[3].map(course => <Draggable onStart={()=>this.handleDragstart("Fourth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[4]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Fifth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Fifth")}>Fifth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Fifth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[4] && this.state.Courses[4].map(course => <Draggable onStart={()=>this.handleDragstart("Fifth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[5]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Sixth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Sixth")}>Sixth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Sixth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[5] && this.state.Courses[5].map(course => <Draggable onStart={()=>this.handleDragstart("Sixth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[6]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Seventh") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Seventh")}>Seventh Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Seventh")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[6] && this.state.Courses[6].map(course => <Draggable onStart={()=>this.handleDragstart("Seventh")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[7]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Eighth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Eighth")}>Eighth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Eighth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Courses[7] && this.state.Courses[7].map(course => <Draggable onStart={()=>this.handleDragstart("Eighth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow">{(course.msg.length !== 0) ? <div className="CourseRoadSemCourseItems active" onClick={()=>this.handleCourseClick(course)}> <FontAwesomeIcon icon={faTriangleExclamation} style={{color: "#1e90ff",}} /> <div>{course.name}</div></div>: <div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}><div>{course.name}</div></div>}</Draggable>)}
            </div>
          </div>
        </div> : null}
        {this.state.SetLoading && (this.state.SelectedPlusSem !== "") ? <div className="CourseRoadOptsContainer">
          <div className="CourseRoadAddOptsContainer">
            <div className="CourseRoadOptsItems">Elective Type:</div>
            <Select options={ElectiveTypeoptions} placeholder="Select"/>
            <div className="CourseRoadOptsItems">
              <input onChange={(e)=>this.handleInputChange(e)}/>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="CourseRoadSearch" onClick={()=>this.handleSearchClick()}/>
            </div>
            <table className="CourseRoadTable">
              <tr className="CourseRoadTableRow"><th className="CourseRoadTableItems">Course Code</th><th className="CourseRoadTableItems">Course Name</th></tr>
              {this.state.SearchRes && this.state.SearchRes.map(course => <tr className={`CourseRoadTableRow ${(this.state.SelectedCourseAdd === course)? "active" : ""}`} onClick={()=>this.handleCourseAdding(course)}><td className="CourseRoadTableItems">{course.code}</td><td className="CourseRoadTableItems">{course.name}</td></tr>)}
            </table>
            <div className="DeptSelectOkbtn" onClick={()=>this.handleCourseAddOk()}>Ok</div>
          </div>
        </div> : null}
        {this.state.SetLoading && (this.state.SelectedCourse !== null) ? <div className="CourseInfoContainer">
          <div className="CourseInfoTitleContainer">
            <div className="CourseInfoTitle">Course Info:</div>
            <div className="CourseInfoDelete" onClick={()=>this.handleDeleteClick()}>Delete</div>
          </div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Name :</div><div className="CourseInfoItems2">{this.state.SelectedCourse.name}</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Course Code:</div><div className="CourseInfoItems2">{this.state.SelectedCourse.code}</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Timetable Slot:</div><div className="CourseInfoItems2">{this.state.SelectedCourse.slot}</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Instructor:</div><div className="CourseInfoItems2">Virat Kohli</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Description:</div><div className="CourseInfoItems2">Worst Course</div></div>
          {(this.state.SelectedCourse.msg.length !== 0) ? this.state.SelectedCourse.msg.map( messg => <div className="CourseRoadMsg">{messg}</div>): null}

        </div> : null}
      </div>
    )
  }
}