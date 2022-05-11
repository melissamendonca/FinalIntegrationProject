let picture;
let imgState = 'wait';
let synth = new Tone.Synth();
synth.toDestination();
let startTime;
let serialPDM;                             // Variable to hold instance of serialport library
let portName = 'COM3';

function preload() {
  picture = loadImage("beach.gif")
}

function setup() {
  createCanvas(800, 600);
  serialPDM = new PDMSerial(portName);
  console.log(serialPDM.inData);
  sensors = serialPDM.sensorData;
  // synth.volume.value = sensors.a0 * -1/100;
}

function draw() {
  background(255, 255, 255);  
  if (imgState == 'wait') {
    textSize(20);
    text('Press mouse to start', 150, 200);
    if (mouseIsPressed) {
      startTime = millis();
      imgState = 'playing';
      Tone.Transport.start();

    }
  }
  else if (imgState == 'playing') {
    let time = timer();
    let totalTime = 5;
    vol = sensors.a0 * (-1/10);
    synth.volume.value = (vol);
    text("Time: " + (totalTime - time), 10, 30);
    if (time >= totalTime) {
      imgState = 'end';
      Tone.Transport.stop();
    }
    image(picture, 0, 0);


  }
    else if (imgState == 'end') {
      text("Press mouse to restart", 150, 200);
      if (mouseIsPressed) {
        startTime = millis();
        imgState = 'playing';
      }
    }
    }
     function timer() {
      return int((millis() - startTime)/1000);
      
    
    }

function mousePressed() {
  let pattern = new Tone.Sequence((time, note)=>{
    synth.triggerAttackRelease(note, '4n', time);
  }, ['E4','G#4','B5','D4', 'G#4']).start();
}