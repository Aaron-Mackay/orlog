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

        this.switchTurn();

        let otherPlayer = this.players[this.currPlayerIndex];
        let otherPlayerDice = otherPlayer.dices.map(dice => dice.currFace);
        let otherPlayerAddGP = otherPlayer.dices.filter(dice => dice.goldCurrFace).length;


        console.log(`${currPlayer.name} has\n${currPlayerDice}\nand gains ${currPlayerAddGP} god points.\n\n${otherPlayer.name} has\n${otherPlayerDice}\nand gains ${otherPlayerAddGP} god points`);
    }

    playMatch() {
        for (let turn = 1; turn <= 6; turn++) {
            let currPlayer = this.players[this.currPlayerIndex]
            console.log(`${currPlayer.name}'s turn to roll`);

            currPlayer.rollDice();
            if (turn >= 5) { //final turns for players
                currPlayer.dices.forEach(dice => dice.locked = true)
            } else {
                //player locks pieces - inquirer input?
            }
            console.log(currPlayer.dices.map(dice => dice.currFace));

            this.switchTurn();
        }
        this.resolve();
        this.switchTurn();
    }
}

module.exports = Round;