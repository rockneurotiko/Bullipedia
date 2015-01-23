var app = angular.module('angularApp', ['ngSanitize', 'ui.select']);
var BullipediaDemoCtrl = function($scope) {
   this.availableColors = [
      {id:1,name:'Red'},
      {id:2,name:'Green'},
      {id:3,name:'Blue'},
      {id:4,name:'Yellow'},
      {id:5,name:'Magenta'},
      {id:6,name:'Maroon'},
      {id:7,name:'Umbra'},
      {id:8,name:'Turquoise'}
    ];

    this.selectedColors = [ this.availableColors[0]];
    this.oldSelectedColors = this.selectedColors;
    this.nodes = new vis.DataSet();
    
    //this.draw();
};


/*BullipediaDemoCtrl.prototype.method_name = function(argument){
  
};*/
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
  for (i=0; i< this.selectedColors.length; i++){
    if (this.selectedColors[i] != this.oldSelectedColors[i]){
      this.nodes.add({
      id: i,
        label: this.selectedColors[i],
        shape: 'circle',
        color: {
          background: this.selectedColors[i],
          border: 'black'
        }
        //mass: this.selectedColors[i].length * 0.2
      });
      break;
    }

  }
  this.oldSelectedColors = this.selectedColors;
}

BullipediaDemoCtrl.prototype.draw = function (){
   
  this.nodes.clear();
  for (i=0; i< this.selectedColors.length; i++){
    this.nodes.add({
      id: this.selectedColors[i].id,
      label: this.selectedColors[i].name,
      shape: 'circle',
      color: {
        background: this.selectedColors[i].name,
        border: 'black'
      },
      //mass: this.selectedColors[i].length * 0.2
    });
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
    onAdd: function(data,callback) {
      var span = document.getElementById('operation');
      var idInput = document.getElementById('node-id');
      var labelInput = document.getElementById('node-label');
      var saveButton = document.getElementById('saveButton');
      var cancelButton = document.getElementById('cancelButton');
      var div = document.getElementById('network-popUp');
      span.innerHTML = "Add Node";
      idInput.value = data.id;
      labelInput.value = data.label;
      saveButton.onclick = saveData.bind(this,data,callback);
      cancelButton.onclick = clearPopUp.bind();
      div.style.display = 'block';
    }.bind(this),
    onEdit: function(data,callback) {
      var span = document.getElementById('operation');
      var idInput = document.getElementById('node-id');
      var labelInput = document.getElementById('node-label');
      var saveButton = document.getElementById('saveButton');
      var cancelButton = document.getElementById('cancelButton');
      var div = document.getElementById('network-popUp');
      span.innerHTML = "Edit Node";
      idInput.value = data.id;
      labelInput.value = data.label;
      saveButton.onclick = saveData.bind(this,data,callback);
      cancelButton.onclick = clearPopUp.bind();
      div.style.display = 'block';
    }.bind(this),
    onConnect: function(data,callback) {
      if (data.from == data.to) {
        var r=confirm("Do you want to connect the node to itself?");
        if (r==true) {
          callback(data);
        }
      }
      else {
        callback(data);
      }
    }
  };
  network = new vis.Network(container, data, options);

  // add event listeners
  network.on('select', function(params) {
    document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
  });

  network.on("resize", function(params) {console.log(params.width,params.height)});
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
    data.label = labelInput.value;
    clearPopUp();
    this.selectedColors.push(data.label);
    //this.scope.$select.activate();

    callback(data);

  }
}


app.controller('BullipediaDemoCtrl', ['$scope', BullipediaDemoCtrl]); 