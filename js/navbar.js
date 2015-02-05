function show_login() {
  if($('#login-form').hasClass('active'))
    hl();
  else sl();
}

function show_dropdown_mini() {
  if($('#bullipedia-navbar-mini ul').hasClass('active'))
    hd();
  else sd();
}

var hd = function(){
  $('#bullipedia-navbar-mini ul').removeClass('active');
};

var sd = function(){
  $('#bullipedia-navbar-mini ul').addClass('active');
};

var sl = function(){
  $('#login-form').addClass('active').fadeIn();
  $('#login-dropdown').addClass("active");
  $('#page-shadow-login').addClass('active').fadeIn();
};

var hl = function(){
  $('#login-form').removeClass('active').fadeOut();
  $('#login-dropdown').removeClass("active");
  $('#page-shadow-login').removeClass('active').fadeOut();
};

$(document).click(function(e){
  if($(e.target).find('#login-form').length != 0) hl(); //$('#login-form').hide();
  if ($(e.target).closest('#bullipedia-navbar-mini').length === 0  &&
      ! $('#bullipedia-navbar-mini ul').hasClass('active')) hd();
});
