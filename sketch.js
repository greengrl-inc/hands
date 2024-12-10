let handPose;
let video;
let hands = [];

function preload() {
    handPose = ml5.handPose({ flipped: true });
}

function mousePressed(){
    console.log(hands);
}

// https://p5js.org/reference/p5/createCapture/
function setup() {
    createCanvas(900, 600);
    video = createCapture(VIDEO, { flipped: true });
    video.size(640, 480);
    video.hide(); // hides the video from off canvas

    // Start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);
}

function draw() {
    background(25);
    // imageMode(CENTER);
    image(video, 0, 0, 640, 480);

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        if (hand.confidence > 0.5) {
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(255, 255, 255);
            noStroke();
            circle(keypoint.x, keypoint.y, 10);
        }
    }
    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
}