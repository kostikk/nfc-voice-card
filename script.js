// ================================
// ГОЛОСОВАЯ ОТКРЫТКА
// ================================
const config = {
  title: "Для тебя ❤️",
  subtitle: "У тебя есть личное голосовое послание.",
  message: "Спасибо, что открыл(а) эту открытку.",
  fallbackText: "Привет! Это твоё личное голосовое послание. Спасибо, что открыл эту открытку."
};

document.title = config.title;
document.getElementById("title").textContent = config.title;
document.getElementById("subtitle").textContent = config.subtitle;
document.querySelector("#message p").textContent = config.message;

const audio = document.getElementById("audio");
const button = document.getElementById("playButton");
const icon = document.getElementById("playIcon");
const buttonText = document.getElementById("buttonText");
const status = document.getElementById("status");
const wave = document.getElementById("wave");

// ========================================
// ОТДЕЛЬНЫЕ ЗАКАЗЫ
// Без ?id=... используется старый voice.mp3.
// Например: ?id=001 → audio/001.mp3
// ========================================
const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (orderId && /^[a-zA-Z0-9_-]+$/.test(orderId)) {
  audio.src = `audio/${orderId}.mp3`;
  audio.load();
}

let usingSpeech = false;

function setPlaying(isPlaying) {
  wave.classList.toggle("playing", isPlaying);
  icon.textContent = isPlaying ? "Ⅱ" : "▶";
  buttonText.textContent = isPlaying ? "Пауза" : "Послушать";
}

function speakFallback() {
  if (!("speechSynthesis" in window)) {
    status.textContent = "Не удалось загрузить голосовое послание.";
    return;
  }

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    setPlaying(false);
    status.textContent = "Послание остановлено";
    usingSpeech = false;
    return;
  }

  const utterance = new SpeechSynthesisUtterance(config.fallbackText);
  utterance.lang = "ru-RU";
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    usingSpeech = true;
    setPlaying(true);
    status.textContent = "Воспроизводится голосовое послание…";
  };

  utterance.onend = () => {
    usingSpeech = false;
    setPlaying(false);
    status.textContent = "Послание закончено ❤️";
  };

  speechSynthesis.speak(utterance);
}

button.addEventListener("click", async () => {
  try {
    await audio.play();
    setPlaying(true);
    status.textContent = "Воспроизводится голосовое послание…";
  } catch (e) {
    speakFallback();
  }
});

audio.addEventListener("ended", () => {
  setPlaying(false);
  status.textContent = "Послание закончено ❤️";
});

audio.addEventListener("pause", () => {
  if (!audio.ended && !usingSpeech) {
    setPlaying(false);
    status.textContent = "Послание на паузе";
  }
});
