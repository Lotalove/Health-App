import styles from '../styles/login.module.css'
import axios from '../api/axios';
import AuthContext from "../context/Authprovider"
import { useContext, useRef,useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";


export function Login(){
    const {auth,signIn} = useContext(AuthContext)
    const navigate = useNavigate();
    var user = useRef()
    var pwrd = useRef()
      
  useEffect(() => {
    if (auth) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth, navigate]);

    async function handleSubmit() {
        try {
           /* const resp = await axios.post('/login', {
                user: user.current.value,
                password: pwrd.current.value
            
                },
            {
                headers:{'Content-Type':'application/json'},
                withCredentials:true
            });
            const accessToken = resp?.data?.accessToken
            
            await setAuth({user:user.current.value,routines:resp.data.routines,accessToken:accessToken})
        */
            const response =await signIn(user.current.value,pwrd.current.value)
            console.log(response)
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
        
            <input ref ={user} type="email"></input>
            
           
            
            <label className={styles.formLabel}> Password</label>
            <input ref={pwrd} type="password"></input>
            
            <a className={styles.formLabel} href='/signup'>Sign up</a>
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

export function Signup(){
    const {auth,setAuth,signUp} = useContext(AuthContext)
    const navigate = useNavigate();
    var [mustConfirm,setMustConfirm] = useState(false)

    function SignUpForm({setMustConfirm}){
        
        const [error, setError] = useState({
            username: false,
            password: false,
            confirmPassword: true
          });
        var username = useRef()
        var pwrd = useRef()
        var comfPwrd = useRef()
        
        function checkPasswordMatches(){
            if(pwrd.current.value != comfPwrd.current.value){setError({...error,confirmPassword:"Passwords do not match"})}
            else{setError({...error,confirmPassword:false})}
        }
        
        function isValidForm(){

            var newErrors = {username:false,password:false,confirmPassword:false}

            if(username.current.value == ""){
                newErrors.username = "Please provide a username"
            }
            if(pwrd.current.value == ""){
                newErrors.password = "Please enter a password"
            }
            if(comfPwrd.current.value == ""){
                newErrors.confirmPassword = "Please confirm your password"
            }
            setError(newErrors)

            if (Object.keys(newErrors).length > 0) {
                return false;
            }
            return true
        }
    
      useEffect(() => {
        console.log(auth.user)
        if (auth.user) {
          navigate("/dashboard", { replace: true });
        }
      }, [auth, navigate]);
    
        async function handleSubmit() {
            console.log(error)
            if(!isValidForm()) {
                console.log("invalid form")
                return}
            try {
                const data = await signUp(username.current.value,pwrd.current.value)
                setMustConfirm(true)
            } catch (error) {
                console.error('signup failed:', error.response ? error.response.data : error.message);
               // if(!err?.response)setErrMsg
            }
        }
    
        
        return(
            <div id={styles.page}>
            <div className={styles.formContainer}>  
            <h3>Hello, fill out the form to make an account.</h3>
               
                <label className={styles.formLabel}> Username </label>   
                <input ref ={username} type="text"></input>
                {error.username?<div className={styles.errorMessage}>{error.username}</div>:''}
    
                <label className={styles.formLabel}> Password</label>
                <input ref={pwrd} type="password"></input>
                {error.password? <div className={styles.errorMessage}>{error.password}</div>:''}
               
                <label className={styles.formLabel}>Confirm Password</label>
                <input 
                className={`${styles.input} ${error.password ? styles.inputError : ''}`}
                onChange={checkPasswordMatches}
                 ref={comfPwrd}
                  type="password"></input>
                {error.confirmPassword?<div className={styles.errorMessage}>{error.confirmPassword}</div>:''}
               
                <a className={styles.formLabel} href='/'>Already have an account?</a>
                <div>
                
                <button
                 className={styles.bigButton}
                 onClick={handleSubmit}
                 >Register</button>
                
                </div>
            </div>
            </div>
        )
    }
    
    function ConfirmationScreen({email}){
        return(
            <div>
                <p>Please check your email: {email} and confirm your email address. </p>
                <a>Click here once you have done so. </a>
            </div>
        )
    }
    return(mustConfirm?<ConfirmationScreen></ConfirmationScreen>:<SignUpForm></SignUpForm>)

}

