angular.module('csGeneration',[
    "ui.router",
    "ui.bootstrap",
    "toastr",
    "loginModule",
    'registerModule',
    'dashboardModule',
    'datatableModule',
    'addModule'
])
.config(function ($stateProvider, $urlRouterProvider, toastrConfig) {
    angular.extend(toastrConfig, {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
    });
    $urlRouterProvider.otherwise('/');
    $stateProvider.
        state('login', {
            url: '/login',
            templateUrl: './resources/views/login.html',
            controller: 'LoginCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: './resources/views/register.html',
            controller: 'RegisterCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: './resources/views/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .state('dashboard.datatable', {
            url: '/datatable',
            templateUrl: './resources/views/datatable.html',
            controller: 'DatatableCtrl'
        })
        .state('dashboard.add', {
            url: '/add',
            templateUrl: './resources/views/addstudent.html',
            controller: 'AddCtrl'
        });
})
.controller('indexController', function ($scope, $state, userService) {
    $state.go('login');
})
.service('userService', function () {
    var user = {};
    this.setUser = function (info) {
        user.access = info.access;
        user.role = info.role;
        user.profiles = info.profiles;
    };
    this.getUser = function () {
        return user;
    };
});
