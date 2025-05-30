import { createContext, useState } from "react";
import { supabase } from "../api/supabaseClient";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const signUp = async(email,password) =>{
        const {data,error} = await supabase.auth.signUp({email:email,
            password:password,
            options:{data:{
                role:"client"
            }}
            
        })
  
        if(error){return({success:false,error})}
        return({success:true,data})
    }

    const signOut = async()=>{
        const {error} = await supabase.auth.signOut()
    }
    const signIn = async(email,password)=>{
      
        const {data,error} = await supabase.auth.signInWithPassword({email,password})
        if(data.user !==null){
            setAuth(data)
            return({success:true,data})
        }
        if(error){
            return({success:false,error})}
        
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth,signUp,signIn,signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;