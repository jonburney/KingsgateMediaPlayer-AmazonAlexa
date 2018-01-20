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

var logger = {

    timer: function(metricName, value) {
        console.log("TIMER_METRIC " + metricName + " " + value);
    },

    increment: function(metricName) {
        console.log("COUNTER_METRIC " + metricName);
    },

    error: function(metricName) {
        console.log("COUNTER_METRIC Error");
        console.log("COUNTER_METRIC " + metricName);
    }
}

module.exports = logger;