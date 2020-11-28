const Dice = require("./Dice")

class Player {
    constructor(name) {
        this.name = name;
        this.health = 10;
        this.godPoints = 0;
        this.godTokens = []; // todo, add godtokens
        this.dices = [
            new Dice([2, 5]),
            new Dice([2, 3]),
            new Dice([3, 5]),
            new Dice([4, 5]),
            new Dice([3, 4]),
            new Dice([2, 4]),
        ]
    }

    rollDice() {
        this.dices.forEach(dice => {
            if (!dice.locked) {
                dice.roll();
            }
        })
        return this.dices;
    }

    getUnlockedDices() {
        return this.dices.filter(dice => !dice.locked);
    }

    lockDice(index) {
        this.dices[index].locked = true;
    }
}


module.exports = Player