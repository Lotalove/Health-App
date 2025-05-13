import homeIcon from '../media/icons/home_icon.svg'
import account_icon from '../media/icons/user.svg'
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/Authprovider';
// styles for the navbar are loacted in ../styles/App.css

function Icon(props){
    
    return(
        <div id={props.id?props.id:null}
        className ="navbar-icon"
        onClick={props.clickEvent}
        >
            <img src = {props.svg} />
            {props.text}
            
        </div>
    )
}


export function Navbar (){
    const navigate = useNavigate(); // useNavigate must be called inside a functional component
    const {auth,setAuth,signOut} = useContext(AuthContext)
    const goHome = () => {
        navigate('/dashboard'); // Redirect to the '/dashboard' route
    };

    async function logout() {
            try {
                
                const response = await signOut()
                await setAuth(null)
                //navigate('/')
            } catch (error) {
                console.error('Logout failed:', error.response ? error.response.data : error.message);
               // if(!err?.response)setErrMsg
            }
        }
    return(
        <div id="navbar">
        <Icon clickEvent ={goHome}svg = {homeIcon}></Icon>
        
        <button id='logout_button' onClick={logout} >Logout</button>
       
        </div>)
}