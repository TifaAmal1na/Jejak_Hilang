const { sql } = require('@vercel/postgres');

exports.getNotifications = async (req, res) => {
	try {
		const { rows } = await sql`SELECT * FROM notification ORDER BY id DESC`;
		return res.status(200).json(rows);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};
