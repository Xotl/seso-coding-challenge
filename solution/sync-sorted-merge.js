"use strict";

// Print all entries, across all of the sources, in chronological order.

function getIndexOfOldestDate(incomingDateFromLogSourceArr) {
    let resultingIdx = null;
    for (let idx = 0; idx < incomingDateFromLogSourceArr.length; idx++) {
        if (incomingDateFromLogSourceArr[idx] === false) {
            return idx;
        }

        if (resultingIdx === null) {
            resultingIdx = 0;
            continue;
        }

        if (incomingDateFromLogSourceArr[resultingIdx] > incomingDateFromLogSourceArr[idx]) {
            resultingIdx = idx;
        }
    }

    return resultingIdx;
}

module.exports = (logSources, printer) => {
    const incomingDateFromLogSourceArr = new Array(logSources.length);
    for (let idx = 0; idx < logSources.length; idx++) {
        // Fill in the array with the first logs from each log source
        incomingDateFromLogSourceArr[idx] = logSources[idx].pop();
    }

    let drainedLogSourcesCount = 0;
    while (drainedLogSourcesCount !== logSources.length) {
        const oldestDateIdx = getIndexOfOldestDate(incomingDateFromLogSourceArr);
        const oldestLogObj = incomingDateFromLogSourceArr[oldestDateIdx];
        if (oldestLogObj) {
            // We print the log and then we replace it with a new log from the same log source
            printer.print(oldestLogObj);
            incomingDateFromLogSourceArr[oldestDateIdx] = logSources[oldestDateIdx].pop();
        } else {
            // Drained log source
            drainedLogSourcesCount++;
            incomingDateFromLogSourceArr[oldestDateIdx] = null;// We indicate that the log source is drained
        }
    }

    printer.done();
};
