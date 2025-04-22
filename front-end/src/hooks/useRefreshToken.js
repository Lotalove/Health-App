import {supabase} from '../api/supabaseClient' 
import axios from '../api/axios';

import useAuth from './useAuth';


const useRefreshToken = () => {
    const { setAuth } = useAuth();
    
    const refresh = async () => {
        const {data:{session}} = await supabase.auth.getSession()
        setAuth(session)
        console.log(session)
    }
    return refresh;
};

export default useRefreshToken;