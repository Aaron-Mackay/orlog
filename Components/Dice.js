class Dice {
    constructor(godFaces) {
        this.godFaces = godFaces;
        this.faces = ["axe", "axe", "arrow", "shield", "helmet", "thief"];

        this.currFace = null;
        this.goldCurrFace = false;

        this.locked = false;
    }

    roll() {
        if (!this.locked) {
            const randInt = Math.floor(Math.random() * (5 + 1))

            this.currFace = this.faces[randInt]
            this.goldCurrFace = this.godFaces.includes(randInt);
            return randInt;
        }
        return null;
    }

}

module.exports = Dice