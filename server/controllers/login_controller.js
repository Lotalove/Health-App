require('dotenv').config()

async function login(req,res){
   
    let email = req.body.email
    let password = req.body.password

    const supabaseEndpoint = process.env.SUPABASE_URL + "/auth/v1/token?grant_type=password"

    try {
        
        const response = await fetch(supabaseEndpoint, {
            method: 'POST',
            
            body: JSON.stringify({email:email,password:password}), 
            
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_APIKEY,
            }
        });

        
        if (!response.ok) {
            
            const errorData = await response.json();
            throw new Error(`Supabase Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        // Parse the JSON response body
        const data = await response.json();

        // 4. Send the Supabase response back to the original client
        res.status(response.status).json({
            data: data
        });

    } catch (error) {
        // Handle errors from the fetch request (e.g., network error or Supabase error)
        console.error('Error calling Supabase API:', error.message);
        
        res.status(500).json({ 
            message: 'Failed to Login user in Supabase',
            error: error.message
        });
    }


}

module.exports ={login}