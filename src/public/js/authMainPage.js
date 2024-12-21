
let callbackTable = $('.callbackTable');
let fullname = $('#fullname');
let nickname = $('#nickname');
let errMss = $('.errMss');
let profileForm = $('.profileForm');
let credentialForm = $('.credentialForm');

const deleteThis = (id) => {
    $(`#${id}`).remove();
}

const addUrl = () => {
    const id = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    callbackTable.append(`
    <div class="w-100 d-flex mb-1" id="${id}">
                                        <input type="text" class="form-control w-75 callBackUrlInput" val=""
                                             placeholder="Enter your url">
                                        <a onclick="deleteThis(${id})" class="btn btn-danger">X</a>
                                    </div>
    `)
    $('.callBackUrlInput').on('input', function (e) {
        $(this).removeClass('errMss border-danger');
        $(this).attr('placeholder', 'Enter your url')
    })
}


let clientID = $('#clientID');
let clientSecret = $('#clientSecret');

$('.callBackUrlInput').on('input', function (e) {
    $(this).removeClass('errMss border-danger');
    $(this).attr('placeholder', 'Enter your url')
})

const RequireErrorConfig = () => {
    let callBackUrlInput = $('.callBackUrlInput');
    let check = true;
    if (clientID.val() == null || clientID.val() == '') {
        clientID.attr('placeholder', 'Please fill in your fullname')
        clientID.addClass(' errMss border-danger')
        check = false;
    }
    if (clientSecret.val() == null || clientSecret.val() == '') {
        clientSecret.attr('placeholder', 'Please fill in your nickname')
        clientSecret.addClass(' errMss border-danger')
        check = false;
    }
    callBackUrlInput.each((index, element) => {
        const jqElement = $(element);
        if (jqElement.val() == null || jqElement.val() == '') {
            jqElement.attr('placeholder', 'Please fill in your url')
            jqElement.addClass(' errMss border-danger')
            check = false;
        }
    })
    return check;
}

credentialForm.on('submit', async (e) => {

    e.preventDefault()
    let callBackUrlInput = $('.callBackUrlInput');
    let config = {
        clientID: null,
        clientSecret: null,
        callbackURL: []
    };
    if (!RequireErrorConfig()) return;
    config.clientID = clientID.val();
    config.clientSecret = clientSecret.val();
    callBackUrlInput.each((index, element) => {
        config.callbackURL.push($(element).val());
    })

    const serverResponse = await fetch('api/oauthconfig/update', {
        method: 'post',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(config)
    })
    const response = await serverResponse.json();
    if (response) {
        alert("Cập nhật thành công");
    } else {
        alert("Cập nhật thất bại");
    }

})



/*  ==========================================
SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(function () {
    $('#upload').on('change', function () {
        readURL(input);
    });
});

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');