var x= document.querySelector("#display");
var num1=document.querySelector(".confirm");
var bttn=document.querySelector("#conjuring");



var college=[{

	n:"IIT Bombay",
	cutoff:250

},{
	n:"IIT Delhi",
	cutoff:240

},{

	n:"NITK Surathkal",
	cutoff:230

},{

	n:"IIT Kanpur",
	cutoff:212

},{

	n:"IIT GandhiNagar",
	cutoff:200

}

];


bttn.addEventListener("click",function(){

	
	var num=Number(num1.value);
		
	for(var i=0;i<college.length;i++)
	{
		var res=college[i].n;

		if(college[i].cutoff<num)
		{	
			    var li = document.createElement('li');
    			li.appendChild(document.createTextNode(res));
    			x.appendChild(li);
			
		}
	}

	
});


