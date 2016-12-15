angular.module('addModule', [])
    .controller('AddCtrl', ['$scope', '$state', 'studentService', 'toastr',
        function($scope, $state, studentService, toastr) {
            var genCloseFriend = function() {
                var information = '';
                if ($scope.info.cfname) {
                    information = $scope.info.cfname;
                    if ($scope.info.cfsurname) {
                        information += ',' + $scope.info.cfsurname;
                        if ($scope.info.cfaddress) {
                            information += ',' + $scope.info.cfaddress;
                        }
                    }
                }
                return information;
            };

            var genStudentData = function() {
                var information = {
                    code: $scope.info.code,
                    name: $scope.info.name,
                    surname: $scope.info.surname,
                    tel: $scope.info.tel || '',
                    facebook: $scope.info.facebook || '',
                    address: $scope.info.address || '',
                };
                information.cf = genCloseFriend();
                return information;
            };

            var addSuccess = function() {
                toastr.success('Add student success');
                $scope.info = {};
            };

            var addError = function(result) {
                if (result == 1) {
                    toastr.error('This student already added');
                } else if (result == 2) {
                    toastr.error('Connection Lost');
                } else {
                    toastr.error('Add student failed');
                }
            };

            $scope.add = function() {
                var info = genStudentData();
                studentService.add(info).then(function(result) {
                    addSuccess();
                }, function(err) {
                    addError(err.result);
                });
            };
        }
    ])
    .factory('studentService', function($q, $http) {
        var service = {
            add: function(info) {
                var deferred = $q.defer();
                $http({
                        method: 'POST',
                        url: backend + 'student/add',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": 'PN'
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log(data);
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
