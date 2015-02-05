var app = angular.module("bulli", ['ngSanitize', 'ui.select', 'ui.checkbox', 'ui.bootstrap']);

var LoginCtrl = function($rootScope, $scope) {
  this.keep = false;
  this.email = "";
  this.pass = "";
};

LoginCtrl.prototype.sendForm = function() {
  alert("User: " + this.email
        + "\nPass: " + this.pass
        + "\nKeep: " + this.keep
       );
  //send stuff here!
};

var DropdownCtrl = function($scope, Data) {
    this.selected = Data.getMessage();
    
  this.select = function(option){
    Data.setFusion(option);
    //this.selected = option;
  };
    var mythis = this;
    $scope.$watch(function() {return Data.getMessage();},function(v){
        if(v) mythis.selected = v;
    });

};

var CarouselCtrl = function($scope, Data) {
    this.images = [];
    this.types = Data.getData();

    
    var urls = ["img/veg.svg", "img/fruit.svg","img/meat.svg", "img/cereals.svg", "img/dairys.svg","img/fish.svg", "img/milk.svg", "img/spices.svg"];

  var mythis = this;
  angular.forEach(urls, function(url){
    mythis.images.push({
      image: url,
      name: url.split("/")[url.split("/").length-1].split(".")[0].toUpperCase(),
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


var BullipediaDemoCtrl = function($scope, Data) {
    this.Data = Data;
    
    this.availableIngredients = [];
    var mythis = this;
    $scope.$watch(function () { return Data.getSelected(); }, function (newValue) {
        if (newValue) mythis.availableIngredients = newValue;
    });
    
    this.mode = "";
    this.selectedIngredients = []; 
    this.oldSelectedIngredients = this.selectedIngredients;
    this.nodes = new vis.DataSet();
    this.edges = new vis.DataSet();

    this.hasResized = false;

  this.draw();

  this.fusion_array = [];

    $scope.$watch(function() {return mythis.selectedIngredients;},function(v){
        if(mythis.selectedIngredients.length >= 2){
            mythis.fusion_array = [];
            for(var i=2; i <= mythis.selectedIngredients.length;i++){
                mythis.fusion_array.push(i);
            }
            mythis.Data.setMessage("You can select now.");
        }
        else {
            mythis.fusion_array = [];
            mythis.Data.setMessage("You need two nodes");
        }
  });
  
    this.is_small = $(window).width() < 1080;

    var first = true;
    
    var calculate_size = function() {
        var width =  $(window).width();
        var height = $(window).height();
        
        if (width < 1080){
            //If we have no nodes we need to redraw after we add one node
            if (!this.hasResized && !this.selectedIngredients.length){
                this.hasResized  = true;
            }else{//If we have already nodes, we redraw the network
                setTimeout(function(){this.network.redraw()}.bind(this), 10);
            }
            
            if (!this.is_small || first){
                $('#leftPanel').hide();
                $('#rightPanel').addClass('centered');
                $("#carousel").hide();
                $("#carousel").detach().prependTo("#networkContainer");
                $("#carousel").addClass("floating");
                $("#my_selector").hide();
                $("#my_selector").detach().prependTo("#networkContainer");
                $("#my_selector").addClass("floating");                

              $('#login-form').detach().appendTo($('#login-container'));
              $('#page-shadow-login').toggleClass('small');
                first = false;
            }
            this.is_small = true;
        }
        else {
            if(this.is_small){
                $("#my_selector").detach().appendTo("#selectContainer");
                $("#my_selector").removeClass("floating");
                $("#carousel").detach().appendTo("#carouselContainer");
                $("#carousel").removeClass("floating");
                if (this.mode === "family" || this.mode === "addingNodes")
                    this.do_clean_menu();
                setTimeout(function(){this.network.redraw()}.bind(this), 10);
            }
            this.is_small = false;
            
            $('#rightPanel').removeClass('centered');
            $("#carousel").show();
            $("#my_selector").show();
            $("#leftPanel").show();
            $("#shadow").hide(); 
          //$('#login-form').detach().appendTo($('#login-dropdown'));
          $('#login-form').detach().appendTo($('#test5'));
          
          $('#page-shadow-login').toggleClass('small');
        }
    }.bind(this);
    
    var resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calculate_size, 100);
    });

    setTimeout(calculate_size, 100);
};

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});


BullipediaDemoCtrl.prototype.updateNodes = function (){
    
    if (this.oldSelectedIngredients.length > this.selectedIngredients.length){
        for (var i = 0; i < this.oldSelectedIngredients.length; i++){
            if (this.selectedIngredients[i] == null){
                this.removeNode(this.oldSelectedIngredients[i].id);
                break;
            }
            if (this.oldSelectedIngredients[i].id != this.selectedIngredients[i].id){
                this.removeNode(this.oldSelectedIngredients[i].id);
                break;
            }
        }
    }
    else{
        for (i = 0; i < this.selectedIngredients.length; i++){
            if (this.oldSelectedIngredients[i] == null){
                this.addNode(i);
                break;
            }
            if (this.selectedIngredients[i].id != this.oldSelectedIngredients[i].id){
                this.addNode(i);
                break;
            }
        }
    }
    
    this.oldSelectedIngredients = this.selectedIngredients;
    if (this.hasResized){//This means this is the first node and we need to redraw the network
        this.network.redraw();
        this.hasResized = false;
    }
};

