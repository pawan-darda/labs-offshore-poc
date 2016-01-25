(function (rx) {
    
    rx.ExceptionHandler = rx.ExceptionHandler || angular.module("rx.ExceptionHandlerModule", ['exception.directive']);
    
    rx.ExceptionHandler.service('exceptionService', ['$rootScope', '$window', function ($rootScope, $window) {

        var err = [], rootContext = this;

        this.errors = function () {
            return err;
        };

        this.pushNotification = function (ex, type) {
            //var errMsg = ex.message || ex;
            //type = type || 'error';
            if (!this.isExist(ex)) {
                err.push(ex);
            }
        };

        this.isExist = function (ex) {
            for (var i = 0, j = err.length; i < j; i++) {
                if (JSON.stringify(err[i].message) == JSON.stringify(ex.message)) {
                    return true;
                }
            }
            return false;
        }

        this.deleteError = function (index) {
            err.splice(index, 1);
        };
        this.clear = function () { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                this.deleteError(i);
            }
        };

        this.clearWithType = function (type) { //it should use same instance then only it reflect in UI whenever u change the coll
            var len = err.length - 1;
            for (var i = len; i >= 0; i--) {
                if (err[i].type == type) {
                    this.deleteError(i);
                }
            }
        };

        
        this.addNotification = function (exception) {
            if (exception instanceof rx.ExceptionHandler.CustomError) {
                //showErrDialog(constant.Common.ERROR, exception);
                this.pushNotification(exception);
            }            
            else if (exception instanceof rx.ExceptionHandler.ValidationError) {
                this.pushNotification(exception);
            } else if (exception instanceof rx.ExceptionHandler.ServerError) {
                this.pushNotification(constant.Common.SERVICE_ERROR, exception);
            }
            else if (exception instanceof rx.ExceptionHandler.SuccessAlert) {
                this.pushNotification(exception);
            }
            else {
                this.pushNotification(new rx.ExceptionHandler.CustomError(exception.toString()));
            }
        };

        this.windowError = function (message, filename, lineno, colno, error) {
            rootContext.addNotification(new rx.ExceptionHandler.CustomError(message));
        }

        window.onerror = this.windowError; // To handle unhandle exception.

        $rootScope.$on(rx.Constants.PublisherEventPayLoad.SHOW_ERROR_COMMAND, function (event, exception) {
            rootContext.addNotification(exception);
        });

        $rootScope.$on(rx.Constants.PublisherEventPayLoad.SHOW_SUCCESS_COMMAND, function (event, notification) {
            rootContext.pushNotification(notification);
        });

    }]);

})(window.rx = window.rx || {});