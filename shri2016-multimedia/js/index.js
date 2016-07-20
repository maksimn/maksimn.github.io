window.onload = function () {
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;

    var videoUrl = searchParams.get('video');
    var subsUrl = searchParams.get('subs');
    var audioUrl = searchParams.get('audio');

    //var urlAppendix = "https://crossorigin.me/";
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var urlPrefix = cors_api_url;
    if (videoUrl.startsWith('file:///')) {
        urlPrefix = "";
    }

    var VIDEO_WIDTH = 380;
    var VIDEO_HEIGHT = 280;
    var INTERVAL_BETWEEN_FRAMES = 16;

    var srt = []; // массив с данными, извлекаемыми из субтитров

    // Проверка, отправлены ли входные данные на страницу.
    // Если нет, то отображается начальная форма ввода
    if (isEmptyString(searchParams.toString()) || isEmptyString(videoUrl) ||
        isEmptyString(subsUrl) || isEmptyString(audioUrl)) {
        show(document.querySelector('.silencer_start'));
        hide(document.querySelector('.silencer_work'));
        return;
    }

    // Эта часть кода исполняется, только если оправлены какие-то данные
    hide(document.querySelector('.silencer_start')); // скрывается начальная форма
    show(document.querySelector('.silencer_work')); // показывается "Киноглушитель"
    // ссылка на начальную форму
    document.getElementById('return_back_link').href = url.origin + url.pathname;

    loadSubtitles(function () {
        playAudioElement(document.querySelector('audio'));
        playVideoElement(document.getElementById('video'));
        var ctx = getGraphicsContext();
        playVideoAndDrawOnCanvas(ctx);
    });

    // @param {Function} callback -- функция, вызываемая после успешной загрузки субтитров
    function loadSubtitles(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var fileText = xmlhttp.responseText;
                initSrt(fileText);
                callback();
            }
        };
        xmlhttp.open("GET", subsUrl, true);
        xmlhttp.send();
    }
    function playAudioElement(audioEl) {
        audioEl.src = audioUrl;
        audioEl.play();
    }
    function playVideoElement(videoEl) {
        videoEl.src = urlPrefix + videoUrl;
        videoEl.play();
    }
    function getGraphicsContext() {
        var cnvs = document.querySelector('canvas');
        return cnvs.getContext("2d");
    }
    function playVideoAndDrawOnCanvas(ctx) {
        var i, videoEl = document.getElementById('video');
        var subNum = 0; // номер следующего субтитра, который нужно показать
        var videoCurrentTime = document.getElementById('videoCurrentTime');
        var subtitlesStart = document.getElementById('subtitlesStart');
        var subtitleText = document.getElementById('subtitleText');

        var sub = document.getElementById('subArea');

        videoEl.addEventListener('play', _onPlayDrawVideoFramesOnCanvas, false);
        videoEl.addEventListener('pause', _onPauseStopDrawVideoFramesOnCanvas, false);
        videoEl.addEventListener('ended', _onVideoEnded, false);

        function _onVideoEnded(e) {
            videoEl.currentTime = 0;
            videoEl.pause();
            document.querySelector('audio').pause();
        }

        function _onPlayDrawVideoFramesOnCanvas(e) {
            i = window.setInterval(function () {
                videoCurrentTime.innerText = videoEl.currentTime;
                subtitlesStart.innerText = srt[subNum].start;

                /* Здесь нужно написать код, обрабатывающий показ субтитров */                
                if (videoEl.currentTime >= srt[subNum].start) {
                    videoEl.pause();
                } else {
                    /* Конец кода, обрабатывающего показ субтитров */
                    ctx.drawImage(videoEl, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
                    var imgData = ctx.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
                    for (var j = 0; j < imgData.data.length; j += 4) {
                        var grey = greyFromRGB(imgData.data[j], imgData.data[j + 1], imgData.data[j + 2]);
                        imgData.data[j + 2] = imgData.data[j + 1] = imgData.data[j] = grey;
                    }
                    ctx.putImageData(imgData, 0, 0);
                }
            }, INTERVAL_BETWEEN_FRAMES);
            document.getElementById('scratches_video').play();
        }
        function _onPauseStopDrawVideoFramesOnCanvas(e) {
            window.clearInterval(i);
            ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            subtitleText.innerText = srt[subNum].text;
            sub.innerText = srt[subNum].text;
            setTimeout(function () {
                videoEl.play();
                subtitleText.innerText = "";
                sub.innerText = "";
            }, srt[subNum++].duration * 1000);
        }
    }
    function initSrt(srtFileText) {
        var num = 1, pos = 0;
        var dt = 0.0, k = 1;
        var ch;
        function readChunk() {
            var ind = srtFileText.indexOf('\n' + (num + 1) + '\n', pos);
            if (ind === -1) {
                return "";
            }
            var res = srtFileText.substring(pos, ind);
            pos = ind + 1;
            num++;
            return res;
        }
        function readLastChunk() {
            var ind = srtFileText.lastIndexOf('\n' + num + '\n');
            return srtFileText.substring(ind + 1);
        }
        function getObjForSrt() {
            var ind1 = ch.indexOf('\n');
            var ind2 = ch.indexOf('\n', ind1 + 1);
            var timeStr = ch.substring(ind1 + 1, ind2);
            var hh = parseInt(timeStr.substring(0, 2));
            var mm = parseInt(timeStr.substring(3, 5));
            var ss = parseInt(timeStr.substring(6, 8));
            var ms = parseInt(timeStr.substring(9, 12));
            var tBegin = hh * 3600 + mm * 60 + ss + ms * 0.001;
            hh = parseInt(timeStr.substring(17, 19));
            mm = parseInt(timeStr.substring(20, 22));
            ss = parseInt(timeStr.substring(23, 25));
            ms = parseInt(timeStr.substring(26, 29));
            var tEnd = hh * 3600 + mm * 60 + ss + ms * 0.001;
            var txt = ch.substring(ind2 + 1);
            return {
                start: tEnd + dt,
                duration: k * (tEnd - tBegin),
                text: txt
            };
        }
        while((ch = readChunk()).length > 0) {
            srt.push(getObjForSrt());
        }
        ch = readLastChunk();        
        srt.push(getObjForSrt());
    }
}

function greyFromRGB(red, green, blue) {
    return 0.21 * red + 0.72 * green + 0.07 * blue;
}
function isEmptyString(s) {
    return s === "";
}
function hide(el) {
    el.style.display = 'none';
}
function show(el) {
    el.style.display = 'block';
}