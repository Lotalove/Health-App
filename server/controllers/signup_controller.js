require('dotenv').config()

async function signUp(req,res){
    let email = req.body.email
    let password = req.body.password

    const CHECK_ENDPOINT = `${process.env.SUPABASE_URL}/rest/v1/Profiles`;
    const supabaseSignUpEndpoint = process.env.SUPABASE_URL + "/auth/v1/signup"

   try {
   
        const checkResponse = await fetch(`${CHECK_ENDPOINT}?email=eq.${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Use SERVICE KEY to bypass RLS and read the protected 'auth.users' table
                'apikey': process.env.SUPABASE_SERVICE_KEY, 
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            },
   
        })
        
        let data = await checkResponse.json()
        if(data.length == 0){
            // if no account with this email are found then sign the user up and add to profiles

            const signUpResponse = await fetch( supabaseSignUpEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Use SERVICE KEY to bypass RLS and read the protected 'auth.users' table
                'apikey': process.env.SUPABASE_SERVICE_KEY, 
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
            },
            body:JSON.stringify({email:email,password:password})
        })
            data = await signUpResponse.json()
            console.log(data)
            res.json({
            data: data
        });

        }
        
    }
    catch (err){

        console.error(err)
    }
}

module.exports ={signUp}