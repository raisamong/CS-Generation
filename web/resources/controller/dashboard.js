angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService', 'cookiesService',
        function($scope, $state, userService, cookiesService) {
            var checkCurrentUser = function() {
                $scope.user = userService.getUser();
                if (!$scope.user.access) {
                    $state.go('login');
                }
            };
            checkCurrentUser();

            $scope.logout = function() {
                userService.clearUser();
                cookiesService.clear();
                $state.go('login');
            };
        }
    ])
    .factory('studentService', function($q, $http, cookiesService) {
        var service = {
            add: function(info) {
                var deferred = $q.defer();
                var access = cookiesService.get('access');
                $http({
                        method: 'POST',
                        url: backend + 'student/add',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Add-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data.msg);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Add Student failed");
                    });
                return deferred.promise;
            },
            list: function (info) {
                var deferred = $q.defer();
                var access = cookiesService.get('access');
                $http({
                        method: 'POST',
                        url: backend + 'student/list',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[List-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Get Information failed");
                    });
                return deferred.promise;
            },
            delete: function (id) {
                var deferred = $q.defer();
                var access = cookiesService.get('access');
                $http({
                        method: 'DELETE',
                        url: backend + 'student/delete/' + id,
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Delete-Student]', data);
                        deferred.resolve();
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Get Information failed");
                    });
                return deferred.promise;
            }
        };
        return service;
    });
