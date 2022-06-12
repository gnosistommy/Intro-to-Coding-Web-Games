let actx = new AudioContext();
let C1 = 130.81,
    Csharp1 = 138.59,
    D1= 146.83,
    Eflat1 = 155.56,
    E1 = 164.81,
    F1 = 174.61,
    Fsharp1 = 185.00,
    G1= 196.00,
    Gsharp1 = 207.65,
    A1 = 220.00,
    Bflat1 = 233.08,
    B1 = 246.94,
    C2 = 261.63,
    Csharp2 = 277.18,
    D2= 293.66,
    Eflat2 = 311.13,
    E2 = 329.63,
    F2 = 349.24,
    Fsharp2 = 369.99,
    G2= 392.00,
    Gsharp2 = 415.30,
    A2 = 440.00,
    Bflat2 = 466.16,
    B2 = 493.88,
    C3 = 523.25,
    Csharp3 = 554.37,
    D3= 587.33,
    Eflat3 = 622.25,
    E3 = 659.25,
    F3 = 698.46,
    Fsharp3 = 739.99,
    G3= 783.99,
    Gsharp3 = 830.61,
    A3 = 880.00,
    Bflat3 = 923.33,
    B3 = 987.77,
    C4 = 1046.50,
    Csharp4 = 1108.73,
    D4= 1174.66,
    Eflat4 = 1244.51,
    E4 = 1318.51,
    F4 = 1396.91,
    Fsharp4 = 1479.98,
    G4= 1567.98,
    Gsharp4 = 1661.22,
    A4 = 1760.00,
    Bflat4 = 1864.66,
    B4 = 1975.53,
    C5 = 2093;
