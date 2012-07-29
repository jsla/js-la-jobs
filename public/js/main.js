(function() {

  var auth = function(token) {
    var opts = {
        url: '/login'
      , success: function() {
          console.log('success!!')
        }
      , data: {token:token}
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