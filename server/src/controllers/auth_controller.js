const { pool } = require("../database/connection");

async function login(req, res) {
	const { email, password } = req.body;

	const response = await fetch(
		`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
			},
			body: JSON.stringify({ email, password }),
		},
	);

	const data = await response.json();

	if (!response.ok) {
		// supabase return 400 when incorrect credentials
		// supabase  also return error description "Invalid login credentials"
		return res
			.status(response.status)
			.json({ error: data.error_description || data.msg });
	}

	// Set httpOnly cookies instead of returning tokens in the JSON body
	res.cookie("access_token", data.access_token, {
		httpOnly: true,
		secure: true, // only sent over HTTPS
		sameSite: "strict", // or 'lax' depending on your setup
		maxAge: 60 * 60 * 1000, // 1 hour, matches token expiry
	});

	res.cookie("refresh_token", data.refresh_token, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days, or whatever your refresh token lifetime is
	});

	res.status(200).json({ user: data.user });
}
async function logout(req, res) {
	const token = req.cookies["access_token"];
	if (token == undefined)
		res.status(200).json({ msg: "User already logged out" });

	const response = await fetch(
		`${process.env.SUPABASE_URL}/auth/v1/logout?scope=local`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
			},
		},
	);
	if (!response.ok) {
		return res.status().json({ error: "failed to logout" });
	}
	res.clearCookie("access_token");
	res.clearCookie("refresh_token");

	return res.status(200).json({ msg: "Succesfully logged out" });
}
async function requireAuth(req, res, next) {
	const token = req.cookies.access_token;

	if (!token) return res.status(401).json({ error: "Missing token" });

	const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
		headers: {
			Authorization: `Bearer ${token}`,
			apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
		},
	});

	if (!response.ok) {
		return res.status(401).json({ error: "Invalid token" });
	}

	req.user = await response.json(); // update to user_idß

	next();
}
module.exports = { login, logout, requireAuth };
