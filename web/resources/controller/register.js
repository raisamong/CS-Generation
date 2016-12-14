angular.module('registerModule', [])
    .controller('RegisterCtrl', ['$scope', 'registerService', '$state', 'toastr',
        function($scope, registerService, $state, toastr) {
            // <!-- variables defined -->
            // <!-- end variables defined -->

            // <!-- $scopes defined -->
            // <!-- end $scopes defined -->

            // <!-- variables function defined -->
            // <!-- end variables function defined -->

            // <!-- $scopes function defined -->
            $scope.register = function(registerForm) {
                console.log(registerForm);
                $scope.info.access = $scope.info.username;
                registerService.register($scope.info).then(function(returned) {
                    console.log('register succeed', returned);
                    if (!returned.result) {
                        toastr.success('Register Success');
                        $state.go('login');
                    } else
                        toastr.warning('Please check your register code.');
                }, function(err) {
                    toastr.error("Register Failed");
                    console.log('register failed', err);
                });
            };

            // <!-- end $scopes function defined -->
        }
    ])
    .factory('registerService', function($http, $q) {
        var service = {
            register: function(info) {
                var deferred = $q.defer();
                $http({
                        method: 'POST',
                        url: backend + 'register',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        if (!data.result) {
                            deferred.resolve(data);
                        } else {
                            deferred.resolve(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        };
        return service;
    });
