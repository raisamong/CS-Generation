angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService', 'cookiesService', '$uibModal', 'toastr',
        function($scope, $state, userService, cookiesService, $uibModal, toastr) {
            var checkCurrentUser = function() {
                $scope.user = userService.getUser();
                if (!$scope.user.access || $scope.user.role != 'admin') {
                    $state.go('login');
                    return false;
                }
            };
            checkCurrentUser();

            $scope.changeCode = function () {
                var modalInstance =  $uibModal.open({
                    templateUrl: 'resources/views/templates/registerCode.html',
                    size: 'md',
                    controller: function($scope, $http, $uibModalInstance) {
                      var access = cookiesService.get('access');
                      $http({
                              method: 'GET',
                              url: backend + 'setting/register',
                              headers: {
                                  "Content-type": "application/json;charset=UTF-8",
                                  "X-CS-Access": access
                              }
                          })
                          .success(function(data, status, headers, config) {
                              hidden.log('[Register code get]', data);
                              if (data.result === 0) {
                                  $scope.registerCode = data.data;
                              } else {
                                 $scope.registerCode = '';
                              }
                          })
                          .error(function(data, status, headers, config) {
                              deferred.reject("Register code get failed");
                          });

                      $scope.change = function () {
                        $http({
                              method: 'PUT',
                              url: backend + 'setting/register',
                              headers: {
                                  "Content-type": "application/json;charset=UTF-8",
                                  "X-CS-Access": access
                              },
                              data: {
                                  passcode: $scope.registerCode
                              }
                          })
                          .success(function(data, status, headers, config) {
                              hidden.log('[Register code update]', data);
                              if (data.result === 0) {
                                  $uibModalInstance.close(true);
                              } else {
                                  $uibModalInstance.close(false);
                              }
                          })
                          .error(function(data, status, headers, config) {
                              $uibModalInstance.close(false);
                          });
                      };

                      $scope.cancel = function () {
                          $uibModalInstance.dismiss('cancel');
                      };
                    }
                });

                modalInstance.result.then(function (isSuccess) {
                    if (isSuccess) {
                        toastr.success('Update register code succeed');
                    } else {
                        toastr.error('Update register code failed');
                    }
                }, function () {
                    hidden.log('dismiss');
                });
            };

            $scope.logout = function() {
                userService.clearUser();
                cookiesService.clear();
                $state.go('login');
            };
        }
    ]);
