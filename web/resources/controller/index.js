hidden = {};
hidden.intentUrl = '';
hidden.log = function() {};

if (!!main && main.type == 'debug' && !!console && !!hidden.log) {
    if (Function.prototype.bind) {
        hidden.log = Function.prototype.bind.call(console.log, console);
    } else {
        hidden.log = function() {
            Function.prototype.apply.call(hidden.log, console, arguments);
        };
    }
}

angular.module('csGeneration', [
        "ui.router",
        "ui.bootstrap",
        "toastr",
        'ngFileUpload',
        "loginModule",
        'registerModule',
        'dashboardModule',
        'datatableModule',
        'addModule'
    ])
    .config(function($stateProvider, $urlRouterProvider, toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
            preventOpenDuplicates: true
        });
        $urlRouterProvider.otherwise('/');
        $stateProvider.
        state('login', {
                url: '/login',
                templateUrl: './resources/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: './resources/views/register.html',
                controller: 'RegisterCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: './resources/views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('dashboard.datatable', {
                url: '/datatable',
                templateUrl: './resources/views/datatable.html',
                controller: 'DatatableCtrl'
            })
            .state('dashboard.add', {
                url: '/add',
                templateUrl: './resources/views/addstudent.html',
                controller: 'AddCtrl'
            });
    })
    .controller('indexController', function($scope, $state, userService) {
        $state.go('login');
    })
    .service('userService', function() {
        var user = {};
        this.setUser = function(info) {
            user = _.clone(info);
        };
        this.getUser = function() {
            return _.clone(user);
        };

        this.clearUser = function() {
            user = '';
        };
    })
    .factory('cookiesService', function($http, $q) {
        return {
            set: function(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            },
            remove: function(cname) {
                var d = new Date();
                d.setTime(d.getTime());
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + '=;expires=' + expires;
            },
            get: function(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
                }
                return "";
            },
            clear: function() {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
        };
    })
    .factory('uploadService', function(Upload, $q) {
        return function(file, path, type, name) {
            // var deferred = $q.defer();
            // var access = shappyCookie.get('user_access');
            // var blob;
            // if (file.indexOf('base64')) {
            //     var imageType = file.substring(file.indexOf('data:image/')+11, file.indexOf(';base64'));
            //     if (imageType == "jpeg") {
            //         imageType = 'jpg';
            //     }
            //     var fileName = (new Date().getTime()) + "." + imageType;
            //     shappyMain.log('fileName', fileName);
            //     blob = Upload.dataUrltoBlob(file, fileName);
            // } else {
            //     blob = file;
            // }
            // shappyMain.log({
            //     file: blob,
            //     otherInfo: {
            //         access: access,
            //         path: backend + path,
            //         type: type
            //     }
            // });
            // Upload.upload({
            //     url: '/upload',
            //     data: {
            //         file: blob,
            //         otherInfo: {
            //             access: access,
            //             path: backend + path,
            //             type: type
            //         },
            //         key: name? Upload.rename(blob, encodeURIComponent(name)) : ''
            //     }
            // }).then(function (resp) {
            //     if (!resp.data.result) {
            //         deferred.resolve(resp.data.url);
            //     } else {
            //         deferred.reject(resp);
            //     }
            // }, function (resp) {
            //     deferred.reject(resp);
            // });
            // return deferred.promise;
        };
    });
