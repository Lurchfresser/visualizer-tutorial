const container = document.querySelector('#container');
const canvas = document.querySelector('#canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**
 * @type {CanvasRenderingContext2D}
 */
const drawCtx = canvas.getContext('2d');





/**
     * @type {HTMLAudioElement}
     */
const audioElement = document.querySelector('#audio');
//let audio = new Audio('overthinker.mp3');
/**
 * @type {AudioContext}
 */
const audioCtxRealSong = new AudioContext();

// audioElement.play();
/**
 * @type {MediaElementAudioSourceNode}
 */
let audioSource = audioCtxRealSong.createMediaElementSource(audioElement);
/**
 * @type {AnalyserNode}
 */
let analyser = audioCtxRealSong.createAnalyser();
audioSource.connect(analyser);


/**
 * @type {HTMLAudioElement}
 */
let fakeAudioElement = document.getElementById('fakeAudio');
/**
 * @type {AudioContext}
 */
let fakeAudioCtx = new AudioContext();
/**
 * @type {MediaElementAudioSourceNode}
 */
let fakeAudioSource = fakeAudioCtx.createMediaElementSource(fakeAudioElement);
/**
 * @type {AnalyserNode}
 */
let fakeAnalyser = fakeAudioCtx.createAnalyser();


fakeAudioElement.destination = fakeAudioCtx.destination;

fakeAudioSource.connect(fakeAnalyser);
//fakeAnalyser.connect(fakeAudioCtx.destination);

analyser.connect(audioCtxRealSong.destination);
analyser.fftSize = 64;


container.addEventListener('click', () => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;

    function animate() {
        let x = 0;
        drawCtx.clearRect(0, 0, canvas.width, canvas.height);
        fakeAnalyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const r = barHeight + (25 * (i / bufferLength));
            const g = 250 * (i / bufferLength);
            const b = 50;
            drawCtx.fillStyle = `rgb(${r},${g},${b})`;
            drawCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate();
});