(async () => {
    await fetch('/cache/cache.json').then(async (fetchCache) => {
        addImages(await fetchCache.json());
    });
})();