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


module.exports = {
    getIndexOfOldestDate
}