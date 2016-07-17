window.onload = function () {
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;

    if(searchParams.toString() === "") {
        return
    }

    var videoUrl = searchParams.get('video');
    var subsUrl = searchParams.get('subs');
    var audioUrl = searchParams.get('audio');

    var ans = "Video URL: " + videoUrl + "\n\nSubtitles URL: " + subsUrl + "\n\nAudio URL: " + audioUrl;
    alert(ans);
}