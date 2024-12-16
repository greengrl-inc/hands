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
    createCanvas(900, 600);
    video = createCapture(VIDEO, { flipped: true });
    video.size(640, 480);
    video.hide(); // hides the video from off canvas

    // Start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);

    osc = new p5.Oscillator();
    osc.setType('sine');
}

function draw() {
    background(25);
    // video on the left hand side 
    image(video, 260, 0, 640, 480);

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(keypoint.x + 260, keypoint.y, 5);
        }

        if (hand.handedness == "Left") {
            let index = hand.index_finger_tip;
            let thumb = hand.thumb_tip;

            let x = (index.x + thumb.x) / 2; // average dist
            let y = (index.y + thumb.y) / 2; // average dist

            d = dist(index.x, index.y, thumb.x, thumb.y);

            if (d > 25) {
                osc.start();
                fill(255, 0, 150);
                circle(x + 260, y, d * .87);
            } else {
                osc.stop();
            }

            amp = map(d, 25, 200, 0, 1, true);
            osc.amp(round(amp, 1));
        }

        if (hand.handedness == "Right") {
            let indexY = hand.index_finger_tip.y;
            frequency = map(indexY, 0, 480, 500, 100, true);
        }

    }

}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
}

function mousePressed() {
    console.log(hands, d, amp);
}