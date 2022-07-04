const authorizedUsers = require('../constants/authorized');

let entriesList = [];
let isOpen = false;
let winnersList = ['philVelo','GillianHayek','chemjanet','StewartHayek','eroomekim','CoverTimePete','kilozebra','sasavame','Cptcrunch85','alynbart','mainemammie','bitemeimklingon69','BooksBrewsAndBooze','steamin_clevelan','theqil','ofucc','PLUMPKINPLUMPS','AnnArborite','hoolery_schmoolery','penguin_superhero','lisawarrenserenityharp'];

const entries = (client, target, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$enter':
            if (isOpen) {
                if (entriesList.includes(context['display-name'])) {
                    client.say(target, `${context['display-name']} You have already entered the current giveaway`);
                } else if (winnersList.includes(context['display-name'])) {
                    client.say(target, `${context['display-name']} You have already won a previous giveaway`);
                } else {
                    entriesList.push(context['display-name']);
                    client.say(target, `${context['display-name']} Your name has been successfully entered`);
                }
            } else {
                client.say(target, `${context['display-name']} There is no giveaway currently in progress`);
            }
            break;
        case '$start':
            if (authorizedUsers.includes(context['username'])) {
                if (isOpen) {
                    client.say(target, `${context['display-name']} There is a giveaway already in progress`);
                } else {
                    isOpen = true;
                    client.say(target, `A new giveaway started! Enter for a chance to win by typing $enter in the chat!`);
                    setTimeout(drawWinner, 600000, client, target);
                }
            }
            break;
    }
};

const drawWinner = (client, target) => {
    const winner = entriesList[Math.floor(Math.random() * entriesList.length)];
    console.log('Entries: ' + entriesList);
    if (winner) {
        client.say(target, `Congratulations ${winner}! You have been selected! Send a whisper to either IslandVibingPresents or IslandAdjacent so they know where to send you your prize!`);
        winnersList.push(winner);
        console.log('Winners: ' + winnersList);
    } else {
        client.say(target, `No one entered the giveaway`);
    }
    isOpen = false;
    entriesList = [];
};

module.exports = entries;