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

var constants = require("./constants");
var feed = require("./feed-read");

var controller = function() {
	
	return {
		play: function() {
			this.handler.state = constants.states.PLAY_MODE;
			
			var playBehavior = 'REPLACE_ALL';

			this.attributes['playOrder'] = 0
		
			var self = this;

            feed(constants.rssFeedUrl, function (error, articles) {
		
                if (error) {
                    console.log("Error loading RSS feed");
                    return;
                }
        
				var targetIndex = articles.length - (1 + self.attributes['index']);
				var lastArticle = articles[targetIndex];
				
				console.log("Loading podcast entry: " + targetIndex);
                var mediaUrl = lastArticle.enclosure.url.replace("http://", "https://");
        
                console.log("author: " + lastArticle.author + "\nTitle: " + lastArticle.title + "\nURL: " + mediaUrl);
        
                self.attributes['playOrder'] = 0
                
                self.attributes['offsetInMilliseconds'] = 0;
                self.attributes['loop'] = true;
                self.attributes['shuffle'] = false;
                self.attributes['playbackIndexChanged'] = true;
                self.attributes['audioStream'] = {
                    title: lastArticle.title.replace(" & ", " &amp; ") + " by " + lastArticle.author,
                    url: mediaUrl
                };
                
                var token = self.attributes["audioStream"].title;
			
				var offsetInMilliseconds = self.attributes['offsetInMilliseconds'];
			
				if (canThrowCard.call(self)) {
					var cardTitle = 'Playing ' + self.attributes["audioStream"].title;
					var cardContent = 'Playing ' + self.attributes["audioStream"].title;
					self.response.cardRenderer(cardTitle, cardContent, null);
				}
				console.log("====== Starting Playback ======");
				self.response.speak(cardTitle).audioPlayerPlay(playBehavior, self.attributes["audioStream"].url, token, null, offsetInMilliseconds);
				self.emit(':responseReady');
            });   			
		},
		
		stop: function() {
			this.response.audioPlayerStop();
			this.emit(':responseReady');
		},
		
		playNext: function() {
			this.attributes['index'] += 1;
            this.attributes['offsetInMilliseconds'] = 0;
            this.attributes['playbackIndexChanged'] = true;

            controller.play.call(this);
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