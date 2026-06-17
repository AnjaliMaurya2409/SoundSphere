const songs = [

{
    title:"Sample Song 1",
    artist:"Artist One",
    src:"songs/song1.mp3",
    cover:"https://picsum.photos/id/237/300/300"
},

{
    title:"Sample Song 2",
    artist:"Artist Two",
    src:"songs/song2.mp3",
    cover:"https://picsum.photos/id/238/300/300"
},

{
    title:"Sample Song 3",
    artist:"Artist Three",
    src:"songs/song3.mp3",
    cover:"https://picsum.photos/id/239/300/300"
}

];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playlist = document.getElementById("playlist");

let currentSong = 0;

function loadSong(index){

    audio.src = songs[index].src;

    title.textContent = songs[index].title;
    artist.textContent = songs[index].artist;
    cover.src = songs[index].cover;

    updatePlaylist();
}

loadSong(currentSong);

function playSong(){
    audio.play();
    playBtn.innerHTML = "⏸";
}

function pauseSong(){
    audio.pause();
    playBtn.innerHTML = "▶";
}

playBtn.addEventListener("click",()=>{

    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }

});

nextBtn.addEventListener("click",()=>{

    currentSong++;

    if(currentSong >= songs.length){
        currentSong = 0;
    }

    loadSong(currentSong);
    playSong();

});

prevBtn.addEventListener("click",()=>{

    currentSong--;

    if(currentSong < 0){
        currentSong = songs.length - 1;
    }

    loadSong(currentSong);
    playSong();

});

audio.addEventListener("timeupdate",()=>{

    const progressPercent =
        (audio.currentTime / audio.duration) * 100;

    progress.value = progressPercent || 0;

    currentTimeEl.textContent =
        formatTime(audio.currentTime);

});

audio.addEventListener("loadedmetadata",()=>{

    durationEl.textContent =
        formatTime(audio.duration);

});

progress.addEventListener("input",()=>{

    audio.currentTime =
        (progress.value / 100) * audio.duration;

});

volume.addEventListener("input",()=>{

    audio.volume = volume.value;

});

function formatTime(time){

    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);

    if(sec < 10){
        sec = "0" + sec;
    }

    return `${min}:${sec}`;
}

function createPlaylist(){

    songs.forEach((song,index)=>{

        const li = document.createElement("li");

        li.innerHTML =
            `${song.title} - ${song.artist}`;

        li.addEventListener("click",()=>{

            currentSong = index;

            loadSong(index);
            playSong();

        });

        playlist.appendChild(li);

    });

}

function updatePlaylist(){

    const items = document.querySelectorAll("#playlist li");

    items.forEach((item,index)=>{

        item.classList.remove("active");

        if(index === currentSong){
            item.classList.add("active");
        }

    });

}

createPlaylist();

audio.addEventListener("ended",()=>{

    currentSong++;

    if(currentSong >= songs.length){
        currentSong = 0;
    }

    loadSong(currentSong);
    playSong();

});