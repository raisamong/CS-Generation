angular.module('addModule', [])
    .controller('AddCtrl', ['$scope', '$state', '$stateParams', 'studentService', 'toastr',
        'uploadService', 'userService',
        function($scope, $state, $stateParams, studentService, toastr,
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
            if ($stateParams.info) {
                $scope.update = true;
            }

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
                    image: $scope.info.image
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
            };

            var addError = function(message) {
                toastr.error(message);
            };

            $scope.add = function() {
                var info = genStudentData();
                console.log(info);
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

            $scope.uploadImage = function (image) {
                if (image) {
                    if (!$scope.loading) {
                        $scope.loading = true;
                        console.log(image);
                        var reader = new FileReader();
                        reader.readAsDataURL(image);
                        reader.onload = function () {
                            console.log(reader.result);
                            uploadService(reader.result, image.name).then(function (url) {
                                hidden.log('uploaded', url);
                                $scope.info.image = url;
                                $scope.loading = false;
                            }, function () {
                                $scope.loading = true;
                                toastr.error('Upload image error');
                            });
                        };
                    }
                }
            };
        }
    ]);
