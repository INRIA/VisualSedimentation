/**
 * StreamPlayer 0.1
 * Romain Vuillemot
 */
var StreamPlayer = function(wrapper, options) {
	if(typeof(wrapper) == 'string') {
		wrapper = document.getElementById(wrapper);
	}
	if(!wrapper) {
		return;
	}
	var handle = wrapper.getElementsByTagName('div')[0];
	this.init(wrapper, handle, options || {});
	this.setup();
};

StreamPlayer.prototype.init = function(wrapper, handle, options) {
	this.callback = options.callback || null;	
	this.displayUpdate = options.displayUpdate || null;
	this.playCallback = options.playCallback || null;
	this.pauseCallback = options.pauseCallback || null;
	this.stopCallback = options.stopCallback || null;
	this.updateCallback = options.updateCallback || null;	
	this.nextCallback = options.nextCallback || null;		
	this.previousCallback = options.previousCallback || null;		
	this.ffCallback = options.ffCallback || null;
	this.fbCallback = options.fbCallback || null;			
	this.refreshCallback = options.refreshCallback || this.refreshCallback;			

	this.wrapper = wrapper;
	this.handle = handle;
	this.options = options;
	
	this.refreshIntervalId = null;
	this.buffer_count = 0;
	this.buffered_data = [];
	this.current_value = null;
	
	this.auto_start = this.getOption('auto_start', false);
	this.updates_freq = this.getOption('updates_freq', false);	
	this.is_buffering = this.getOption('is_buffering', false);
	this.current_speed = this.getOption('current_speed', 1);	
	this.buffered_pause = true;	
	
	this.addListeners();

	this.MAX_SPEED = 4;
	this.MIN_SPEED = 1;

	self = this;
}
	
StreamPlayer.prototype.addListeners = function() {

	this.wrapper.onclick = function(e) {

		if(e.target.className.search(/(^|\s)play(\s|$)/) != -1 && typeof(self.playCallback) == 'function') {
			self.playCallback(self);
			e.target.className = e.target.className.replace(/\s?play/g, '');
			e.target.className += " pause";
			self.is_buffering = false;
			self.update();
	
		} else if(e.target.className.search(/(^|\s)pause(\s|$)/) != -1 && typeof(self.pauseCallback) == 'function') {
			self.pauseCallback();
			e.target.className = e.target.className.replace(/\s?pause/g, '');
			e.target.className += " play";

			if(!self.buffered_pause) 
				clearInterval(self.refreshIntervalId);
			else
				self.is_buffering = true;
				
		} else if(e.target.className.search(/(^|\s)stop(\s|$)/) != -1 && typeof(self.stopCallback) == 'function') {
			self.stopCallback(self);

		} else if(e.target.className.search(/(^|\s)next(\s|$)/) != -1 && typeof(self.nextCallback) == 'function') {
			
			if(self.buffered_data.length>0) {
				// play next data in the buffer
				console.log("has buffered data");
			}

			self.nextCallback(self);

		} else if(e.target.className.search(/(^|\s)prev(\s|$)/) != -1 && typeof(self.previousCallback) == 'function') {

			// TODO : buffer the last data and remove it!
			// Buffer the list of display updates?

			self.previousCallback(self);

		} else if(e.target.className.search(/(^|\s)ff(\s|$)/) != -1 && typeof(self.ffCallback) == 'function') {
			
			if(self.current_speed<self.MAX_SPEED) {
				e.target.className.replace(/\s?disabled/g, '');
				self.current_speed++;
				self.ffCallback();
				document.getElementsByClassName("fb")[0].className = document.getElementsByClassName("fb")[0].className.replace(/\s?disabled/g, '');
				document.getElementsByClassName("fb")[0].disabled = false;
			}

			if(self.current_speed==self.MAX_SPEED) {
				if(e.target.className.search(/(^|\s)disabled(\s|$)/) == -1) {
					e.target.className += " disabled";
					e.target.disabled = true;
				}
			}

		} else if(e.target.className.search(/(^|\s)fb(\s|$)/) != -1 && typeof(self.fbCallback) == 'function') {
			
			if(self.current_speed>self.MIN_SPEED) {
				e.target.className.replace(/\s?disabled/g, '');
				self.current_speed--;
				self.fbCallback();
				document.getElementsByClassName("ff")[0].className = document.getElementsByClassName("ff")[0].className.replace(/\s?disabled/g, '');
				document.getElementsByClassName("ff")[0].disabled = false;
			} 

			if(self.current_speed==self.MIN_SPEED) {
				if(e.target.className.search(/(^|\s)disabled(\s|$)/) == -1) {
					e.target.className += " disabled";
					e.target.disabled = true;
				}
			}
		}
		self.refreshCallback(self);
	}
}

StreamPlayer.prototype.setup = function() {
	this.addListeners();
	this.update();

	// TODO: check if fb/ff are disabled and do it if not!
	if((self.current_speed==self.MIN_SPEED) && (document.getElementsByClassName("fb")[0].className.search(/(^|\s)disabled(\s|$)/) == -1)) {
		document.getElementsByClassName("fb")[0].className += " disabled";
		document.getElementsByClassName("fb")[0].disabled = false;
	}
}

StreamPlayer.prototype.getOption = function(name, defaultValue) {
	return this.options[name] !== undefined ? this.options[name] : defaultValue;
}

StreamPlayer.prototype.update = function() {
	var self = this;
	if(this.auto_start && typeof(this.updateCallback) == 'function' && this.refreshIntervalId==null) {
		this.refreshIntervalId = setInterval(function () {return self.updateCallback(self);}, this.updates_freq);
	}	
}

StreamPlayer.prototype.refreshCallback = function() {
	return;
}
