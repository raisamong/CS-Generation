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
                hidden.log(authData);
                if (authData.username && authData.access) {
                    loginService.login(authData).then(function(userData) {
                        loginSuccess(userData);
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

            var checkLogin = function() {
                var user = userService.getUser();
                hidden.log(user);
                if (user.access) {
                    hidden.log(1);
                    $state.go('dashboard.datatable');
                } else {
                    hidden.log(2);
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
                hidden.log('login', $scope.info);
                loginService.login($scope.info).then(function(userData) {
                    hidden.log('login succeed', userData);
                    if (!userData.result) {
                        loginSuccess(userData);
                    } else {
                        toastr.warning('Please check your username/password.');
                    }
                }, function(err) {
                    hidden.log('login failed', err);
                    toastr.error('Login Failed');
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
