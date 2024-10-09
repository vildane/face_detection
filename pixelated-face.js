const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#ffc600';
ctx.lineWidth = 2;
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();


// Write a fucntion that will populate the users video
async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
    });
    video.srcObject = stream;
    await video.play();
    // size the canvases to be the same size as the video
    console.log(video.videoWidth, video.videoHeight);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    faceCanvas.width = video.videoWidth;
    faceCanvas.height = video.videoHeight;
  }


async function detect() {
    const faces = await faceDetector.detect(video);
    console.log(faces.length);

    //ask the browser when the next animation frame(ftyra) is, and tell it to run detect for us:
    faces.forEach(drawFace)
    requestAnimationFrame(detect);
}
// draw a rectangle around the face 
function drawFace(face){
  const {width, height, top} = face.boundingBox;
  ctx.strokeRect(left, top, width, height);
}
populateVideo().then(detect);