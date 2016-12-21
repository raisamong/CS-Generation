angular.module('addModule', [])
    .controller('AddCtrl', ['$scope', '$state', 'studentService', 'toastr',
        function($scope, $state, studentService, toastr) {
            // TODO hacked
            $scope.info = {
                code: '5621601785',
                name: 'jirapat',
                surname: 'thanapingpong',
                tel: '0823252881',
                facebook: 'testFacebook',
                address: 'testAddress'
            };
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
                    year: $scope.info.code.substring(0, 2)
                };
                information.cf = genCloseFriend();
                return information;
            };

            var addSuccess = function() {
                toastr.success('Add student success');
                $scope.info = {};
            };

            var addError = function(message) {
                toastr.error(message);
            };

            $scope.add = function() {
                var info = genStudentData();
                console.log(info);
                studentService.add(info).then(function(result) {
                    addSuccess();
                }, function(err) {
                    addError(err);
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
                        hidden.log('[Add-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data.msg);
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
