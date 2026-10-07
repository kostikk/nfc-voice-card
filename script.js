// ================================
// НАСТРОЙКИ ОТКРЫТКИ
// ================================
const config = {
  title: "Для тебя ❤️",
  subtitle: "У тебя есть личное голосовое послание.",
  message: "Спасибо, что открыл(а) эту открытку.",
  // Текст используется только как запасной вариант,
  // если voice.mp3 ещё не добавлен.
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

let usingSpeech = false;

function setPlaying(isPlaying) {
  wave.classList.toggle("playing", isPlaying);
  icon.textContent = isPlaying ? "Ⅱ" : "▶";
  buttonText.textContent = isPlaying ? "Пауза" : "Послушать";
}

function speakFallback() {
  if (!("speechSynthesis" in window)) {
    status.textContent = "Добавь файл voice.mp3 в репозиторий.";
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
  // Если voice.mp3 доступен — используем его.
  if (audio.readyState > 0 && !audio.error) {
    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
        status.textContent = "Воспроизводится голосовое послание…";
      } else {
        audio.pause();
        setPlaying(false);
        status.textContent = "Послание на паузе";
      }
      return;
    } catch (e) {
      // Если браузер не смог проиграть файл, используем запасной голос.
    }
  }

  speakFallback();
});

audio.addEventListener("ended", () => {
  setPlaying(false);
  status.textContent = "Послание закончено ❤️";
});

audio.addEventListener("pause", () => {
  if (!audio.ended && !usingSpeech) setPlaying(false);
});