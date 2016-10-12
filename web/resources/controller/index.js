angular.module('csGeneration',[
    "ui.router",
    "ui.bootstrap",
    "loginModule",
    'registerModule',
    'dashboardModule'
])
.config(function ($stateProvider, $urlRouterProvider) {
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
