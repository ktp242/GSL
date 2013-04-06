/**
Graveyard Social -- a social lobby for zombies
by Kang Peng (ktp242 on Github)

Version: 1.0
Start date: 20130404

working diary

*20130404
The very beginning. Build my own site "GSL."
This is for the routes. (routes/index.js)

*20130405
The function in “dialogueQuery.exec” should be 
one defined in the this function.
Since dialogueQuery is based on dialogueModel, 
so the function should be “zombie” as defined at 
“dialogueQuery.exec.” 
After I changed the name then I could launch to
localhost:5000/data/zombie

I changed the url in exports.dialogue_log
from remote to localhost:5000, so I can launch to 
dialogue_log.

Removed "templaData" form 
"res.redirect('dialogue_log', templateData)" and 
it can launch to /dialogue_log.html now.

Don't know why. Perhpas because the "templateData" 
here would fight with the" templateData" in 
"dialogue_log." 

 */


var moment = require("moment"); // date manipulation library
var dialogueModel = require("../models/zombie.js"); //db model
var request = require('request'); //request JSON


/*
	GET /index
*/

exports.index = function(req, res){

  console.log("main page requested");
  res.render('index', { title: 'Graveyard Social' });

}


/*
	POST /create
*/

exports.createDialogue = function(req, res) {
	
	console.log("received form submission");
	console.log(req.body);

	// accept form post data
	var newDialogue = new dialogueModel({
		contents : req.body.contents,
		slug : req.body.contents.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')
	});

	
	// save the newDialogue to the database
	newDialogue.save(function(err){

		if (err) {
			console.error("Error on saving new dialogue");
			console.error(err); // log out to Terminal all errors

			var templateData = {
				page_title : "Let's make some noise!",
				errors : err.errors, 
				zombie : req.body
			};

			res.render('index.html', templateData);
			return res.send("There was an error when creating a new dialogue");

		} else {
			console.log("Created a new dialogue!");
			console.log(newDialogue);
			// redirect to /dialogue_log.html
			res.redirect('dialogue_log')
		}
	});
};


/*
	GET /dialogue_log
*/


// export data from API
exports.dialogue_log = function(req, res) {
    
    console.log("It is now executing dialogue_log.");

    var dialogue_log = 'http://gsl.herokuapp.com/data/zombie';
    //var dialogue_log = 'http://localhost:5000/data/zombie';

    // make a request to dialogue_log
    request.get(dialogue_log, function(error, response, data){

        if (error){
            res.send("There was an error requesting dialogue_log.");
	    return;
        }

        // convert data JSON string to native JS object
        var apiData = JSON.parse(data);
	
	console.log(apiData);
	console.log("***********");

        // if apiData has property 'status == OK' then successful api request
        if (apiData.status == 'OK') {

            // prepare template data for dialogue_log.html template
            var templateData = {
                dialogues : apiData.dialogue,
                rawJSON : data, 
                remote_url : dialogue_log
            }

            return res.render('dialogue_log', templateData);
        }   
    })
}



/*
	GET data from DB as JSON
*/

exports.data_all = function(req, res) {

	dialogueQuery = dialogueModel.find({}); // query for all dialogues
	dialogueQuery.sort('contents');

	// display the fields from dialogue data
	dialogueQuery.select('contents');

	dialogueQuery.exec(function(err, zombie){
		// prepare data for JSON
		var jsonData = {
			status : 'OK',
			dialogue : zombie
		}

		res.json(jsonData);
	});

}



/*
	GET the data from JSON and make it detailed
*/


exports.data_detail = function(req, res) {

	console.log("detail page requested for " + req.params.dialogue_id);

	//get the requested astronaut by the param on the url :dialogue_id
	var dialogue_id = req.params.dialogue_id;

	// query the database for dialogue
	var dialogueQuery = astronautModel.findOne({slug:dialogue_id});
	dialogueQuery.exec(function(err, currentDialogue){

		if (err) {
			return res.status(500).send("There was an error on the dialogue query");
		}

		if (currentDialogue == null) {
			return res.status(404).render('404.html');
		}

		//prepare JSON data for response
		var jsonData = {
			dialogue : currentDialogue,
			status : 'OK'
		}

		// return JSON to requestor
		res.json(jsonData);

	}); // end of .findOne query

}