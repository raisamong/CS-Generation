angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService', 'cookiesService',
        function($scope, $state, userService, cookiesService) {
            var checkCurrentUser = function() {
                $scope.user = userService.getUser();
                if (!$scope.user.access || $scope.user.role != 'admin') {
                    $state.go('login');
                    return false;
                }
            };
            checkCurrentUser();

            $scope.logout = function() {
                userService.clearUser();
                cookiesService.clear();
                $state.go('login');
            };
        }
    ]);
