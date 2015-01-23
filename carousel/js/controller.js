var app = angular.module("MyApp", []);

app.factory('Data', function(){
    var types = {'VEG': ['Tofu','Champiñones','Jaca','Berenjena','Lentejas'],
                 'FRUIT': ['Naranja','Mandarina','Manzana','Pera','Platano'],
                 'MEAT': ['Vaca', 'Ternera', 'Pollo', 'Buey', 'Jabali'],
                 'CEREALS': ['Cereals0','Cereals1','Cereals2','Cereals3','Cereals4'],
                 'DAIRYS': ['Dairy0','Dairy1','Dairy2','Dairy3','Dairy4'],
                 'FISH': ['Fish0','Fish1','Fish2','Fish3','Fish4'],
                 'MILK': ['Milk0','Milk1','Milk2','Milk3','Milk4'],
                 'SPICES': ['Spices0','Spices1','Spices2','Spices3','Spices4']};
    var ind = 0;
    for (i in types){
        for (j in types[i]){
            types[i][j] = {'id':ind, 'name':types[i][j]};
            ind += 1;
        }
    };

    var data = {types:types,
                selected:[]};
    
    return {
        getData: function(){
            return data.types;
        },
        getSelected: function () {
            return data.selected;
        },
        setSelected: function (n) {
            data.selected = n;
        }
    };
});



var DemoCtrl = function($scope, Data) {
  this.images = [];
    this.types = Data.getData();

    
    var urls = ["img/veg.svg", "img/fruit.svg","img/meat.svg", "img/cereals.svg", "img/dairys.svg","img/fish.svg", "img/milk.svg", "img/spices.svg"];

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

    $scope.selected = Data.getSelected(); 
    $scope.name_selected = ""; 
    
    $scope.$watch('selected', function(nv){
        Data.setSelected(nv);
    });
    
  $scope.update = function(name){
    $scope.$apply(function(){  
        $scope.selected = mythis.types[name];
        $scope.name_selected = name;
    });
  };

  $scope.update_n = function(n){
      $scope.$apply(function(){
          var name = urls[n].split("/")[1].split(".")[0].toUpperCase();
          $scope.selected = mythis.types[name];
          $scope.name_selected = name;
    });
  };

  $scope.select = function(image){
      if(image.name === $scope.name_selected){
      return image.image.split(".")[0] + "_color.svg";
    }
    return image.image;
  };
};


var DemoCtrl2 = function($scope, Data){
    $scope.selected = [];
    $scope.$watch(function () { return Data.getSelected(); }, function (newValue) {
        if (newValue) $scope.selected = newValue;
    });
};

app.controller('DemoCtrl', DemoCtrl);
app.controller("Demo", DemoCtrl2);


