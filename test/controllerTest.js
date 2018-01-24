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
var sinon = require('sinon');
var controller = require("../controller");



describe("controller", function() {
    before(function(){
        this.attributes = [];
        
    });

    describe("pause", function() {
        it('Pause calls audioPlayerStop', function() {
            let response = {
                audioPlayerStop: sinon.stub()
            }

            let attributes = {
                offsetInMilliseconds: sinon.stub()
            }
            
            //sinon.stub(this.response, 'audioPlayerStop');
            //controller.pause(this);
        });
    });
});