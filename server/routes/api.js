/* Express Routes */
var User = require('../models/user');
var Employee = require('../models/employee');
var Image = require('../models/image');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var config = require('../../config');

//super secret for creating token
var superSecret = config.secret;

module.exports = function(app,express){

//get an instance of the express router
var apiRouter = express.Router();

//===============================  Token Middleware  =========================
// For /user request
// Checks for token for /api routes
apiRouter.use("/",function(req,res,next){
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') ||req.headers['x-access-token'];

	//decode token
	if(token){
		//verifies secret and checks exp
		jwt.verify(token,superSecret,function(err,decoded){
			if(err){
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			}else{
				//save to request for use in other routes
				req.decoded = decoded;
				next();// this make sure we go to the next routes and dont stop here
			}
		});
	}else{
		// if there is no token
		//return an HTTP response of 403 (access forbidden) and an error message
		return res.status(403).send({
			success:false,
			message: 'No token provided.'
		});
	}
});

//===================================  /users  ================================
apiRouter.route('/users')
	// get all the users (accessed at GET http://localhost::3000/api/users)
	.get(function(req, res) {
			User.find(function(err,users){
				if(err) res.send(err);
				//res: return list of users
					res.json(users);
					});
		});

//=====================================  /me  ==================================
apiRouter.route('/me')
		.get(function(req,res){
		res.send(req.decoded);
	});

//===============================  /users/:user_id  ============================
apiRouter.route('/users/:user_id')
	//get the user with that id
	//(accessed at GET http://localhost:3000/api/users/:user_id)
	.get(function(req,res){
		User.findById(req.params.user_id, function(err,user){
			if(err) res.send(err);
			//return that user
			res.json(user);
		});
	})
	//update the user with this id
	//(accessed at PUT http://localhost:3000/api/users/:user_id)
	.put(function(req,res){
			//use our user model to find the user we want
			User.findById(req.params.user_id,function(err,user)
			{
				if(err) res.send(err);
				//update the users info only if its new
				if(req.body.name) user.name = req.body.name;
				if(req.body.username) user.username = req.body.username;
				if(req.body.password) user.password = req.body.password;
				//save the user
				var self = this;
				user.save(function(err){
					if(err) res.send(err);
					//return a message
					else{
						var token = jwt.sign({
							name: self.name,
							username: self.username
						}, superSecret, {expiresIn: 86400}); //24 hrs
						res.json({
							name: user.name,
							success: true,
							message:'User updated!',
							token: token
						});	
					}
				});
			});
		})

	.delete(function(req, res){
		User.remove({
				_id:req.params.user_id
			}, function(err,user){
				if(err) return res.send(err);
				res.json({message: 'Successfully deleted'});
		});
	});



//Employee API's

//===================================  /employee  ================================
apiRouter.route('/employees')
	// get all the employees (accessed at GET http://localhost::3000/api/employees)
	.get(function(req, res) {
			Employee.find({}).populate('image').exec(function(err,employees){
				if(err) res.send(err);
				//res: return list of employee
			    res.json(employees);
			});
	})
	.post(function(req, res) {
	    //create a new instance of the Employee model
		var employee = new Employee();

		//set the users information (comes from the request)
		employee.name = req.body.name;
		employee.address = req.body.address;
		employee.email = req.body.email;
		employee.dob = req.body.dob;
		employee.phone = req.body.phone;
		employee.image = req.body.image;

		//save the employee and check for errors
		employee.save(function(err){
			if (err){
				//duplicate entry
				if(err.code == 11000)
					return res.json({success: false,
						message: 'A employee with that\ employeename already exists.'});
				else
					return res.send(err);
			}
			res.json({ message:'employee created!' });
		});
	});


	apiRouter.route('/employees/upload')
		.post(function(req, res) {
		    var form = new formidable.IncomingForm();
		     form.parse(req)
		    form.on('fileBegin', function (name, file){
		    	console.log(config.rootDir)
		        file.path = config.rootDir +  file.name;
		    });

		    form.on('file', function (name, file){
		        let imgPath = file.path;
		    	let imageType = file.type;
				let img = new Image();
				img.imageName = file.name;
				img.image.data = fs.readFileSync(imgPath);
				img.image.contentType = imageType;
				img.save(function (err, image) {
				   if (err) throw err;
				    fs.unlink(imgPath, (err) => {
                       if (err) throw err;
                        console.log('successfully deleted file');
                    });
				    res.json(image);
			    });
		    });
         

	});


//===============================  /employees/:id  ============================
apiRouter.route('/employees/:id')
	//get the employee with that id
	//(accessed at GET http://localhost:3000/api/employees/:id)
	.get(function(req,res){
		Employee.findById(req.params.id, function(err,employee){
			if(err) res.send(err);
			//return that employee
			res.json(employee);
		});
	})
	//update the employee with this id
	//(accessed at PUT http://localhost:3000/api/employee/:id)
	.put(function(req,res){
			//use our employee model to find the employee we want
		Employee.findById(req.params.id,function(err,employee)
		{
			if(err) res.send(err);
			//update the employee info only if its new
			if(req.body.name) employee.name = req.body.name;
			if(req.body.email) employee.email = req.body.email;
			if(req.body.address) employee.address = req.body.address;
			if(req.body.dob) employee.dob = req.body.dob;
			if(req.body.phone) employee.phone = req.body.phone;
			if(req.body.image) employee.image = req.body.image;
			//save the employee
			var self = this;
			employee.save(function(err){
				if(err) res.send(err);
				//return a message
				else{
					res.json({
						name: employee.name,
						success: true,
						message:'Employee updated!',
					});	
				}
			});
		});
	})

	.delete(function(req, res){
		Employee.remove({
				_id:req.params.id
			}, function(err,employee){
				if(err) return res.send(err);
				res.json({message: 'Successfully deleted'});
		});
	});

	return apiRouter;
};