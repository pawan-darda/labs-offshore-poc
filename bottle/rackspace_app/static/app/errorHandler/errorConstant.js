(function (rx) {

    rx.Constants = rx.Constants || {};

    //Common error code starts from 1000 to 1500    
    //UI error code starts from 1500 to 2000
    rx.Constants.ErrorCode = {

        //defaut error code
        '404': 'Service unavailable. Please contact administrator.',
        '401': 'Unauthorized. Request denied',

        //Common error code starts from 1000 to 1500 
        '1000': 'Data invalid',
        '1001': 'Unhandled exception occured.',
        '1002': 'Error occured in service invocation.',


        //UI Constants
        '5001':'Error occured while saving the product'        
    }

    rx.Constants.CommonErrorConstant = {
        'UNAUTHORIZED' :rx.Constants.ErrorCode['401'],
        'SERVICE_UNAVAILABLE':rx.Constants.ErrorCode['404'],
        'DATA_INVALID': rx.Constants.ErrorCode['1000'],
        'UNHANDLED_EXP': rx.Constants.ErrorCode['1001'],
        'SERVICE_INVOCATION_ERR': rx.Constants.ErrorCode['1002']
    };

})(window.rx = window.rx || {})