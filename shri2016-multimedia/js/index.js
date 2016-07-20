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

        videoEl.addEventListener('play', _onPlayDrawVideoFramesOnCanvas, false);
        videoEl.addEventListener('pause', _onPauseStopDrawVideoFramesOnCanvas, false);
        videoEl.addEventListener('ended', _onPauseStopDrawVideoFramesOnCanvas, false);

        function _onPlayDrawVideoFramesOnCanvas(e) {
            i = window.setInterval(function () {
                ctx.drawImage(videoEl, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
                var imgData = ctx.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
                for (var j = 0; j < imgData.data.length; j += 4) {
                    var grey = greyFromRGB(imgData.data[j], imgData.data[j + 1], imgData.data[j + 2]);
                    imgData.data[j + 2] = imgData.data[j + 1] = imgData.data[j] = grey;
                }
                ctx.putImageData(imgData, 0, 0);
            }, INTERVAL_BETWEEN_FRAMES);
            document.getElementById('scratches_video').play();
        }
        function _onPauseStopDrawVideoFramesOnCanvas(e) {
            window.clearInterval(i);
        }
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