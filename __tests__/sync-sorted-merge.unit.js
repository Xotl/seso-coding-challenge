const LogSource = require("../lib/log-source");
const SyncSortedMerge = require("../solution/sync-sorted-merge");

function Printer() {
    this.lastDate = -1;
    this.print = jest.fn((logObj) => {
        // Confirms that is being printed in an ascending way
        const logTS = logObj.date.getTime();
        expect(logTS).toBeGreaterThan(this.lastDate);
        this.lastDate = logTS;
    });
    this.numOfPrintCallsWhenDoneGotCalled = 0;
    this.done = jest.fn(() => {
        this.numOfPrintCallsWhenDoneGotCalled = this.print.mock.calls.length;
    });
}
const NUM_OF_LOG_SOURCES = 7;

describe("Sync Sorted Merge Behaviors", () => {
    let syncLogSources;

    beforeEach(() => {
        syncLogSources = [];
        for (let i = 0; i < NUM_OF_LOG_SOURCES; i++) {
            const logSource = new LogSource();
            jest.spyOn(logSource, 'pop');
            syncLogSources.push(logSource);
        }
    });

    test("It should synchronously drain multiple log sources", () => {
        const printerObj = new Printer();
        SyncSortedMerge(syncLogSources, printerObj);

        // Count how many calls to the 'pop' have been done in total
        const numberOfLogsPopped = syncLogSources.reduce((result, logSource) => {
            result += logSource.pop.mock.calls.length;
            return result;
        }, 0);
        
        // confirm that we called the done function just once and after all of the print calls
        expect(printerObj.done).toHaveBeenCalledTimes(1);
        expect(printerObj.print.mock.calls.length).toBe(printerObj.numOfPrintCallsWhenDoneGotCalled);
        
        // Since we're not printing the 'false' values then we need to substract that ammount to
        // confirm the num of calls corresponds correctly.
        expect(printerObj.print.mock.calls.length).toBe(numberOfLogsPopped - NUM_OF_LOG_SOURCES);
    });
})