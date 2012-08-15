(function() {

  var auth = function(token) {
    var onSuccess = function(data) {
      console.log('Login Successful', data)
      window.location = data
    }

    var opts = {
        url: '/login'
      , success: onSuccess
      , data: {token:token}
      , type: 'POST'
    }
    $.ajax(opts)
  }

  var stripeResponseHandler = function(status, response) {

    if (response.error) {
        // show the errors on the form
        $(".payment-errors").text(response.error.message);
        $(".submit-button").removeAttr("disabled");
    } else {
        var form$ = $(".payment-form")
        // token contains id, last4, and card type
        var token = response.id
        // insert the token into the form so it gets submitted to the server
        form$.append("<input type='hidden' name='stripeToken' value='" + token + "'/>")
        // and submit
        form$.get(0).submit();
    }

  }

  var paymentSubmit = function(event) {
    console.log('payment submit!!')
    $('.submit-button').attr("disabled", "disabled");

    Stripe.createToken({
        number: $('.card-number').val(),
        cvc: $('.card-cvc').val(),
        exp_month: $('.card-expiry-month').val(),
        exp_year: $('.card-expiry-year').val()
    }, stripeResponseHandler);

    return false;
  }
  
  $(document).ready(function() {
    $('body').timeago()

    $('.login').on('click', function() {
      navigator.id.get(auth)
    })

    $('.payment-form').submit(paymentSubmit)

    $('.control-group').keydown(function() {
      $(this).removeClass('error')
    })
  })

}).call(this)