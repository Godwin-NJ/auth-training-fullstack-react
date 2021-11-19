import {useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const PrivateScreen = () => {
    // {history}
    let history = useNavigate();
    const[error,setError] = useState('');
    const[privateData, setPrivateData] = useState('')
    

    useEffect(() => {
       if(!localStorage.getItem('authToken')){
            history('/login')
       }

       const fetchPrivateData = async() => {
            const config = {
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${localStorage.getItem('authToken')}`
                }
            }
            try {
                const {data} = await axios.get('/api/private/',config)
                setPrivateData(data.data)
            } catch (error) {
                localStorage.removeItem('authToken')
                setError("Ýou are not authorized , pls login")
            }
       }

       fetchPrivateData()
        
    }, [history])

    const logoutHandler = () => {
        localStorage.removeItem("authToken")
        history('/')
    }

    return error ? (
        <span className="error-message">{error}</span>
    ) : (
        <>
            <div style={{backgroundColor:"green", color:"white"}}>{privateData}</div>
            <button onClick={logoutHandler}>Logout</button>
        </>
    )
}

export default PrivateScreen
