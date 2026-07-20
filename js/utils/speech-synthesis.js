class SpeechSynthesis {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.loadVoices();
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    this.selectedVoice = this.voices.find(voice => voice.lang === 'en-US');
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth.getVoices();
      this.selectedVoice = this.voices.find(voice => voice.lang === 'en-US');
    };
  }

  speak(text, voice = this.selectedVoice) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    this.synth.speak(utterance);
  }
}