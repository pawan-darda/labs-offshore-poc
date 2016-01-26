angular.module('app.global.directive', []).directive('wcOverlay', ['$q', '$timeout', '$window', 'httpInterceptor', function ($q, $timeout, $window, httpInterceptor) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            wcOverlayDelay: "@"
        },
        template: '<div id="overlay-container" class="overlayContainer" ng-show="show">' +
                        '<div id="overlay-background" class="overlayBackground"></div>' +
                        '<div id="overlay-content" class="overlayContent" data-ng-transclude>' +
                        '</div>' +
                    '</div>',
        link: function (scope, element, attrs) {
            var overlayContainer = null,
                timerPromise = null,
                timerPromiseHide = null,
                inSession = false,
                queue = [];

            init();

            function init() {
                wireUpHttpInterceptor();
                if (window.jQuery) wirejQueryInterceptor();
                scope.show = false;
            }

            //Hook into httpInterceptor factory request/response/responseError functions                
            function wireUpHttpInterceptor() {

                httpInterceptor.requestSubscribe(function (config) {
                    processRequest();
                    return config || $q.when(config);
                });

                httpInterceptor.responseSubscribe(function (response) {
                    processResponse();
                    return response || $q.when(response);
                });

                httpInterceptor.responseErrorSubscribe(function (rejection) {
                    processResponse();
                    return rejection || $q.when(rejection);
                });
            }

            //Monitor jQuery Ajax calls in case it's used in an app
            function wirejQueryInterceptor() {
                $(document).ajaxStart(function () {
                    processRequest();
                });

                $(document).ajaxComplete(function () {
                    processResponse();
                });

                $(document).ajaxError(function () {
                    processResponse();
                });
            }

            function processRequest() {
                queue.push({});
                if (queue.length == 1) {
                    timerPromise = $timeout(function () {
                        if (queue.length) showOverlay();
                    }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 500); //Delay showing for 500 millis to avoid flicker
                }
            }

            function processResponse() {
                queue.pop();
                if (queue.length == 0) {
                    //Since we don't know if another XHR request will be made, pause before
                    //hiding the overlay. If another XHR request comes in then the overlay
                    //will stay visible which prevents a flicker
                    timerPromiseHide = $timeout(function () {
                        //Make sure queue is still 0 since a new XHR request may have come in
                        //while timer was running
                        if (queue.length == 0) {
                            hideOverlay();
                            if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                        }
                    }, scope.wcOverlayDelay ? scope.wcOverlayDelay : 500);
                }
            }

            function showOverlay() {
                scope.show = true;
            }

            function hideOverlay() {
                if (timerPromise) $timeout.cancel(timerPromise);
                scope.show = false;
                
            }
        }
    }
}]);
