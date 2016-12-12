angular.module('loginModule', [])
.controller('LoginCtrl', ['$scope', '$state', 'loginService', 'userService',
                        function($scope, $state, loginService, userService) {
    // <!-- initial function -->
    var checkLogin = function () {
        var user = userService.getUser();
        console.log(user);
        if (user.profiles) {
            $state.go('dashboard');
        }
    };
    checkLogin();
    // <!-- end initial function -->
    // <!-- variables defined -->
    // <!-- end variables defined -->

    // <!-- $scopes defined -->

    // <!-- end $scopes defined -->

    // <!-- variables function defined -->

    // <!-- end variables function defined -->

    // <!-- $scopes function defined -->
    $scope.login = function () {
        console.log('login', $scope.info);
        loginService.login($scope.info).then(function (returned) {
            console.log('login succeed', returned);
            $state.go('dashboard.datatable');
        }, function (err) {
            console.log('login failed', err);
        });
    };
    // <!-- end $scopes function defined -->
}])
.factory('loginService', function ($http, $q) {
    var service = {
        login : function (info) {
            var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: backend + 'login',
                    headers: {
                       "Content-type": "application/json;charset=UTF-8",
                    },
                    data: info
                })
                .success(function (data, status, headers, config) {
                    !data.result ? deferred.resolve(data) : deferred.reject(data);
                })
                .error( function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
    return service;
});
