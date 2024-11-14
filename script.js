const container = document.querySelector('#container');
const canvas = document.querySelector('#canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');
/**
 * @type {MediaElementAudioSourceNode}
 */
let audioSource;
/**
 * @type {AnalyserNode}
 */
let analyser;


/**
     * @type {HTMLAudioElement}
     */
const audioElement = document.querySelector('#audio');
audioElement.src = 'overthinker-full.mp3';
//let audio = new Audio('overthinker.mp3');
const audioCtx = new AudioContext();

audioElement.play();
audioSource = audioCtx.createMediaElementSource(audioElement);
analyser = audioCtx.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;


container.addEventListener('click', () => {
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width / bufferLength;
    let barHeight;

    function animate() {
        let x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            const r = barHeight + (25 * (i / bufferLength));
            const g = 250 * (i / bufferLength);
            const b = 50;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate();
});