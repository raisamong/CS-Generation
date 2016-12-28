angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService', 'studentService',
        function($scope, $state, userService, studentService) {
            $scope.allYear = [56, 57, 58, 59];
            $scope.yearSelected = $scope.allYear[0];
            studentService.list({year: '56', limit:[0,2]}).then(function () {

            });
            $scope.itemsTable = [{
                imgUrl: '',
                id: '5621606021',
                name: '1',
                surname: '2'
            }, {
                imgUrl: '',
                id: '5621604021',
                name: '3',
                surname: '4'
            }, {
                imgUrl: '',
                id: '5621606021',
                name: '5',
                surname: '6'
            }];

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
