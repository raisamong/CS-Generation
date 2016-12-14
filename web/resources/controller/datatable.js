angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService',
        function($scope, $state, userService) {
            $scope.itemsTable = [{
                imgUrl: '',
                name: '1',
                surname: '2'
            }, {
                imgUrl: '',
                name: '3',
                surname: '4'
            }, {
                imgUrl: '',
                name: '5',
                surname: '6'
            }];
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
