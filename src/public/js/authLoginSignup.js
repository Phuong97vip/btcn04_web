let content = $('.content')
let loginContent = $('.loginContent')
let signupContent = $('.signupContent')
let createAccountLink = $('.createAccountLink');
let carousel = $('.carousel');

const changeForm = (e) => {
    carousel.toggleClass('carouselSignup');
    content.toggleClass('changeToSignup hidden');
    setTimeout(() => {
        loginContent.toggleClass('d-none');
        signupContent.toggleClass('d-none');
        content.toggleClass('hidden');
    }, 600)

}

$('.loginForm').on('submit', function (e) {
    $rememberChbx = $($('form input[type="checkbox"]')[0]);
    $rememberChbx.val($rememberChbx.prop('checked') == true ? 'true' : 'false');
});

if (typeof isRegister !== 'undefined') {
    if (isRegister) {
        changeForm();
    }

}


let signupUsername = $('#signupUsername');
let signupFullname = $('#signupFullname');
let nickname = $('#nickname');
let signupPassword = $('#signupPassword');
let signupButton = $('.signupButton');
let errMss = $('.errMss')
let signupForm = $('.signupForm')

signupUsername.on('input', (e) => {
    signupUsername.removeClass('errMss border-danger');
    signupUsername.attr('placeholder', 'Enter your username')
})
signupFullname.on('input', (e) => {
    signupFullname.removeClass('errMss border-danger');
    signupFullname.attr('placeholder', 'Enter your username')
})
nickname.on('input', (e) => {
    nickname.removeClass('errMss border-danger');
    nickname.attr('placeholder', 'Enter your username')
})
signupPassword.on('input', (e) => {
    signupPassword.removeClass('errMss border-danger');
    signupPassword.attr('placeholder', 'Enter your username')
})

const RequireError = () => {
    let check = true;
    if (signupUsername.val() == null || signupUsername.val() == '') {
        signupUsername.attr('placeholder', 'Please fill in your username')
        signupUsername.addClass(' errMss border-danger')
        check = false;
    }
    if (signupFullname.val() == null || signupFullname.val() == '') {
        signupFullname.attr('placeholder', 'Please fill in your fullname')
        signupFullname.addClass(' errMss border-danger')
        check = false;
    }
    if (nickname.val() == null || nickname.val() == '') {
        nickname.attr('placeholder', 'Please fill in your nickname')
        nickname.addClass(' errMss border-danger')
        check = false;
    }
    if (signupPassword.val() == null || signupPassword.val() == '') {
        signupPassword.attr('placeholder', 'Please fill in your password')
        signupPassword.addClass(' errMss border-danger')
        check = false;
    }
    return check;
}

const CheckUsername = async () => {
    const rs = await fetch('https://localhost:53003/api/user/username');
    const usernameList = await rs.json();
    if (usernameList.includes(signupUsername.val())) {
        signupUsername.val('');
        signupUsername.attr('placeholder', 'This username has already been used')
        signupUsername.addClass(' errMss border-danger')
        return false;
    }
    return true;
}

signupForm.on('submit', async (e) => {
    e.preventDefault();
    if (!(await RequireError())) return;
    if (!(await CheckUsername())) return;
    const signupInfo = {
        username: signupUsername.val(),
        password: signupPassword.val(),
        nickname: nickname.val(),
        fullname: signupFullname.val()
    }
    const serverResponse = await fetch('https://localhost:53003/signup', {
        method: 'post',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(signupInfo)
    })
    const response = await serverResponse.json();
    if (response.mss == 'err') {
        errMss.removeClass('d-none');
    } else {
        alert("Đăng ký tài khoảng My Oauth2 thành công!")
        window.location = 'https://localhost:53003/loginSignup';
    }
})
