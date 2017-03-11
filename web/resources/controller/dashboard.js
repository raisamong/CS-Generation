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
                    size: 'sm',
                    controller: function($scope) {

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
