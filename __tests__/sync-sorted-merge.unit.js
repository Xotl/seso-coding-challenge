const LogSource = require("../lib/log-source");
const SyncSortedMerge = require("../solution/sync-sorted-merge");

function Printer() {
    this.print = jest.fn();
    this.numOfPrintCallsWhenDoneGotCalled = 0;
    this.done = jest.fn(() => {
        this.numOfPrintCallsWhenDoneGotCalled = this.print.mock.calls.length;
    });
}
const NUM_OF_LOG_SOURCES = 7;

describe("Sync Sorted Merge Behaviors", () => {
    let asyncLogSources;

    beforeEach(() => {
        asyncLogSources = [];
        for (let i = 0; i < NUM_OF_LOG_SOURCES; i++) {
            const logSource = new LogSource();
            jest.spyOn(logSource, 'pop');
            asyncLogSources.push(logSource);
        }
    });

    test("It should synchronously drain multiple log sources", () => {
        const printerObj = new Printer();
        SyncSortedMerge(asyncLogSources, printerObj);

        // Count how many calls to the 'pop' have been done in total
        const numberOfLogsPopped = asyncLogSources.reduce((result, logSource) => {
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