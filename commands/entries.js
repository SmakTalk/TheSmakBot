const authorizedUsers = require('../constants/authorized');

let entriesList = [];
let isOpen = false;
let winnersList = [];

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
                    console.log(entriesList);
                    client.say(target, `${context['display-name']} Your name has been successfully entered`);
                    // add to API
                }
            } else {
                client.say(target, `${context['display-name']} There is no giveaway currently in progress`);
            }
            break;
        case '$start':
            if (authorizedUsers.includes(context['username'])) {
                console.log('Previous winners: ' + winnersList);
                isOpen = true;
                client.say(target, `Giveaway started`);
                setTimeout(drawWinner, 60000, client, target);
            }
            break;
    }
};

const drawWinner = (client, target) => {
    const winner = entriesList[Math.floor(Math.random() * entriesList.length)];
    console.log('winner selected!: ' + winner);
    if (winner) {
        client.say(target, `Congratulations ${winner}! You have been selected!`);
        winnersList.push(winner);
    } else {
        client.say(target, `No one entered the giveaway`);
    }
    isOpen = false;
    entriesList = [];
};

module.exports = entries;