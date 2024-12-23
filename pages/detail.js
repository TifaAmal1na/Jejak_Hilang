const html = String.raw;

export default function loadDetail(id) {
	const mainContent = document.getElementById('main-content');
	mainContent.innerHTML = `<p>Loading data...</p>`;
	const heroElement = document.querySelector('.hero');

	window.history.pushState({}, '', '/detail');

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
					</div>
				</section>
			`;
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			mainContent.innerHTML = '<p>Detail tidak ditemukan.</p>';
		});
}
