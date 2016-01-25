(function (rx) {

    rx.Constants = rx.Constants || {};

    //Common error code starts from 1000 to 1500    
    //UI error code starts from 1500 to 2000
    rx.Constants.Common = {
        'HOME': 'Home',
        'ALL_PRODUCT':'All products'
    };

    rx.Constants.ProductModuleConstant = {
        'PRODUCT_CREATION_FAILED': rx.Constants.ErrorCode['1500'],
        'PRODUCTLIST_STATE': 'Product List',
        'PRODUCT_MODULE_HEADER': 'Products',
        'PRODUCT_LIST_ROUTER':'/product',
        'DEFAULT_PRODUCT_ROUTER': "#/product",
        'PRODUCT_LIST_STATE_NAME': 'Product List',
        'ADD_PRODUCT_ROUTER':'/create',
        'ADD_PRODUCT_STATE_NAME': 'Add Product'
    };
    rx.Constants.SettingsModuleConstant = {
        SETTINGS_MODULE_HEADER: 'Settings'
    }
    rx.Constants.PublisherEventPayLoad = {
        'SHOW_ERROR_COMMAND': 'ERROR',
        'SHOW_SUCCESS_COMMAND':'SUCCESS'
    }

})(window.rx = window.rx || {})