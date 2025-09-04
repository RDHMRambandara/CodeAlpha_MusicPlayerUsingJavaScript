class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.autoplay = false;
        
        this.playlist = [
            {
                title: "Neon nights",
                artist: "Patrick Patrikios",
                src: "Neon nights - Patrick Patrikios.mp3",
                duration: "2:42",
                image: "images.jpeg"
            },
            {
                title: "Rubberband",
                artist: "The Grey Room/Density & Time",
                src: "Rubberband - The Grey Room _ Density & Time.mp3",
                duration: "3:07",
                image: "hq720.jpg"
            },
            {
                title: "Love Me Never Ending",
                artist: "Everet Almond",
                src: "Love Me Never Ending - Everet Almond.mp3",
                duration: "2:55",
                image: "maxresdefault.jpg"
            },
            {
                title: "Precious Girl",
                artist: "Ryan Stasik,Kanika Moore",
                src: "Precious Girl - Ryan Stasik, Kanika Moore.mp3",
                duration: "3:13",
                image: "maxresdefault (1).jpg"
            },
            {
                title: "Floating Lanterns",
                artist: "The Mini Vandals",
                src: "Floating Lanterns - The Mini Vandals.mp3",
                duration: "1:56",
                image: "images (1).jpeg"
            },
            {
                title: "Brave",
                artist: "Mark Karan, Scott Guberman, Angeline Saris, Jeremy Hoenig",
                src: "Brave - Mark Karan, Scott Guberman, Angeline Saris, Jeremy Hoenig.mp3",
                duration: "2:56",
                image: "hq720 (1).jpg"
            },
            {
                title: "Final Boss Battle",
                artist: "Rod Kim",
                src: "Final Boss Battle - Rod Kim.mp3",
                duration: "1:40",
                image: "images (2).jpeg"
            },
            {
                title: "Kayak",
                artist: "The Grey Room / Density & Time",
                src: "Kayak - The Grey Room _ Density & Time.mp3",
                duration: "2:42",
                image: "images (3).jpeg"
            }
        ];
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderPlaylist();
        this.loadSong(0);
        this.updatePlaylistSummary();
    }

    initializeElements() {
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.durationDisplay = document.getElementById('duration');
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        this.playlistElement = document.getElementById('playlist');
        this.autoplayToggle = document.getElementById('autoplayToggle');
        this.musicPlayerElement = document.getElementById('musicPlayer');
        this.albumArtElement = document.getElementById('albumArt');
        this.playlistSummary = document.getElementById('playlistSummary');
    }

    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.songEnded());
        this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
    }

    renderPlaylist() {
        this.playlistElement.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="playlist-item-number">${(index + 1).toString().padStart(2, '0')}</div>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${song.title}</div>
                    <div class="playlist-item-artist">${song.artist}</div>
                </div>
                <div class="playlist-item-duration">${song.duration}</div>
            `;
            
            item.addEventListener('click', () => this.loadSong(index));
            this.playlistElement.appendChild(item);
        });
    }

    updatePlaylistSummary() {
        const totalTracks = this.playlist.length;
        this.playlistSummary.textContent = `${totalTracks} tracks`;
    }

    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentSongIndex = index;
        const song = this.playlist[index];
        
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.durationDisplay.textContent = song.duration;
        this.audio.src = song.src;
        
        this.albumArtElement.style.backgroundImage = `url('${song.image}')`;
        
        this.renderPlaylist();
        
        this.progress.style.width = '0%';
        this.currentTime.textContent = '0:00';
        this.totalTime.textContent = song.duration;
        
        if (this.isPlaying) {
            this.audio.play();
        } else {
            this.audio.load();
            this.pause();
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.playPauseBtn.textContent = '⏸';
        this.musicPlayerElement.classList.add('playing');
        this.audio.play();
    }

    pause() {
        this.isPlaying = false;
        this.playPauseBtn.textContent = '▶';
        this.musicPlayerElement.classList.remove('playing');
        this.audio.pause();
    }

    previousSong() {
        const newIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextSong() {
        const newIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(newIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const duration = this.audio.duration;
        if (!isNaN(duration)) {
            const seekTime = (clickX / rect.width) * duration;
            this.audio.currentTime = seekTime;
        }
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        this.autoplayToggle.classList.toggle('active', this.autoplay);
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
        }
    }

    updateProgress() {
        const duration = this.audio.duration;
        const currentTime = this.audio.currentTime;

        if (!isNaN(duration)) {
            const progressPercent = (currentTime / duration) * 100;
            this.progress.style.width = progressPercent + '%';
            this.currentTime.textContent = this.formatTime(currentTime);
        }
    }

    updateTotalTime() {
        const duration = this.audio.duration;
        if (!isNaN(duration)) {
            this.totalTime.textContent = this.formatTime(duration);
        }
    }

    songEnded() {
        if (this.autoplay && this.currentSongIndex < this.playlist.length - 1) {
            this.nextSong();
        } else {
            this.pause();
            this.progress.style.width = '100%';
            this.currentTime.textContent = this.totalTime.textContent;
        }
    }

    parseDuration(duration) {
        if (!duration) return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else if (parts.length === 3) {
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
        return 0;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});