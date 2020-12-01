const inquirer = require("inquirer");

const Player = require("./Components/Player")
const Round = require("./Components/Round")

const player1 = new Player("bob");
const player2 = new Player("rob");

async function game() {
    let roundCount = 1;
    while (player1.health > 0 && player2.health > 0) {
        console.log(`\n\n=============================\n========== Round ${roundCount++} ==========\n=============================\n\n${player1.name}: ${player1.health} life\n${player2.name}: ${player2.health} life\n`)
        const round = new Round(player1, player2);
        const result = await round.playMatch();

        // playMatch returns true if won, so reset roundCount incase of replay
        if (result === true) roundCount = 1;
    }
}

game();