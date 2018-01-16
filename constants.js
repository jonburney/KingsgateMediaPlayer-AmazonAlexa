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

module.exports = Object.freeze({

    appId: "amzn1.ask.skill.74c0e160-0e95-48f8-936b-f6134db15077",
    dynamoDbTable: "AlexaKingsgateSkillTable",
    rssFeedUrl: "http://www.kingsgateuk.com/Media/rss.xml",
    states: {
        START_MODE: '',
        PLAY_MODE: '_PLAY_MODE',
        RESUME_DECISION_MODE : '_RESUME_DECISION_MODE'
    }
});