document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие данных в localStorage
    const name = localStorage.getItem('name') || '';
    const username = localStorage.getItem('username') || '';
    const gmail = localStorage.getItem('gmail') || '';
    const рост = localStorage.getItem('рост') || '';
    const вес = localStorage.getItem('вес') || '';
    const страна = localStorage.getItem('страна') || '';
    const возраст = localStorage.getItem('возраст') || '';
    const пол = localStorage.getItem('пол') || '';

    // Заполняем поля формы данными из localStorage
    document.querySelector('input[name="name"]').value = name;
    document.querySelector('input[name="username"]').value = username;
    document.querySelector('input[name="gmail"]').value = gmail;
    document.querySelector('input[name="рост"]').value = рост;
    document.querySelector('input[name="вес"]').value = вес;
    document.querySelector('input[name="страна"]').value = страна;
    document.querySelector('input[name="возраст"]').value = возраст;
    document.querySelector('select[name="пол"] option[value="' + пол + '"]').selected = true;

    // Обработка нажатия кнопки "Сохранить"
    document.querySelector('.save').addEventListener('click', () => {
        const formData = new FormData(document.forms.signup);

        localStorage.setItem('name', formData.get('name'));
        localStorage.setItem('username', formData.get('username'));
        localStorage.setItem('gmail', formData.get('gmail'));
        localStorage.setItem('рост', formData.get('рост'));
        localStorage.setItem('вес', formData.get('вес'));
        localStorage.setItem('страна', formData.get('страна'));
        localStorage.setItem('возраст', formData.get('возраст'));
        localStorage.setItem('пол', formData.get('пол'));

        alert('Данные успешно сохранены!');
    });
});