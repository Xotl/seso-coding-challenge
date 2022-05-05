"use strict";
const { getIndexOfOldestDate } = require('./utils');

// Print all entries, across all of the sources, in chronological order.

function insertSortIntoDoubleLinkedList(newNode, node) {
    if (node === null) {
        return newNode
    }

    let currentNode = node;

    // console.log('Wow,m such debugging antes', currentNode, newNode);

    // console.log('Wow, such debugging enters IF', currentNode.log.date > newNode.log.date)
    if (currentNode.log.date > newNode.log.date) {
        while (currentNode.prev !== null && currentNode.prev.log.date > newNode.log.date) {
            // console.log('Wow, such debugging while prev', currentNode, currentNode.prev);
            currentNode = currentNode.prev;
        }

        newNode.next = currentNode;
        newNode.prev = currentNode.prev;
        if (currentNode.prev) {
            currentNode.prev.next = newNode;
        }
        currentNode.prev = newNode;

        return newNode;
    }

    // if it's not greater then executes the next: 
    
    // console.log('Wow, such debugging enters the "next" part')
    while (currentNode.next !== null && currentNode.next.log.date < newNode.log.date) {
        // console.log('Wow, such debugging while next', currentNode, currentNode.next);
        currentNode = currentNode.next;
    }

    newNode.next = currentNode.next;
    newNode.prev = currentNode;
    if (currentNode.next) {
        currentNode.next.prev = newNode;
    }
    currentNode.next = newNode;

    return newNode;
}

module.exports = (logSources, printer) => {
    let notYetDrainedLogSources = [...logSources];
    let firstNodeOfLogLinkedList = null;
    let lastSafeNodeToPrint = null;
    
    while (notYetDrainedLogSources.length > 0) {
        const currentNotDrainedLogSources = [];
        let latestInsertedLogNode = firstNodeOfLogLinkedList;

        for (let idx = 0; idx < notYetDrainedLogSources.length; idx++) {
            const newLog = notYetDrainedLogSources[idx].pop();
            if (newLog === false) {
                continue;
            }

            // Keep track of the log sources that may still have logs
            currentNotDrainedLogSources.push(notYetDrainedLogSources[idx]);

            latestInsertedLogNode = insertSortIntoDoubleLinkedList(
                { log: newLog, next: null, prev: null },// new node to be inserted
                latestInsertedLogNode
            );

            if (lastSafeNodeToPrint === null || lastSafeNodeToPrint.log.date > latestInsertedLogNode.log.date) {
                lastSafeNodeToPrint = latestInsertedLogNode;
            }

            // Keep the first node updated
            if (firstNodeOfLogLinkedList === null) {
                firstNodeOfLogLinkedList = latestInsertedLogNode;
            } else if (firstNodeOfLogLinkedList.prev) {
                firstNodeOfLogLinkedList = firstNodeOfLogLinkedList.prev
            }
        }

        // Print all the logs that are safe to print now
        let currentNode = firstNodeOfLogLinkedList;
        while (currentNode) {
            printer.print(currentNode.log);
            
            if (currentNode === lastSafeNodeToPrint) {
                // Reset the first node because we don't need the nodes that already got printed
                firstNodeOfLogLinkedList = currentNode.next
                if (firstNodeOfLogLinkedList) {
                    firstNodeOfLogLinkedList.prev = null
                }
                lastSafeNodeToPrint = firstNodeOfLogLinkedList;

                currentNode = null;// We are done for now, so let's break the while with this
            } else {
                currentNode = currentNode.next;
            }
        }

        // updates list of logsources with data only so we don't waste time checking 
        // for data during next iterations
        notYetDrainedLogSources = currentNotDrainedLogSources;
    }

    printer.done();



    // const incomingDateFromLogSourceArr = new Array(logSources.length);
    // for (let idx = 0; idx < logSources.length; idx++) {
    //     // Fill in the array with the first logs from each log source
    //     incomingDateFromLogSourceArr[idx] = logSources[idx].pop();
    // }

    // let drainedLogSourcesCount = 0;
    // while (drainedLogSourcesCount < logSources.length) {
    //     const oldestDateIdx = getIndexOfOldestDate(incomingDateFromLogSourceArr);
    //     const oldestLogObj = incomingDateFromLogSourceArr[oldestDateIdx];
    //     if (oldestLogObj) {
    //         // We print the log and then we replace it with a new log from the same log source
    //         printer.print(oldestLogObj);
    //         incomingDateFromLogSourceArr[oldestDateIdx] = logSources[oldestDateIdx].pop();
    //     } else {
    //         // Drained log source
    //         drainedLogSourcesCount++;
    //         incomingDateFromLogSourceArr[oldestDateIdx] = null;// We indicate that the log source is drained
    //     }
    // }

    // printer.done();
};
