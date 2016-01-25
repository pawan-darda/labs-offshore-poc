(function (rx) {
   
    rx.ExceptionHandler = rx.ExceptionHandler || angular.module("rx.ExceptionHandlerModule", ['exception.directive']);

    rx.ExceptionHandler.config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler',
            ['$delegate','$injector', extendExceptionHandler]);
    }]);

    // Extend the $exceptionHandler service to also display a toast.
    function extendExceptionHandler($delegate, $injector) {
        
        return function (exception, cause) {
            $delegate(exception, cause);
            //customize
            var es = $injector.get('exceptionService');
            es.addNotification(exception);
        };
    }

})(window.rx = window.rx || {});