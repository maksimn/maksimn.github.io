function VideoHandler(subPhrasesInfo) {
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;
    var videoUrl = searchParams.get('video');
    if (!videoUrl) {
        window.location = 'index.html';
        return;
    }

    this.videoEl = document.getElementById('video');
    this.subPhrasesInfo = subPhrasesInfo;
    this.scratches = document.getElementById('scratches_video');

    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var urlPrefix = cors_api_url;
    if (videoUrl.startsWith('file:///')) {
        urlPrefix = "";
    }
    this.videoEl.src = urlPrefix + videoUrl;

    this.videoEl.addEventListener('ended', function (e) {
        document.getElementById('scratches_video').pause();
        document.getElementById('audio').pause();
    }, false);
}

VideoHandler.prototype.play = function() {
    this.scratches.play();
    this.videoEl.play();
}

VideoHandler.prototype.stop = function() {
    this.scratches.pause();
    this.videoEl.pause();
}

VideoHandler.prototype.startShowFrames = function() {
    var subNum = 0; // номер субтитра для показа

    var VIDEO_WIDTH = 380;
    var VIDEO_HEIGHT = 280; 

    requestAnimationFrame(frame.bind(this));
    var cnvs = document.querySelector('canvas');
    var ctx = cnvs.getContext("2d");
    var sub = document.getElementById('subArea');

    this.videoEl.play();
    this.scratches.play();

    function frame() {
        var subStart = this.subPhrasesInfo[subNum].start;

        /* Здесь нужно написать код, обрабатывающий показ субтитров */
        if (this.videoEl.currentTime >= subStart) {
            ctx.fillRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            sub.innerText = this.subPhrasesInfo[subNum].text;
            if (this.videoEl.currentTime >= subStart + this.subPhrasesInfo[subNum].duration) {
                this.videoEl.currentTime = subStart;
                sub.innerText = "";
                subNum++;
            }
        } else {
            /* Конец кода, обрабатывающего показ субтитров */
            ctx.drawImage(this.videoEl, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            var imgData = ctx.getImageData(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
            for (var j = 0; j < imgData.data.length; j += 4) {
                var grey = greyFromRGB(imgData.data[j], imgData.data[j + 1], imgData.data[j + 2]);
                imgData.data[j + 2] = imgData.data[j + 1] = imgData.data[j] = grey;
            }
            ctx.putImageData(imgData, 0, 0);
        }
        requestAnimationFrame(frame.bind(this));
    }

    function greyFromRGB(red, green, blue) {
        return 0.21 * red + 0.72 * green + 0.07 * blue;
    }
}
