// ==UserScript==
// @name         Talespire20
// @namespace    https://drewers.dev
// @version      0.3
// @description  Roll20 OGL Sheet Roller for Talespire
// @author       Steven Drewers
// @match        https://app.roll20.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Lskovfoged/roll20-ogl-to-talespire/main/userscript.jsw
// @downloadURL  https://raw.githubusercontent.com/Lskovfoged/roll20-ogl-to-talespire/main/userscript.js
// ==/UserScript==

/* global $ */

window.jQuery360 = $.noConflict(true);

$(document).ready(function(){
    function sanitizeData(data){
        var san_roll = {
            name: "",
            die: "",
            count: "",
            mods: []
        };
        // prepare data (currently json object)
        var roll;
        try {
            roll = JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse roll data:", e);
            return;
        }

        var v = roll.rolls[0];
        var current_roll = v.vre.rolls;

        $.each(current_roll, function(i, v) {
            if (this.type == "R"){
                san_roll.die = this.sides;
                san_roll.count = this.dice;
            }
            else if (this.type == "M"){
                san_roll.mods.push(this.expr);
            }
        });
        // make talespire url
        makeTalespireLink(san_roll);
    }

    function makeTalespireLink(data){
        var modifiers = "";
        $.each(data.mods, function(i, v) {
            modifiers = modifiers.concat(v);
        });

        console.log(modifiers);
        var sum = eval(modifiers);
        var talespire_string = "";
        if (sum >= 0){
            talespire_string = "talespire://dice/" + data.count + "d" + data.die + "+" + sum;
        }
        else {
            talespire_string = "talespire://dice/" + data.count + "d" + data.die + "-" + sum;
        }
        console.log(talespire_string);
        location.href = talespire_string;
    }

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url; // store the URL
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        // Only intercept requests related to specific Roll20 roll actions
        if (this._url.includes("roll")) {
            try {
                var parsedData = JSON.parse(data);
                if (parsedData && parsedData.rolls) {
                    sanitizeData(data);
                }
            } catch (e) {
                console.error("Failed to process roll data:", e);
            }
        }

        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;

        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;
});

(function() {
    'use strict';

    // Your code here...
    $("button[type='roll']").click(function(event){
        event.preventDefault();
        $(this).addClass("ivebeenclicked");
    });
})();
