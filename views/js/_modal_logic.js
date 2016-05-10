
window.onload = function() {


    $('#modal-submit').hide() // submit button


    if (window.localStorage.getItem('emailEntered')){
        // do nothing
    }
    else {
        $('#modal1').openModal({
            dismissible: false
        });
    }


    function validEmail(email){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([ucr]+\.)+[edu]{2,}))$/;
        return re.test(email);
    }


    $('#email').keyup(function(event){

        if (validEmail($('#email').val())){
            $($('#modal-message')[0]).css('color', 'green')
            $('#modal-message')[0].innerHTML = "Good to go!"
            $('#modal-submit').show()
        }
        else {
            $($('#modal-message')[0]).css('color', 'red')
            $('#modal-message')[0].innerHTML = "Please Enter A Valid UCR Email Address"
        }

        if ($('#email').val() == ""){
            $('#modal-message')[0].innerHTML = ""
        }

    });

    $('#modal-submit')[0].click(function(event){
        //window.localStorage.setItem('emailEntered', 'true')
        $('#modal-form')[0].submit();
    })


}
