import React from 'react'
import "./about.css";

const About = () => {
    return (
        <>
             <section className="text-center about">
      <h1>About US</h1>
      <hr/>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-sm-6 col-ex-12 about-item wow lightSpeedIn" data-wow-offset="200" >
            <span className="fa fa-user-friends"></span>
            <h2>Our Team</h2>
            <h4 className="lead">We have a Good team with good team management, also we have skilled people with experience</h4>
          </div>
          <div className="col-lg-4 col-sm-6 col-ex-12 about-item wow lightSpeedIn" data-wow-offset="200">
            <span className="fa fa-info"></span>
            <h2>What we do</h2>
            <h4 className="lead">We are the developers,we are doing prediction of stock and based on prediction user can buy particular stock</h4>
          </div>
          <div className="clearfix visible-md-block visible-sm-block"></div>
          <div className="col-lg-4 col-sm-6 col-ex-12 about-item wow lightSpeedIn" data-wow-offset="200">
            <span className="fa fa-file"></span>
            <h2>Goal</h2>
            <h4 className="lead">Our goal is to fulfill user requirements, give a best accuracy and performance will be high for particular stock</h4>
          </div>
          
        </div>
        
      </div>
    </section>
        </>
    )   
}

export default About
