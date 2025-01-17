const jsonUrl = 'https://raw.githubusercontent.com/Yeadee/Toffee/refs/heads/main/toffee_ns_player.json'; // Replace with your JSON URL

// Fetch and render the JSON playlist
async function fetchAndRenderChannels() {
    try {
        const response = await fetch(jsonUrl);
        const channels = await response.json();
        renderChannels(channels);
    } catch (error) {
        console.error('Error fetching JSON playlist:', error);
    }
}

// Render channels dynamically
function renderChannels(channels) {
    const channelList = document.getElementById('channel-list');
    channelList.innerHTML = '';

    channels.forEach(channel => {
        const card = document.createElement('div');
        card.className = 'channel-card';
        card.onclick = () => playChannel(channel);

        card.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            <h3>${channel.name}</h3>
        `;

        channelList.appendChild(card);
    });
}

// Play the selected channel
function playChannel(channel) {
    const playerContainer = document.getElementById('player-container');
    const videoPlayer = document.getElementById('video-player');
    const channelList = document.getElementById('channel-list');

    // Hide channel list and show player
    channelList.style.display = 'none';
    playerContainer.style.display = 'block';

    if (Hls.isSupported()) {
        const hls = new Hls({
            xhrSetup: function (xhr) {
                xhr.setRequestHeader('Cookie', channel.cookie);
            }
        });
        hls.loadSource(channel.link);
        hls.attachMedia(videoPlayer);
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = channel.link;
    }
}

// Go back to the channel list
function goBack() {
    const playerContainer = document.getElementById('player-container');
    const channelList = document.getElementById('channel
