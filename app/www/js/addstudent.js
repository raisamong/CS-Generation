angular.module('addModule', [])
    .controller('AddCtrl', ['$scope', '$state', '$stateParams', 'studentService', 'toastr', '$http',
        'uploadService', 'userService',
        function($scope, $state, $stateParams, studentService, toastr, $http,
        uploadService, userService) {
            // TODO hacked
            $scope.info = $stateParams.info || {
                code: '5621601785',
                name: 'jirapat',
                surname: 'thanapingpong',
                tel: '0823252881',
                facebook: 'testFacebook',
                address: 'testAddress'
            };

            $scope.refresh = function () {
                  var access = window.localStorage.getItem('access');
                  $http({
                          method: 'post',
                          url: backend + 'student/get',
                          headers: {
                              "Content-type": "application/json;charset=UTF-8",
                              "X-CS-Access": access
                          },
                          data: {
                              id: $scope.info.code
                          }
                      })
                      .success(function(data, status, headers, config) {
                          hidden.log('[get-Student]', data);
                          if (data.result === 0) {
                              $scope.info.address = data.data.address;
                              $scope.info.facebook = data.data.facebook;
                              $scope.info.image = data.data.image;
                              $scope.info.name = data.data.name;
                              $scope.info.surname = data.data.surname;
                              $scope.info.tel = data.data.tel;
                              if (data.data.friend) {
                                    var cf = data.data.friend.split(',');
                                    if (cf[0]) {
                                        $scope.info.cfname = cf[0];
                                    }
                                    if (cf[1]) {
                                        $scope.info.cfsurname = cf[1];
                                    }
                                    if (cf[2]) {
                                        $scope.info.cfaddress = cf[2];
                                    }
                              }
                              toastr.success('Refreshed');
                          } else {
                              toastr.error('Refresh failed');
                          }
                      })
                      .error(function(data, status, headers, config) {
                          toastr.error('Connection Lost');
                      });
            };

            $scope.loading = false;

            if ($stateParams.info) {
                $scope.update = true;
            }
            var upload = false;
            var user = userService.getUser();
            if (user && user.role == 'admin') {
                $scope.isAdmin = true;
            } else {
                $scope.isAdmin = false;
            }
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
                    year: $scope.info.code.substring(0, 2),
                    image: $scope.info.image || ''
                };
                information.cf = genCloseFriend();
                return information;
            };

            var addSuccess = function() {
                if ($scope.update) {
                    toastr.success('Update student succeed');
                } else {
                    toastr.success('Add student succeed');
                    $scope.info = {};
                }
                $scope.addForm.$setPristine();
                $scope.loading = false;
            };

            var addError = function(message) {
                toastr.error(message);
                $scope.loading = false;
            };

            var set = function (info) {
                if ($scope.update) {
                    studentService.update(info).then(function(result) {
                        addSuccess();
                    }, function(err) {
                        addError(err);
                    });
                } else {
                    studentService.add(info).then(function(result) {
                        addSuccess();
                    }, function(err) {
                        addError(err);
                    });
                }
            };

            $scope.back = function functionName() {
                if (!$scope.loading) {
                    $state.go('dashboard.datatable');
                }
            };

            $scope.add = function() {
                var info = genStudentData();
                console.log(info);
                $scope.loading = true;
                if (upload) {
                    uploadService($scope.info.image).then(function (url) {
                        hidden.log('uploaded', url);
                        if (url) {
                            info.image = url;
                            $scope.info.image = url;
                            upload = false;
                            set(info);
                        } else {
                            info.image = '';
                            set(info);
                        }
                    }, function () {
                        addError('Upload image failed');
                    });
                } else {
                    set(info);
                }
            };

            $scope.openCamera = function () {
                navigator.camera.getPicture(function (imageData) {
                    $scope.info.image = "data:image/jpeg;base64," + imageData;
                    $scope.$apply();
                    upload = true;
                }, function () {
                    hidden.log('error camera');
                }, {
                    destinationType: 0
                });
            };
        }
    ]);
