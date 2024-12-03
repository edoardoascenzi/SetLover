import { Song } from './modules.mjs'

// const SERVER_URL = 'http://127.0.0.1:8000/';
const SERVER_URL = '';
const PREFIX_URL = '/api'
const SEARCH_ROUTE = '/search?q=';
const PLAY_ROUTE = '/play?id=';
const DOWNLOAD_ROUTE = '/play?id=';

function createUrl(source, route, attribute) {
    return `${SERVER_URL}${PREFIX_URL}/${source.toLowerCase()}${route}${attribute}`;
}

async function getAudioStream(source, id) {
    const fullQuery = createUrl(source, PLAY_ROUTE, id);
    try {
        const response = await fetch(fullQuery);

        if (!response.ok) {
            throw new Error(`Error fetching audio: ${response.statusText}`);
        }

        // Convert response to a Blob (binary large object)
        const audioBlob = await response.blob();

        // Create a URL for the blob to be used in the audio element
        const audioUrl = URL.createObjectURL(audioBlob);

        return audioUrl
    } catch (error) {
        console.error('Error fetching or playing audio:', error);
        return ""
    }
}


async function downlaodAudio(source, id) {
    const fullQuery = createUrl(source, DOWNLOAD_ROUTE, id);
    try {
        const response = await fetch(fullQuery);

        if (!response.ok) {
            throw new Error(`Error fetching audio: ${response.statusText}`);
        }

        // Convert response to a Blob (binary large object)
        const audioBlob = await response.blob();

        // Create a URL for the blob to be used in the audio element
        const audioUrl = URL.createObjectURL(audioBlob);

        return audioUrl
    } catch (error) {
        console.error('Error fetching or downloading audio:', error);
        return ""
    }
}

async function getSearchResult(source, query) {
    const fullQuery = createUrl(source, SEARCH_ROUTE, query);
    try {
        const response = await fetch(fullQuery);
        const res = await response.json();
        const songs = res.results.map(
            result => new Song(result.video_id, result.title, source.toLowerCase(), result.video_url, result.length, result.channel, result.thumbnail_url))
        return songs
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];  // Return an empty array in case of error
    }
}
const API = { getSearchResult, getAudioStream }

export default API