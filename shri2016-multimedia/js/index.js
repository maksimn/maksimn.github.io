window.onload = function () {
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;

    if (searchParams.toString() === "") {
        show(document.querySelector('.silencer_start'));
        hide(document.querySelector('.silencer_work'));
        return;
    }

    hide(document.querySelector('.silencer_start'));
    show(document.querySelector('.silencer_work'));
    document.getElementById('return_back_link').href = url.origin + url.pathname;

    var videoUrl = searchParams.get('video');
    var subsUrl = searchParams.get('subs');
    var audioUrl = searchParams.get('audio');

    var auEl = document.querySelector('audio');
    auEl.src = audioUrl;
    auEl.play();

    var videoEl = document.querySelector('video');
    videoEl.src = videoUrl;
    videoEl.play();

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var fileText = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", subsUrl, true);
    xmlhttp.send();

    function hide(el) {
        el.style.display = 'none';
    }
    function show(el) {
        el.style.display = 'block';
    }
}