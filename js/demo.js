var app = angular.module('angularApp', ['ngSanitize', 'ui.select']);
var BullipediaDemoCtrl = function($scope) {
    this.availableColors = [
	    {id:0,name:'Red'},
	    {id:1,name:'Green'},
	    {id:2,name:'Blue'},
	    {id:3,name:'Yellow'},
	    {id:4,name:'Magenta'},
	    {id:5,name:'Maroon'},
	    {id:6,name:'Umbra'},
	    {id:7,name:'Turquoise'}
    ];

    this.selectedColors = [this.availableColors[0]];
    this.oldSelectedColors = this.selectedColors;
    this.nodes = new vis.DataSet();
	//setTimeout(function(){ this.oldSelectedColors.splice(0,1); this.selectedColors = this.oldSelectedColors.slice()}.bind(this), 3000);
    
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
				this.removeNode(this.oldSelectedColors[i].id)
				break;
			}
			if (this.oldSelectedColors[i].id != this.selectedColors[i].id){
				this.removeNode(this.oldSelectedColors[i].id)
				break;
			}
		}
	}
	else{
		for (var i = 0; i < this.selectedColors.length; i++){
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
}

BullipediaDemoCtrl.prototype.addNode = function (index, x, y){
	var tooltip = document.createElement("div");
	tooltip.className = "toolTip";
	tooltip.innerHTML = this.selectedColors[index].name;
	tooltip.style.backgroundColor = this.selectedColors[index].name;

	var node = {
		id: this.selectedColors[index].id,
		label: this.selectedColors[index].name[0],
		title: tooltip,
		shape: 'circle',
		color: {
			background: this.selectedColors[index].name,
			border: 'black'
		}
		  //mass: this.selectedColors[i].length * 0.2
	}
	if (x != null && y != null){
		node.x = x;
		node.y = y;
	}
	this.nodes.add(node);
}

BullipediaDemoCtrl.prototype.removeNode = function (id){	
	this.nodes.remove(id);
}

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
    },
    onDelete: function(data,callback) {
    	for (var i = 0; i < this.selectedColors.length; i++){
    		if (this.selectedColors[i].id == data.nodes[0]){
				this.oldSelectedColors = this.selectedColors;
				this.oldSelectedColors.splice(i, 1);//Weird trick to make it update the tags, using only splice makes it to not refresh them properly
				this.selectedColors = this.oldSelectedColors.slice();
				var div = document.getElementById('selector').focus()
				break;
			}
		}
		callback(data);  // call the callback to delete the objects.
    }.bind(this)
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

    clearPopUp();
    this.oldSelectedColors.push(this.availableColors[data.id]);
    this.selectedColors = this.oldSelectedColors.slice();
    var div = document.getElementById('selector').focus();
    //this.scope.$select.activate();
    this.addNode(data.id, data.x, data.y);
  }

}

app.controller('BullipediaDemoCtrl', ['$scope', BullipediaDemoCtrl]); 