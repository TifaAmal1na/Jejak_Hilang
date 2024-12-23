import loadDetail from './detail';

export default function loadHome() {
	const mainContent = document.getElementById('main-content');
	mainContent.innerHTML = `
    <section class="header">
      <h1>Admin Dashboard</h1>
      <button id="logout-button">Logout</button>
    </section>
    <section class="search-bar">
      <input type="text" id="search-input" placeholder="Cari nama orang hilang...">
      <button id="search-button">Cari</button>
    </section>
    <section class="missing-list">
      <h2>Daftar Orang Hilang</h2>
      <div id="missing-list-container" class="list">
        <!-- Data akan dimuat di sini -->
      </div>
    </section>
  `;

	const container = document.getElementById('missing-list-container');
	const searchInput = document.getElementById('search-input');
	const searchButton = document.getElementById('search-button');
	const logoutButton = document.getElementById('logout-button');

	logoutButton.addEventListener('click', () => {
		window.location.href = '/';
	});

	let orangHilang = [];

	const handleSearch = () => {
		const query = searchInput.value.trim().toLowerCase();
		const persons = document.querySelectorAll('.person');

		persons.forEach((person) => {
			const name = person.querySelector('p').textContent.toLowerCase();
			if (name.includes(query)) {
				person.style.display = 'block';
			} else {
				person.style.display = 'none';
			}
		});
	};

	const handleDelete = async (id) => {
		if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
			try {
				const response = await fetch('/api/orang_hilang/' + id, {
					method: 'DELETE',
				});

				if (response.ok) {
					alert('Data berhasil dihapus!');
					loadHome();
				} else {
					alert('Gagal menghapus data.');
				}
			} catch (error) {
				console.error('Error deleting data:', error);
				alert('Terjadi kesalahan saat menghapus data.');
			}
		}
	};

	fetch('/api/orang_hilang')
		.then((response) => response.json())
		.then((data) => {
			orangHilang = data;

			orangHilang.forEach((person) => {
				const personCard = document.createElement('div');
				personCard.classList.add('person');
				personCard.innerHTML = `
          <img src="${person.foto}" alt="${person.nama}">
          <p>${person.nama}</p>
          <div class="actions">
            <a href="#" data-id="${person.id}" class="detail-link">View More >></a>
            <button class="delete-button" data-id="${person.id}">Delete</button>
          </div>
        `;
				container.appendChild(personCard);
			});

			document.querySelectorAll('.detail-link').forEach((link) => {
				link.addEventListener('click', (event) => {
					event.preventDefault();
					const personId = event.target.getAttribute('data-id');
					loadDetail(personId);
				});
			});

			document.querySelectorAll('.delete-button').forEach((button) => {
				button.addEventListener('click', (event) => {
					const personId = event.target.getAttribute('data-id');
					handleDelete(personId);
				});
			});
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			mainContent.innerHTML = '<p>Gagal memuat data.</p>';
		});

	searchButton.addEventListener('click', () => {
		handleSearch();
	});
}
