const openEye = './static/img/eye.svg';
const closeEye = './static/img/eye-off.svg';

document.getElementById('password-eye').onclick = showPassword
document.getElementById('submit').onclick = loginUser

function loginUser() {
    hiddenAllMessage()
    let emailFiled = document.getElementById('email-field')
    let passwordFiled = document.getElementById('password-field')
    let loginData = {
        'email': emailFiled.value,
        'password': passwordFiled.value
    }

    let errors = validateForm(loginData)
    if (errors.error) {
        sendErrors(errors)
    } else {
        let XHR = new XMLHttpRequest();
        XHR.onreadystatechange = () => {
            if (XHR.readyState === 4) {
              if (XHR.status == 200){
                window.location.href = '/admin'
              } else {
                sendErrorMessageLogin()
              }
            }
        };
        XHR.open('POST', '/api/login');
        XHR.send(JSON.stringify(loginData));
    }

}

function sendErrorMessageLogin(){
    let messageBox = document.getElementById('message-box')
    let messageText = document.getElementById('message-text')
    messageBox.classList.remove('hidden')
    messageBox.classList.add('message-box-animation')
    messageText.innerHTML = 'Email or password is incorrect.'
}

function sendErrors(errors) {
    let messageBox = document.getElementById('message-box')
    let messageText = document.getElementById('message-text')
    let commentEmail = document.getElementById('comment-email')
    let commentPassword = document.getElementById('comment-password')
    let emailFiled = document.getElementById('email-field')
    let passwordFiled = document.getElementById('password-field')
    if (errors.message) {
        messageBox.classList.remove('hidden')
        messageText.innerHTML = errors.message
        messageBox.classList.add('message-box-animation')
    }
    if (errors.emailError) {
        commentEmail.classList.remove('hidden')
        commentEmail.classList.add('comment_red')
        commentEmail.innerHTML = errors.emailError
        emailFiled.classList.add('field__input_red_underline')
    }
    if (errors.passwordError) {
        commentPassword.classList.remove('hidden')
        commentPassword.classList.add('comment_red')
        commentPassword.innerHTML = errors.passwordError
        passwordFiled.classList.add('field__input_red_underline')
    }
}

function validateForm(loginData) {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let findedError = false;
    let messageBoxError = ''
    let emailError = ''
    let passwordError = ''
    let email = loginData.email;
    let password = loginData.password;
    if (email == '' && password == '') {
        messageBoxError = 'A-Ah! Check all fileds,'
        emailError = 'Email is required.'
        passwordError = 'Password is required.'
        findedError = true
    }
    if (!emailRegexp.test(email)) {
        messageBoxError = 'A-Ah! Check all fileds,'
        emailError = 'Incorrect email format. Correct format is ****@**.***'
        findedError = true
    }
    if (password.length < 8) {
        messageBoxError = 'A-Ah! Check all fileds,'
        passwordError = 'Min 8 character.'
        findedError = true;
    }
    return {
        'error': findedError,
        'message': messageBoxError,
        'emailError': emailError,
        'passwordError': passwordError,
    }
}

function hiddenAllMessage() {
    document.getElementById('message-box').classList.add('hidden')
    document.getElementById('comment-email').classList.add('hidden')
    document.getElementById('comment-password').classList.add('hidden')
    document.getElementById('email-field').classList.remove('field__input_red_underline')
    document.getElementById('password-field').classList.remove('field__input_red_underline')
    document.getElementById('message-box').classList.remove('message-box-animation')
}

function showPassword() {
    const eye = document.getElementById('password-eye');
    const password = document.getElementById('password-field');

    eye.onclick = hidePassword;
    eye.setAttribute('src', closeEye);

    password.setAttribute('type', 'text');
}

function hidePassword() {
    const eye = document.getElementById('password-eye')
    const password = document.getElementById('password-field');

    eye.onclick = showPassword;
    eye.setAttribute('src', openEye);

    password.setAttribute('type', 'password');
}
