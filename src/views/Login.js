// import { signInWithEmailAndPassword } from '@firebase/auth';
// import { db } from 'Firebase';
// import { auth } from 'Firebase';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link,useHistory } from 'react-router-dom';
import { setuser, setloader } from 'Reducer/Action';
import "./Views.css"
import {
    auth,db,
    signInWithEmailAndPassword,
    signInWithGoogle,
} from "../firebase";
import Loader from 'components/Loader';

const Login = (props) => {
    const history = useHistory()
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const loading = useSelector(state => state.loading)

    const dispatch = useDispatch()
    const InputEvent = (event) => {
        const { name, value } = event.target;
        setData((preVal) => {
            return {
                ...preVal,
                [name]: value,
            };
        });
    };

    const seterror = (msg) => {
        props.notify(msg)
    }
    const formSubmit = async (e) => {
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        e.preventDefault()
        if (data.email === "") {
            seterror("Please enter Email")
            
        }
        else if (!data.email.match(mailformat)) {
            seterror("Please Enter valid Email")
            
        }
        else if (data.password === "") {
            seterror("Please Enter password")
        }
        else if (data.password.length < 8) {
            seterror("Password Should be atlist 8 characters")
        }
        else {
            dispatch(setloader(true))
            let res = await signInWithEmailAndPassword(data.email, data.password)
            if (res.error) {
                seterror(res.error)
                dispatch(setloader(false))
            }
            else {
                if (res?.user?.uid) {
                    localStorage.setItem("Stockid", res?.user?.uid)
                }
                db.collection("users").doc(res?.user?.uid).get().then(doc => {
                    if (doc.exists) {
                        dispatch(setuser(doc.data()))
                        history.push("/");
                        dispatch(setloader(false))
                    }
                    else {
                        console.log("No DATA FOUND");
                        dispatch(setloader(false))
                    }
                }).catch(e => { console.log("error:", e);dispatch(setloader(false)) })
            }
        // signInWithEmailAndPassword(auth, data.email, data.password)
        //     .then((userCredential) => {
        //         const user = userCredential.user;
        //         dispatch(setuser(user.uid))
                
//         }
//   )
//   .catch((error) => {
//       const errorCode = error.code;
//     //   if(error.message?.split("(")[1]?.split(")")[0]?.split("/")[1] === "user-not-found")
//       seterror("User not found please register.");
//       console.log(error);
//   });
        }
    }
    return (
        <>
            {loading && <Loader />}
        <div className="container">
            <form className="form">
                <h3 style={{textAlign:"center"}}>Login</h3>

                <div className="form-group">
                    <label>Email Id</label>
                    <input type="text" className="form-control" placeholder="First name or Email Id is your username" name="email" onChange={InputEvent} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" name="password" onChange={InputEvent} />
                    </div>

                <button type="submit" onClick={formSubmit} style={{justifyContent:"center"}} className="btn btn-dark">Login</button>
                <p className="forgot-password text-right mt-2">
                    New to Mine Stocks ? <Link to="/Register">Register </Link>
                </p>
                
                <p className="forgot-password text-right mt-2">
                    <Link to="/reset-password">Forget Password</Link>
                </p>
                
            </form>
            </div>
            </>
    )
}

export default Login