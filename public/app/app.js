angular.module('userApp', [
	'ngAnimate',
	'ui.bootstrap',
	'app.routes',
	'authService',
	'userService',
	'employeeService',
	'mainCtrl',
	'userCtrl',
	'employeeCtrl'
	])
.config(function($httpProvider)	{	
	//attach our auth inteceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
});