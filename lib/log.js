var Winston = require('winston');
var Utils = require('nuage-utils');
var Path = require('path');

var Log = function(){};

Log.prototype = {
	_log : false,
	load : function(conf){

		if(!this._log){

			if(!conf){
				conf = {};
			}

			var formatedDate = function(){
				return Utils.formatTimeDate(new Date());
			}

			this._log = new (Winston.Logger)({
				transports: [
					new (Winston.transports.Console)({
						colorize:true,
						level:(conf.level) ? conf.level : 'info',
						timestamp:formatedDate
					}),
					new (Winston.transports.File)({
						filename: (conf.logfile) ? conf.logfile : Path.dirname(require.main.filename)+'/logs/app.log',
						level:(conf.level) ? conf.level : 'info',
						timestamp:formatedDate
					})
				],
				levels: {
					debug: 0,
					info: 1,
					notice: 2,
					warn: 3,
					error: 4
				}
			});
			Winston.addColors({
				debug: 'cyan',
				info: 'grey',
				notice: 'magenta',
				warn: 'yellow',
				error: 'red'
			});
		}
		return this;
	},
	debug : function(message){
		if(this._log)
			this._log.debug(message);
	},
	info : function(message){
		if(this._log)
			this._log.info(message);
	},
	notice : function(message){
		if(this._log)
			this._log.notice(message);
	},
	warn : function(message){
		if(this._log)
			this._log.warn(message);
	},
	error : function(message){
		if(this._log)
			this._log.error(message);
	}
}

module.exports = exports = new Log();
