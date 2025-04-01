import styles from '../styles/login.module.css'
import axios from '../api/axios';
import AuthContext from "../context/Authprovider"
import { useContext, useRef,useEffect} from 'react';
import { useNavigate } from "react-router-dom";

/*  
    this is the code for a sign in with google button just paste into form

<GoogleLogin className ={styles.bigButton}onSuccess={(credentialResponse)=>{
                console.log("Success: " + credentialResponse)
            }}
            onError={()=>{
                console.log("There was an issue with your login")
            }}
            ></GoogleLogin>            
*/ 

export function Login(){
    const {auth,setAuth} = useContext(AuthContext)
    const navigate = useNavigate();
    var user = useRef()
    var pwrd = useRef()
      
  useEffect(() => {
    console.log(auth.user)
    if (auth.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth, navigate]);

    async function handleSubmit() {
        try {
            const resp = await axios.post('/login', {
                user: user.current.value,
                password: pwrd.current.value
            },
            {
                headers:{'Content-Type':'application/json'},
                withCredentials:true
            });
            const accessToken = resp?.data?.accessToken
            
            await setAuth({user:user.current.value,routines:resp.data.routines,accessToken:accessToken})
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
           // if(!err?.response)setErrMsg
        }
    }
    return(
        <div id={styles.page}>
        <div className={styles.formContainer}>  

            <div>
           
            </div>
            <label className={styles.formLabel}> Username </label>
            <div>
            <input ref ={user} type="text"></input>
            
            </div>
            
            <label className={styles.formLabel}> Password</label>
            <input ref={pwrd} type="password"></input>
            
        
            <div>
            <button
             className={styles.bigButton}
             onClick={handleSubmit}
             >Login</button>
            </div>
        </div>
        </div>
    )
}

