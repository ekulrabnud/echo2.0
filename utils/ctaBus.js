var CTA = require('cta-bus-tracker');

function parseTime(time){
	
	var now = Date.now() 
	//Convert arrival to UTC 
	var arrival = Date.parse(time) + 18000000
	var waitTime = ((arrival - now) / 1000) / 60

	return Math.round(waitTime,0)
}

module.exports = function (apiKey,topCount,stopIds) {

    var bustracker = CTA(apiKey);

	options ={
		topCount:topCount || 2,
		stopIds:stopIds || [11713,9592]
	}

	console.log(options)
   
	return {
		getBuses:function(cb){

			bustracker.predictionsByStop(options,function(err,buses){

				if (err) return cb(err);
				
				buildReply(buses);
			})

			function buildReply(buses){

				if (!buses) return cb(null, "There are no buses at the moment");

				var reply = [];

				if (buses.length > 1){

						for (bus in buses){

							var minutes = parseTime(buses[bus].prdtm)
							var direction = buses[bus].rtdir
							var stopName = buses[bus].stpnm.split(' ')[0]
							var time = Date.now()
							reply += `In ${minutes} minutes there will be a ${direction} bus at ${stopName}`
						}

						cb(null,reply.toString())
				} else {
				//handels buses object when there is only one bus. I am sure there is a nicer wat of doing this
						var minutes = parseTime(buses.prdtm)
						var direction = buses.rtdir
						var stopName = buses.stpnm.split(' ')[0]
						var time = Date.now()

						reply += `The time is ${time} In ${minutes} minutes there will be a ${direction} bus at ${stopName}`

						cb(null,reply.toString())
			
				}
			}
		}
	}
}
		

			
			

