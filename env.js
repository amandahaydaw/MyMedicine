const form = require("./server");
$(document).ready(function() {
    insertMessage();
    $('#submit').click(() => {
        let Name = $('#name').val()
        let Email = $('#email').val()
        let username = $('#username').val()
        let Password = $('#password').val()
        let DOB = $('.birthday').val() + $('.birthyear').val()
        let gender = $('.select-style gender').val()
        let Phone = $('#phone').val()
        let data = {
            Name,
            Email,
            username,
            Password,
            DOB,
            gender,
            Phone
        }

        $.get('/user', data, function() {
            $('#userCreation').append('<div style="background-color: transparent;color: white;">' + "User created" + '</div>');

        })



    })
})