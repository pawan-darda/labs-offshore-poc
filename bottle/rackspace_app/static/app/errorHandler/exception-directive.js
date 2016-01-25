angular.module('exception.directive',[]).directive('exceptionBlock', ['$compile', '$timeout', function ($compile, $timeout) {
    return {
        restrict: "A",
        scope: {
            showerror: '@',
            ondelete: '&'
        },
        templateUrl: "static/app/errorHandler/exceptionTemplate.html",
        link: function (scope, elm, attrs, exceptionService) {

            var config = { 'time-out': 5000 },
                mergedConfig, timerObj;

            mergedConfig = angular.extend({}, config, scope.$eval(attrs.options));

            scope.configureTimer = function configureTimer(timerObj) {
                var timeout = mergedConfig['time-out'];
                if (timeout > 0)
                    setTimeout(timerObj, timeout);
            };

            function setTimeout(timerObj, time) {
                if (timerObj) {
                    scope.stopTimer();
                }
                timerObj = $timeout(function () {
                    if (scope.errors && scope.errors.length > 0) {
                        scope.deleteError();
                    }
                    scope.stopTimer();
                }, time);
            };

            scope.stopTimer = function () {
                if (timerObj) {
                    $timeout.cancel(timerObj);
                    timerObj = null;
                }
            };

            scope.restartTimer = function () {
                if (!timerObj)
                    scope.configureTimer(timerObj);
            };

            scope.getClassName = function () {

                var className = "", moreThanOneLineClassName = scope.isMoreThanOneLine() ? "exception-moreThenoneLine" : "";
                if (scope.errors.length > 0) {
                    switch (scope.errors[0].type) {
                        case rx.ExceptionHandler.ExceptionType.WARNING:
                        case rx.ExceptionHandler.ExceptionType.VALIDATION:
                            className = "warning" + " " + moreThanOneLineClassName;
                            break;
                        case rx.ExceptionHandler.ExceptionType.SUCCESS:
                            className = "success" + " " + moreThanOneLineClassName;
                            break;
                        case rx.ExceptionHandler.ExceptionType.ERROR:
                        case rx.ExceptionHandler.ExceptionType.FILEUPLOAD_ERROR:
                            className = "error" + " " + moreThanOneLineClassName;
                            break;
                    }
                }
                return className;
            }

        },
        controller: ['$scope', '$element', '$attrs', 'exceptionService', function ($scope, $element, $attrs, exceptionService) {

            $scope.errors = exceptionService.errors();
            $scope.isMoreThanOneLine = function () {
                var isMoreThanOneLine = false;
                if ($scope.errors.length > 1) {
                    return true;
                }                
                return false;
            };
            $scope.deleteError = function (index) {
                exceptionService.clear();
                if ($scope.ondelete) {
                    $scope.ondelete();
                }

            };
            $scope.onErrorAdded = function () {
                if ($scope.errors) {
                   
                    if ($scope.errors.length > 0) {
                        $scope.configureTimer();
                    }
                    else {
                        $scope.restartTimer();
                    }
                }
            };
        }]
    };
}]);
