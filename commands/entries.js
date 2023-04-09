const authorizedUsers = require('../constants/authorized');

let drawing;
let entriesList = [];
let isOpen = false;
let winnersList = [];

const entries = (client, target, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$enter':
            if (isOpen) {
                const entry = (args[1] && (context.badges.has('moderator') || context.badges.has('broadcaster'))) ? args[1] : context.displayName;
                if (entriesList.includes(entry)) {
                    client.say(target, (args[1]) ? `${entry} has already entered the current drawing` : `${entry} You have already entered the current drawing`);
                } else if (winnersList.includes(entry)) {
                    client.say(target, (args[1]) ? `${entry} has already won a previous drawing` : `${entry} You have already won a previous drawing`);
                } else {
                    entriesList.push(entry);
                    client.say(target, (args[1]) ? `${entry} has been successfully entered` : `${entry} Your name has been successfully entered`);
                }
            } else {
                client.say(target, `${context.displayName} There is no drawing currently in progress`);
            }
            break;
        case '$drawing':
            if (context.badges.hasOwnProperty('moderator') || context.badges.hasOwnProperty('broadcaster')) {
                if (args[1]) {
                    switch (args[1]) {
                        case 'start':
                            entriesList = [];
                            const time = (args[2] && Number.isInteger(parseInt(args[2]))) ? args[2] * 60000 : 0;
                            if (isOpen) {
                                client.say(target, `${context.displayName} There is a drawing already in progress`);
                            } else {
                                isOpen = true;
                                client.say(target, `A new drawing started! Enter for a chance to win by typing $enter in the chat!`);
                                if (time > 0) {
                                    client.say(target, `A name will be randomly drawn in ${time / 60000} ${(time === 60000) ? 'minute' : 'minutes'}`);
                                    drawing = setTimeout(drawWinner, time, client, target);
                                }
                            }
                            break;
                        case 'stop':
                            if (isOpen) {
                                if (drawing) {
                                    clearTimeout(drawing);
                                }
                                drawWinner(client, target);
                            } else {
                                client.say(target, `@${context.displayName} There is no drawing currently in progress`);
                            }
                            break;
                        case 'cancel':
                            if (isOpen) {
                                if (drawing) {
                                    clearTimeout(drawing);
                                }
                                isOpen = false;
                                client.say(target, `@${context.displayName} The drawing has been canceled`);
                            } else {
                                client.say(target, `@${context.displayName} There is no drawing currently in progress`);
                            }
                            break;
                        case 'redraw':
                            drawWinner(client, target);
                            break;
                        case 'reset':
                            entriesList = [];
                            winnersList = [];
                            client.say(target, `@${context.displayName} The list of previous winners has been cleared`);
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
        client.say(target, `Congratulations @${winner}! You've won!`);
        winnersList.push(winner);
        entriesList.splice(entriesList.indexOf(winner), 1);
        console.log('Winners: ' + winnersList);
    } else {
        client.say(target, `No one entered the giveaway`);
    }
    isOpen = false;
};

module.exports = entries;