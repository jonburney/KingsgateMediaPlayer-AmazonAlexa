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

var Alexa 	   = require("alexa-sdk");
var controller = require("./controller");
var constants  = require('./constants');
var logger     = require('./logger');

var stateHandlers = {
	
	startModeIntentHandlers : Alexa.CreateStateHandler(constants.states.START_MODE, {
		
		'Unhandled': function() {
			logger.increment("Unhandled (" + constants.states.START_MODE + ")");
			logger.increment("Unhandled");
			
			console.log("Unable to map to intent via startModeIntentHandlers. Handler state = " + this.handler.state);
			console.log(this.event.request);

			var message = "Sorry, I didn't understand your request. Please say, play the latest sermon to listen to the latest sermon.";
			this.response.speak(message).listen(message);
			this.emit(":responseReady");
		},
		
		'LaunchRequest' : function () {
			logger.increment("LaunchRequest (" + constants.states.START_MODE + ")");
			logger.increment("LaunchRequest");

            this.attributes['index'] = 0;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['loop'] = true;
            this.attributes['shuffle'] = false;
            this.attributes['playbackIndexChanged'] = true;
            this.attributes['playQueue'] = [];
            this.handler.state = constants.states.START_MODE;

            var message = 'Welcome to the Kingsgate Community Church sermon player. You can say, play the latest sermon to listen to the latest sermon.';
            var reprompt = 'You can say, play the latest sermon to listen to the latest sermon.';

            this.response.speak(message).listen(reprompt);
            this.emit(':responseReady');
		},
		
		'PlayLatestSermon' : function () {
			logger.increment("PlayLatestSermon (" + constants.states.START_MODE + ")");
			logger.increment("PlayLatestSermon");

            this.attributes['index'] = 0;
            this.handler.state = constants.states.START_MODE;
			controller.play.call(this);
		}
		
	}),
	
	playModeIntentHandlers : Alexa.CreateStateHandler(constants.states.PLAY_MODE, {
		'Unhandled': function() {
			logger.increment("Unhandled (" + constants.states.PLAY_MODE + ")");
			logger.increment("Unhandled");

			console.log("Unable to map to intent via playModeIntentHandlers. Handler state = " + this.handler.state);
			console.log(this.event.request);
			
			var message = "Sorry, I didn't understand your request. Please say, play the latest sermon to listen to the latest sermon.";
			this.response.speak(message).listen(message);
			this.emit(":responseReady");
		},
		'PlayLatestSermon' : function () {
			logger.increment("PlayLatestSermon (" + constants.states.PLAY_MODE + ")");
			logger.increment("PlayLatestSermon");

            this.attributes['index'] = 0;
			controller.play.call(this);
		},
		'SermonInfoIntent' : function() {
			logger.increment("SermonInfoIntent (" + constants.states.PLAY_MODE + ")");
			logger.increment("SermonInfoIntent");

			var currentlyPlaying = this.attributes['audioStream'];
			var message = "This is " + currentlyPlaying.title + " from " + currentlyPlaying.publishDate;
			this.emit(":tell", message);
		},
		'PlaybackStarted' : function () {
			logger.increment("PlaybackStarted (" + constants.states.PLAY_MODE + ")");
			logger.increment("PlaybackStarted");

			this.attributes['playbackFinished'] = false;
			this.emit(':saveState', true);
		},
		'PlaybackFinished' : function () {
			logger.increment("PlaybackFinished (" + constants.states.PLAY_MODE + ")");
			logger.increment("PlaybackFinished");

			this.attributes['playbackFinished'] = true;
			this.attributes['enqueuedToken'] = false;
			this.emit(':saveState', true);
		},
		'PlaybackStopped' : function () {      
			logger.increment("PlaybackStopped (" + constants.states.PLAY_MODE + ")");
			logger.increment("PlaybackStopped");

			this.attributes['offsetInMilliseconds'] = this.event.request.offsetInMilliseconds;
			this.emit(':saveState', true);
		},
		'AMAZON.NextIntent' : function () { 
			logger.increment("AMAZON.NextIntent" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.NextIntent");

			controller.playNext.call(this) 
		},
        'AMAZON.PreviousIntent' : function () { 
			logger.increment("AMAZON.PreviousIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.PreviousIntent");

			controller.playPrevious.call(this) 
		},
        'AMAZON.PauseIntent' : function () { 
			logger.increment("AMAZON.PauseIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.PauseIntent");

			controller.pause.call(this) 
		},
        'AMAZON.StopIntent' : function () { 
			logger.increment("AMAZON.StopIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.StopIntent");

			controller.stop.call(this) 
		},
        'AMAZON.CancelIntent' : function () { 
			logger.increment("AMAZON.CancelIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.CancelIntent");

			controller.stop.call(this) 
		},
        'AMAZON.ResumeIntent' : function () { 
			logger.increment("AMAZON.ResumeIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.ResumeIntent");

			controller.resume.call(this) 
		},
        'AMAZON.LoopOnIntent' : function () { 
			logger.increment("AMAZON.LoopOnIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.LoopOnIntent");

			controller.loopOn.call(this) 
		},
        'AMAZON.LoopOffIntent' : function () { 
			logger.increment("AMAZON.LoopOffIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.LoopOffIntent");

			controller.loopOff.call(this) 
		},
        'AMAZON.ShuffleOnIntent' : function () { 
			logger.increment("AMAZON.ShuffleOnIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.ShuffleOnIntent");

			controller.shuffleOn.call(this) 
		},
        'AMAZON.ShuffleOffIntent' : function () { 
			logger.increment("AMAZON.ShuffleOffIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.ShuffleOffIntent");

			controller.shuffleOff.call(this) 
		},
		'AMAZON.StartOverIntent' : function () { 
			logger.increment("AMAZON.StartOverIntent + (" + constants.states.PLAY_MODE + ")");
			logger.increment("AMAZON.StartOverIntent");

			controller.restart.call(this)
		}
	})

};

module.exports = stateHandlers;