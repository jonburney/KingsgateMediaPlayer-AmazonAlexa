/*
 * Kingsgate Media Player
 * Copyright (C) 2018 Jon Burney (jon@version7.co.uk)
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

var assert = require('assert');
var constants = require("../constants");

// target validation data
var targetData = {
    appId: "amzn1.ask.skill.74c0e160-0e95-48f8-936b-f6134db15077",
    dynamoDbTable: "AlexaKingsgateSkillTable",
    rssFeedUrl: "http://www.kingsgateuk.com/Media/rss.xml"
};

// Tests
describe("constants", function() {

    describe("appId", function() {
        it('appId should equal: ' + targetData.appId, function() {
            assert.equal(constants.appId, targetData.appId);
        });
    });
    
    describe("dynamoDbTable", function() {
        it('dynamoDbTable should equal: ' + targetData.dynamoDbTable, function() {
            assert.equal(constants.dynamoDbTable, targetData.dynamoDbTable);
        });
    });

    describe("rssFeedUrl", function() {
        it('rssFeedUrl should equal: ' + targetData.rssFeedUrl, function() {
            assert.equal(constants.rssFeedUrl, targetData.rssFeedUrl);
        });
    });
});