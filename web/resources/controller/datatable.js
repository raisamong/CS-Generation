angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService', 'studentService', 'toastr',
        function($scope, $state, userService, studentService, toastr) {
            $scope.allYear = ['56', '57', '58', '59'];
            $scope.yearSelected = $scope.allYear[0];
            $scope.hasInfo = false;
            var init = function() {
                studentService.list({
                    year: $scope.yearSelected,
                    limit: 10
                }).then(function(studentList) {
                    $scope.itemsTable = studentList;
                    $scope.hasInfo = true;
                }, function(err) {
                    if (err.result !=1) {
                        toastr.error(err.msg);
                    }
                    $scope.hasInfo = false;
                });
            };
            init();

            $scope.listYear = function(year) {
                $scope.yearSelected = year;
                init();
            };
        }
    ])
    .directive('tableItem', function() {
        return {
            restrict: 'E',
            templateUrl: '../resources/views/directives/item_table.html',
            scope: {
                item: '='
            }
        };
    });
