'use strict';
(function (rx) {
    rx.ExceptionHandler = rx.ExceptionHandler || angular.module("rx.ExceptionHandlerModule", ['exception.directive']);
    var self = rx.ExceptionHandler;

    self.ExceptionType = (function () {

        var exceptionType = {
            WARNING: "WARNING",
            ERROR: "ERROR",
            VALIDATION: "VALIDATION",
            SUCCESS: "SUCCESS"
        };
        return exceptionType;

    })();
    
    self.ValidationError = (function () {
        function CustomError(message, type) {
            this.message = message;
            this.type = type || self.ExceptionType.VALIDATION;
        }
        angular.extend(Error, CustomError);
        return CustomError;

    })();

    self.CustomError = (function () {
        function CustomError(message, type, severity) {
            this.message = message;
            this.severity = severity;
            this.type = type || self.ExceptionType.ERROR;
        }

        CustomError.prototype.toString = function () {
            return this.message;
        }
        angular.extend(Error, CustomError);
        return CustomError;

    })();


    self.ServerError = (function () {
        function ServerError(message, severity, erroCode) {
            self.CustomError.call(this, message, severity);
            this.errorCode = erroCode;
        }
        angular.extend(self.CustomError, ServerError);

        return ServerError;

    })();

    self.SuccessAlert = (function () {
        function SuccessAlert(message, type) {
            this.message = message;
            this.type = type || self.ExceptionType.SUCCESS;
        }
        angular.extend(Error, SuccessAlert);
        return SuccessAlert;

    })();

})(window.rx = window.rx || {});