// var find_first = function(arr){
//   console.log(arr);
//     for (i in arr){
//       if(arr[i].trim() != ""){
//         console.log(arr[i]);
//             return arr[i].trim();
//       }
//     }
// };

// var find_last = function(arr){
//   console.log(arr);
//     var last = "";
//     arr.forEach(function(n){
//         if(n.trim() != "")
//             last = n.trim();
//     });
//     return last;
// };

// var move_f = function(func) {
//     var cent = $('.owl-item.active');
//     var l = func(cent.text().split('\n'));
//     var f = angular.element(cent).scope().update;
    
//   //f(l);
// };


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

  owl.on('changed.owl.carousel', function(event) {
    var diff = event.isTrigger;
    var n = event.item.index;
    var n_f = Math.abs(diff-n);
    var cent = $('.owl-item.active');
    var f = angular.element(cent).scope().update_n;
    f(n_f);
  });
  
  $(".link").click(function(e){ 
    var cent_ind = $('.owl-item.active.center').index();
      var ind = $(this).parent().index();
    if (cent_ind < ind) {
      owl.trigger('next.owl.carousel',[200]);
    } else if (cent_ind > ind) {
      owl.trigger ('prev.owl.carousel',[200]);
    }
  });

  $(".owl-next").click(function(){
    owl.trigger('next.owl.carousel',[200]);
  });

  $(".owl-prev").click(function(){
    owl.trigger('prev.owl.carousel',[200]);
  });
    
});

