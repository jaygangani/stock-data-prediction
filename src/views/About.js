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
            <h4 className="lead">We are the team of students with some basic knowladge about stock market and making sure to provide quality to the person</h4>
          </div>
          <div className="col-lg-4 col-sm-6 col-ex-12 about-item wow lightSpeedIn" data-wow-offset="200">
            <span className="fa fa-info"></span>
            <h2>What we do</h2>
            <h4 className="lead">As everyone has not much time from there daily routine our portals helps them to invest their money wisely in the stock market</h4>
          </div>
          <div className="clearfix visible-md-block visible-sm-block"></div>
          <div className="col-lg-4 col-sm-6 col-ex-12 about-item wow lightSpeedIn" data-wow-offset="200">
            <span className="fa fa-file"></span>
            <h2>Goal</h2>
            <h4 className="lead">The main objective behind this is to improve one's financials for leaving a better life </h4>
          </div>
          
        </div>
        
      </div>
    </section>
        </>
    )   
}

export default About
