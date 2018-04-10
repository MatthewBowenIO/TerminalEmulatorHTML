console.clear();

window.onload = () => {
    if (window.location.protocol !== "https:") {
        console.error('Error: Not HTTPS');
        return;
    }

    if (window.FaceDetector === undefined) {
        console.error('Error: FaceDetector not supported');
        return;
    }
  
    navigator.getUserMedia = navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia;

    if (!navigator.getUserMedia) { 
        console.error('Error: Media not found');
        return; 
    }
      
    var width = 0;
    var height = 0;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    var video = document.createElement('video'), track;
    video.setAttribute('autoplay', true);

    if(isMobile()) {
        const constraints = {
            advanced: [{
                facingMode: "user"
            }]
        };
        navigator.mediaDevices.getUserMedia({
            video: constraints
        }).then(stream => {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
        }).catch(e => {
            console.error("Error: Cannot get media from getUserMedia");
        });
    } else {
        navigator.getUserMedia({ 
            video: true, 
            audio: false 
        }, function(stream) {
            video.src = window.URL.createObjectURL(stream);
            track = stream.getTracks()[0];
        }, function (e) {
            console.error("Error: Cannot get media from getUserMedia");
        });    
    }

    var rotation = 0,
        loopFrame,
        loopCount = 0;

    function loop() {
        loopFrame = requestAnimationFrame(loop);

        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();

        if(loopCount === 15) {
            faceDetector.detect(canvas)
            .then(faces => draw(faces))
            .catch(error => {
                console.error('Error:', error);
            });
        }

        loopCount = loopCount < 15 ? loopCount += 1 : 0;
    }

    var faceDetector = new FaceDetector();
    function draw (faces) {
        faces.forEach(face => {
            face.landmarks.forEach(landmark => {
                ctx.beginPath();
                ctx.fillStyle = '#f1c40f';
                ctx.arc(landmark.location.x, landmark.location.y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font="10px sans-serif";
                ctx.fillText(landmark.type,landmark.location.x - 2,landmark.location.y - 5);
            });
            ctx.beginPath();
            ctx.strokeStyle = '#f1c40f';
            ctx.rect(face.boundingBox.x, face.boundingBox.y, face.boundingBox.width, face.boundingBox.height);
            ctx.stroke();
        });
    }

    function isMobile() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch(e) {
            return false;
        }
    }

    video.addEventListener('loadedmetadata',function(){
        width = canvas.width = video.videoWidth;
        height = canvas.height = video.videoHeight;
        loopFrame = loopFrame || requestAnimationFrame(loop);
    });
}