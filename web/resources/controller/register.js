angular.module('registerModule', [])
.controller('RegisterCtrl', [ '$scope', 'registerService', '$timeout',
                            function ($scope, registerService, $timeout) {
    // <!-- variables defined -->
    var service = new registerService();
    // <!-- end variables defined -->

    // <!-- $scopes defined -->
    $scope.info = {
        username : '',
        password : '',
        email : '',
    };
    $scope.viewMain = true;
    $scope.toastRes;
    // <!-- end $scopes defined -->

    // <!-- variables function defined -->
    var genUserInfo = function () {
        var info = {
            username : $scope.info.username,
            password : $scope.info.password,
            email : $scope.info.email
        };
        return info;
    };

    var checkUsername = function () {
        if (!$scope.info.username) {
            $scope.toastTxt = localize[$scope.$parent.lang]._username_required;
            $scope.toastRes = 4;
            return 1;
        }
        else if ($scope.info.username.length < 8 ) {
            $scope.toastTxt = localize[$scope.$parent.lang]._username_short;
            $scope.toastRes = 4;
            return 1;
        }
        else if ($scope.info.username.length > 10 ) {
            $scope.toastTxt = localize[$scope.$parent.lang]._username_long;
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
        else if ($scope.info.password.length < 8 ) {
            $scope.toastTxt = localize[$scope.$parent.lang]._password_short;
            $scope.toastRes = 2;
            return 1;
        }
        else if ($scope.info.password != $scope.info.passwordConf) {
            $scope.toastTxt = localize[$scope.$parent.lang]._password_mismatch;
            $scope.toastRes = 3;
            return 1;
        }
        else {
            return 0;
        }
    };

    var genResult = function (output) {
        console.log(output);
        if (output.result == 0) {
            // register success
            $scope.regResult = 0;
            $scope.toggleView();
        }
        else if (output.result == 1) {
            //username exist
            $scope.regResult = 1;
        }
        else if (output.result == 2) {
            //register failed
            $scope.regResult = 2;
        }
    };

    var toastOut = function () {
        setTimeout( function(){
            $scope.toastRes = 0;
        }, 1000);
    };
    // <!-- end variables function defined -->

    // <!-- $scopes function defined -->
    $scope.register = function () {
        console.log('register');
        if (!checkUsername()) {
            if (!checkPassword()) {
                service.register(genUserInfo()).then(function (res) {
                    genResult(res);
                });
            }
            else {
                console.log('password mismatch');
                toastOut();
            }
        }
        else {
            console.log('username error');
            toastOut();
        }

    };

    $scope.toggleView = function () {
        $scope.viewMain = !$scope.viewMain;
    };
    // <!-- end $scopes function defined -->
}])
.factory('registerService', function ($http, $q) {
    return function () {
        var self = this;

        this.register = function (info) {
            var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: backend + 'register',
                    headers: {
                       "Content-type": "application/json;charset=UTF-8",
                       "access-control-allow-origin": " *"
                    },
                    data: {
                        username : info.username,
                        password : info.password,
                        access: info.username,
                    }
                })
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error( function (data, status, headers, config) {
                    deferred.resolve(data);
                });
            return deferred.promise;
        };
    };
});
