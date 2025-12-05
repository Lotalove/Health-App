const data = require('../userdata.json')
const jwt = require('jsonwebtoken') //
const argon2 = require('argon2') // for encryption
require('dotenv').config();
const fs= require('fs')
const findUserByID = require('../database/findUser').findUserByID

const {createClient} = require('../config/supabase')
async function createTokens(user){
   const accessToken = jwt.sign({user:user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'}) 
   const refreshToken = jwt.sign({user:user},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'})
    //writes the refresh token
   findUserByID(user).refreshToken = refreshToken
    fs.writeFileSync('./userdata.json',JSON.stringify(data,null,2))
    return {accessToken,refreshToken}
}

// todo send back an error message for errors!
async function login(req,res){
   
    let email = req.body.email
    let password = req.body.password

    const supabaseEndpoint = process.env.SUPABASE_URL + "/auth/v1/token?grant_type=password"

    try {
        // 1. Send the POST request to Supabase using fetch
        const response = await fetch(supabaseEndpoint, {
            method: 'POST',
            // Convert the JavaScript object to a JSON string for the body
            body: JSON.stringify({email:email,password:password}), 
            // 2. Define the required Supabase headers
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_APIKEY,
            }
        });

        // 3. Handle the response
        if (!response.ok) {
            // Check for HTTP error status (4xx or 5xx)
            const errorData = await response.json();
            throw new Error(`Supabase Error: ${response.status} - ${errorData.message || response.statusText}`);
        }

        // Parse the JSON response body
        const data = await response.json();

        // 4. Send the Supabase response back to the original client
        res.status(response.status).json({
            message: 'User created successfully in Supabase via fetch',
            data: data
        });

    } catch (error) {
        // Handle errors from the fetch request (e.g., network error or Supabase error)
        console.error('Error calling Supabase API:', error.message);
        
        res.status(500).json({ 
            message: 'Failed to create user in Supabase',
            error: error.message
        });
    }
    //supabase.auth.signInWithPassword();
    /*try{
    const user = findUserByID(req.body.user)
    const match = await argon2.verify(user.password,req.body.password)
    
    if (match){
        const tokens = await createTokens(user.id)
        res.cookie('jwt',tokens.refreshToken,{httpOnly:true, maxAge:24*60*60*1000})
        res.status(200).json({user:user.id,routines:user.routines,accessToken:tokens.accessToken})  
    } 
    else res.status(400).json({})
}
catch (err){
    console.log(err)
}*/



}

module.exports ={login}