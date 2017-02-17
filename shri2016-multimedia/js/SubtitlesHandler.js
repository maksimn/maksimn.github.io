function SubtitlesHandler(srtFileText) {
    var subsPhrasesInfo = [];
    var num = 1, pos = 0, dt = 0.3, k = 1.3, ch;
    function readChunk() {
        var ind = srtFileText.indexOf('\n' + (num + 1) + '\n', pos);
        if (ind === -1) {
            return "";
        }
        var res = srtFileText.substring(pos, ind);
        return ((num++ , pos = ind + 1), res);
    }
    function readLastChunk() {
        var ind = srtFileText.lastIndexOf('\n' + num + '\n');
        return srtFileText.substring(ind + 1);
    }
    function getSubPhraseInfo() {
        var ind1 = ch.indexOf('\n'), ind2 = ch.indexOf('\n', ind1 + 1);
        var timeStr = ch.substring(ind1 + 1, ind2);
        var split = timeStr.split(':');
        var hh1 = parseInt(split[0]), mm1 = parseInt(split[1]),
            ssms1 = parseFloat(split[2].split(' ')[0].replace(',', '.')),
            hh2 = parseInt(split[2].split(' ')[2]), mm2 = parseInt(split[3]),
            ssms2 = parseFloat(split[4].replace(',', '.'));
        var tBegin = hh1 * 3600 + mm1 * 60 + ssms1;
        var tEnd = hh2 * 3600 + mm2 * 60 + ssms2;
        return {
            start: tEnd + dt,
            duration: k * (tEnd - tBegin),
            text: ch.substring(ind2 + 1)
        };
    }
    while ((ch = readChunk()).length > 0) {
        subsPhrasesInfo.push(getSubPhraseInfo());
    }
    ch = readLastChunk();
    subsPhrasesInfo.push(getSubPhraseInfo());
    return subsPhrasesInfo;
}
