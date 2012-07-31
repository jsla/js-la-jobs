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

  $(document).ready(function() {
    $('body').timeago()

    $('.login').on('click', function() {
      navigator.id.get(auth)
    })
  })

}).call(this)