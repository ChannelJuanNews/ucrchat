$('#modal1').openModal({
    dismissible: false
});

function validEmail(email){
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([ucr]+\.)+[edu]{2,}))$/;
    return re.test(email);
}

$('#modal-submit').hide()


$('#email').keyup(function(event){

    if(validEmail($('#email').val())){
        $($('#modal-message')[0]).css('color', 'green')
        $('#modal-message')[0].innerHTML = "Good to go!"
        $('#modal-submit').show()
    }
    else {
        $($('#modal-message')[0]).css('color', 'red')
        $('#modal-message')[0].innerHTML = "Please Enter A Valid UCR Email Address"
    }

})
