import React from 'react'
import {
    // Route,
    Navigate
  } from "react-router-dom";

const PrivateRoute = ({children}) => {
    // {element : Component, ...rest}
    // return (
    //     <Route 
    //         {...rest}
    //         render={(props) =>{
    //                 localStorage.getItem("authToken") ? (
    //                    < Component {...props}/> 
    //                 ) : (
    //                     <Navigate to="/login"/>
    //                 )
    //             }
    //         }
    //     />
    // )
    const auth = localStorage.getItem("authToken")
    return auth ? children : <Navigate to="/login"/>
}

export default PrivateRoute
