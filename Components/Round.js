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

    async resolveHealth(currPlayer, currPlayerDice, otherPlayer, otherPlayerDice) {
        // damage is calculated. First damage done by first player, then other way
        let otherPlayerArrDmg = currPlayerDice.filter(x => x === "arrow").length - otherPlayerDice.filter(x => x === "shield").length
        let otherPlayerAxeDmg = currPlayerDice.filter(x => x === "axe").length - otherPlayerDice.filter(x => x === "helmet").length
        let otherPlayerDmg = Math.max(0, otherPlayerAxeDmg) + Math.max(0, otherPlayerArrDmg);
        otherPlayer.health -= Math.max(0, otherPlayerDmg)

        if (otherPlayer.health <= 0) {
            const winner = await this.win(currPlayer);
            console.log("inresolvehealth");
            return true;
        }

        let currPlayerArrDmg = otherPlayerDice.filter(x => x === "arrow").length - currPlayerDice.filter(x => x === "shield").length
        let currPlayerAxeDmg = otherPlayerDice.filter(x => x === "axe").length - currPlayerDice.filter(x => x === "helmet").length
        let currPlayerDmg = Math.max(0, currPlayerAxeDmg) + Math.max(0, currPlayerArrDmg);
        currPlayer.health -= Math.max(0, currPlayerDmg);
        console.log(currPlayerArrDmg);

        if (currPlayer.health <= 0) {
            const winner = await this.win(otherPlayer);
            return true;
        }
        return false;
    };

    async win(winner) {
        console.log(`\n\n${winner.name} wins!\n\n`)
        const res = await inquirer
            .prompt({
                type: "confirm",
                name: "toRestart",
                message: "Play again?",
                default: false
            });
        if (res.toRestart) {
            for (let player of this.players) {
                player.health = 10;
                player.godPoints = 0;
            }
        }
        console.log(this.players);
        return winner;
    }

    async resolve() {
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
        return await this.resolveHealth(currPlayer, currPlayerDice, otherPlayer, otherPlayerDice);
    }


    async playMatch() {
        for (let player of this.players) {
            for (let dice of player.dices) {
                dice.locked = false;
            }
        }

        //switch from player to player until etiher all dice locked, or 3rd roll
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

            if (turn >= 5) {
                //final turns for players
                currPlayer.dices.forEach(dice => dice.locked = true)
            } else {
                // player chooses dice to lock, they get locked
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
        const result = await this.resolve();
        this.switchTurn();
        return result;
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