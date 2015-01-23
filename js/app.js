var app = angular.module('main', ['bulli']);

app.factory('Data', function(){
    var types = {'VEG': ['Tofu comun','Champiñones','Jaca','Berenjena','Lentejas'],
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

    var ind_color = 0;
    var colors = ['#708e14', '#1d1955', '#e62c1f', '#fcbf00', '#d20049', '#6b397d', '#00aeea', '#e9511c'];
    
    return {
        getData: function(){
            return data.types;
        },
        getSelected: function () {
            return data.selected;
        },
        setSelected: function (n) {
            data.selected = n;
        },
        getNextColor: function(){
            var color = colors[ind_color % colors.length];
            ind_color += 1;
            return color;
        }
    };
});

