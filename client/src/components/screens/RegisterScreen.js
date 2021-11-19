import { useState,useEffect } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './RegisterScreen.css'

const RegisterScreen = () => {
    // {history}
    let history = useNavigate();
    const[username, setUsername] = useState("")
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")
    const[comparepassword, setComparePassword] = useState("")
    const[error, setError] = useState("")

    useEffect(() => {
        if(localStorage.getItem('authToken')){
            history('/')
        }
    }, [history])

    const registerHandler = async(e) => {
        e.preventDefault();
     const config = {
            header : {
                "Content-Type" : "application/json"
            }
        }

    if(password !== comparepassword){
        setPassword('');
        setComparePassword('')
        setTimeout(() => {
            setError('')
        }, 5000);
        return setError('Password do not match')
    }

    try {
        const {data} = await axios.post('/api/auth/register',{username,email,password},config)
        localStorage.setItem('authToken',data.token)
        history('/')
    } catch (error) {
        setError(error.response.data.error)
        setTimeout(() => {
            setError('')
        }, 5000);
    }


    }

    return (
        <div className="register-screen">
            <form onSubmit={registerHandler} className="register-screen__form">
                <h3 className="register-screen__form">Register</h3>
                {error && <span className="error-message">{error}</span>}
                <div className="form-group">
                    <label htmlFor="name">username:</label>
                    <input type="text" required id="name" 
                    placeholder="Enter Username" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">email:</label>
                    <input type="email" required id="email" 
                    placeholder="Enter email"  value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">password:</label>
                    <input type="password" required id="password" 
                    placeholder="Enter password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="comparepassword">password:</label>
                    <input type="password" required id="comparepassword" 
                    placeholder="Enter password" value={comparepassword}
                    onChange={(e) => setComparePassword(e.target.value)}
                    />
                </div>

                    <button type="submit" className="btn btn-primary">Register</button>

                    <span className="register-screen__subtext">
                        Already have an account 
                        <Link to="/login">Login</Link>
                    </span>
            </form>            
        </div>
    )
}

export default RegisterScreen


