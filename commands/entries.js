const authorizedUsers = require('../constants/authorized');

let drawing;
let entriesList = [];
let isOpen = false; // drawing open for entries
let winnersList = [];

const entries = (client, channel, command, context) => {
    const args = command.split(' ');
    switch (args[0]) {
        case '$enter':
            enterDrawing(args[1], client, channel, context);
            break;
        case '$drawing':
            if (context.badges.has('moderator') || context.badges.has('broadcaster') || authorizedUsers.includes(context.userName)) {
                if (args[1]) {
                    switch (args[1]) {
                        case 'start':
                            startDrawing(args[2], client, channel, context);
                            break;
                        case 'stop':
                            stopDrawing(client, channel, context);
                            break;
                        case 'cancel':
                            cancelDrawing(client, channel, context);
                            break;
                        case 'redraw':
                            drawWinner(client, channel);
                            break;
                        case 'reset':
                            resetDrawing(client, channel, context);
                            break;
                        case 'winners':
                            showWinners(client, channel, context);
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

const enterDrawing = (rawEntry, client, channel, context) => {
    if (isOpen) {
        const entry = (rawEntry && (context.badges.has('moderator') || context.badges.has('broadcaster') || authorizedUsers.includes(context.userName))) ? formatEntry(rawEntry) : context.displayName;
        if (entriesList.includes(entry)) {
            client.say(channel, (rawEntry) ? `${entry} has already entered the current drawing` : `${entry} You have already entered the current drawing`);
        } else if (winnersList.includes(entry)) {
            client.say(channel, (rawEntry) ? `${entry} has already won a previous drawing` : `${entry} You have already won a previous drawing`);
        } else {
            entriesList.push(entry);
            client.say(channel, (rawEntry) ? `@${entry} has been successfully entered` : `@${entry} Your name has been successfully entered`);
        }
    } else {
        client.say(channel, `${context.displayName} There is no drawing currently in progress`);
    }
};

const formatEntry = (entry) => {
    return (entry.startsWith('@')) ? entry.substring(1) : entry;
};

const startDrawing = (timeMinutes, client, channel, context) => {
    entriesList = [];
    const time = (timeMinutes && Number.isInteger(parseInt(timeMinutes))) ? timeMinutes * 60000 : 0;
    if (isOpen) {
        client.say(channel, `${context.displayName} There is a drawing already in progress. Enter for a chance to win by typing $enter in the chat!`);
    } else {
        client.say(channel, `A new drawing started! Enter for a chance to win by typing $enter in the chat!`);
        if (!global.messageFailed) {
            isOpen = true;
            if (time > 0) {
                client.say(channel, `A name will be randomly drawn in ${time / 60000} ${(time === 60000) ? 'minute' : 'minutes'}`);
                drawing = setTimeout(drawWinner, time, client, channel);
            }
        }
    }
};

const stopDrawing = (client, channel, context) => {
    if (isOpen) {
        if (drawing) {
            clearTimeout(drawing);
        }
        drawWinner(client, channel);
    } else {
        client.say(channel, `@${context.displayName} There is no drawing currently in progress`);
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

const cancelDrawing = (client, channel, context) => {
    if (isOpen) {
        if (drawing) {
            clearTimeout(drawing);
        }
        isOpen = false;
        client.say(channel, `@${context.displayName} The drawing has been canceled`);
    } else {
        client.say(channel, `@${context.displayName} There is no drawing currently in progress`);
    }
};

const resetDrawing = (client, channel, context) => {
    entriesList = [];
    winnersList = [];
    client.say(channel, `@${context.displayName} The list of previous winners has been cleared`);
};

const showWinners = (client, channel, context) => {
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
};

module.exports = entries;