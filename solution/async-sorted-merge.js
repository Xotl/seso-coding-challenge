"use strict";
const promise = require('bluebird/js/release/promise');
const { getIndexOfOldestDate } = require('./utils');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = async (logSources, printer) => {

    const initalRequestOfLogs = new Array(logSources.length);
    for (let idx = 0; idx < logSources.length; idx++) {
        // Fill in the array with the first logs from each log source
        initalRequestOfLogs[idx] = logSources[idx].popAsync();
    }

    const incomingDateFromLogSourceArr = await Promise.all(initalRequestOfLogs);
    let drainedLogSourcesCount = 0;
    while (drainedLogSourcesCount < logSources.length) {
        const oldestDateIdx = getIndexOfOldestDate(incomingDateFromLogSourceArr);
        const oldestLogObj = incomingDateFromLogSourceArr[oldestDateIdx];
        if (oldestLogObj) {
            // We print the log and then we replace it with a new log from the same log source
            printer.print(oldestLogObj);
            incomingDateFromLogSourceArr[oldestDateIdx] = await logSources[oldestDateIdx].popAsync();
        } else {
            // Drained log source
            drainedLogSourcesCount++;
            incomingDateFromLogSourceArr[oldestDateIdx] = null;// We indicate that the log source is drained
        }
    }

    printer.done();
};
