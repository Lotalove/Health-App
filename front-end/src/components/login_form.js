import styles from '../styles/login.module.css'
import AuthContext from "../context/Authprovider"
import { useContext, useRef,useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import LoadingSpinner from './loading';
import logo from '../media/icons/Fittest_Logo.jpg'

export function Login(){
    const {auth,signIn} = useContext(AuthContext)
    const navigate = useNavigate();
    var user = useRef()
    var pwrd = useRef()
    const [error, setError] = useState({username: false,password: false,general:false});
    const [isLoading,setLoading] = useState(false)
  useEffect(() => {
    if (auth?.user!=null) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth, navigate]);

    function Errors(){
        setError({username:false,password:false,general:false})
        console.log(user.current.value)
        if (user.current.value == ""){
            setError({...error , username :'No username entered'})
            return true
        } 
        if (pwrd.current.value == ""){
            setError({...error , password :'No password entered'})
            return true
        } 
    }

    async function handleSubmit() {
        if(Errors() == true){return}
        setLoading(true);
        try {
            
            const response = await signIn(user.current.value,pwrd.current.value)

            if(!response.success)  setError({... error,general:response.error.message})
        } catch (e) {
      
            console.error('Login failed:', e.response ? e.response.data : e.message);
           // if(!err?.response)setErrMsg
        }
        finally{
            setLoading(false)
        }
    }
    return(
        <div id={styles.page}>
        <div className={styles.formContainer}>  
             <img
                 id={styles.logo}
                 src={logo}
                 />
            <div>
            {error.general?<div className={styles.errorMessage}>{error.general}</div>:''}
            </div>
            <label className={styles.formLabel}> Email </label>
        
            <input ref ={user} type="email"></input>
            {error.username?<div className={styles.errorMessage}>{error.username}</div>:''}
           
            
            <label className={styles.formLabel}> Password</label>
            <input ref={pwrd} type="password"></input>
            {error.password?<div className={styles.errorMessage}>{error.password}</div>:''}
            <a className={styles.formLabel} href='/signup'>Sign up</a>
        
            <button
             className={styles.bigButton}
             onClick={handleSubmit}
             >
                {isLoading ? (
       <LoadingSpinner size={50} color="#FFFFFF" />
      ) : "Login" }

             </button>
       
        </div>
        </div>
    )
}

export function Signup(){
    const {auth,setAuth,signUp} = useContext(AuthContext)
    const navigate = useNavigate();
    var [mustConfirm,setMustConfirm] = useState(false)
    var email = useRef()
    var pwrd = useRef()
    var confirmPassword = useRef()
    var subButton = useRef()

    function SignUpForm(){      
        const [error, setError] = useState({email: false,password: false,confirmPassword: false,server:false});
  
        function checkPasswordMatches(){
            if(pwrd.current.value != confirmPassword.current.value){setError({...error,confirmPassword:"Passwords do not match"})}
            else{setError({...error,confirmPassword:false})}
        }
        
        function isValidForm(){
            var newErrors = {email:false,password:false,confirmPassword:false}

            if(email.current.value == ""){
                newErrors.email = "Please provide a username"
            }
            if(pwrd.current.value == ""){
                newErrors.password = "Please enter a password"
            }
            if(confirmPassword.current.value == ""){
                newErrors.confirmPassword = "Please confirm your password"
            }
            setError(newErrors)

            if (newErrors.email == false && newErrors.password == false && newErrors.confirmPassword == false) {
                
                return true;
            }
            return false
        }
    
      useEffect(() => {
   
        if (auth?.user!=null)  {
          navigate("/dashboard", { replace: true });
        }
      }, [auth, navigate]);
    
        async function handleSubmit() {
            subButton.current.disabled =true
           
            try {
                if(!isValidForm()) {throw new Error("bad input")}
                const data = await signUp(email.current.value,pwrd.current.value)
                if(data.success == true)setMustConfirm(true)
                else throw data.error
            } catch (e) {
                setError({...error, server:e.message})
        
               // if(!err?.response)setErrMsg
            }
            finally{
                subButton.current.disabled = false
            }
        }
    
        return(
 
            <div className={styles.formContainer}>  
            <h3>Hello, fill out the form to make an account.</h3>
            {error.server?<div className={styles.errorMessage}>{error.server}</div>:''}

                <label className={styles.formLabel}> Email </label>   
                <input className={`${styles.input} ${error.email ? styles.inputError : ''}`}ref ={email} type="email"></input>
                {error.email?<div className={styles.errorMessage}>{error.email}</div>:''}
    
                <label className={styles.formLabel}> Password</label>
                <input className={`${styles.input} ${error.password ? styles.inputError : ''}`} ref={pwrd} type="password"></input>
                {error.password? <div className={styles.errorMessage}>{error.password}</div>:''}
               
                <label className={styles.formLabel}>Confirm Password</label>
                
                <input 
                className={`${styles.input} ${error.confirmPassword? styles.inputError : ''}`}
                onChange={checkPasswordMatches}
                 ref={confirmPassword}
                  type="password"></input>
                
            
                {error.confirmPassword?<div className={styles.errorMessage}>{error.confirmPassword}</div>:''}
               
                <a className={styles.formLabel} href='/'>Already have an account?</a>
                <div>
                
                <button
                ref={subButton}
                 className={styles.bigButton}
                 onClick={handleSubmit}
                 >Register</button>
                
                </div>
            </div>
        )
        
    }

    function ConfirmationScreen({email}){
        return(
            <div>
                <p>Please check your email: {email} and confirm your email address. </p>
                <a>If you dont recieve one it is likely you already have an account click here to <a href='/'>login</a> </a>
            </div>
        )
    }
    return(
        <div id={styles.page}>
        {mustConfirm==true?<ConfirmationScreen email={email.current.value}></ConfirmationScreen>:<SignUpForm></SignUpForm>}
        </div>
     
    )
}

