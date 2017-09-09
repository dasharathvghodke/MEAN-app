//inject the stuff service into main Angular module
angular.module('employeeCtrl', ['employeeService', 'ngFileUpload'])	
//create a controller and inject the Stuff factory
	.controller('employeeController',function(Employee)	{
		
		var vm = this;

		//	set a processing variable to show loading things
		vm.processing = true;

		//	grab all the employees at page load
		Employee.all()
		.success(function(data)	{
		
		//	when all the employees come back, remove the processing variable
			vm.processing = false;
			//bind the data to a controller variable
			//this come from the stuffService
			vm.employees = data;
		});
		//function to delete a employee
		vm.deleteEmployee = function(id)	{
			vm.processing = true;
            console.log(id);
			// accepts the employee id as a parameter		
			Employee.delete(id)
				.success(function(data)	{

				// get all employees to update the table 
				// you can also set up your api 
				// to return the list of employees with the delete call
			Employee.all()
				.success(function(data)	{
					vm.processing = false;
					vm.employees = data;
					});
				});
			};
	})

// controller applied to employee creation page
	.controller('employeeCreateController', function($scope, Employee, Upload)	{

		var vm = this;
        
        vm.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
        
           
		// differentiates between create or edit page
		vm.type = 'create';
		// function to create a employee
		vm.saveEmployee = function()	{
			vm.processing = true;

			//clear the message
			vm.message = '';
            Upload.upload({
                   url: '/api/employees/upload',
                   data: {file: $scope.file}
               }).then(function (resp) {
               	     console.log(resp.data);
                    // use the create function in the employeeService
                    let employeeData = vm.employeeData;
                    employeeData.image = resp.data._id;
                    console.log(employeeData)
          			Employee.create(employeeData)
          				.success(function (data)	{
          					vm.processing = false;

          					//clear the form
          					vm.employeeData = {};
          					vm.message = data.message;
          				});
               });
			
      	};

	})

	//	controller applied to employee edit page
	.controller('employeeEditController', function($routeParams,Employee)	{
		var vm = this;
			//	variable to hide/show elemments of the view
			//	differentiates between create or edit pages
		vm.type = 'edit';

			//	get the employee data for the employee you want to edit
			//	$routeParams is the way we grab data from the URL
		Employee.get($routeParams.employee_id)
			.success(function(data)	{
				vm.employeeData = data;
			});

			//	function to save the employee
		vm.saveEmployee = function() {
			vm.processing = true;
			vm.message = '';

		//	call the employeeService function to update
			Employee.update($routeParams.employee_id, vm.employeeData)
				.success(function(data) {
					vm.processing = false;

					//clear the form
					vm.employeeData = {};

					//bind the message from API to vm.message
					vm.message = data.message;
				});
		};

	});
