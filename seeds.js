var mongoose = require("mongoose");
var College = require("./models/college");
var Comment   = require("./models/comment");

var data=[
	{	
		name:"NITK Surathkal",
		image:"https://d1vdjc70h9nzd9.cloudfront.net/media/campaign/156000/156284/image/5e202a492a326.jpeg",
		description:"Amongst one of the best College in India"
	},{
		name:"NIT Trichy",
		image:"https://i.pinimg.com/originals/a0/6e/19/a06e19fe5db35fa18ea89a5df9cc6d07.jpg",
		description:"South Asia's Best College"

	},{
		name:"MIT Cambridge",
		image:"https://www.sciencemag.org/sites/default/files/styles/article_main_large/public/MIT_16x9_0.jpg?itok=etTY7iog",
		description:"Neil's fav college"
	}
];


function seedDB(){
	// remove all colleges
	College.remove({},function(err){

		if(err)
		{
			console.log(err);
		}else{

			console.log("removed");
			
			data.forEach(function(seed)
			{
				College.create(seed,function(err,clg){

					if(err){

						console.log(err);
					}else{

						console.log("added");
                        //create a comment
                        	
                        	Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "XYZ"
                            
                            }, function(err, comment){
                                
                                if(err){
                                    console.log(err);
                                } else {
                                    clg.comments.push(comment);
                                    clg.save();
                                    console.log("Created new comment");
                                }
                            });
					}
				});
			});
		}	

	});
}

module.exports=seedDB;