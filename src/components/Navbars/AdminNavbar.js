
import React, { Component, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";

import routes from "routes.js";
import { useDispatch, useSelector } from "react-redux";
import { setuser } from "Reducer/Action";
import {
  logout
} from "../../firebase";

function Header() {
  const location = useLocation();
  const dispatch = useDispatch()
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
      else {
        return "Mine Stocks"
      }
    }
  };

  
  const [userdata, setuserdata] = useState({});
  
  const user = useSelector(state => state.userData)

  useEffect(() => {
    setuserdata(user)
    
  }, [user])
  
  const signout = () => {
    logout()
    dispatch(setuser({}))
    localStorage.removeItem("Stockid")
  }


  return (
    <Navbar bg="light" expand="lg" sticky={"top"}>
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href={location.pathname }
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            <Nav.Item>
              <Nav.Link
                className="m-0"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="ml-auto" navbar>
            <Nav.Item>
              <Nav.Link
                className="m-0"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                { Object.keys(userdata).length > 0 ? <span className="no-icon" onClick={signout}>Log out</span> : <><Link to="/Login" className="no-icon">Log in</Link> &nbsp; | &nbsp;<Link to="/Register" className="no-icon">Register</Link></> }
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
