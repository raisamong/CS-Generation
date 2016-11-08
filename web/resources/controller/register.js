angular.module('registerModule', [])
.controller('RegisterCtrl', [ '$scope', 'registerService', '$timeout',
                            function ($scope, registerService, $timeout) {
    // <!-- variables defined -->
    // <!-- end variables defined -->

    // <!-- $scopes defined -->
    // <!-- end $scopes defined -->

    // <!-- variables function defined -->
    var genUserInfo = function () {
        var info = {
            username : $scope.info.username,
            password : $scope.info.password,
            access : $scope.info.username,
            code : $scope.info.code
        };
        return info;
    };


    // <!-- end variables function defined -->

    // <!-- $scopes function defined -->
    $scope.register = function () {
        var info  = genUserInfo();
        registerService.register(info).then(function (returned) {
            console.log('register succeed', returned);
        }, function (err) {
            console.log('register failed', returned);
        });
    };

    // <!-- end $scopes function defined -->
}])
.factory('registerService', function ($http, $q) {
    var service = {
        register : function (info) {
            var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: backend + 'register',
                    headers: {
                       "Content-type": "application/json;charset=UTF-8",
                    },
                    data: info
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error( function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    };
    return service;
});
