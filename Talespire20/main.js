CharacterLoop();

function CharacterLoop(){
    creatureMods();
    creatureAttacks();
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
    return `<a href="javascript:void(0)" onclick="sendChat('character', '[[' + '${dice}' + ']]')" class="roll20Link">${innerText}</a>`;
}

/**
 * @param {string} sign
 * @param {string} mod
 * @param {?string} label
 * @returns {Node}
 */
function nodeLinkGenerator(sign, mod, label = "") {
    const a = document.createElement("a");
    label = label.replace(/ /g, "%20");
    if(mod == "0"){
        a.href = "javascript:void(0)";
        a.onclick = () => sendChat('character', '[[1d20]]');
    }
    else{
        a.href = "javascript:void(0)";
        a.onclick = () => sendChat('character', `[[1d20${sign}${mod}]]`);
    }
    a.textContent = sign + mod;
    a.classList.add("roll20Link");
    a.style.zIndex = "10";
    return a;
}

/**
 * @param {Node} parentNode
 * @param {?Element} labelNode
 */
function nodeReplacer(parentNode, labelNode = null) {
    const ability = parentNode.querySelector('input[name="attr_atkname"]');
    if (ability === null) {
        return;
    }
    const sign = ability.value[0];
    const ability_number = ability.value.slice(1);

    if (labelNode === null) {
        parentNode.appendChild(nodeLinkGenerator(sign, ability_number));
    } else {
        parentNode.appendChild(nodeLinkGenerator(sign, ability_number, labelNode.value));
    }
}

function creatureAttacks(){
    const regex = /\(\d+d\d+ *[−+-]? *[−+-]?\d*\)/gmi;
    const AttackChecker = /(?<!1D20)(?<!dicenotation=")(?<!class="roll20Link">)\(\d+d\d+ *[−+-]? *[−+-]?\d*\)/m;
    const elements = document.querySelectorAll('.attack:not(.TSExtensionAttacksModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        if(found){
            for(const workingString of found) {
                let fixed = workingString.replace(/[ )(]/g,'');
                fixed = fixed.replace("−","-")
                fixed = fixed.replace("+-","-");

                element.innerHTML = element.innerHTML.replace(AttackChecker, linkGenerator(fixed, true, false))
            }
        }
        element.classList.add("TSExtensionAttacksModified");
    }
}

function creatureMods(){
    const regex = /(?<!1D20)(?<!1d20)(?<!\d)(?<!dicenotation=")(?<!class="roll20Link">)([−+-]\d+)/gm;
    const ModChecker = /(?<!1D20)(?<!1d20)(?<!\d)(?<!dicenotation=")(?<!class="roll20Link">)([−+-]\d+)/m;
    const elements = document.querySelectorAll('.attack:not(.TSExtensionModsModified)');
    for (const element of elements) {
        const currentText = element.innerHTML;
        const found = currentText.match(regex);
        let workingElement = currentText.toString();
        if(found){
            for(const workingString of found) {
                const fixed = workingString.replace(/[ )(]/g,'');
                workingElement = workingElement.replace(ModChecker, linkGenerator(fixed, false, true))
                element.innerHTML = workingElement;
            }
        }
        element.classList.add("TSExtensionModsModified");
    }
}

/**
 * Handles replacing spells & melee attacks with Roll20 links
 */
function attackWrapper() {
    // Adjust these class selectors to match Roll20's DOM structure
    const classesToScan = [{
        mainName: ".attack", // Replace with actual Roll20 class
        labelName: "input[name='attr_atkname']" // Replace with actual Roll20 class
    }];
    
    for (const classes of classesToScan) {
        const attacks = document.querySelectorAll(classes.mainName);
        for (const attack of attacks) {
            const roll20LinkCheck = attack.querySelector(".roll20Link");

            if (roll20LinkCheck !== null) {
                continue;
            }

            // Replaces the HIT/DC
            const label = attack.querySelector(classes.labelName);
            if (label) {
                nodeReplacer(attack, label);
                let labelText = label.value.replace(/ /g, "%20");

                // Replaces the DAMAGE or HEALING
                const damage1 = attack.querySelector("input[name='attr_dmgbase']");
                const damage2 = attack.querySelector("input[name='attr_dmg2base']");

                replaceWithRoll20Link(damage1);
                replaceWithRoll20Link(damage2);
            }
        }
    }
}

function replaceWithRoll20Link(element) {
    if (element === null || !element.value.includes("d")) {
        return;
    }

    const parent = element.parentElement;
    const a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.onclick = () => sendChat('character', `[[${element.value}]]`);
    a.textContent = element.value;
    a.classList.add("roll20Link");

    parent.removeChild(element);
    parent.prepend(a);
}

function nodeReplacer(attack, label) {
    // Function logic to replace the node
    const span = document.createElement("span");
    span.textContent = label.value;
    label.parentElement.replaceChild(span, label);
}