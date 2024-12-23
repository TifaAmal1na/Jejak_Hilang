const html = String.raw;

export default function loadDetail(id) {
	const mainContent = document.getElementById('main-content');
	mainContent.innerHTML = `<p>Loading data...</p>`;
	const heroElement = document.querySelector('.hero');

	window.history.pushState({}, '', '/detail-update');

	if (heroElement) {
		heroElement.style.display = 'none';
	}

	fetch('/api/orang_hilang/' + id)
		.then((response) => response.json())
		.then((data) => {
			const found = data.tanggal_ditemukan !== '0000-00-00';
			const date = found ? new Date(data.tanggal_ditemukan).toLocaleDateString() : 'Belum ditemukan';

			mainContent.innerHTML = html`
				<section class="detail">
					<div class="image">
						<img src="${data.foto}" alt="${data.nama}" />
					</div>
					<div class="info">
						<h2>${data.nama}</h2>
						<p><strong>Tanggal Hilang:</strong> ${new Date(data.tanggal_hilang).toLocaleDateString()}</p>
						<p><strong>Ciri-ciri:</strong> ${data.ciri}</p>
						<p><strong>Nomor Pelapor:</strong> ${data.nomer_pelapor}</p>
						<p><strong>Tanggal Ditemukan:</strong> ${date}</p>
						<button class="status-btn">${data.status === 'sudah' ? 'Sudah Ditemukan' : 'Belum Ditemukan'}</button>
						<button class="update-btn" data-id="${data.id}">Update Data</button>
					</div>
				</section>
			`;

			const updateBtn = document.querySelector('.update-btn');
			updateBtn.addEventListener('click', () => {
				loadUpdate(data.id);
			});
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			mainContent.innerHTML = '<p>Detail tidak ditemukan.</p>';
		});
}

function loadUpdate(id) {
	const mainContent = document.getElementById('main-content');
	window.history.pushState({}, '', `/update/${id}`);

	mainContent.innerHTML = html`
		<h2>Update Data Orang Hilang</h2>
		<form id="update-form" enctype="multipart/form-data">
			<label for="nama">Nama:</label>
			<input type="text" id="nama" name="nama" required />

			<label for="ciri">Ciri-ciri:</label>
			<textarea id="ciri" name="ciri" required></textarea>

			<label for="tanggal_hilang">Tanggal Hilang:</label>
			<input type="date" id="tanggal_hilang" name="tanggal_hilang" required />

			<label for="tanggal_ditemukan">Tanggal Ditemukan:</label>
			<input type="date" id="tanggal_ditemukan" name="tanggal_ditemukan" />

			<label for="foto">Foto:</label>
			<input type="file" id="foto" name="foto" accept="image/*" />
			<div id="preview-container">
				<p>Preview Foto:</p>
				<img id="foto-preview" src="" alt="Preview Foto" style="max-width: 200px; max-height: 200px;" />
			</div>

			<label for="status">Status:</label>
			<select id="status" name="status" required>
				<option value="belum">Belum Ditemukan</option>
				<option value="sudah">Sudah Ditemukan</option>
			</select>

			<label for="nomer_pelapor">Nomor Pelapor:</label>
			<input type="text" id="nomer_pelapor" name="nomer_pelapor" required />

			<button type="submit">Submit</button>
		</form>
	`;

	fetch('/api/orang_hilang/' + id)
		.then((response) => response.json())
		.then((data) => {
			const found = data.tanggal_ditemukan !== '0000-00-00';
			const date = found ? data.tanggal_ditemukan.split('T')[0] : '0000-00-00';

			document.getElementById('nama').value = data.nama;
			document.getElementById('ciri').value = data.ciri;
			document.getElementById('tanggal_hilang').value = data.tanggal_hilang.split('T')[0];
			document.getElementById('tanggal_ditemukan').value = date;
			document.getElementById('status').value = data.status;
			document.getElementById('nomer_pelapor').value = data.nomer_pelapor;

			const fotoPreview = document.getElementById('foto-preview');
			fotoPreview.src = data.foto;
		})
		.catch((error) => {
			console.error('Error fetching data for update:', error);
			alert('Gagal memuat data untuk diupdate.');
			mainContent.innerHTML = '<p>Data tidak ditemukan untuk diupdate.</p>';
		});

	const fotoInput = document.getElementById('foto');
	fotoInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		const preview = document.getElementById('foto-preview');
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				preview.src = e.target.result;
			};
			reader.readAsDataURL(file);
		} else {
			preview.src = '';
		}
	});

	const form = document.getElementById('update-form');
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const nama = document.getElementById('nama').value;
		const ciri = document.getElementById('ciri').value;
		const tanggalHilang = document.getElementById('tanggal_hilang').value;
		const tanggalDitemukan = document.getElementById('tanggal_ditemukan').value;
		const status = document.getElementById('status').value;
		const nomerPelapor = document.getElementById('nomer_pelapor').value;
		const fotoFile = document.getElementById('foto').files[0];

		if (!nama || !ciri || !tanggalHilang || !status || !nomerPelapor) {
			alert('Semua field wajib diisi.');
			return;
		}

		const formData = new FormData();

		formData.append('nama', nama);
		formData.append('tanggal_hilang', tanggalHilang);
		formData.append('tanggal_ditemukan', tanggalDitemukan || '0000-00-00');
		formData.append('ciri', ciri);
		formData.append('nomer_pelapor', nomerPelapor);
		formData.append('status', status);

		if (fotoFile) {
			formData.append('foto', fotoFile);
		}

		fetch('/api/orang_hilang/' + id, {
			method: 'PUT',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) throw new Error('Gagal memperbarui data');
				return response.json();
			})
			.then((data) => {
				alert('Data berhasil diperbarui');
				loadDetail(id);
			})
			.catch((error) => {
				console.error('Error updating data:', error);
				alert('Terjadi kesalahan saat memperbarui data');
			});
	});
}
