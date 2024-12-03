//Logica frontend: controladores angular JS, llamar al API

angular.module('angularToDo', [])
    .controller('mainController',['$scope', '$http', function($scope, $http) {
    
        $scope.formData = {};//almacenar variables dentro del controlador

        //carga la página y pide todos los ToDos del API
        $http.get('/api/todos')
            .then(function(response){
            $scope.todos = response.data;
            console.log(response.data)
        })
        .catch(function(error){
            console.log('Error: '+ error.data);
        });
        
        //añadir un nuevo ToDo, envía el texto a la API
        $scope.createToDo = function(){
            if($scope.formData.text){ //validar que el campo no esté vacío
                $http.post('/api/todos', $scope.formrData)
                .then(function(response){
                    $scope.formrData = {};
                    $scope.todos = response.data;
                    console.log(response.data);
                })
                .catch(function(error){
                    console.log('Error: '+ error,data)
                });
            } else {
                alert('Error: El campo de texto está vacío');
            }
        };

        //borra ToDo luego de marcarlo como terminado
        $scope.deleteToDo = function(id){
            $http.delete('/api/todos/'+ id)
            .then(function(response){
                $scope.todos = response.data;
                console.log(response.data);
            })
            .catch(function(error){
                console.log('Error: '+ error.data);
            });
        };
    }]);