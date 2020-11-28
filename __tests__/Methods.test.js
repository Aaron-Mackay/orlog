const Dice = require("../Components/Dice")
const Player = require("../Components/Player")

const _ = require("lodash")

describe("Dice class", () => {
    const testDice = new Dice([0, 5]);

    test("roll returns a number between 0 and 5 inclusive", () => {
        expect(testDice.roll()).toBeGreaterThanOrEqual(0);
        expect(testDice.roll()).toBeLessThan(6);
    })
})

describe("Player class", () => {
    const testPlayer = new Player("Steve");
    const origDices = _.cloneDeep(testPlayer.dices);

    test("rollDice rerolls the player's dice", () => {
        testPlayer.rollDice();
        expect(testPlayer.dices).not.toStrictEqual(origDices)
    })
})