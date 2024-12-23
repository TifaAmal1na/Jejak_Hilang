import loadDetail from './detail';

const html = String.raw;

export default function loadHome() {
	const mainContent = document.getElementById('main-content');

	mainContent.innerHTML = html`
		<section class="search-bar">
			<input type="text" id="search-input" placeholder="Cari nama orang hilang..." />
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
          <a href="#" data-id="${person.id}" class="detail-link">View More >></a>
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
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			mainContent.innerHTML = '<p>Gagal memuat data.</p>';
		});

	searchButton.addEventListener('click', () => {
		const persons = document.querySelectorAll('.person');
		persons.forEach((person) => {
			person.style.display = 'none';
		});

		handleSearch();
	});
}
