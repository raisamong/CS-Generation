angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService', 'studentService', 'toastr',
        function($scope, $state, userService, studentService, toastr) {
            $scope.allYear = ['56', '57', '58', '59'];
            $scope.yearSelected = $scope.allYear[0];
            var inited = false;
            var init = function () {
                if (!inited) {
                    studentService.list({year: $scope.yearSelected, limit: 10}).then(function (studentList) {
                        $scope.itemsTable = studentList;
                        inited = true;
                    }, function (msg) {
                        toastr.error(msg);
                    });
                }
            };
            init();

            $scope.listYear = function (year) {
                $scope.yearSelected = year;
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
