angular.module('loginModule', [])
    .controller('LoginCtrl', ['$scope', '$state', 'loginService', 'userService', 'toastr',
        'cookiesService',
        function($scope, $state, loginService, userService, toastr, cookiesService) {
            // <!-- initial function -->
            var autoLogin = function() {
                var authData = {
                    username: cookiesService.get('username'),
                    access: cookiesService.get('access')
                };
                hidden.log('[Login]', authData);
                if (authData.username && authData.access) {
                    loginService.login(authData).then(function(userData) {
                        loginSuccess(userData);
                    }, function(err) {
                        loginFail(err.result, true);
                    });
                }
            };

            var loginSuccess = function(userData) {
                toastr.success('Login Success', userData.data);
                userService.setUser(userData.data);
                cookiesService.set('username', $scope.info.username);
                cookiesService.set('access', userData.data.access);
                $state.go('dashboard.datatable');
            };

            var loginFail = function(result, notShow) {
                hidden.log('[Login] login failed');
                if (!notShow) {
                    if (result == 1) {
                        toastr.warning('Please check your username/password.');
                    } else if (result == 3) {
                        toastr.error('Connection Lost');
                    } else {
                        toastr.error('Login Failed');
                    }
                }
            };

            var checkLogin = function() {
                var user = userService.getUser();
                hidden.log('[Login]', user);
                if (user.access) {
                    $state.go('dashboard.datatable');
                } else {
                    autoLogin();
                }
            };
            checkLogin();
            // <!-- end initial function -->
            // <!-- variables defined -->
            // <!-- end variables defined -->

            // <!-- $scopes defined -->
            $scope.info = {};
            $scope.info.username = 'raisamong';
            $scope.info.password = 'aaaaaaaa';
            // <!-- end $scopes defined -->

            // <!-- variables function defined -->

            // <!-- end variables function defined -->

            // <!-- $scopes function defined -->
            $scope.login = function() {
                hidden.log('[Login]', $scope.info);
                loginService.login($scope.info).then(function(userData) {
                    hidden.log('[Login] login succeed', userData);
                    loginSuccess(userData);
                }, function(err) {
                    loginFail(err.result);
                });
            };
            // <!-- end $scopes function defined -->
        }
    ])
    .factory('loginService', function($http, $q) {
        var service = {
            login: function(info) {
                var deferred = $q.defer();
                $http({
                        method: 'POST',
                        url: backend + 'login',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": 'PN'
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Login]', data);
                        if (!data.result) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject({
                            result: 3
                        });
                    });
                return deferred.promise;
            }
        };
        return service;
    });
