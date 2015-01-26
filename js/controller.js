var app = angular.module("bulli", ['ngSanitize', 'ui.select']);

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


var BullipediaDemoCtrl = function($scope, Data) {
    this.Data = Data;
    
    this.availableColors = [];
    mythis = this;
    $scope.$watch(function () { return Data.getSelected(); }, function (newValue) {
        if (newValue) mythis.availableColors = newValue;
    });
    
    this.mode = "";
    this.selectedColors = []; 
    this.oldSelectedColors = this.selectedColors;
    this.nodes = new vis.DataSet();

    this.draw();
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
    
    if (this.oldSelectedColors.length > this.selectedColors.length){
        for (var i = 0; i < this.oldSelectedColors.length; i++){
            if (this.selectedColors[i] == null){
                this.removeNode(this.oldSelectedColors[i].id);
                break;
            }
            if (this.oldSelectedColors[i].id != this.selectedColors[i].id){
                this.removeNode(this.oldSelectedColors[i].id);
                break;
            }
        }
    }
    else{
        for (i = 0; i < this.selectedColors.length; i++){
            if (this.oldSelectedColors[i] == null){
                this.addNode(i);
                break;
            }
            if (this.selectedColors[i].id != this.oldSelectedColors[i].id){
                this.addNode(i);
                break;
            }
        }
    }
    
    this.oldSelectedColors = this.selectedColors;
};

BullipediaDemoCtrl.prototype.addNode = function (index, x, y){
    var tooltip = document.createElement("div");
    var color = this.Data.getNextColor();
    tooltip.className = "toolTip";
    tooltip.innerHTML = this.selectedColors[index].name;
    tooltip.style.backgroundColor = color; //this.selectedColors[index].name;

    var node = {
        id: this.selectedColors[index].id,
        label: this.selectedColors[index].name.split(' ').map(function(x){return x[0];}).join('') ,
        title: tooltip,
        shape: 'circle',        
        fontSize: 16,
        fontColor: 'white',
        color: {
            background: color, //this.selectedColors[index].name,
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
    
    for (i=0; i< this.selectedColors.length; i++){
        this.addNode(i);
    }
    edges = [];

    var connectionCount = [];

    // randomly create some nodes and edges
    
    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: this.nodes,
        edges: edges
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
        onAdd: function(data,callback) {
            var span = document.getElementById('operation');
            var idInput = document.getElementById('node-id');
            var labelInput = document.getElementById('node-label');
            var saveButton = document.getElementById('saveButton');
            var cancelButton = document.getElementById('cancelButton');
            var div = document.getElementById('network-popUp');
            span.innerHTML = "Add Node";
            idInput.value = 0;
            labelInput.value = "Red";
            saveButton.onclick = saveData.bind(this,data,callback);
            cancelButton.onclick = clearPopUp.bind();
            div.style.display = 'block';
        }.bind(this),

        onConnect: function(data,callback) {
            callback(data);
            setTimeout(function(){
                this.mode = "";
                this.network._toggleEditMode();
                this.activateAddEdge();            
            }.bind(this), 10);
        }.bind(this),
        
        onDelete: function(data,callback) {
            for (var i = 0; i < this.selectedColors.length; i++){
                if (this.selectedColors[i].id == data.nodes[0]){
                    this.oldSelectedColors = this.selectedColors;
                    this.oldSelectedColors.splice(i, 1);//Weird trick to make it update the tags, using only splice makes it to not refresh them properly
                    this.selectedColors = this.oldSelectedColors.slice();
                    var div = document.getElementById('selector').focus();
                    break;
                }
            }
            callback(data);  // call the callback to delete the objects.
        }.bind(this)
    };
    this.network = new vis.Network(container, data, options);

    // add event listeners
    this.network.on('select', function(params) {
        document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
    });

    this.network.on("resize", function(params) {console.log(params.width,params.height);});
    function clearPopUp() {
        var saveButton = document.getElementById('saveButton');
        var cancelButton = document.getElementById('cancelButton');
        saveButton.onclick = null;
        cancelButton.onclick = null;
        var div = document.getElementById('network-popUp');
        div.style.display = 'none';
    }

    function saveData(data,callback) {
        var idInput = document.getElementById('node-id');
        var labelInput = document.getElementById('node-label');
        var div = document.getElementById('network-popUp');
        data.id = idInput.value;

        clearPopUp();
        this.oldSelectedColors.push(this.availableColors[data.id]);
        this.selectedColors = this.oldSelectedColors.slice();
        div = document.getElementById('selector').focus();
        //this.scope.$select.activate();
        this.addNode(data.id, data.x, data.y);
    }
};
BullipediaDemoCtrl.prototype.activateAddEdge = function(){
    if (this.mode != "addingEdges"){
        this.network._toggleEditMode();
        this.network._createAddEdgeToolbar();
        this.mode = "addingEdges";    
        addClass(document.getElementById('fusionButton'), 'selected');
    }else{  
        this.network._toggleEditMode();
        removeClass(document.getElementById('fusionButton'), 'selected');
        this.mode = "";
    }
//createManipulatorBar
};

app.controller('BullipediaDemoCtrl', ['$scope', 'Data', BullipediaDemoCtrl]); 


//Functions for adding/removing css classes
function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
 
function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}
 
function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}