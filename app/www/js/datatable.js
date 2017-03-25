angular.module('datatableModule', [])
    .controller('DatatableCtrl', ['$scope', '$state', 'userService', 'studentService', 'toastr',
        function($scope, $state, userService, studentService, toastr) {
            $scope.allYear = calYear();
            $scope.yearSelected = $scope.allYear[0];
            $scope.hasInfo = false;
            $scope.pages = [];
            $scope.pageSelected = 1;

            var searchMode = false;

            var user = userService.getUser();
            if (user && user.role == 'admin') {
                $scope.isAdmin = true;
            } else {
                $scope.isAdmin = false;
            }

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
                    calPage(studentList.count || 0);
                    $scope.hasInfo = true;
                }, function(err) {
                    if (err.result != 1) {
                        toastr.error(err.msg);
                    }
                    $scope.pages = [];
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
                $scope.searchText = '';
                searchMode = false;
                $scope.pageSelected = 1;
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
                    if (searchMode) {
                        $scope.search(limit);
                    } else {
                        init(limit);
                    }
                }
            };

            $scope.deleteStudent = function(id, index) {
                hidden.log(id, index);
                if (confirm('Are you sure to delete this student?')) {
                    studentService.delete(id).then(function() {
                        $scope.itemsTable.splice(index, 1);
                        toastr.success('Delete stundent succeed');
                    }, function(msg) {
                        toastr.error(msg);
                    });
                }
            };
            $scope.update = function(item) {
                hidden.log(item);
                item.code = item.id.substring(1, item.id.length - 1);
                if (item.friend) {
                    var cf = item.friend.split(',');
                    if (cf[0]) {
                        item.cfname = cf[0];
                    }
                    if (cf[1]) {
                        item.cfsurname = cf[1];
                    }
                    if (cf[2]) {
                        item.cfaddress = cf[2];
                    }
                }
                if (item.parent) {
                    var pr = item.parent.split(',');
                    if (pr[0]) {
                        item.prname = pr[0];
                    }
                    if (pr[1]) {
                        item.prsurname = pr[1];
                    }
                    if (pr[2]) {
                        item.praddress = pr[2];
                    }
                }
                $state.go('dashboard.add', {
                    info: item
                });
            };

            $scope.refresh = function () {
                init();
                toastr.success('Refresh');
            };

            $scope.search = function (limit) {
                if ($scope.searchText) {
                    searchMode = true;
                    studentService.search({
                        search: $scope.searchText,
                        limit:  limit || 10
                    }).then(function(studentList) {
                        $scope.itemsTable = [];
                        $scope.itemsTable = studentList.data;
                        calPage(studentList.count || 0);
                        $scope.hasInfo = true;
                    }, function(err) {
                        if (err.result != 1) {
                            toastr.error(err.msg);
                        }
                        $scope.pages = [];
                        $scope.hasInfo = false;
                    });
                } else {
                    searchMode = false;
                    init();
                }
            };
        }
    ])
    .directive('tableItem', function() {
        return {
            restrict: 'E',
            templateUrl: 'directives/item_table.html',
            scope: {
                item: '=',
                deleteStudent: '&',
                update: '&',
                isAdmin: '=',
                index: '=',
                page: '='
            },
            controller: function ($scope) {
                $scope.item.idShow = $scope.item.id.replace(/'/g, "");
            }
        };
    })
    .factory('studentService', function($q, $http) {
        var service = {
            add: function(info) {
                var deferred = $q.defer();
                var access = window.localStorage.getItem('access');
                $http({
                        method: 'POST',
                        url: backend + 'student/add',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Add-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data.msg);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Add Student failed");
                    });
                return deferred.promise;
            },
            update: function(info) {
                var deferred = $q.defer();
                var access = window.localStorage.getItem('access');
                $http({
                        method: 'PUT',
                        url: backend + 'student/update',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Update-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data.msg);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Update Student failed");
                    });
                return deferred.promise;
            },
            list: function(info) {
                var deferred = $q.defer();
                var access = window.localStorage.getItem('access');
                $http({
                        method: 'POST',
                        url: backend + 'student/list',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[List-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject({
                            result: 1,
                            msg: "Get Information failed"
                        });
                    });
                return deferred.promise;
            },
            delete: function(id) {
                var deferred = $q.defer();
                var access = window.localStorage.getItem('access');
                $http({
                        method: 'DELETE',
                        url: backend + 'student/delete/' + id,
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        }
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[Delete-Student]', data);
                        if (!data.result) {
                            deferred.resolve();
                        } else {
                            deferred.reject(data.msg);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject("Delete student failed");
                    });
                return deferred.promise;
            },
            search: function(info) {
                var deferred = $q.defer();
                var access = window.localStorage.getItem('access');
                $http({
                        method: 'POST',
                        url: backend + 'student/search',
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            "X-CS-Access": access
                        },
                        data: info
                    })
                    .success(function(data, status, headers, config) {
                        hidden.log('[search-Student]', data);
                        if (data.result === 0) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject({
                            result: 1,
                            msg: "Get Information failed"
                        });
                    });
                return deferred.promise;
            }
        };
        return service;
    });
