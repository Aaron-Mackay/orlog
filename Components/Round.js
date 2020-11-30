const inquirer = require("inquirer");
const Dice = require("./Dice")
const Player = require("./Player")

class Round {
    constructor(player1, player2) {
        this.players = [player1, player2]
        this.currPlayerIndex = Math.round(Math.random());
    }

    switchTurn() {
        this.currPlayerIndex = (this.currPlayerIndex + 1) % 2;
    }

    resolve() {
        let currPlayer = this.players[this.currPlayerIndex];
        let currPlayerDice = currPlayer.dices.map(dice => dice.currFace);
        let currPlayerAddGP = currPlayer.dices.filter(dice => dice.goldCurrFace).length;
        currPlayer.godPoints += currPlayerAddGP;

        this.switchTurn();

        let otherPlayer = this.players[this.currPlayerIndex];
        let otherPlayerDice = otherPlayer.dices.map(dice => dice.currFace);
        let otherPlayerAddGP = otherPlayer.dices.filter(dice => dice.goldCurrFace).length;
        otherPlayer.godPoints += otherPlayerAddGP;


        console.log(`${currPlayer.name} has\n${currPlayerDice}\nand gains ${currPlayerAddGP} god points.\n\n${otherPlayer.name} has\n${otherPlayerDice}\nand gains ${otherPlayerAddGP} god points`);

        // damage calculation
    }

    async playMatch() {
        for (let player of this.players) {
            for (let dice of player.dices) {
                dice.locked = false;
            }
        }

        for (let turn = 1; turn <= 6; turn++) {
            console.log("\nturn", turn);
            let currPlayer = this.players[this.currPlayerIndex]
            currPlayer.rollDice();

            const currDice = currPlayer.dices.filter(dice => !dice.locked)
            const lockedDice = currPlayer.dices.filter(dice => dice.locked);

            const currDiceNames = currDice.map((dice, i) => {
                return dice.currFace + (dice.goldCurrFace ? " - G" : "")
            })
            const lockedDiceNames = lockedDice.map((dice, i) => {
                return dice.currFace + (dice.goldCurrFace ? " - G" : "")
            })
            console.log("lockeddicenames", lockedDiceNames);

            if (turn >= 5) {
                //final turns for players
                currPlayer.dices.forEach(dice => dice.locked = true)
            } else {
                await this.playerLockDices(currPlayer.name, currDiceNames, lockedDiceNames)
                    .then(({ diceToLock }) => {
                        diceToLock.forEach(diceName => {
                            // iterate through all unlocked dice, check for matches and lock
                            for (let dice of currDice) {
                                const diceToLockIsGold = diceName.includes(" - G");
                                if (dice.currFace === diceName.replace(" - G", "") && !dice.locked && diceToLockIsGold === dice.goldCurrFace) {
                                    dice.locked = true;
                                    break;
                                }
                            }
                        })
                    })
            }

            this.switchTurn();
        }
        this.resolve();
        this.switchTurn();
    }

    playerLockDices(name, currDice, lockedDice) {
        const lockedDiceStr = lockedDice.length > 0 ? `Locked dice: ${lockedDice.join(" . ")}\n` : "";
        return inquirer
            .prompt([{
                type: "checkbox",
                message: `${lockedDiceStr}${name}, select dice to lock`,
                name: "diceToLock",
                choices: currDice
            }])
    }
}

module.exports = Round;