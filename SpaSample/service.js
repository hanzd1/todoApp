/// <reference path="scripts/angular.js" />

var TodoService = angular.module('TodoService', []);

TodoService.factory('TodoApi', function ($http) {

    var urlBase = "http://localhost:53482/api";

    //let authorizationData = 'Basic ' + btoa('hanzd1:1234');

    //const headerOptions = {
    //    headers: new HttpHeaders({
    //        'Content-Type': 'application/json',
    //        'Authorization': authorizationData
    //    })
    //};

    var TodoApi = {};
    TodoApi.getTodosService = function (user) {
        return $http.get('http://distsys.ch:1450/todos', { headers: { 'Authorization': 'Basic ' + btoa(user.username + ':' + user.password) }, 'accept': 'application/json' });
    }

    TodoApi.getTodoService = function (user, id) {
        return $http.get('http://distsys.ch:1450/todos/' + id, { headers: { 'Authorization': 'Basic ' + btoa(user.username + ':' + user.password) }, 'accept': 'application/json' });
    }

    TodoApi.saveTodoService = async function (user, id, todo) {
        var msg = '';
        await $.ajax({
            url: 'http://distsys.ch:1450/todos/' + id,
            type: 'PUT',
            headers: { 'Authorization': 'Basic ' + btoa(user.username + ':' + user.password) },
            data: JSON.stringify(todo),
            contentType: "application/json"
        })
        //    .then((data) => {
        //    msg = 'Todo saved successfully.';
        //}).fail(() => {
        //    msg = 'Ups, something went wrong!';
        //});

        return msg;
        //return $http.put('http://distsys.ch:1450/todos/' + id, { headers: { 'Authorization': 'Basic ' + btoa('hanzd1:1234') }, 'contentType': 'application/json', 'data': JSON.stringify(todo) });
    }

    TodoApi.saveNewTodoService = async function (user, todo) {
        var msg = '';
        await $.ajax({
            url: 'http://distsys.ch:1450/todos/',
            type: 'POST',
            headers: { 'Authorization': 'Basic ' + btoa(user.username + ':' + user.password) },
            data: JSON.stringify(todo),
            contentType: "application/json"
        })
        //}).then((data) => {
        //    msg = 'Todo added successfully.';
        //}).fail((error) => {
        //    msg = 'Ups, something went wrong!';
        //});

        return msg;
        //return $http.put('http://distsys.ch:1450/todos/' + id, { headers: { 'Authorization': 'Basic ' + btoa('hanzd1:1234') }, 'contentType': 'application/json', 'data': JSON.stringify(todo) });
    }

    TodoApi.deleteTodoService = async function (user, id) {
        var msg = '';
        await $.ajax({
            url: 'http://distsys.ch:1450/todos/' + id,
            type: 'DELETE',
            headers: { 'Authorization': 'Basic ' + btoa(user.username + ':' + user.password) },
            contentType: "application/json"
        })
        //    .then((data) => {
        //    msg = 'Todo deleted successfully.';
        //}).fail(() => {
        //    msg = 'Ups, something went wrong!';
        //});

        return msg;
        //return $http.put('http://distsys.ch:1450/todos/' + id, { headers: { 'Authorization': 'Basic ' + btoa('hanzd1:1234') }, 'contentType': 'application/json', 'data': JSON.stringify(todo) });
    }

    return TodoApi;
});
