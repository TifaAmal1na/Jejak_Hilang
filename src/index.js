import '../assets/style.css';

import loadAdminForm from '../admin/home.js';
import loadForm from '../pages/form.js';
import loadHome from '../pages/home.js';

document.addEventListener('DOMContentLoaded', () => {
	const homeLink = document.getElementById('home-link');
	const formLink = document.getElementById('form-link');
	const loginLink = document.getElementById('login-link');
	const mainContent = document.getElementById('main-content');
	const hamburger = document.getElementById('hamburger');
	const drawer = document.getElementById('drawer');
	const closeDrawer = document.getElementById('closeDrawer');
	const heroElement = document.querySelector('.hero');

	loadHome();

	window.history.pushState({}, '', '/home');

	if (heroElement) {
		heroElement.style.display = 'flex';
	}

	homeLink.addEventListener('click', (event) => {
		event.preventDefault();
		loadHome();
		window.history.pushState({}, '', '/home');
		if (heroElement) {
			heroElement.style.display = 'flex';
		}
		drawer.classList.remove('active');
	});

	formLink.addEventListener('click', (event) => {
		event.preventDefault();
		loadForm();
		window.history.pushState({}, '', '/form');
		if (heroElement) {
			heroElement.style.display = 'none';
		}
		drawer.classList.remove('active');
	});

	loginLink.addEventListener('click', (event) => {
		event.preventDefault();
		const loginModal = document.getElementById('login-modal');
		loginModal.style.display = 'block';
		window.history.pushState({}, '', '/admin');
	});

	const closeButton = document.getElementById('close-login');
	const modal = document.getElementById('login-modal');

	closeButton.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	window.addEventListener('click', (event) => {
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	});

	const loginForm = document.getElementById('login-form');
	loginForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		try {
			const response = await fetch('/api/users/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

			const result = await response.json();

			if (response.ok) {
				alert('Login Berhasil!');
				modal.style.display = 'none';

				loadAdminForm();
				window.history.pushState({}, '', '/admin-dashboard');
			} else {
				alert(result.message || 'Username atau Password salah.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Terjadi kesalahan. Silakan coba lagi.');
		}
	});

	hamburger.addEventListener('click', () => {
		drawer.classList.add('active');
	});

	closeDrawer.addEventListener('click', () => {
		drawer.classList.remove('active');
	});
});
