const authorizedUsers = require('../constants/authorized');

let drawing;
let entriesList = [];
let isOpen = false; // drawing open for entries
let winnersList = [];

const entries = (client, channel, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$enter':
            if (isOpen) {
                const entry = (args[1] && (context.badges.has('moderator') || context.badges.has('broadcaster') || authorizedUsers.includes(context.userName))) ? args[1] : context.displayName;
                if (entriesList.includes(entry)) {
                    client.say(channel, (args[1]) ? `${entry} has already entered the current drawing` : `${entry} You have already entered the current drawing`);
                } else if (winnersList.includes(entry)) {
                    client.say(channel, (args[1]) ? `${entry} has already won a previous drawing` : `${entry} You have already won a previous drawing`);
                } else {
                    entriesList.push(entry);
                    client.say(channel, (args[1]) ? `${entry} has been successfully entered` : `${entry} Your name has been successfully entered`);
                }
            } else {
                client.say(channel, `${context.displayName} There is no drawing currently in progress`);
            }
            break;
        case '$drawing':
            if (context.badges.has('moderator') || context.badges.has('broadcaster') || authorizedUsers.includes(context.userName)) {
                if (args[1]) {
                    switch (args[1]) {
                        case 'start':
                            entriesList = [];
                            const time = (args[2] && Number.isInteger(parseInt(args[2]))) ? args[2] * 60000 : 0;
                            if (isOpen) {
                                client.say(channel, `${context.displayName} There is a drawing already in progress`);
                            } else {
                                isOpen = true;
                                client.say(channel, `A new drawing started! Enter for a chance to win by typing $enter in the chat!`);
                                if (time > 0) {
                                    client.say(channel, `A name will be randomly drawn in ${time / 60000} ${(time === 60000) ? 'minute' : 'minutes'}`);
                                    drawing = setTimeout(drawWinner, time, client, channel);
                                }
                            }
                            break;
                        case 'stop':
                            if (isOpen) {
                                if (drawing) {
                                    clearTimeout(drawing);
                                }
                                drawWinner(client, channel);
                            } else {
                                client.say(channel, `@${context.displayName} There is no drawing currently in progress`);
                            }
                            break;
                        case 'cancel':
                            if (isOpen) {
                                if (drawing) {
                                    clearTimeout(drawing);
                                }
                                isOpen = false;
                                client.say(channel, `@${context.displayName} The drawing has been canceled`);
                            } else {
                                client.say(channel, `@${context.displayName} There is no drawing currently in progress`);
                            }
                            break;
                        case 'redraw':
                            drawWinner(client, channel);
                            break;
                        case 'reset':
                            entriesList = [];
                            winnersList = [];
                            client.say(channel, `@${context.displayName} The list of previous winners has been cleared`);
                            break;
                        case 'winners':
                            if (context.badges.has('moderator') || context.badges.has('broadcaster') || authorizedUsers.includes(context.userName)) {
                                if (winnersList.length > 0) {
                                    let listOfWinners = '';
                                    winnersList.forEach((val, i) => {
                                        listOfWinners += (i === 0) ? `${val}` : `, ${val}`;
                                    });
                                    client.say(channel, `Winners: ${listOfWinners}`);
                                } else {
                                    client.say(channel, `The list of previous winners is empty`);
                                }
                            }
                            break;
                        default:
                            //TODO: list drawing options
                    }
                } else {
                    //TODO: list drawing arguments
                }
            }
            break;
    }
};

const drawWinner = (client, target) => {
    const winner = entriesList[Math.floor(Math.random() * entriesList.length)];
    console.log('Entries: ' + entriesList);
    if (winner) {
        client.say(target, `Congratulations @${winner}! You've won the giveaway!`);
        winnersList.push(winner);
        entriesList.splice(entriesList.indexOf(winner), 1);
        console.log('Winners: ' + winnersList);
    } else {
        client.say(target, `No one entered the giveaway`);
    }
    isOpen = false;
};

module.exports = entries;