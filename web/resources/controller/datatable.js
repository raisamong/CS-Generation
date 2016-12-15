angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService',
        function($scope, $state, userService) {
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
        }
    ])
    .service('dataService', function () {
        var self = this;
    })
    .directive('tableItem', function() {
        return {
            restrict: 'E',
            templateUrl: '../resources/views/directives/item_table.html',
            scope: {
                item: '='
            }
        };
    });
