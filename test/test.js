var Log = require('../lib/log');
var Utils = require('nuage-utils');
var fs = require('fs');
var temp = require('temp');

temp.track();

var translation = {
	lang : {
		"_dateFormat" : "dd/mm/yyyy",
		"_timeFormat" : "HH:MM:ss",
		"_timeDateFormat" : "dd/mm/yyyy HH:MM:ss",
	},
	I : function(word){
		return (this.lang[word]) ? this.lang[word] : word;
	}
};

Utils.load(translation);

exports.logfileAndLevel = function(test){
	test.expect(1);
	temp.open('nuage-log-test', function(err, info) {
		if (!err) {
			Log.load({level:'info',logfile:info.path});
			var startDate = new Date();
			Log.debug("test");
			Log.info("test");
			Log.notice("test");
			Log.warn("test");
			Log.error("test");
			setTimeout(function(){
				var logged = fs.readFileSync(info.path,{encoding:"utf8"});
				logged = logged.split("\n");
				var popped;
				if(popped = logged.pop() != ""){
					test.ok(false,'The last line ine the file should be blank. Got : '+popped);
					test.done();
				}
				logged = JSON.parse('['+logged.join(',')+']');
				if(logged.length == 3){
					for(var i = 0; i < logged.length;i++){
						var line = logged[i];
						var props = [];
						for(j in line){
							props.push(j);
						}
						if(props.length == 3){
							if(props.indexOf('level') == -1 ||
								props.indexOf('message') == -1 ||
								props.indexOf('timestamp') == -1
							){
								test.ok(false,'A number != 3 properties found in line. Should be level, message, timestamp. Got : '+props.join(", "));
								test.done();
								break;
							}
						}else{
							test.ok(false,'A number != 3 properties found in line. Should be level, message, timestamp. Got : '+props.join(", "));
							test.done();
							break;
						}

						if(line.message != "test"){
							test.ok(false,'A wrong message was written in logfile. Expecting "test". Got : "'+line.message+'"');
							test.done();
							break;
						}
					}
					test.ok(true);
					test.done();
				}else{
					test.ok(false,'A number != 3 lines where written. Should be notice, warn, error. Got : '+JSON.stringify(logged,null, 4));
					test.done();
				}
			},1000);
		}else{
			test.ok(false, "Cannot create a temporary file")
			test.done();
		}
	});
};