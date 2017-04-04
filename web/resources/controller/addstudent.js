angular.module('addModule', [])
    .controller('AddCtrl', ['$scope', '$state', '$stateParams', 'studentService', 'toastr', '$q',
        'uploadService',
        function($scope, $state, $stateParams, studentService, toastr, $q,
        uploadService ) {
            // TODO hacked
            $scope.info = $stateParams.info || {
                code: '',
                name: '',
                surname: '',
                tel: '',
                facebook: '',
                address: ''
            };

            $scope.loading = false;

            if ($stateParams.info) {
                $scope.update = true;
            }

            var upload = false;
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

            var genParent = function() {
                var information = '';
                if ($scope.info.prname) {
                    information = $scope.info.prname;
                    if ($scope.info.cfsurname) {
                        information += ',' + $scope.info.prsurname;
                        if ($scope.info.cfaddress) {
                            information += ',' + $scope.info.praddress;
                        }
                    }
                }
                return information;
            };

            var genAddress = function () {
                var information = '';
                    information = $scope.info.houseno || '';
                    information += ',' + ($scope.info.subdistrict || '');
                    information += ',' + ($scope.info.district || '');
                    information += ',' + ($scope.info.province || '');
                    information += ',' + ($scope.info.postal || '');
                return information;
            };

            var genStudentData = function() {
                var information = {
                    code: $scope.info.code,
                    name: $scope.info.name,
                    surname: $scope.info.surname,
                    tel: $scope.info.tel || '',
                    facebook: $scope.info.facebook || '',
                    year: $scope.info.code.substring(0, 2),
                    image: $scope.info.image,
                    teacher: $scope.info.teacher
                };
                information.cf = genCloseFriend();
                information.parent = genParent();
                information.address = genAddress();
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

            $scope.add = function() {
                var info = genStudentData();
                hidden.log(info);
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

            var loadImage = function (image) {
                var deferred = $q.defer();
                var reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = function () {
                    deferred.resolve(reader.result);
                };
                return deferred.promise;
            }


            $scope.uploadImage = function (image) {
                if (image) {
                    if (!$scope.loading) {
                        loadImage(image).then(function (dataImage) {
                            console.log('loaded');
                            $scope.info.image = dataImage;
                            upload = true;
                            $scope.loading = false;
                        });
                    }
                } else {
                    hidden.log('no image');
                }
            };
        }
    ]);
