function MovieSilencer() {
    var videoHandler;
    var audioHandler = new AudioHandler();

    loadSubtitles(showBlackAndWhiteMovie);
    // @param {Function} callback -- функция, вызываемая после успешной загрузки субтитров
    function loadSubtitles(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var subPhrasesInfo = SubtitlesHandler(xmlhttp.responseText);
                videoHandler = new VideoHandler(subPhrasesInfo);
                callback();
            }
        };
        var url = new URL(window.location.href);
        var subsUrl = url.searchParams.get('subs');
        xmlhttp.open("GET", subsUrl, true);
        xmlhttp.send();
    }

    function showBlackAndWhiteMovie() {
        audioHandler.play();
        videoHandler.startShowFrames();
        var movieToggleBtn = document.getElementById('stop_and_play_button');
        var playing = true;

        movieToggleBtn.addEventListener('click', function () {
            if (playing) {
                playing = false;
                movieToggleBtn.innerHTML = '&#9658;';
                videoHandler.stop();
                audioHandler.stop();
            } else {
                playing = true;
                movieToggleBtn.innerHTML = '||';
                videoHandler.play();
                audioHandler.play();
            }
        }, false);
    }
}

window.addEventListener('load', MovieSilencer, false);