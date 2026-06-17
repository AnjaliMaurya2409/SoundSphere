// =========================
// SONG DATABASE
// =========================

let songs = [
{
    title: "Dreams",
    artist: "Artist One",
    src: "songs/song1.mp3",
    cover: "https://picsum.photos/400?random=1"
},
{
    title: "Night Drive",
    artist: "Artist Two",
    src: "songs/song2.mp3",
    cover: "https://picsum.photos/400?random=2"
},
{
    title: "Sunrise",
    artist: "Artist Three",
    src: "songs/song3.mp3",
    cover: "https://picsum.photos/400?random=3"
}
];

// =========================
// LIBRARY PAGE
// =========================

const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");
const songUpload = document.getElementById("songUpload");

// Load uploaded songs
if(localStorage.getItem("uploadedSongs")){
    const uploadedSongs =
        JSON.parse(localStorage.getItem("uploadedSongs"));

    songs = [...songs, ...uploadedSongs];
}

// Render Songs
function renderSongs(filteredSongs = songs){

    if(!songList) return;

    songList.innerHTML = "";

    filteredSongs.forEach((song,index)=>{

        const card = document.createElement("div");
        card.className = "song-card";

        card.innerHTML = `
            <div class="song-details">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>

            <button class="play-btn">
                ▶
            </button>
        `;

        card.addEventListener("click",()=>{

            const realIndex =
                songs.findIndex(
                    s => s.title === song.title &&
                    s.artist === song.artist
                );

            selectSong(realIndex);

        });

        songList.appendChild(card);

    });

}

// Search Songs
if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const value =
            searchInput.value.toLowerCase();

        const filtered = songs.filter(song =>
            song.title.toLowerCase().includes(value) ||
            song.artist.toLowerCase().includes(value)
        );

        renderSongs(filtered);

    });

}

// Upload Songs
if(songUpload){

    songUpload.addEventListener("change",(e)=>{

        const files = Array.from(e.target.files);

        files.forEach(file=>{

            const newSong = {

                title: file.name.replace(/\.[^/.]+$/, ""),
                artist: "Uploaded Song",
                src: URL.createObjectURL(file),
                cover:
                "https://picsum.photos/400?random=" +
                Math.floor(Math.random()*1000)

            };

            songs.push(newSong);

        });

        localStorage.setItem(
            "uploadedSongs",
            JSON.stringify(
                songs.slice(3)
            )
        );

        renderSongs();

    });

}

function selectSong(index){

    localStorage.setItem(
        "currentSongIndex",
        index
    );

    window.location.href =
        "player.html";

}

renderSongs();

// =========================
// PLAYER PAGE
// =========================

const audio = document.getElementById("audio");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");

const currentTimeEl =
document.getElementById("currentTime");

const durationEl =
document.getElementById("duration");

const volume =
document.getElementById("volume");

const shuffleBtn =
document.getElementById("shuffleBtn");

const repeatBtn =
document.getElementById("repeatBtn");

let currentSongIndex =
parseInt(
    localStorage.getItem(
        "currentSongIndex"
    )
) || 0;

let repeat = false;
let shuffle = false;

if(audio){

    loadSong(currentSongIndex);

}

// Load Song
function loadSong(index){

    if(!audio) return;

    const song = songs[index];

    audio.src = song.src;

    title.textContent =
    song.title;

    artist.textContent =
    song.artist;

    cover.src =
    song.cover;

}

// Play / Pause
if(playBtn){

playBtn.addEventListener("click",()=>{

    if(audio.paused){

        audio.play();

        playBtn.textContent =
        "⏸";

    }else{

        audio.pause();

        playBtn.textContent =
        "▶";

    }

});
}

// Next Song
if(nextBtn){

nextBtn.addEventListener("click",()=>{

    if(shuffle){

        currentSongIndex =
        Math.floor(
            Math.random()*songs.length
        );

    }else{

        currentSongIndex++;

        if(
            currentSongIndex >= songs.length
        ){
            currentSongIndex = 0;
        }

    }

    loadSong(currentSongIndex);

    audio.play();

    playBtn.textContent = "⏸";

});

}

// Previous Song
if(prevBtn){

prevBtn.addEventListener("click",()=>{

    currentSongIndex--;

    if(currentSongIndex < 0){

        currentSongIndex =
        songs.length - 1;

    }

    loadSong(currentSongIndex);

    audio.play();

    playBtn.textContent = "⏸";

});

}

// Progress Bar
if(audio){

audio.addEventListener("timeupdate",()=>{

    const percent =
        (audio.currentTime /
        audio.duration) * 100;

    progress.value =
    percent || 0;

    currentTimeEl.textContent =
    formatTime(audio.currentTime);

});

audio.addEventListener(
    "loadedmetadata",
    ()=>{

        durationEl.textContent =
        formatTime(audio.duration);

    }
);

}

// Seek
if(progress){

progress.addEventListener("input",()=>{

    audio.currentTime =
    (progress.value / 100) *
    audio.duration;

});

}

// Volume
if(volume){

volume.addEventListener("input",()=>{

    audio.volume =
    volume.value;

});

}

// Shuffle
if(shuffleBtn){

shuffleBtn.addEventListener("click",()=>{

    shuffle = !shuffle;

    shuffleBtn.style.background =
    shuffle
    ? "#ff4d6d"
    : "#2c2c2c";

});

}

// Repeat
if(repeatBtn){

repeatBtn.addEventListener("click",()=>{

    repeat = !repeat;

    repeatBtn.style.background =
    repeat
    ? "#ff4d6d"
    : "#2c2c2c";

});

}

// Autoplay Next
if(audio){

audio.addEventListener("ended",()=>{

    if(repeat){

        audio.currentTime = 0;

        audio.play();

        return;

    }

    currentSongIndex++;

    if(currentSongIndex >= songs.length){

        currentSongIndex = 0;

    }

    loadSong(currentSongIndex);

    audio.play();

});

}

// Time Formatter
function formatTime(time){

    let minutes =
    Math.floor(time / 60);

    let seconds =
    Math.floor(time % 60);

    if(seconds < 10){

        seconds = "0" + seconds;

    }

    return `${minutes}:${seconds}`;

}

// Back Button
function goBack(){

    window.location.href =
    "index.html";

}
