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

var controller = function() {
	
	return {
		play: function() {
			this.handler.state = "_PLAY_MODE";
			
			console.log("Checking state = " + this.handler.state);
			
			var token = this.attributes["audioStream"].title;
			var playBehavior = 'REPLACE_ALL';
			var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];
			this.attributes['playbackIndexChanged'] = true;
			
			if (canThrowCard.call(this)) {
                var cardTitle = 'Playing ' + this.attributes["audioStream"].title;
                var cardContent = 'Playing ' + this.attributes["audioStream"].title;
                this.response.cardRenderer(cardTitle, cardContent, null);
			}
			
			this.response.speak(cardTitle).audioPlayerPlay(playBehavior, this.attributes["audioStream"].url, token, null, offsetInMilliseconds);
			this.emit(':responseReady');
		},
		
		stop: function() {
			this.response.audioPlayerStop();
			this.emit(':responseReady');
		},
		
		playNext: function() {
			var message = 'Playing the next sermon is not supported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		playPrevious: function() {
			var message = 'Playing the previous sermon is not supported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		shuffleOn: function() {
			var message = 'Shuffle is not suported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		shuffleOff: function() {
			var message = 'Shuffle is not suported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		loopOn: function() {
			var message = 'Looping is not suported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		loopOff: function() {
			var message = 'Looping is not suported yet';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		restart: function() {
			this.attributes['offsetInMilliseconds'] = 0;
			controller.play.call(this);
		}
	}
	
}();

function canThrowCard() {

    if (this.event.request.type === 'IntentRequest' && this.attributes['playbackIndexChanged']) {
        this.attributes['playbackIndexChanged'] = false;
        return true;
    } else {
        return false;
    }
}

module.exports = controller;