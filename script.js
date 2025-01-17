const m3uUrl = 'https://raw.githubusercontent.com/Yeadee/Toffee/refs/heads/main/toffee_ns_player.m3u';

// Function to fetch and parse JSON or M3U
async function fetchChannels() {
    try {
        const response = await fetch(m3uUrl);
        const m3uText = await response.text();
        const channels = parseM3U(m3uText);
        renderChannels(channels);
    } catch (error) {
        console.error('Error fetching M3U:', error);
    }
}

// Parse M3U file to extract channels
function parseM3U(m3uText) {
    const lines = m3uText.split('\n');
    const channels = [];
    let currentChannel = {};

    lines.forEach(line => {
        if (line.startsWith('#EXTINF:')) {
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const nameMatch = line.match(/,(.+)$/);
            if (logoMatch) currentChannel.logo = logoMatch[1];
            if (nameMatch) currentChannel.name = nameMatch[1];
        } else if (line.startsWith('http')) {
            currentChannel.link = line.trim();
            currentChannel.cookie = ''; // Add a placeholder for cookies if needed
            channels.push(currentChannel);
            currentChannel = {};
        }
    });

    return channels;
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
            <img src="${channel.logo || 'https://via.placeholder.com/200x150'}" alt="${channel.name}">
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

    // Hide the channel list and show the player
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

// Go back to channel list
function goBack() {
    const playerContainer = document.getElementById('player-container');
    const channelList = document.getElementById('channel-list');

    playerContainer.style.display = 'none';
    channelList.style.display = 'flex';
}

// Fetch and render channels on load
fetchChannels();
