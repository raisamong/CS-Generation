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
                $scope.info.username = $scope.info.username.toLowerCase();
                $scope.info.access = $scope.info.username;
                registerService.register($scope.info).then(function(returned) {
                    hidden.log('[Register] register succeed', returned);
                    toastr.success('Register Success');
                    $state.go('login');
                }, function(err) {
                    hidden.log('[Register] register failed', err);
                    if (err.result == 1) {
                        toastr.warning('Please check your register code.');
                    } else if (err.result == 4) {
                        toastr.warning('Connection Lost');
                    } else if (err.result == 5) {
                        toastr.warning('Wrong Register Code');
                    } else {
                        toastr.error("Register Failed");
                    }
                });
            };

            // <!-- end $scopes function defined -->
        }
    ])
    .factory('registerService', function($http, $q) {
        var service = {
            register: function(info) {
                info.role = 'admin';
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
                            deferred.reject(data);
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
