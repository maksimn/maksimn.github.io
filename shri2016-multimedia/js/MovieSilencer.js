function MovieSilencer() {
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;

    var videoUrl = searchParams.get('video');
    var subsUrl = searchParams.get('subs');
    var audioUrl = searchParams.get('audio');

    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var urlPrefix = cors_api_url;
    if (videoUrl.startsWith('file:///')) {
        urlPrefix = "";
    }

    var VIDEO_WIDTH = 380;
    var VIDEO_HEIGHT = 280;

    var srt = []; // массив с данными, извлекаемыми из субтитров

    // Проверка, отправлены ли входные данные на страницу.
    // Если нет, то отображается начальная форма ввода
    if (isEmptyString(searchParams.toString()) || isEmptyString(videoUrl) ||
        isEmptyString(subsUrl) || isEmptyString(audioUrl)) {
        window.location = 'index.html';
        return;
    }

    // Эта часть кода исполняется, только если оправлены какие-то данные 
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
        var videoEl = document.getElementById('video');
        var audioEl = document.getElementById('audio');
        var subNum = 0; // номер следующего субтитра, который нужно показать
        var scratches = document.getElementById('scratches_video');
        scratches.play();

        var sub = document.getElementById('subArea');

        requestAnimationFrame(frame);

        videoEl.addEventListener('ended', function (e) {
            stopPlayer();
        }, false);

        var button = document.getElementById('stop_and_play_button');
        var playing = true;
        button.addEventListener('click', function () {
            if (playing) {
                playing = false;
                button.innerHTML = '&#9658;';
                stopPlayer();
            } else {
                playing = true;
                button.innerHTML = '||';
                startPlayer();
            }
        }, false);
        function stopPlayer() {
            videoEl.pause();
            audioEl.pause();
            scratches.pause();
        }
        function startPlayer() {
            videoEl.play();
            audioEl.play();
            scratches.play();
        }

        function frame() {
            var subStart = srt[subNum].start;

            /* Здесь нужно написать код, обрабатывающий показ субтитров */
            if (videoEl.currentTime >= subStart) {
                ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
                sub.innerText = srt[subNum].text;
                if (videoEl.currentTime >= subStart + srt[subNum].duration) {
                    videoEl.currentTime = subStart;
                    sub.innerText = "";
                    subNum++;
                }
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
            requestAnimationFrame(frame);
        }
    }
    function initSrt(srtFileText) {
        var num = 1, pos = 0, dt = 0.0, k = 1, ch;
        function readChunk() {
            var ind = srtFileText.indexOf('\n' + (num + 1) + '\n', pos);
            if (ind === -1) {
                return "";
            }
            var res = srtFileText.substring(pos, ind);
            return ((num++, pos = ind + 1), res);
        }
        function readLastChunk() {
            var ind = srtFileText.lastIndexOf('\n' + num + '\n');
            return srtFileText.substring(ind + 1);
        }
        function getObjForSrt() {
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
            srt.push(getObjForSrt());
        }
        ch = readLastChunk();
        srt.push(getObjForSrt());
    }
    function greyFromRGB(red, green, blue) {
        return 0.21 * red + 0.72 * green + 0.07 * blue;
    }
    function isEmptyString(s) {
        return s === "";
    }
}