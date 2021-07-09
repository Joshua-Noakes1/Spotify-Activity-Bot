// fetch cache.json and save the length of the image arrays to localstorage
var cache;
fetch('/static/cache/cache.json').then(async (serverCache) => {
    cache = await serverCache.json();
    window.localStorage.setItem('imageLength', cache.images.length);
});

// every 60 seconds check if the image length isnt equal to the value in localstorage
setInterval(() => {
    var intervalCache;
    fetch('/static/cache/cache.json').then(async (serverCache) => {
        intervalCache = await serverCache.json();
        if (window.localStorage.getItem('imageLength') != intervalCache.images.length) {
            history.pushState(null, null, location.pathname + location.search);
            location.hash = '#' + `${intervalCache.recentImage}`;
            location.reload();
        }
    });
}, (2 * 60) * 1000);