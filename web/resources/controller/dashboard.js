angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService', 'cookiesService', '$uibModal',
        function($scope, $state, userService, cookiesService, $uibModal) {
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
                    controller: function($scope, $http) {
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
                    }
                });

                modalInstance.result.then(function (selectedItem) {

                }, function () {

                });
            };

            $scope.logout = function() {
                userService.clearUser();
                cookiesService.clear();
                $state.go('login');
            };
        }
    ]);
