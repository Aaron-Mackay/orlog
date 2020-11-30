const inquirer = require("inquirer");

const Dice = require("./Components/Dice")
const Player = require("./Components/Player")
const Round = require("./Components/Round")

const player1 = new Player("bob");
const player2 = new Player("rob");

async function game() {
    let roundCount = 1;
    while (player1.health > 0 && player2.health > 0) {
        console.log(`\n\n=============================\n========== Round ${roundCount++} ==========\n=============================\n`)
        const round = new Round(player1, player2);
        await round.playMatch()
        player1.health--;
    }
}

game();