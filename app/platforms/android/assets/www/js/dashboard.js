angular.module('dashboardModule', [])
    .controller('DashboardCtrl', ['$scope', '$state', 'userService', 'cookiesService',
        function($scope, $state, userService, cookiesService) {
            var checkCurrentUser = function() {
                $scope.user = userService.getUser();
                if (!$scope.user.access) {
                    $state.go('login');
                    return false;
                }
            };
            checkCurrentUser();

            $scope.logout = function() {
                userService.clearUser();
                window.localStorage.setItem('username', null);
                window.localStorage.setItem('access', null);
                $state.go('login');
            };
        }
    ]);
