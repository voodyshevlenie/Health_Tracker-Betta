document.addEventListener('DOMContentLoaded', () => {
    const authorizeButton = document.getElementById('authorizeButton');
  
    authorizeButton.addEventListener('click', () => {
          window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.activity.read%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.body.read&prompt=consent&response_type=code&client_id=834693111196-e0clo37qqtistl163steva89a73bdbjg.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fcallback&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow'; // Перенаправляем на /auth
    });
  });