function soundEffect(
frequencyValue,
 attack = 0,
 decay = 1,
 type = "sine",
 volumeValue = 1,
 panValue = 0,
 wait = 0,
 pitchBendAmount = 0,
 reverse = false,
 randomValue = 0,
 dissonance = 0,
 echo = undefined,
 reverb = undefined

){
    let oscillator = actx.createOscillator(),
        volume = actx.createGain(),
        pan = actx.createStereoPanner();

    oscillator.connect(volume);
    volume.connect(pan);
    pan.connect(actx.destination);

    volume.gain.value = volumeValue;
    pan.value = panValue;
    oscillator.type = type;

    let frequency;
    let randomInt = (min,max) => {
        return Math.floor(Math.random() * (max-min+1))+min;
    }
    if(randomValue > 0){
        frequency = randomInt(
            frequencyValue - randomValue /2,
            frequencyValue + randomValue/2
        );
    }else{
        frequency = frequencyValue;
    }
    oscillator.frequency.value = frequency;

    if(attack > 0)fadeIn(volume);
    if(decay > 0.0)fadeOut(volume);
    if(pitchBendAmount > 0)pitchBend(oscillator);
    if(echo > 0)addEcho(volume);
    if(reverb > 0)addReverb(volume);
    if(dissonance > 0)addDissonance(volume);

    play(oscillator);

    function addReverb(volumeNode){
        let convolver = actx.createConvolver();
        convolver.buffer = impulseResponse(reverb[0],reverb[1],reverb[2]);
        volumeNode.connect(convolver);
        convolver.connect(pan);
    }
    function addEcho(volumeNode){
        let feedback = actx.createGain(),
            delay = actx.createDelay(),
            filter = actx.createBiquadFilter();
        delay.delayTime.value = echo[0];
        feedback.gain.value = echo[1];
        if(echo[2])filter.frequency.value = echo[2];
        delay.connect(feedback)
        if(echo[2]){
            feedback.connect(filter);
            filter.connect(delay);
        }else{
            feedback.connect(delay);
        }
        volumeNode.connect(delay);
        delay.connect(pan);
    }
    function fadeIn(volumeNode){
        volumeNode.gain.value = 0;
        volumeNode.gain.linearRampToValueAtTime(
            0,actx.currentTime + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
            volumeValue,actx.currentTime + wait + attack
        );
    }
    function fadeOut(volumeNode){
        volumeNode.gain.linearRampToValueAtTime(
            volumeValue,actx.currentTime + attack + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
            0,actx.currentTime + wait + attack + decay
        );
    }
    function pitchBend(oscillatorNode){
        let frequency = oscillatorNode.frequency.value;
        if(!reverse){
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency,actx.currentTime + wait
            );
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency-pitchBendAmount,actx.currentTime + wait + attack + decay
            );
        }else{
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency,actx.currentTime + wait
            );
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency+pitchBendAmount,actx.currentTime + wait + attack + decay
            );
        }
    }
    function addDissonance(){
        let d1 = actx.createOscillator(),
            d2 = actx.createOscillator(),
            d1Volume = actx.createGain(),
            d2Volume = actx.createGain();
        d1Volume.gain.value = volumeValue;
        d2Volume.gain.value = volumeValue;
        d1.connect(d1Volume);
        d1Volume.connect(actx.destination);
        d2.connect(d2Volume);
        d2Volume.connect(actx.destination);
        d1.type = "sawtooth";
        d2.type = "sawtooth";
        d1.frequency.value = frequency + dissonance;
        d2.frequency.value = frequency - dissonance;
        if(attack > 0){
            fadeIn(d1Volume);
            fadeIn(d2Volume);
        }
        if(decay > 0){
            fadeOut(d1Volume);
            fadeOut(d2Volume);
        }
        if(pitchBendAmount > 0){
            pitchBend(d1);
            pitchBend(d2);
        }
        if(echo){
            addEcho(d1Volume);
            addEcho(d2Volume);
        }
        if(reverb){
            addReverb(d1Volume);
            addReverb(d2Volume);
        }

        play(d1);
        play(d2);
    }
    function play(oscillatorNode){
        try{
            oscillatorNode.start(actx.currentTime + wait);
            console.log(oscillatorNode.context);
        }finally{
            oscillatorNode.stop(actx.currentTime + wait + 1);
        }
    }
}
function shootSound(){
    soundEffect(
        1046.5,
        0,
        0.3,
        "triangle",
        .02,
        -0.8,
        0,
        1200,
        false,
        0,
        25,
        undefined,
        undefined
    );
}
function jumpSound(){
    soundEffect(
        523.25,
        0.05,
        0.2,
        "sine",
        .5,
        0.8,
        0,
        600,
        true,
        100,
        0,
        undefined,
        undefined
    );
}
function punchSound(){
    soundEffect(
        523.25,
        0.05,
        0.2,
        "sine",
        .5,
        0.8,
        0,
        600,
        false,
        100,
        0,
        undefined,
        undefined
    );
}
function countdown(a){
    if(a === '0'){
        soundEffect(C4,0,0.5,"sine",.1,0,0);
    }else{
        soundEffect(C4,0,0.2,"sine",.1,0,0);
        soundEffect(G4,0,0.2,"sine",.1,0,0.1);
        soundEffect(C5,0,0.2,"sine",.1,0,0.2);
    }

}
function explosionSound(){
    soundEffect(
        16,
        0,
        .5,
        "triangle",
        .05,
        0,
        0,
        0,
        false,
        0,
        10,
        undefined,
        undefined
    );
}
function bonusSound(){
    soundEffect(587.33,0,0.2,"sine",.05,0,0);
    soundEffect(880,0,0.2,"sine",.05,0,0.1);
    soundEffect(1174.66,0,0.3,"sine",.05,0,0.2);
}
function coinSound(){
    soundEffect(5755,0,1,"sine",.03,0,0.1,0,false,0,40);
}
function buzzer(){
    soundEffect(C1,0,0.2,"sawtooth",.04,0,0,0,false,0,40);
    soundEffect(C2,0,0.2,"sawtooth",.04,0,0,0,false,0,40);
    soundEffect(C1,0,0.2,"sawtooth",.04,0,0.2,0,false,0,40);
    soundEffect(C2,0,0.2,"sawtooth",.04,0,0.2,0,false,0,40);
    
    //soundEffect(250,0,0.3,"sawtooth",.04,0,0.1,0,false,0,1);
}
function bassDrum(){
    for(var i=0;i<50;i++){
        setTimeout(hitIt,1000*i);
        function hitIt(){soundEffect(50.0,0,.5,"sine",1,0,0);}
    }
}
