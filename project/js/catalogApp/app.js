var catalogApp = angular.module('catalogApp', [
    'ui.router',
    'ngResource', 
    'ngSanitize', 
    'catalogServices',
    'catalogFilters',
    'catalogControllers',
    'ui.slider',
    'angularUtils.directives.dirPagination'
]);
     
catalogApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('root', {
            url: '/?prod&cols&mods&curr&size&min&max&st',
            params: {
                prod: null,
                cols: '',
                mods: '',
                curr: 1,
                size: 5,
                min: 0,
                max: null,
                st: ''
            },
            controller: 'catalogCtrl'
        });
    $urlRouterProvider.otherwise("/");
}]);