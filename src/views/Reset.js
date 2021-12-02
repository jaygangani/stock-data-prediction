import Loader from 'components/Loader';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { setloader } from 'Reducer/Action';
import {
    sendPasswordResetEmail
} from "../firebase";

function Reset(props) {
    const history = useHistory()
    const [data, setData] = useState({
        email: '',
    });
    const dispatch = useDispatch()

    const loading = useSelector(state => state.loading)
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
            
        else {
            dispatch(setloader(true))
            let res= await sendPasswordResetEmail(data.email)
            if (res.error) {
                seterror(res.error)
                dispatch(setloader(false))
            }
            else {
                seterror(res.message)
                dispatch(setloader(false))
                history.push("/")
            }
        }
    }
    
    return (
        <>
            {loading && <Loader />}
        <div className="container">
            <form className="form">
                <h3 style={{textAlign:"center"}}>Reset Password</h3>

                <div className="form-group">
                    <label>Email Id</label>
                    <input type="text" className="form-control" placeholder="Enter Email Id" name="email" onChange={InputEvent} />
                </div>

                <button type="submit" onClick={formSubmit} style={{justifyContent:"center"}} className="btn btn-dark">Reset</button>                
                <p className="forgot-password text-right mt-2">
                    <Link to="/Login">Login</Link>
                </p>
                
            </form>
            </div>
            </>
            
    )
}

export default Reset
