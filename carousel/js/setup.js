var find_first = function(arr){
    for (i in arr){
        if(arr[i].trim() != "")
            return arr[i].trim();    
    }
};

var find_last = function(arr){
    var last = "";
    arr.forEach(function(n){
        if(n.trim() != "")
            last = n.trim();
    });
    return last;
};

var move_f = function(func) {
    var cent = $('.owl-item.active');
    var l = func(cent.text().split('\n'));
    var f = angular.element(cent).scope().update;
    
    f(l);
};


$(document).ready(function(){    
  var owl = $(".owl-carousel");
  owl.owlCarousel({
    loop:true,
    margin:10,
    center:true,
    items:3,
    animateOut: 'fadeOut',
    mouseDrag: false
  });
  
  $(".link").click(function(e){ 
    var cent_ind = $('.owl-item.active.center').index();
      var ind = $(this).parent().index();
      console.log(ind);
    if (cent_ind < ind) {
      owl.trigger('next.owl.carousel');
      move_f(find_last);
    } else if (cent_ind > ind) {
      owl.trigger ('prev.owl.carousel');
      move_f(find_first);
    }
  });

  $(".owl-next").click(function(){
    owl.trigger('next.owl.carousel');
    move_f(find_last);
  });

  $(".owl-prev").click(function(){
    owl.trigger('prev.owl.carousel');
    move_f(find_first);
  });
    
});

