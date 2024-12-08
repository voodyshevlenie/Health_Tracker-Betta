const menuButton = document.querySelector('.menu-button');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

menuButton.addEventListener('click', () => {
    sidebar.style.left = '0';
    overlay.style.display = 'block';
    menuButton.style.display = 'none';
});

overlay.addEventListener('click', () => {
    sidebar.style.left = '-300px';
    overlay.style.display = 'none';
    menuButton.style.display = 'block';
});