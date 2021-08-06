# roll20-ogl-to-talespire

A javascript/jquery userscript, that rolls anything from your roll20 OGL character sheet in TaleSpire.

This script is to be used with a browser extension, that enables you to load userscripts, like Tampermonkey, Greasemonkey, Violentmonkey and so on.

Once loaded and activated the script will grab any clicked stat or feature from any OGL character sheet inside of a roll20.net game and pass the dice to roll on to TaleSpire.

Be aware, that just the dice are passed on, not the actuall outcome of the dice roll.

Example: You click "Initiative" on your OGL sheet, roll20 will roll it for you and sow you the result in the chat. Meanwhile the information of *what to roll* is sent to TaleSpire and can also be rolled there. The outcome will (well... most likely) differ.
