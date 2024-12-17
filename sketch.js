let handPose;
let video;
let hands = [];
let d = 0;
let osc, frq, amp;

function preload() {
    handPose = ml5.handPose({ flipped: true });
}

// https://p5js.org/reference/p5/createCapture/
function setup() {
    createCanvas(800, 600);
    video = createCapture(VIDEO, { flipped: true });
    video.size(800, 600);
    video.hide(); // hides the video from off canvas

    // Start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);

    osc = new p5.Oscillator();
    osc.setType('sawtooth');
}

// reference: heavily inspired by coding train's HandPose Painting 
// https://editor.p5js.org/codingtrain/sketches/-C3Og5Wzs
function draw() {
    background(25);
    // video on the left hand side 
    // image(video, 0, 0, 800, 600);

    // reference: coding train asci art
    // https://editor.p5js.org/codingtrain/sketches/KTVfEcpWx
    // pixel cam
    let pixelSize = 10; // control resolution
    let pixW = width / pixelSize;
    let pixH = height / pixelSize;

    // draw each pixel
    video.loadPixels();
    for (let y = 0; y < pixH; y++) {
        for (let x = 0; x < pixW; x++) {
            let i = (y * pixelSize * video.width + x * pixelSize) * 4;
            let r = video.pixels[i];
            let g = video.pixels[i + 1];
            let b = video.pixels[i + 2];
            fill(r, g, b);
            noStroke();
            rect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    // draw tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        if (hand.confidence > 0.85) {
            // only start once
            // https://p5js.org/tutorials/simple-melody-app/
            if (!osc.started) {
                osc.start();
            }
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                fill(186, 255, 223, 200); // greenish blue
                noStroke();
                circle(keypoint.x, keypoint.y, 5); // small circles at keypoints
            }

            if (hand.handedness == "Left") {
                let index = hand.index_finger_tip;
                let thumb = hand.thumb_tip;

                let x = (index.x + thumb.x) / 2; // average dist
                let y = (index.y + thumb.y) / 2; // average dist

                d = dist(index.x, index.y, thumb.x, thumb.y); // dist btwn fingers
                d = Math.round(d / 10) * 10; // round to then tens

                // controls volume based of circle diameter
                if (d > 25) {
                    fill(150, 230, 179, 230);
                    circle(x, y, d);
                } else {
                    osc.amp(0);
                    circle(x, y, 0);
                }

                amp = map(d, 25, 200, 0, 1, true);
                amp = round(amp, 2); // round to 2 decimals
                osc.amp(amp);

                frq = map(thumb.y, 0, 480, 480, 10, true);
                osc.freq(frq);
            }

            if (hand.handedness == "Right") {
                let indexX = hand.index_finger_tip.x;
                let indexY = hand.index_finger_tip.y;

                // set osc type and visual feedback
                if (indexX > 600 && indexY < 300) { // top right
                    osc.setType('sine');
                    fill(41, 115, 115, 50); // blue-green
                    rect(790, 0, 10, 300);
                } else if (indexX > 600 && indexY >= 300 && indexY < 600) { // bottom right
                    osc.setType('square');
                    fill(255, 133, 82, 50); // orange
                    rect(790, 300, 10, 300);
                } else {
                    osc.setType('sawtooth');
                }

            }

        }
    }

}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
}

function mousePressed() {
    console.log(hands);
}