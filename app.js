const inquirer = require("inquirer");

const Dice = require("./Components/Dice")
const Player = require("./Components/Player")
const Round = require("./Components/Round")

const player1 = new Player("bob");
const player2 = new Player("rob")


const round = new Round(player1, player2);

round.playMatch()