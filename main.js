//Logica frontend: controladores angular JS, llamar al API

angular.module('angularToDo', []);

function mainController($scope, $http){
    
    $scope.formData = {};//almacenar variables dentro del controlador

    //carga la pag y pide todos los ToDos del API
    $http.get('/api/todos') //llamadas AJAX a la API con poco codigo
        .success(function(data){
        $scope.todos = data;
        console.log(data)
    })
    .error(function(data){
        console.log('Error: '+ data);
        
        
    });
    
    //al añadir nuevo, envia el texto a la API
    $scope.createToDo = function(){
        $http.post('/api/todos', $scope.formData)
        .success(function(data){
            $scope.formData ={};
            $scope.todos = data;
            console.log('Error: '+ data);
        });
    };

    //borra ToDo luego de marcarlo como terminado
    $scope.deleteToDo = function(id){
        $http.delete('/api/todos/'+ id)
        .success(function(data){
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data){
            console.log('Error: '+ data);
        });
    };
}