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

var constants  = require("./constants");
var feed 	   = require("./feed-read");
var dateFormat = require("dateformat");
var logger     = require('./logger');

var controller = function() {
	
	return {
		play: function() {
			this.handler.state = constants.states.PLAY_MODE;
			
			var playBehavior = 'REPLACE_ALL';
			var self = this;

            feed(constants.rssFeedUrl, function (error, articles, processingStartTime) {
		
                if (error) {
					logger.error("RssFeedError");
                    console.log("Error loading RSS feed", error);
                    return;
				}
				
				var processingElapsedTime = Date.now() - processingStartTime;
    			logger.timer('FeedProcessingTime', processingElapsedTime);
		
				console.log("Play queue = " + self.attributes['playQueue']);
				console.log("Stream count = " + articles.length);
				self.attributes['streamCount'] = articles.length;
				self.attributes['maxIndex'] = articles.length - 1;

				if (self.attributes['index'] == 0) {
					self.attributes['index'] = (articles.length - 1);
				}

				var lastArticle = articles[self.attributes['index']];

				console.log("Loading podcast entry: " + self.attributes['index']);
                var mediaUrl = lastArticle.enclosure.url.replace("http://", "https://");
        
                console.log("author: " + lastArticle.author + "\nTitle: " + lastArticle.title + "\nURL: " + mediaUrl);
                
                self.attributes['offsetInMilliseconds'] = 0;
                self.attributes['loop'] = true;                
                self.attributes['playbackIndexChanged'] = true;
                self.attributes['audioStream'] = {
                    title: lastArticle.title.replace(" & ", " &amp; ") + " by " + lastArticle.author,
					url: mediaUrl,
					publishDate: dateFormat(Date.parse(lastArticle.published), "dddd, mmmm dS, yyyy")
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
		
		pause: function() {
			console.log("====== Pausing Playback ======");
			console.log("Pausing offset at: " + this.attributes['offsetInMilliseconds']);

			this.response.audioPlayerStop();
			this.emit(':responseReady');
		},

		resume: function() {
			var playBehavior = 'REPLACE_ALL';
			var token = this.attributes["audioStream"].title;
			var offsetInMilliseconds = this.attributes['offsetInMilliseconds'];
		
			console.log("====== Resuming Playback ======");
			console.log("Resuming at offset: " + offsetInMilliseconds);
			var cardTitle = 'Resuming ' + this.attributes["audioStream"].title;
			this.response.speak(cardTitle).audioPlayerPlay(playBehavior, this.attributes["audioStream"].url, token, null, offsetInMilliseconds);
			this.emit(':responseReady'); 
		},

		stop: function() {
			this.response.audioPlayerStop();
			this.emit(':responseReady');
		},
		
		playNext: function() {

			var maxIndex = this.attributes['maxIndex'];

			if (this.attributes['shuffle']) {
				this.attributes['index'] = Math.floor(Math.random() * Math.floor(maxIndex));
				this.attributes['offsetInMilliseconds'] = 0;
				this.attributes['playbackIndexChanged'] = true;
				
				if (!this.attributes['playQueue']) {
					this.attributes['playQueue'] = [];
				}
				
				this.attributes['playQueue'].push(this.attributes['index']);
				controller.play.call(this);
			} else if (this.attributes['index'] == maxIndex) {
				var message = 'This is the latest sermon. You can say "Alexa, go back" to listen to a previous sermon';
				this.response.speak(message);
				this.emit(':responseReady');
			} else {
				this.attributes['index'] += 1;
				this.attributes['offsetInMilliseconds'] = 0;
				this.attributes['playbackIndexChanged'] = true;
				controller.play.call(this);
			}
		},
		
		playPrevious: function() {

			if (this.attributes['shuffle'] && this.attributes['playQueue'] && this.attributes['playQueue'].length > 0) {
				this.attributes['index'] = this.attributes['playQueue'].pop();
			} else {
				this.attributes['index'] -= 1;
			}

			
			this.attributes['offsetInMilliseconds'] = 0;
			this.attributes['playbackIndexChanged'] = true;
			controller.play.call(this);
		},
		
		shuffleOn: function() {
			this.attributes['shuffle'] = true;
			var message = 'Enabling shuffle mode';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		shuffleOff: function() {
			this.attributes['shuffle'] = false;
			this.attributes['playQueue'] = [];
			var message = 'Disabling shuffle mode';
			this.response.speak(message);
			this.emit(':responseReady');
		},
		
		noSupportedYet: function() {
			var message = 'That feature is not available yet.';
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