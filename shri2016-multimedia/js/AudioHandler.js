function AudioHandler() {
    var url = new URL(window.location.href);
    var audioUrl = url.searchParams.get('audio');
    this.audioEl = document.getElementById('audio');
    this.audioEl.src = audioUrl;
}

AudioHandler.prototype.play = function () {
    this.audioEl.play();
}

AudioHandler.prototype.stop = function () {
    this.audioEl.pause();
}
