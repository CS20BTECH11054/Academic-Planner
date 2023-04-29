//import React from "react"
import Navbar from "../../components/Navbar/Navbar"
import Header from "../../components/Header/Header"

import React, { Component } from 'react'
//import Draggable from "react-draggable"
import Select from "react-select"
import './CourseRoad.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import Draggable from "react-draggable"

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
      SelectedCourse: "",
      DragprevSem: "",
      Input: "",
      First: ["Intro to Programming"],
      Second: ["Calculus II"],
      Third: ["Database Management Systems I"],
      Fourth: ["Operating Systems II"],
      Fifth: ["Foundations Of Machine Learning"],
      Sixth: ["Software Engineering"],
      Seventh: ["Placements"],
      Eighth: ["Timepass"],
    }
  }
  handleDeptClick()
  {
    this.setState({
      SelectedDep : this.state.currentDep
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
    switch(this.state.SelectedPlusSem) {
      case "First":
        this.setState(prevState =>({
          First: [...prevState.First, this.state.Input]
        })); break;
      case "Second":
        this.setState(prevState =>({
          Second: [...prevState.Second, this.state.Input]
        })); break;
      case "Third":
        this.setState(prevState =>({
          Third: [...prevState.Third, this.state.Input]
        })); break;
      case "Fourth":
        this.setState(prevState =>({
          Fourth: [...prevState.Fourth, this.state.Input]
        })); break;
      case "Fifth":
        this.setState(prevState =>({
          Fifth: [...prevState.Fifth, this.state.Input]
        })); break;
      case "Sixth":
        this.setState(prevState =>({
          Sixth: [...prevState.Sixth, this.state.Input]
        })); break;
      case "Seventh":
        this.setState(prevState =>({
          Seventh: [...prevState.Seventh, this.state.Input]
        })); break;
      case "Eighth":
        this.setState(prevState =>({
          Eighth: [...prevState.Eighth, this.state.Input]
        })); break;
      default:
        console.log("Error!! ", this.state.SelectedPlusSem)
        break;
    }
    this.setState({
      Input: "",
      SelectedPlusSem: ""
    })
  }
  handleCourseClick(course)
  {
    (this.state.SelectedCourse !== course)?
    this.setState({
      SelectedCourse: course
    }) : this.setState({
      SelectedCourse: ""
    })
    console.log(this.state.SelectedCourse)
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
    for(var i=0; i<7; i++)
    {
      var top = this.CourseRef[i].current.getBoundingClientRect().top
      var height = this.CourseRef[i].current.getBoundingClientRect().height
      if(top < Course_curr_y && Course_curr_y < top + height)
      {
        currSem = i + 1;
        break;
      }
    }
    const numtoString = {
      1 : "First", 2 : "Second", 3: "Third", 4: "Fourth", 5: "Fifth", 6: "Sixth", 7: "Seventh", 8: "Eighth"
    }
    const v = this.state.DragprevSem
    const newArray = this.state[v].filter(Course => Course !== course)
    this.setState({
      [v] : newArray
    })
    this.setState(prevState => ({
      [numtoString[currSem]] : [...prevState[numtoString[currSem]], course]
    }))
  }

  render() {
    const options = [{
      "name": "CS", "label":"CS"
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
        {(this.state.SelectedSem !== "") ? <div>
          <div className="SemCredInfoContainer">
            <div className="SemCredInfoItems">{this.state.SelectedSem} Semester</div>
            <div className="SemCredInfoItems">Total Cred: </div>
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
        {(this.state.SelectedDep !== "") ? <div className="CourseRoadWindow">
          <div ref = {this.CourseRef[0]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "First") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("First")}>First Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("First")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div id = "First" className="CourseRoadSemCourseContainer">
              {this.state.First && this.state.First.map(course => <Draggable onStart={()=>this.handleDragstart("First")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow" ><div onClick={()=>this.handleCourseClick(course)} className="CourseRoadSemCourseItems">{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[1]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Second") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Second")}>Second Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Second")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div id = "Second" className="CourseRoadSemCourseContainer">
            {this.state.Second && this.state.Second.map(course => <Draggable onStart={()=>this.handleDragstart("Second")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[2]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Third") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Third")}>Third Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Third")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Third && this.state.Third.map(course => <Draggable onStart={()=>this.handleDragstart("Third")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[3]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Fourth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Fourth")}>Fourth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Fourth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Fourth && this.state.Fourth.map(course => <Draggable onStart={()=>this.handleDragstart("Fourth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[4]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Fifth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Fifth")}>Fifth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Fifth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Fifth && this.state.Fifth.map(course => <Draggable onStart={()=>this.handleDragstart("Fifth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[5]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Sixth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Sixth")}>Sixth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Sixth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Sixth && this.state.Sixth.map(course => <Draggable onStart={()=>this.handleDragstart("Sixth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[6]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Seventh") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Seventh")}>Seventh Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Seventh")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Seventh && this.state.Seventh.map(course => <Draggable onStart={()=>this.handleDragstart("Seventh")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
          <div ref = {this.CourseRef[7]} className={`CourseRoadSemContainer ${(this.state.SelectedSem === "Eighth") ? "active" : ""}`}>
            <div className="CourseRoadSemTitleContainer">
              <div onClick={()=>this.handleSemClick("Eighth")}>Eighth Semester</div>
              <FontAwesomeIcon onClick={()=>this.handlePlusClick("Eighth")} icon={faCirclePlus} style={{color: "#1290ff",}} />
            </div>
            <div className="CourseRoadSemCourseContainer">
            {this.state.Eighth && this.state.Eighth.map(course => <Draggable onStart={()=>this.handleDragstart("Eighth")} onStop={(e, data)=>this.handleDragend(e, data, course)} bounds=".CourseRoadWindow"><div className="CourseRoadSemCourseItems" onClick={()=>this.handleCourseClick(course)}>{course}</div></Draggable>)}
            </div>
          </div>
        </div> : null}
        {(this.state.SelectedPlusSem !== "") ? <div className="CourseRoadOptsContainer">
          <div className="CourseRoadAddOptsContainer">
            <div className="CourseRoadOptsItems">Elective Type:</div>
            <Select options={ElectiveTypeoptions} placeholder="Select"/>
            <div className="CourseRoadOptsItems">
              <input onChange={(e)=>this.handleInputChange(e)}/>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="CourseRoadSearch" />
            </div>
            <div className="DeptSelectOkbtn" onClick={()=>this.handleCourseAddOk()}>Ok</div>
          </div>
        </div> : null}
        {(this.state.SelectedCourse !== "") ? <div className="CourseInfoContainer">
          <div className="CourseInfoTitle">Course Info:</div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Name :</div><div className="CourseInfoItems2">{this.state.SelectedCourse}</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Course Code:</div><div className="CourseInfoItems2">CS0000</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Timetable Slot:</div><div className="CourseInfoItems2">X</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Instructor:</div><div className="CourseInfoItems2">Virat Kohli</div></div>
          <div className="CourseInfoItemsContainer"><div className="CourseInfoItems1">Description:</div><div className="CourseInfoItems2">Worst Course</div></div>
        </div> : null}
      </div>
    )
  }
}