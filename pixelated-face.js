const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');

const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();

const options = {
    SIZE: 10,
    SCALE: 1.35
} 
 


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
   
//ask the browser when the next animation frame(ftyra) is, and tell it to run detect for us:
    faces.forEach(drawFace);
    faces.forEach(censor);
    requestAnimationFrame(detect);
}
// draw a rectangle around the face 
function drawFace(face){
  const {width, height, top, left} = face.boundingBox;
  ctx.clearRect(0,0,canvas.width, canvas.height);//para se me shti kto jetshin katrorat plot
  ctx.strokeStyle = '#ffc600';
  ctx.lineWidth = 2;
  ctx.strokeRect(left, top, width, height);
}

function censor ({boundingBox: face}) {
    faceCtx.imageSmoothingEnabled = false;
    faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
//draw the small face
faceCtx.drawImage(
    video,
    face.x,
    face.y,
    face.width,
    face.height,

    face.x,
    face.y,
    options.SIZE,
    options.SIZE

);
//draw the small face back on, but scale so strech it back
const width = face.width * options.SCALE;
const height = face.height * options.SCALE;

faceCtx.drawImage(
    faceCanvas, 
    face.x,
    face.y,
    options.SIZE, 
    options.SIZE,

    face.x - (width - face.width) / 2,
    face.y - (height - face.height) / 2,
    width,
    height

    );

}
populateVideo().then(detect);