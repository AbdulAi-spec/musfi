/**
 * Happy Birthday Dr. Musfi - Interactive Experience Logic
 * Created with Love by Abdul Rehman
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const screens = document.querySelectorAll('.quiz-screen');
  const topProgress = document.getElementById('topProgressIndicator');
  const startExamBtn = document.getElementById('startExamBtn');
  const unlockCelebrationBtn = document.getElementById('unlockCelebrationBtn');
  const restartQuizBtn = document.getElementById('restartQuizBtn');
  const replayVoiceBtn = document.getElementById('replayVoiceBtn');
  
  // Audio elements
  const whisperAudio = document.getElementById('whisperAudio');
  const voicePlayBtn = document.getElementById('voicePlayBtn');
  const playIcon = document.getElementById('playIcon');
  const pulseRing = document.getElementById('pulseRing');
  const waveVisualizer = document.getElementById('waveVisualizer');
  
  // Ambient Music & Audio Synthesizer
  const bgmToggleBtn = document.getElementById('bgmToggleBtn');
  let audioCtx = null;
  let isBgmPlaying = false;
  let bgmInterval = null;

  // Candle Elements
  const birthdayCandle = document.getElementById('birthdayCandle');
  const candleFlame = document.getElementById('candleFlame');
  const candleHint = document.getElementById('candleHint');

  let currentScreenIndex = 0;
  const totalScreens = screens.length; // 16 screens total (0 to 15)

  // -------------------------------------------------------------
  // Screen Navigation
  // -------------------------------------------------------------
  function showScreen(index) {
    if (index < 0 || index >= totalScreens) return;
    
    screens.forEach(screen => screen.classList.remove('active'));
    screens[index].classList.add('active');
    currentScreenIndex = index;

    // Update Top Progress
    if (index === 0) {
      topProgress.textContent = "Welcome Exam";
    } else if (index === totalScreens - 1) {
      topProgress.textContent = "Grand Celebration 🎉";
    } else {
      topProgress.textContent = `Page ${index} / ${totalScreens - 1}`;
    }

    // Smooth scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startExamBtn?.addEventListener('click', () => {
    showScreen(1);
    startRomanticMusic();
  });

  unlockCelebrationBtn?.addEventListener('click', () => {
    showScreen(15);
    triggerMegaConfetti();
  });

  restartQuizBtn?.addEventListener('click', () => {
    // Reset options
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('selected-correct', 'revealed-correct');
    });
    document.querySelectorAll('.feedback-box').forEach(fb => {
      fb.classList.remove('active');
    });
    showScreen(0);
  });

  // Next Step Buttons inside question cards
  document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextIndex = parseInt(btn.getAttribute('data-next'), 10);
      if (!isNaN(nextIndex)) {
        showScreen(nextIndex);
      }
    });
  });

  // -------------------------------------------------------------
  // Quiz Option Click Handling
  // -------------------------------------------------------------
  document.querySelectorAll('.options-grid').forEach((grid, qIdx) => {
    const optionBtns = grid.querySelectorAll('.option-btn');
    const feedbackBox = grid.parentElement.querySelector('.feedback-box');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Disable all options in this grid once answered
        optionBtns.forEach(b => b.disabled = true);

        const isCorrect = btn.getAttribute('data-correct') === 'true';

        if (isCorrect) {
          btn.classList.add('selected-correct');
          playSoftChime(true);
          burstHearts(btn);
        } else {
          btn.classList.add('selected-correct'); // In this love quiz, every answer she picks is adorable!
          // Also highlight the ideal sweet answer
          optionBtns.forEach(b => {
            if (b.getAttribute('data-correct') === 'true') {
              b.classList.add('revealed-correct');
            }
          });
          playSoftChime(false);
          burstHearts(btn);
        }

        // Show feedback container
        if (feedbackBox) {
          feedbackBox.classList.add('active');
        }
      });
    });
  });

  // -------------------------------------------------------------
  // Quiz 6: Voice Note Whisper Audio Player
  // -------------------------------------------------------------
  function toggleVoiceNote() {
    if (!whisperAudio) return;

    if (whisperAudio.paused) {
      whisperAudio.play().then(() => {
        playIcon.textContent = "❚❚";
        pulseRing?.classList.add('pulsing');
        waveVisualizer?.classList.add('playing');
        triggerHeartSparkle();
      }).catch(err => {
        console.warn("Audio play blocked or unavailable:", err);
      });
    } else {
      whisperAudio.pause();
      playIcon.textContent = "▶";
      pulseRing?.classList.remove('pulsing');
      waveVisualizer?.classList.remove('playing');
    }
  }

  voicePlayBtn?.addEventListener('click', toggleVoiceNote);

  whisperAudio?.addEventListener('ended', () => {
    playIcon.textContent = "▶";
    pulseRing?.classList.remove('pulsing');
    waveVisualizer?.classList.remove('playing');
  });

  replayVoiceBtn?.addEventListener('click', () => {
    if (whisperAudio) {
      whisperAudio.currentTime = 0;
      toggleVoiceNote();
    }
  });

  // -------------------------------------------------------------
  // Birthday Candle Interaction
  // -------------------------------------------------------------
  birthdayCandle?.addEventListener('click', blowCandle);
  candleFlame?.addEventListener('click', blowCandle);

  function blowCandle() {
    if (!candleFlame.classList.contains('blown-out')) {
      candleFlame.classList.add('blown-out');
      candleHint.innerHTML = "🎉 <strong>Candle Blown! Happy Birthday Dr. Musfi!</strong> Your wish is sealed with Abdul Rehman's love! ❤️";
      triggerMegaConfetti();
      playCelebrationChime();
    }
  }

  // -------------------------------------------------------------
  // Romantic Ambient Synth (Web Audio API)
  // -------------------------------------------------------------
  function initAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft romantic note tones (A-Major pentatonic scale)
  const romanticNotes = [220.00, 277.18, 329.63, 440.00, 554.37, 659.25]; // A3, C#4, E4, A4, C#5, E5
  let noteIdx = 0;

  function playAmbientNote() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const freq = romanticNotes[noteIdx % romanticNotes.length];
      noteIdx = (noteIdx + 1) % romanticNotes.length;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 2.6);
    } catch (e) {
      // safe fallback
    }
  }

  function startRomanticMusic() {
    initAudioCtx();
    if (isBgmPlaying) return;
    isBgmPlaying = true;
    bgmToggleBtn?.classList.add('active');
    if (bgmInterval) clearInterval(bgmInterval);
    playAmbientNote();
    bgmInterval = setInterval(playAmbientNote, 1200);
  }

  function stopRomanticMusic() {
    isBgmPlaying = false;
    bgmToggleBtn?.classList.remove('active');
    if (bgmInterval) clearInterval(bgmInterval);
  }

  bgmToggleBtn?.addEventListener('click', () => {
    initAudioCtx();
    if (isBgmPlaying) {
      stopRomanticMusic();
    } else {
      startRomanticMusic();
    }
  });

  function playSoftChime(isPrimary) {
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const notes = isPrimary ? [523.25, 659.25, 783.99] : [440.00, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.7);
      });
    } catch (e) {}
  }

  function playCelebrationChime() {
    initAudioCtx();
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.3);
      });
    } catch (e) {}
  }

  // -------------------------------------------------------------
  // Ambient Canvas Hearts & Confetti
  // -------------------------------------------------------------
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleTypes = ['heart', 'sparkle', 'dot'];

  class Particle {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * width;
      this.y = y ?? (isBurst ? y : Math.random() * height);
      this.size = Math.random() * (isBurst ? 16 : 8) + 4;
      this.type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.12;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.012;
      } else {
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(Math.random() * 0.8 + 0.3);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = 0;
      }

      this.isBurst = isBurst;
      const colors = ['#e11d48', '#ff2e63', '#fda4af', '#fde68a', '#06b6d4', '#ffffff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.isBurst) {
        this.vy += this.gravity;
        this.alpha -= this.decay;
      } else {
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      if (this.type === 'heart') {
        drawHeart(this.x, this.y, this.size);
      } else if (this.type === 'sparkle') {
        drawStar(this.x, this.y, 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawHeart(x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + size, x, y + size);
    ctx.bezierCurveTo(x, y + size, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  // Populate initial floating background particles
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  function burstHearts(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 28; i++) {
      particles.push(new Particle(centerX, centerY, true));
    }
  }

  function triggerHeartSparkle() {
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 35; i++) {
      particles.push(new Particle(centerX, centerY, true));
    }
  }

  function triggerMegaConfetti() {
    for (let i = 0; i < 120; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * (height / 2), true));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.isBurst && p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();
});