BullipediaDemoCtrl.prototype.addNode = function (index, x, y){
    var tooltip = document.createElement("div");
    var color = this.Data.getNextColor();
    tooltip.className = "toolTip";
    tooltip.innerHTML = this.selectedIngredients[index].name;
    tooltip.style.backgroundColor = color; //this.selectedIngredients[index].name;

    var node = {
        id: this.selectedIngredients[index].id,
        label: this.selectedIngredients[index].name.split(' ').map(function(x){return x[0];}).join('') ,
        title: tooltip,
        shape: 'circle',        
        fontSize: 16,
        fontColor: 'white',
        color: {
            background: color, //this.selectedIngredients[index].name,
            border: color
        }
        //mass: (index+1) * 0.2
    };
    if (x != null && y != null){
        node.x = x;
        node.y = y;
    }
    this.nodes.add(node);
};

BullipediaDemoCtrl.prototype.removeNode = function (id){  
    this.nodes.remove(id);
};

BullipediaDemoCtrl.prototype.draw = function (){
    
    for (i=0; i< this.selectedIngredients.length; i++){
        this.addNode(i);
    }
    
    var connectionCount = [];

    // randomly create some nodes and edges
    
    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: this.nodes,
        edges: this.edges
    };
    var options = {
        stabilize: false,
        dataManipulation: true,    
        tooltip:{
            color: {
                border: "transparent",
                background: "transparent"
            }
        },

        onConnect: function(data,callback) {
            callback(data);
            setTimeout(function(){
                this.mode = "";
                this.network._toggleEditMode();
                this.activateAddEdge();            
            }.bind(this), 10);
        }.bind(this),
        
        onDelete: function(data,callback) {
            console.log(data);
            this.refreshSelector();
            callback(data);  // call the callback to delete the objects.
        }.bind(this)
    };
    this.network = new vis.Network(container, data, options);

    // add event listeners
    this.network.on('select', function(data) {
        if (this.mode == "removing") {
            this.nodes.remove(data.nodes);
            this.edges.remove(data.edges);
            this.refreshSelector(data);
        }
    }.bind(this));

    //this.network.on("resize", function(params) {console.log(params.width,params.height);});

};

BullipediaDemoCtrl.prototype.activateFamily = function(){
    if(this.is_small){
        if(this.mode != "family"){
            this.do_clean_menu();
            this.mode = "family";
            $("#familyButton").addClass("selected");

            $("#carousel").show();
            $("#shadow").show();
            //$('#popUp').show();
        } else {
            this.mode = "";
            $("#familyButton").removeClass("selected");

            $("#carousel").hide();
            $("#shadow").hide();
            //$('#popUp').hide();
        }
    };
};

BullipediaDemoCtrl.prototype.activateAddNode = function(){
    if(this.is_small){
        if (this.mode != "addingNodes"){
            this.do_clean_menu();
            this.mode = "addingNodes";
            $("#ingredientButton").addClass("selected");
            $("#my_selector").show();
            $("#shadow").show();
            //$('#popUp').show();
            setTimeout(function(){
                $(".ui-select-search.input-xs").click();
                $(".ui-select-search.input-xs").focus();
            }, 0);
        }  else{
            this.mode = "";
            $("#ingredientButton").removeClass("selected");
            $("#my_selector").hide();
            $("#shadow").hide();
            //$("#popUp").hide();
            setTimeout(function(){
                $(".ui-select-search.input-xs").val("");
            });
        }
    }
};

BullipediaDemoCtrl.prototype.activateAddEdge = function(){
    if (this.mode != "addingEdges"){
        this.do_clean_menu();
        this.network._toggleEditMode();
        this.network._createAddEdgeToolbar();
        this.mode = "addingEdges";
        $("#fusionButton").addClass("selected");
    }else{  
        this.network._toggleEditMode();
        this.mode = "";
        $("#fusionButton").removeClass("selected");
    }
//createManipulatorBar
};

BullipediaDemoCtrl.prototype.activateRemove = function(){
    if (this.mode != "removing"){
        this.do_clean_menu();
        this.mode = "removing";
        $("#removeButton").addClass("selected");
    }else{
        this.mode = "";
        $("#removeButton").removeClass("selected");
    }
    //createManipulatorBar
};

BullipediaDemoCtrl.prototype.refreshSelector = function(data){
   for (var i = 0; i < this.selectedIngredients.length; i++){
        if (this.selectedIngredients[i].id == data.nodes[0]){
            this.oldSelectedIngredients = this.selectedIngredients;
            this.oldSelectedIngredients.splice(i, 1);  //Weird trick to make it update the tags, using only splice makes it to not refresh them properly
            this.selectedIngredients = this.oldSelectedIngredients.slice();
            $(".ui-select-search.input-xs").click();
            break;
        }
    }
};

BullipediaDemoCtrl.prototype.do_clean_menu = function(){
    if (this.mode === "family")
        this.activateFamily();
    else if (this.mode === "addingNodes")
        this.activateAddNode();
    else if (this.mode === "addingEdges")
        this.activateAddEdge();
    else if (this.mode === "removing")
        this.activateRemove();
};

var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

BullipediaDemoCtrl.prototype.do_random_fusion = function(choice){
    this.edges.clear();
    var nodes = this.nodes.getIds();
    var nl = [];
    for(var i=0;i<choice;i++){
        nl.push(nodes.splice(Math.floor(Math.random()*nodes.length),1));
    }
    for(var j=0;j<nl.length-1;j++){
        f=nl[j];
        t=nl[j+1];
        this.edges.add({id:guid(), from:f, to:t});
    }
};


app.controller('LoginCtrl', ['$rootScope', '$scope', LoginCtrl]);
app.controller('DropdownCtrl', ['$scope', 'Data', DropdownCtrl]);
app.controller('CarouselCtrl', ['$scope', 'Data', CarouselCtrl]);
app.controller('BullipediaDemoCtrl', ['$scope', 'Data', BullipediaDemoCtrl]); 
