const WorkerPool = require('workerpool'),
    imageProvider = require('../../api/v3/spotify/provideImage');

const provideImage = (id) => {
    return imageProvider(id);
}

WorkerPool.worker({
    provideImage
});