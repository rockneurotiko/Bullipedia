var app = angular.module("MyApp", []);

var DemoCtrl = function($scope) {
  this.images = [];
  this.types = {'VEG': ['Tofu','Champiñones','Jaca','Berenjena','Lentejas'],
                'FRUIT': ['Naranja','Mandarina','Manzana','Pera','Platano'],
                'MEAT': ['Vaca', 'Ternera', 'Pollo', 'Buey', 'Jabali'],
                'CEREALS': ['Cereals0','Cereals1','Cereals2','Cereals3','Cereals4','Cereals5'],
                'DAIRYS': ['Dairy0','Dairy1','Dairy2','Dairy3','Dairy4','Dairy5'],
                'FISH': ['Fish0','Fish1','Fish2','Fish3','Fish4','Fish5'],
                'MILK': ['Milk0','Milk1','Milk2','Milk3','Milk4','Milk5']};

    var urls = ["img/veg.svg", "img/fruit.svg","img/meat.svg", "img/cereals.svg", "img/dairys.svg","img/fish.svg", "img/milk.svg"];

  var mythis = this;
  angular.forEach(urls, function(url){
    mythis.images.push({
      image: url,
      name: url.split("/")[1].split(".")[0].toUpperCase(),
      title: "image-" + mythis.images.length,
      id: mythis.images.length,
      cls: ''
    });
  });

    this.selected = this.types[this.images[0].name];
  this.name_selected = this.images[0].name;
    
  $scope.update = function(name){
    $scope.$apply(function(){  
      mythis.selected = mythis.types[name];
      mythis.name_selected = name;
    });
  };

  $scope.update_n = function(n){
    $scope.$apply(function(){
      var selected = urls[n].split("/")[1].split(".")[0].toUpperCase();
      mythis.select = mythis.types[selected];
      mythis.name_selected = selected;
    });
  };

  $scope.select = function(image,u){
    if(image.name === mythis.name_selected){
      return image.image.split(".")[0] + "_color.svg";
    }
    return image.image;
  };
  
  $scope.selected = function(image){
    //console.log(mythis.name_selected);
    return image.name === mythis.name_selected;
  };
};

app.controller("DemoCtrl", ['$scope', DemoCtrl]);
