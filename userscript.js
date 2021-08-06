// ==UserScript==
// @name         Talespire20
// @namespace    https://drewers.dev
// @version      0.1
// @description  Roll20 OGL Sheet Roller for Talespire
// @author       Steven Drewers
// @match        https://app.roll20.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
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
        }
    // prepare data (currently json object)
        var roll;
        roll = JSON.parse(data);

        var v = roll.rolls[0];
        var current_roll = v.vre.rolls;

        $.each(current_roll, function( i, v ) {
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

        //console.log($("button.ivebeenclicked").attr("name"));
        //data.name = $("button.ivebeenclicked").attr("name");
        //console.log(data);
        //$("button.ivebeenclicked").removeClass("ivebeenclicked");
        var modifiers = "";

        $.each(data.mods, function( i, v ) {
            modifiers = modifiers.concat(v);
        });

        console.log(modifiers)
        var sum = eval(modifiers);
        var talespire_string = "";
        if (sum >= 0){
            talespire_string = "talespire://dice/" + data.count + "d" + data.die + "+" + sum;
        }
        else {
            talespire_string = "talespire://dice/" + data.count + "d" + data.die + "-" + sum;

        }
        console.log(talespire_string);
        location.href=talespire_string;


    }

    var open = window.XMLHttpRequest.prototype.open,
    send = window.XMLHttpRequest.prototype.send,
    onReadyStateChange;

    function openReplacement(method, url, async, user, password) {
        var syncMode = async !== false ? 'async' : 'sync';
        console.warn(
            'Preparing ' +
            syncMode +
            ' HTTP request : ' +
            method +
            ' ' +
            url
        );
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        console.warn('Sending HTTP request data : ', data);

        //DO SOMETHING WITH DATA
        sanitizeData(data);

        if(this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;

        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        console.warn('HTTP request ready state changed : ' + this.readyState);
        if(this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
    }



}

window.XMLHttpRequest.prototype.open = openReplacement;
window.XMLHttpRequest.prototype.send = sendReplacement;
});




(function() {
    'use strict';

    // Your code here...
    $("button[type='roll']").click(function(){
        event.preventDefault();
        $(this).addClass("ivebeenclicked");
    });
  
  

})();
