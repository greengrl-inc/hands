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
    image(video, 0, 0, 800, 600);

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        if (hand.confidence > 0.85) {
            // https://p5js.org/tutorials/simple-melody-app/
            // only start once
            if (!osc.started) {
                osc.start();
            }
            for (let j = 0; j < hand.keypoints.length; j++) {
                let keypoint = hand.keypoints[j];
                fill(186, 255, 223, 200);
                // 
                noStroke();
                circle(keypoint.x, keypoint.y, 5);
            }

            if (hand.handedness == "Left") {
                let index = hand.index_finger_tip;
                let thumb = hand.thumb_tip;

                let x = (index.x + thumb.x) / 2; // average dist
                let y = (index.y + thumb.y) / 2; // average dist

                d = dist(index.x, index.y, thumb.x, thumb.y);
                d = Math.round(d / 10) * 10;


                if (d > 25) {
                    fill(150, 230, 179, 230);
                    circle(x, y, d);
                } else {
                    osc.amp(0);
                    circle(x, y, 0);
                }

                amp = map(d, 25, 200, 0, 1, true);
                amp = round(amp, 2);
                osc.amp(amp);

                frq = map(thumb.y, 0, 480, 480, 10, true);
                osc.freq(frq);
            }

            if (hand.handedness == "Right") {
                let indexX = hand.index_finger_tip.x;
                let indexY = hand.index_finger_tip.y;

                if (indexX > 700 && indexY < 300) {
                    osc.setType('sine');
                    fill(255, 0, 0, 100);
                    rect(790, 0, 10, 300);
                } else if (indexX > 700 && indexY >= 300 && indexY < 600) {
                    osc.setType('square');
                    fill(0, 0, 255, 100);
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