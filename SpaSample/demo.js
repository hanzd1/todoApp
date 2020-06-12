/// <reference path="scripts/angular.js" />

var MyApp = angular.module("MyApp", ['ngRoute', 'TodoService']);
//var user = {
//    username,
//    password
//};


angular.module('MyApp')
    .run(['$rootScope', '$location', 'authProvider', function ($rootScope, $location, authProvider) {
        $rootScope.$on('$routeChangeStart', function (event) {
            //if (true) {
            //    alert($location.path);
            //}
            //else
            if (!authProvider.isLoggedIn()) {
                console.log('DENY : Redirecting to Login');
                //event.preventDefault();
                $location.path('/Login');
            }
            else {
                console.log('ALLOW');
                //$location.path('/Home');
            }
        });
    }]);

angular.module('MyApp')
    .factory('authProvider', function ($window) {
        //var user;
        return {
            setUser: function (aUser) {
                $window.localStorage['un'] = aUser.username;
                $window.localStorage['pw'] = aUser.password;
                $window.localStorage['isUserSet'] = true;
                //var usr = $window.localStorage['user'] = aUser;
                //alert(usr);
            },
            getUser: function () {
                var usr = {
                    username: $window.localStorage['un'],
                    password: $window.localStorage['pw']
                }
                return usr;
            },
            isLoggedIn: function () {
                if ($window.localStorage['isUserSet'] === undefined) {
                    return false;
                }
                return $window.localStorage['isUserSet'];
            },
            deleteUser: function () {
                delete $window.localStorage['un'];
                delete $window.localStorage['pw'];
                delete $window.localStorage['isUserSet'];
            }
        };
    });

MyApp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/Add', { templateUrl: 'Views/add.html', controller: 'AddController' })
        .when('/Edit', { templateUrl: 'Views/edit.html', controller: 'EditController' })
        .when('/Home', { templateUrl: 'Views/home.html', controller: 'HomeController' })
        .when('/Login', { templateUrl: 'Views/login.html', controller: 'LoginController' })
        .when('/Logout', { templateUrl: 'Views/login.html', controller: 'LogoutController' })
        .otherwise({ redirectTo: '/Home' });
});

MyApp.controller("AddController", function ($window, $scope, $filter, TodoApi, authProvider) {

    $scope.message = "in Add View";

    $scope.saveNewTodo = async function () {
        if ($scope.txtTitle === undefined) {

            $scope.message = "at least give it a title";
            return;
        }

        var dt = $filter('date')($scope.dtpDueDate, 'yyyy-MM-dd');

        var todo = {
            title: $scope.txtTitle,
            category: $scope.txtCategory,
            dueDate: $filter('date')($scope.dtpDueDate, 'yyyy-MM-dd'),
            important: false,
            completed: false
        };

        await TodoApi.saveNewTodoService(authProvider.getUser(), todo).then(function (data) {
            $scope.message = 'Todo added successfully';
            $window.location.href = '#Home';
        })
        .catch(function (error) {
            $scope.message = 'probably wrong date: ' + error.status;
            $scope.$apply();
        })
    }
});
MyApp.controller("EditController", function ($window, $scope, $filter, TodoApi, $routeParams, authProvider) {

    $scope.txtNo = true;
    $scope.txtRest = false;

    getTodo();
    function getTodo() {
        TodoApi.getTodoService(authProvider.getUser(), $routeParams.id).then(function (todo) {
            $scope.txtId = todo.data.id;
            $scope.txtTitle = todo.data.title;
            $scope.txtCategory = todo.data.category;
            $scope.dtpDueDate = todo.data.dueDate;
            $scope.txtCompleted = todo.data.completed;
        })
        .catch(function (error) {
            $scope.message = 'Unable to load todo: ' + error.staus;
            $scope.$apply();
        })
    }

    $scope.saveTodo = async function () {
        var todo = {
            title: $scope.txtTitle,
            category: $scope.txtCategory,
            dueDate: $filter('date')($scope.dtpDueDate, 'yyyy-MM-dd'),
            important: false,
            completed: $scope.txtCompleted
        };

        if (todo.dueDate !== undefined && !todo.dueDate.includes('-')) {
            $scope.message = 'probably wrong dateformat. has to be yyyy-MM-dd ';
            $scope.$apply();
            return;
        }

        $scope.message = await TodoApi.saveTodoService(authProvider.getUser(), $scope.txtId, todo).then(function (data) {
            $scope.message = 'Todo saved successfully';
            $window.location.href = '#Home';
        })
            .catch(function (error) {
                $scope.message = 'probably wrong date: ' + error.status;
                $scope.$apply();
            })
        $window.location.href = '#Home';
    }

    $scope.deleteTodo = async function () {

        $scope.message = await TodoApi.deleteTodoService(authProvider.getUser(), $scope.txtId).then(function (data) {
            $window.location.href = '#Home';
        })
        .catch(function (error) {
            $scope.message = 'probably wrong date: ' + error.status;
            $scope.$apply();
        })
    }
});
MyApp.controller("HomeController", function ($scope, TodoApi, authProvider) {

    getTodos();
    function getTodos() {
        var usr = authProvider.getUser();
        TodoApi.getTodosService(usr).then(function (todos) {
            $scope.todos = todos.data;
        })
        .catch(function (error) {
            $scope.message = 'Unable to load todos: ' + error.status;
        })
    }
});
MyApp.controller("LoginController", function ($window, $scope, TodoApi, authProvider) {

    $scope.login = async function () {
        var usr = {
            username: $scope.txtUser,
            password: $scope.txtPassword
        };
        await TodoApi.getTodosService(usr).then(async function (todos) {
            await authProvider.setUser(usr);
            $window.location.href = '#Home';
        })
        .catch(function (error) {
            if (error.status === 401) {
                $scope.message = 'wrong password or username';
            } else {
                $scope.message = 'Ups, something failed!';
            }
        })
    }
});
MyApp.controller("LogoutController", function ($scope, authProvider) {
    logout();
    function logout() {
        authProvider.deleteUser();
        //$scope.message = 'bye bye';
        //$scope.$apply();
    }
});
