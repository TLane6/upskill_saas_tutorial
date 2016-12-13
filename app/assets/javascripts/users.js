/* global $, Stripe */
//Document ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-submit-btn');
    
    //Set Stripe public key
    Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
    
    //When user clicks form submit button
    submitBtn.click(function(event){
        //Prevent default submission behaviour
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        //Collect credit card fields
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
            
        //Use stripe js library to check for card errors
        var error = false;
        
        //Validate card number
        if(!Stripe.card.validateCardNumber(ccNum)) {
            error = true;
            alert('The credit card number appears to be invalid');
        }
        
        //Validate cvc number
        if(!Stripe.card.validateCVC(cvcNum)) {
            error = true;
            alert('The CVC number appears to be invalid');
        }
        
        //Validate expiration daate
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            alert('The credit card expiry dates appear to be invalid');
        }
        
        if (error) {
           //If there are card errors, don't send to stripe
           submitBtn.prop('disabled', false).val("Sign Up");
        } else {
            //Send card information to Stripe
            Stripe.createToken({
                number: ccNum,
                cvc: cvcNum,
                exp_month: expMonth,
                exp_year: expYear
            }, stripeResponseHandler);
        }
            
        //Send card information to Stripe
        Stripe.createToken({
            number: ccNum,
            cvc: cvcNum,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeResponseHandler);
        
        return false;
    });
    
    //Stripe will return a card token
    function stripeResponseHandler(status, response) {
        //Get the token from the response
        var token = response.id;
        
        //Inject card token as hidden field into form
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        
        //Submit form to our rails app
        theForm.get(0).submit();
    }
});
