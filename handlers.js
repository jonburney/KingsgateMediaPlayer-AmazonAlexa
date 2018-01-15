/*
 * Kingsgate Media Player
 * Copyright (C) 2016 Jon Burney (jon@version7.co.uk)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
'use strict';

var Alexa = require("alexa-sdk");
var controller = require("./controller");
var constants = require('./constants');

var stateHandlers = {
	
	startModeIntentHandlers : Alexa.CreateStateHandler(constants.states.START_MODE, {
		
		'Unhandled': function() {
			console.log("Unable to map to intent via startModeIntentHandlers. Handler state = " + this.handler.state);
			
			var message = "Sorry, I didn't understand your request. Please say, play the latest sermon to listen to the latest sermon.";
			this.response.speak(message).listen(message);
			this.emit(":responseReady");
		},
		
		'LaunchRequest' : function () {
            this.attributes['playOrder'] = Array.apply(null, {length: audioData.length}).map(Number.call, Number);
            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['loop'] = true;
            this.attributes['shuffle'] = false;
            this.attributes['playbackIndexChanged'] = true;
            this.handler.state = constants.states.START_MODE;

            var message = 'Welcome to the Kingsgate Community Church sermon player. You can say, play the latest sermon to listen to the latest sermon.';
            var reprompt = 'You can say, play the latest sermon to listen to the latest sermon.';

            this.response.speak(message).listen(reprompt);
            this.emit(':responseReady');
		},
		
		'PlayLatestSermon' : function () {
            this.attributes['index'] = 0;
            this.handler.state = constants.states.START_MODE;
			controller.play.call(this);
		}
		
	}),
	
	playModeIntentHandlers : Alexa.CreateStateHandler(constants.states.PLAY_MODE, {
		'Unhandled': function() {
			console.log("Unable to map to intent via playModeIntentHandlers. Handler state = " + this.handler.state);
			
			var message = "Sorry, I didn't understand your request. Please say, play the latest sermon to listen to the latest sermon.";
			this.response.speak(message).listen(message);
			this.emit(":responseReady");
		},
		'PlayLatestSermon' : function () {
            this.attributes['index'] = 0;
			controller.play.call(this);
		},
		'SermonInfoIntent' : function() {
			var message = "Currently playing " + this.attributes['audioStream'].title + " from Kingsgate Community Church";
			this.response.speak(message).listen(message);
			this.emit(":responseReady");
		},
		'PlaybackStarted' : function () {
			this.attributes['playbackFinished'] = false;
			this.emit(':saveState', true);
		},
		'PlaybackFinished' : function () {
			this.attributes['playbackFinished'] = true;
			this.attributes['enqueuedToken'] = false;
			this.emit(':saveState', true);
		},
		'PlaybackStopped' : function () {        
			this.attributes['offsetInMilliseconds'] = this.event.request.offsetInMilliseconds;
			this.emit(':saveState', true);
		},
		'AMAZON.NextIntent' : function () { 
			controller.playNext.call(this) 
		},
        'AMAZON.PreviousIntent' : function () { 
			controller.playPrevious.call(this) 
		},
        'AMAZON.PauseIntent' : function () { 
			controller.stop.call(this) 
		},
        'AMAZON.StopIntent' : function () { 
			controller.stop.call(this) 
		},
        'AMAZON.CancelIntent' : function () { 
			controller.stop.call(this) 
		},
        'AMAZON.ResumeIntent' : function () { 
			controller.play.call(this) 
		},
        'AMAZON.LoopOnIntent' : function () { 
			controller.loopOn.call(this) 
		},
        'AMAZON.LoopOffIntent' : function () { 
			controller.loopOff.call(this) 
		},
        'AMAZON.ShuffleOnIntent' : function () { 
			controller.shuffleOn.call(this) 
		},
        'AMAZON.ShuffleOffIntent' : function () { 
			controller.shuffleOff.call(this) 
		},
		'AMAZON.StartOverIntent' : function () { 
			controller.restart.call(this) 
		}
	})

};

module.exports = stateHandlers;