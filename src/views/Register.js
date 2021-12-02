// import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
// import { auth } from 'Firebase';
import React, { useEffect, useState } from 'react'
import { Alert, Toast } from 'react-bootstrap';
import { Link, Redirect,useHistory } from 'react-router-dom';
import "./Views.css"
import {
    auth,
    db,
    registerWithEmailAndPassword,
    signInWithGoogle,
} from "../firebase";
import { useDispatch, useSelector } from 'react-redux';
import { setuser } from 'Reducer/Action';
import { setloader } from 'Reducer/Action';
import Loader from 'components/Loader';

const Register = (props) => {
    const history = useHistory();
    const [data, setData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        cpassword: ''
    });
    
    const loading = useSelector(state => state.loading)
    const dispatch = useDispatch()
    const setregerror = (msg) => {
        props.notify(msg)
    }
    const InputEvent = (event) => {
        const { name, value } = event.target;
        setData((preVal) => {
            return {
                ...preVal,
                [name]: value,
            };
        });
    };
    

    const formSubmit = async (e) => {
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        e.preventDefault()
        if (data.fname === '') {
            setregerror("Please enter valid name")
        }
        else if (data.lname === '') {
            setregerror("Please enter last name")
        }
        else if (data.email === "") {
            setregerror("Please enter Email") 
        }
        else if (!data.email.match(mailformat)) {
            setregerror("Please Enter valid Email")
            
        }
        else if (data.password === "") {
            setregerror("Please Enter password")
        }
        else if (data.password.length < 8) {
            setregerror("Password Should be atlist 8 characters")
        }
        else if (data.password !== data.cpassword) {
            setregerror("Both Password Should be same")
        }
        else {
            dispatch(setloader(true))
            let res = await registerWithEmailAndPassword(data.fname, data.lname, data.email, data.password);
            if (res.error) {
                setregerror(res.error)
                dispatch(setloader(false))

            }
            else {
                if (res?.uid) {
                    localStorage.setItem("Stockid", res?.uid)
                }
                db.collection("users").doc(res?.uid).get().then(doc => {
                    if (doc.exists) {
                        dispatch(setuser(doc.data()))
                        history.push("/");
                        dispatch(setloader(false))


                    }
                    else {
                        console.log("No DATA FOUND");
                        dispatch(setloader(false))

                    }
                }).catch(e => {
                    console.log("error:", e);
                    dispatch(setloader(false))    })
            }
        }
    }
    // useEffect(() => {
    //     if (loading) return;
    //     if (user) history.replace("/");
    //   }, [user, loading]);
    return (
        <>
            {loading && <Loader />}
            
        <div className="container">
            <form className="form">
                <h3 style={{textAlign:"center"}}>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input type="text" className="form-control" placeholder="First name" name="fname" onChange={InputEvent} />
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name" name="lname" onChange={InputEvent} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                        <input type="email" className="form-control" placeholder="Enter email" name="email" onChange={InputEvent}   />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" name="password" onChange={InputEvent} />
                    </div>
                    
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" placeholder="Re-enter password" name="cpassword" onChange={InputEvent} />
                </div>

                <button type="submit" onClick={formSubmit} style={{justifyContent:"center"}} className="btn btn-dark">Register</button>
                <p className="forgot-password text-right mt-2">
                    Already registered ?<Link to="/login">log in</Link>
                </p>
                
            </form>
            </div>
            </>
    )
}

export default Register