$(document).ready(function () {
    const signUpButton = $('#signUp');
    const signInButton = $('#signIn');
    const container = $('#container');

    signUpButton.on('click', function () {
        container.addClass('right-panel-active');
    });

    signInButton.on('click', function () {
        container.removeClass('right-panel-active');
    });

    $('#registerForm').on('submit', function (event) {
        event.preventDefault();

        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: '/api/auth/register',
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                alert('Успех!');
                location.replace('index.html'); // Перенаправление на главную страницу
            },
            error: function (xhr, status, error) {
                console.error("Ошибка регистрации. Попробуйте еще раз!", xhr.status, xhr.responseText);
                alert('Ошибка регистрации! Попробуйте еще раз.');
            }
        });
    });

    $('#loginForm').on('submit', function (event) {
        event.preventDefault();

        var loginData = {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        };

        $.ajax({
            url: '/api/auth/login',
            type: 'POST',
            data: JSON.stringify(loginData),
            contentType: 'application/json',
            success: function (response) {
                location.replace('index.html');
            },
            error: function (xhr, status, error) {
                console.error("Ошибка входа. Попробуйте еще раз!");
                alert('Неправильный логин или пароль!');
            }
        });
    });
});