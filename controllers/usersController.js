const { sql } = require('@vercel/postgres');

exports.getUsers = async (req, res) => {
	try {
		const { rows } = await sql`SELECT * FROM users`;
		return res.status(200).json(rows);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};

exports.loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

		const { rows } = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password}`;
		if (rows.length === 0) return res.status(401).json({ message: 'Invalid username or password.' });

		const user = rows[0];
		delete user.password;

		return res.status(200).json({
			message: 'Login successful',
			user,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};
