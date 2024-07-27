CharacterLoop();

function CharacterLoop(){
    hitDice()
    creatureMods();
    creatureAttacks();
    creatureDescriptions();
    replaceWrapper();
    attackWrapper();
    sidePanelDescriptions();
    actionDescriptions();
    setTimeout(CharacterLoop, 2000);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

/**
 * @param {string} fixed
 * @param {boolean} brackets
 * @param {boolean} d20
 * @param {?string} label
 * @returns {string}
 */
function linkGenerator(fixed, brackets, d20, label = "") {
    const innerText = brackets ? `(${fixed})` : fixed;
    label = label.replace(/ /g, "%20");
    let dice = d20 ? `1D20${fixed}` : fixed;
    if(dice.includes("d100")){
        dice = dice.replace(/d100/g, "d100+d10")
    }
    return `<a href="talespire://dice/${label}:${dice}" target="_self" class="talespireLink">${innerText}</a>`
}

/**
 * @param {string} sign
 * @param {string} mod
 * @param {?string} label
 * @returns {Node}
 */
function nodeLinkGenerator(sign, mod, label = "") {
    const a = document.createElement("a")
    label = label.replace(/ /g, "%20");
    if(mod == "0"){
        a.href = `talespire://dice/${label}:1d20`;
    }
    else{
        a.href = `talespire://dice/${label}:1d20${sign}${mod}`;
    }
    a.textContent = sign+mod;
    a.classList.add("talespireLink");
    a.style.zIndex = "10";
    return a;
}

/**
 * @param {Node} parentNode
 * @param {?Element} labelNode
 */
function nodeReplacer(parentNode, labelNode = null) {
    const ability = parentNode.querySelector('.styles_numberDisplay__Rg1za:not(.ddbc-combat-attack__range-value .styles_numberDisplay__Rg1za):not(.ct-spells-spell__range-value .styles_numberDisplay__Rg1za):not(.ddbc-note-components__component--distance .styles_numberDisplay__Rg1za)');
    // Checks cause this to fail
    if (ability === null) {
        return;
    }
    const sign = ability.firstElementChild.innerText;
    const ability_number = ability.lastElementChild;

    ability.removeChild(ability.firstChild);
    ability.removeChild(ability.firstChild);
    if (labelNode === null) {
        ability.appendChild(nodeLinkGenerator(sign, ability_number.textContent));
    }
    else {
        if(labelNode.classList.contains("ddbc-saving-throws-summary__ability-name")){
            ability.appendChild(nodeLinkGenerator(sign, ability_number.textContent, `${labelNode.textContent.toUpperCase()} Save`));
        }
        else{
            ability.appendChild(nodeLinkGenerator(sign, ability_number.textContent, labelNode.textContent));
        }
    }
}

function creatureAttacks(){
    const regex = /\(\d+d\d+ *[−+-]? *[−+-]?\d*\)/gmi;  //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/roZY8b/3
    const AttackChecker = /(?<!1D20)(?<!dicenotation=")(?<!class="talespireLink">)\(\d+d\d+ *[−+-]? *[−+-]?\d*\)/m; //Thanks PanoramicPanda for the Regex :)
    const elements = document.querySelectorAll('.mon-stat-block:not(.TSExtensionAttacksModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        if(found){
            for(const workingString of found) {
                let fixed = workingString.replace(/[ )(]/g,''); //Thanks PanoramicPanda for the Regex :)
                fixed = fixed.replace("−","-")
                fixed = fixed.replace("+-","-");

                element.innerHTML = element.innerHTML.replace(AttackChecker, linkGenerator(fixed, true, false))
            }
        }
      element.classList.add("TSExtensionAttacksModified");
    }
}

function creatureMods(){
    const regex = /(?<!1D20)(?<!1d20)(?<!\d)(?<!dicenotation=")(?<!class="talespireLink">)([−+-]\d+)/gm; //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/dGkPnh/1
    const ModChecker = /(?<!1D20)(?<!1d20)(?<!\d)(?<!dicenotation=")(?<!class="talespireLink">)([−+-]\d+)/m; //Thanks PanoramicPanda for the Regex :)
    const elements = document.querySelectorAll('.mon-stat-block:not(.TSExtensionModsModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        let workingElement = currentText.toString();
        if(found){
            for(const workingString of found) {
                const fixed = workingString.replace(/[ )(]/g,''); //Thanks PanoramicPanda for the Regex :)

                workingElement = workingElement.replace(ModChecker, linkGenerator(fixed, false, true))
                element.innerHTML = workingElement;
            }
        }
        element.classList.add("TSExtensionModsModified");
    }
}

function creatureDescriptions(){
    const regex = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/gmi;  //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/roZY8b/3
    const descriptionChecker = /(?<!:)(?<![#0-9])(?<!dicenotation=")(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/m; //Thanks PanoramicPanda for the Regex :) https://regex101.com/r/0hUdgA/1

    const elements = document.querySelectorAll('.mon-details__description-block-content:not(.TSExtensionAttacksModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        if(found){
            for(const workingString of found) {
                let fixed = workingString.replace(/[ )(]/g,''); //Thanks PanoramicPanda for the Regex :)
                fixed = fixed.replace("−","-")
                fixed = fixed.replace("+-","-");

                element.innerHTML = element.innerHTML.replace(descriptionChecker, linkGenerator(fixed, true, false, ""))
            }
        }
      element.classList.add("TSExtensionAttacksModified");
    }
}

function sidePanelDescriptions() {
    const regex = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/gmi;  //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/roZY8b/3
    const descriptionChecker = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/m; //Thanks PanoramicPanda for the Regex :) https://regex101.com/r/0hUdgA/1
    const sidePanelTitle = document.querySelector('.ct-sidebar__heading');
    if (sidePanelTitle !== null) {
        let label = sidePanelTitle.textContent;
        const elements = document.querySelectorAll('.ct-action-detail__description:not(.TSExtensionAttacksModified), .ct-spell-detail__description:not(.TSExtensionAttacksModified), .ct-item-detail__description:not(.TSExtensionAttacksModified), .ddbc-property-list__property-content:not(.TSExtensionAttacksModified)');
        for (const element of elements) {
            let currentText = element.innerHTML;
            const found = currentText.match(regex);
            if (found) {
                for (const workingString of found) {
                    let fixed = workingString.replace(/[ )(]/g, ''); //Thanks PanoramicPanda for the Regex :)
                    fixed = fixed.replace("−", "-")
                    fixed = fixed.replace("+-", "-");

                    element.innerHTML = element.innerHTML.replace(descriptionChecker, linkGenerator(fixed, true, false, label))
                }
            }
            element.classList.add("TSExtensionAttacksModified");
        }
    }
}


function hitDice(){
    const regex = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/gmi;  //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/roZY8b/3
    const descriptionChecker = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/m; //Thanks PanoramicPanda for the Regex :) https://regex101.com/r/0hUdgA/1
    const elements = document.querySelectorAll('.ct-reset-pane__hitdie-heading:not(.TSExtensionAttacksModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        if(found){
            for(const workingString of found) {
                let fixed = workingString.replace(/[ )(]/g,''); //Thanks PanoramicPanda for the Regex :)
                fixed = fixed.replace("−","-")
                fixed = fixed.replace("+-","-");

                element.innerHTML = element.innerHTML.replace(descriptionChecker, linkGenerator(fixed, true, false, "Hit Die"))
            }
        }
      element.classList.add("TSExtensionAttacksModified");
    }
}


function actionDescriptions(){
    const regex = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/gmi;  //Thanks PanoramicPanda for the Regex :) // https://regex101.com/r/roZY8b/3
    const descriptionChecker = /(?<!:)(?<![#0-9])(?<!class="talespireLink">\()\d+d\d+ *[−+-]? *[−+-]?\d*/m; //Thanks PanoramicPanda for the Regex :) https://regex101.com/r/0hUdgA/1
    const elements = document.querySelectorAll('.ct-feature-snippet:not(.TSExtensionAttacksModified)');

    for (const element of elements) {
        const headingElement = element.querySelector('.ct-feature-snippet__heading');
        const label = headingElement.textContent;
        const currentText = element.textContent;
        const found = currentText.match(regex);
        if (found) {
            for (const workingString of found) {
                let fixed = workingString.replace(/[ )(]/g, ''); //Thanks PanoramicPanda for the Regex :)
                fixed = fixed.replace("−", "-")
                fixed = fixed.replace("+-", "-");

                element.innerHTML = element.innerHTML.replace(descriptionChecker, linkGenerator(fixed, true, false, label))
            }
        }
        element.classList.add("TSExtensionAttacksModified");
    }
}




/**
 * Handles replacing the ability, saving throws, items, proficiency & initiative
 * with talespire links
 */
function replaceWrapper() {
    const classesToScan = [{
        mainName: ".ddbc-ability-summary",
        labelName: ".ddbc-ability-summary__label"
    }, {
        mainName: ".ddbc-saving-throws-summary__ability",
        labelName: ".ddbc-saving-throws-summary__ability-name"
    }, {
        mainName: ".ct-skills__item",
        labelName: ".ct-skills__col--skill"
    }, {
        mainName: ".ct-proficiency-bonus-box",
        labelName: ".ct-proficiency-bonus-box__heading"
    }, {
        mainName: ".ct-combat__summary-group--initiative",
        labelName: ".ct-combat__summary-label"
    }]

    for (const classes of classesToScan) {
        const abilities = document.querySelectorAll(classes.mainName);
        for (const ability of abilities) {
            const talespireLinkCheck = ability.querySelector(".talespireLink");

            if (talespireLinkCheck !== null) {
                continue;
            }

            const label = ability.querySelector(classes.labelName);
            nodeReplacer(ability, label);
        }
    }
}

/**
 * Handles replacing spells & melee attacks with talespire links
 */
function attackWrapper() {
    const classesToScan = [{
        mainName: ".ct-spells-spell",
        labelName: ".ddbc-combat-attack__label"
    }, {
        mainName: ".ddbc-combat-attack",
        labelName: ".ddbc-combat-attack__label"
    }]
    for (const classes of classesToScan) {
        const attacks = document.querySelectorAll(classes.mainName);
        for (const attack of attacks) {
            const talespireLinkCheck = attack.querySelector(".talespireLink");

            if (talespireLinkCheck !== null) {
                continue;
            }

            // Replaces the HIT/DC
            const label = attack.querySelector(classes.labelName);
            nodeReplacer(attack, label);
            labelText = label.textContent.replace(/ /g, "%20");
            // Replaces the DAMAGE or HEALING
            const damage = attack.querySelectorAll(".ddbc-damage__value, .ddbc-spell-damage-effect__healing");
            // Effects that aren't DAMAGE cause it to fail
            // Skips Effects that have no dice like Aid
            for (const roll of damage){
                if (roll === null || !roll.textContent.includes("d")) {
                    continue;
                }
                const parent = roll.parentElement;

                const a = document.createElement("a")
                a.href = "talespire://dice/" + labelText +":"+ roll.textContent;
                a.textContent = roll.textContent;
                a.classList.add("talespireLink");

                // If it is a healing spell, remove the text of the roll
                // If it is dmg then you can remove the element as normal
                // This is due to healing having the Icon within the result unlike
                // with dmg which has it on the same level
                if (roll.classList.contains("ddbc-spell-damage-effect__healing")) {
                    roll.removeChild(roll.firstChild);
                    roll.prepend(a);
                } else {
                    parent.removeChild(roll);
                    parent.prepend(a);
                }
            }

        }
    }
}

//exports.linkGenerator = linkGenerator;
//exports.nodeLinkGenerator = nodeLinkGenerator;
