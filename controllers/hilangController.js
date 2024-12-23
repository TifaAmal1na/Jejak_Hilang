const path = require('path');
const { sql } = require('@vercel/postgres');
const { put, del } = require('@vercel/blob');

exports.getAllHilang = async (req, res) => {
	try {
		const { rows } = await sql`SELECT * FROM orang_hilang`;
		return res.status(200).json(rows);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};

exports.getHilangById = async (req, res) => {
	try {
		const { id } = req.params;

		const { rows } = await sql`SELECT * FROM orang_hilang WHERE id = ${id}`;
		const found = rows[0];
		if (!found) {
			return res.status(404).json({
				error: 'Data not found',
			});
		}

		return res.status(200).json(found);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};

exports.addHilang = async (req, res) => {
	try {
		const { nama, ciri, tanggal_hilang, nomer_pelapor } = req.body;
		if (!req.file) {
			return res.status(400).json({
				error: 'Photo must be provided',
			});
		}

		const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const filename = suffix + path.extname(req.file.originalname);
		const { url } = await put(filename, req.file.buffer, {
			access: 'public',
		});

		const { rows: created } = await sql`
			INSERT INTO orang_hilang (nama, ciri, tanggal_hilang, foto, nomer_pelapor)
			VALUES (${nama}, ${ciri}, ${tanggal_hilang}, ${url}, ${nomer_pelapor})
			RETURNING id
		`;

		return res.status(201).json({
			id: created[0].id,
			message: 'Record added successfully',
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			error: error.message,
		});
	}
};

exports.updateHilang = async (req, res) => {
	try {
		const { id } = req.params;
		const { nama, ciri, tanggal_hilang, tanggal_ditemukan, status, nomer_pelapor } = req.body;

		const { rows } = await sql`SELECT * FROM orang_hilang WHERE id = ${id}`;
		const found = rows[0];
		if (!found) {
			return res.status(404).json({
				error: 'Data not found',
			});
		}

		if (req.file) {
			const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
			const filename = suffix + path.extname(req.file.originalname);
			const { url } = await put(filename, req.file.buffer, {
				access: 'public',
			});

			if (found.foto && found.foto !== '') await del(found.foto);
			found.foto = url;
		}

		if (tanggal_ditemukan === '0000-00-00') found.tanggal_ditemukan = '0001-01-01';
		else found.tanggal_ditemukan = tanggal_ditemukan;

		const { rows: updated } = await sql`
			UPDATE orang_hilang
			SET nama = ${nama}, ciri = ${ciri}, tanggal_hilang = ${tanggal_hilang}, tanggal_ditemukan = ${found.tanggal_ditemukan}, foto = ${found.foto}, status = ${status}, nomer_pelapor = ${nomer_pelapor}
			WHERE id = ${id}
			RETURNING id
		`;

		return res.status(200).json({
			id: updated[0].id,
			message: 'Record updated successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};

exports.deleteHilang = async (req, res) => {
	try {
		const { id } = req.params;

		const { rows } = await sql`SELECT * FROM orang_hilang WHERE id = ${id}`;
		const found = rows[0];
		if (!found) {
			return res.status(404).json({
				error: 'Data not found',
			});
		}

		if (found.foto && found.foto !== '') await del(found.foto);

		await sql`DELETE FROM orang_hilang WHERE id = ${id}`;

		return res.status(200).json({
			message: 'Record deleted successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: error.message,
		});
	}
};
