angular.module('registerModule', [])
.controller('RegisterCtrl', [ '$scope', 'registerService', '$state',
                            function ($scope, registerService, $state) {
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
    $scope.register = function (registerForm) {
        console.log(registerForm);
        var info  = genUserInfo();
        registerService.register(info).then(function (returned) {
            console.log('register succeed', returned);
            $state.go('login');
        }, function (err) {
            console.log('register failed', err);
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
