//gets data using $http
//Data gets passed into controller directory to get displayed
angular.module('employeeService', [])

.factory('Employee',function($http){
	//create the object
	var employeeFactory = {};

	//get a single employee
	employeeFactory.get = function(id)	{
		//a function to get all the stuff
		return $http.get('api/employees/' + id );
	};
	//get all employees
	employeeFactory.all = function()	{
		return $http.get('/api/employees');
	};

	//create a employee
	employeeFactory.create = function(employeeData)	{
		return $http.post('/api/employees/', employeeData);
	};

	//update a employee
	employeeFactory.update = function(id,employeeData)	{
		return $http.put('/api/employees/' + id, employeeData);
	};

	//delete a employee
	employeeFactory.delete = function(id)	{
		return $http.delete('/api/employees/' + id);
	};

	//return our entire employeeFactory object
	return employeeFactory;
	});
