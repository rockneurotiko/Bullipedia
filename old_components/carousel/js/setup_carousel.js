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
function selectText(containerid) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
        }
}
function clearSelection() {
    if (window.getSelection) window.getSelection().removeAllRanges();
    else if (document.selection) document.selection.empty();
}

$(document).ready(function(){    
    var owl = $(".owl-carousel");

    owl.on('initialized.owl.carousel', function(event){
        var cent = $('.owl-item.active');
        var f = angular.element(cent).scope().update_n;
        f(0);
    });

  owl.owlCarousel({
    loop:true,
    margin:10,
    center:true,
    items:3,
    animateOut: 'fadeOut'
  });

  owl.on('changed.owl.carousel', function(event) {
      var diff = event.isTrigger;
      var n = event.item.index;
      var elems = event.item.count;
      var n_f = Math.abs(diff-n) % elems;
      var cent = $('.owl-item.active');
      var f = angular.element(cent).scope().update_n;
      f(n_f); // Call the update in scope
      
      selectText('carousel'); // Not so proud.. Damn owl and fixes
      clearSelection();
  });


  $(".link").click(function(e){ 
    var cent_ind = $('.owl-item.active.center').index();
      var ind = $(this).parent().index();
    if (cent_ind < ind) {
      owl.trigger('next.owl.carousel');
    } else if (cent_ind > ind) {
      owl.trigger ('prev.owl.carousel');
    }
  });

  $(".owl-next").click(function(){
    owl.trigger('next.owl.carousel');
  });

  $(".owl-prev").click(function(){
    owl.trigger('prev.owl.carousel');
  });
    
});

