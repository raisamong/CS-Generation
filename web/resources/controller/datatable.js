angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService', 'studentService', 'toastr',
        function($scope, $state, userService, studentService, toastr) {
            $scope.allYear = calYear();
            $scope.yearSelected = $scope.allYear[0];
            $scope.hasInfo = false;
            $scope.pages = [];
            $scope.pageSelected = 1;

            var calPage = function(countRaw) {
                $scope.pages = [];
                var countPage = countRaw / 10;
                var additional = 1;
                if (countRaw % 10 === 0) {
                    additional = 0;
                }
                if (countPage > 1) {
                    for (var i = 1; i <= countPage + additional; i++) {
                        $scope.pages.push(i);
                    }
                }
            };

            var init = function(limit) {
                studentService.list({
                    year: $scope.yearSelected,
                    limit: limit || 10
                }).then(function(studentList) {
                    $scope.itemsTable = [];
                    $scope.itemsTable = studentList.data;
                    calPage(studentList.count);
                    $scope.hasInfo = true;
                }, function(err) {
                    if (err.result != 1) {
                        toastr.error(err.msg);
                    }
                    $scope.hasInfo = false;
                });
            };
            init();

            function calYear() {
                var years = [];
                var d = new Date();
                var thisYear = (d.getFullYear() + 543) - 2500;
                for (var i = 56; i <= thisYear; i++) {
                    years.push(i + '');
                }
                return years;
            }

            $scope.listYear = function(year) {
                $scope.yearSelected = year;
                init();
            };

            $scope.changePage = function(page) {
                if ($scope.pages.indexOf(page) > -1) {
                    $scope.pageSelected = page;
                    var limit = [];
                    limit.push((page - 1) * 10);
                    limit.push((page * 10) - 1);
                    hidden.log(limit);
                    init(limit);
                }
            };

            $scope.deleteStudent = function (id) {
                hidden.log(id);
            };
        }
    ])
    .directive('tableItem', function() {
        return {
            restrict: 'E',
            templateUrl: '../resources/views/directives/item_table.html',
            scope: {
                item: '=',
                deleteStudent: '&'
            }
        };
    });
