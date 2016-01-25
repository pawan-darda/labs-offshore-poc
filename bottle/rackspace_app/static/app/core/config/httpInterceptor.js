angular.module('app.core').factory('httpInterceptor', ['$q', function ($q) {

    var requestCB = [], responseCB = [], responseErrorCB = [];
    var unsubscribe = function (handlers, fn) {
        for (var i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i] === fn) {
                handlers.splice(i, 1);
            }
        }
    }

    var notify = function (handlers, arg) {
        var returnValue;
        for (var i = 0; i < handlers.length; i++) {
            returnValue = handlers[i].call(null, arg);
        }

        return returnValue;
    };

    return {
        request: function (config) {
            notify(requestCB, this.arguments); // have to extend the return data with config
            return config || $q.when(config);
        },
        response: function (response) {
            notify(responseCB, this.arguments);
            return response || $q.when(response);
        },
        responseError: function (response) {
            notify(responseErrorCB, this.arguments);
            var status = response.status;
            if (status === 404 || status == 0) {
                throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_UNAVAILABLE);
            } else if (response.status == 401) {
                throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.UNAUTHORIZED);
            } else {
                throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_INVOCATION_ERR);
            }
            //return $q.reject(response);
        },
        requestSubscribe: function (fn) {
            requestCB.push(fn);
        },
        responseSubscribe: function (fn) {
            responseCB.push(fn);
        },
        responseErrorSubscribe: function (fn) {
            responseErrorCB.push(fn);
        },
        requestUnSubscribe: function (fn) {
            unsubscribe(requestCB, fn);
        },
        responseUnSubscribe: function (fn) {
            unsubscribe(responseCB, fn);
        },
        responseErrorUnSubscribe: function (fn) {
            unsubscribe(responseErrorCB, fn);
        }
    }
}]);