angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService',
        function($scope, $state, userService) {
            var checkCurrentUser = function() {
                $scope.user = userService.getUser();
                if (!$scope.user.access) {
                    $state.go('login');
                }
            };
            checkCurrentUser();

            $scope.logout = function() {
                userService.clearUser();
                $state.go('login');
            };
        }
    ]);
