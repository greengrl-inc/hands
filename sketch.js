let handPose;
let video;
let hands = [];
let d;
let osc, frq, amp;

function preload() {
    handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
    console.log(hands, d);
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
}

function draw() {
    background(25);
    image(video, 0, 0, 640, 480);

    // Draw 
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        if (hand.confidence > 0.7) {

            // volume - modified from the pen width example
            // https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose
            if (hand.handedness == "Left") {
                let index = hand.index_finger_tip;
                let thumb = hand.thumb_tip;

                let x = (index.x + thumb.x) / 2; // average 
                let y = (index.y + thumb.y) / 2; // average 

                d = dist(index.x, index.y, thumb.x, thumb.y);

                if (d > 20) {
                    osc.start();
                    circle(x, y, d);
                } else {
                    osc.stop();
                }
                
                amp = map(d, 19, 200, 0, 1);
                osc.amp(round(amp, .5));
            }

            // pitch
            if (hand.handedness == "Right") {
                let index = hand.index_finger_tip.y;
                
                frq = map(index, 0, height, 500, 100);
                osc.freq(frq, 0.1);
            }

        }
    }

}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
}