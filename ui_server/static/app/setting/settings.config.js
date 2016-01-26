'use strict';
angular.module('app.settings').run(['routehelper', function (routehelper) {
    var baseSettings = {
        parentRoute: { name: rx.Constants.SettingsModuleConstant.SETTINGS_MODULE_HEADER}
    };

    var setting = angular.extend({
        url: '/settings',
        templateUrl: 'static/app/setting/templates/settings.tpl.html',
        controller: 'settingsCtrl',
        name: 'Url Configuration',
    }, baseSettings);

    var states = [
        setting        
    ];

    routehelper.configureStates(states);
}]);