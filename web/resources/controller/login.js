angular.module('loginModule', [])
.controller('LoginCtrl', ['$scope', '$state', 'loginService', 'userService',
                        function($scope, $state, loginService, userService) {
    // <!-- initial function -->
    var checkLogin = function () {
        var user = userService.getUser();
        console.log(user);
        if (user.profiles) {
            $state.go('dashboard');
        }
    };
    checkLogin();
    // <!-- end initial function -->
    // <!-- variables defined -->
    var service = new loginService();
    // <!-- end variables defined -->

    // <!-- $scopes defined -->
    $scope.info = {
        username : '',
        password : '',
    };
    $scope.toastRes;
    // <!-- end $scopes defined -->

    // <!-- variables function defined -->
    var genUserInfo = function () {
        var info = {
            username : $scope.info.username,
            password : $scope.info.password
        };
        return info;
    };

    var genResult = function (output) {
        console.log(output);
        if (output.result == 0) {
            // login success
            $scope.regResult = 0;
            loginSuccess(output.data);
        }
        else if (output.result == 1) {
            //username password incorrect
            $scope.regResult = 1;
        }
        else if (output.result == 2) {
            //login failed
            $scope.regResult = 2;
        }
    };

    var checkUsername = function () {
        if (!$scope.info.username) {
            $scope.toastTxt = localize[$scope.$parent.lang]._username_required;
            $scope.toastRes = 4;
            return 1;
        }
        else {
            return 0;
        }
    };

    var checkPassword = function () {
        if (!$scope.info.password ) {
            $scope.toastTxt = localize[$scope.$parent.lang]._password_required;
            $scope.toastRes = 1;
            return 1;
        }
        else {
            return 0;
        }
    };

    var toastOut = function () {
        setTimeout( function(){
            $scope.toastRes = 0;
        }, 1000);
    };

    var loginSuccess = function (userInfo) {
        genCurrentUser(userInfo);
        $scope.$parent.registered = true;
        $state.go('dashboard');
    }

    var genCurrentUser = function (info) {
        userService.setUser(info);
        console.log(userService.getUser());
    }
    // <!-- end variables function defined -->

    // <!-- $scopes function defined -->
    $scope.login = function () {
        console.log('login');
        if (!checkUsername()) {
            if (!checkPassword()) {
                service.login(genUserInfo()).then(function (res) {
                    genResult(res);
                });
            }
            else {
                toastOut();
            }
        }
        else {
            toastOut();
        }
    };
    // <!-- end $scopes function defined -->
}])
.factory('loginService', function ($http, $q) {
    return function (){
        var self = this;

        this.login = function (info) {
            var deferred = $q.defer();
                $http({
                   method: 'POST',
                   url: backend + 'login',
                   headers: {
                       "Content-type": "application/json;charset=UTF-8",
                       "access-control-allow-origin": " *"
                   },
                   data: JSON.stringify({
                       username: info.username,
                       password: info.password
                   })
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        };
    }
});
