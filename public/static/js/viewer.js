import Viewer from 'viewerjs';

// View an image.
const viewer = new Viewer(document.getElementById('image'), {
    inline: true,
    viewed() {
        viewer.zoomTo(1);
    },
});
// Then, show the image by clicking it, or call `viewer.show()`.

// View a list of images.
// Note: All images within the container will be found by calling `element.querySelectorAll('img')`.
const gallery = new Viewer(document.getElementById('images'));