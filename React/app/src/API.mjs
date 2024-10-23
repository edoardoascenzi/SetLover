import { Song } from './modules.mjs'

const SERVER_URL = 'http://localhost:8000/';
const SEARCH_ROUTE = 'search?q=';
const PLAY_ROUTE = 'play?id=';

async function getAudioStream(source, id) {
    const fullQuery = `${SERVER_URL}${source.toLowerCase()}${PLAY_ROUTE}${id}`;
    const search = await fetch(fullQuery)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));  // Handle any potential errors
    return search;
}

async function getSearchResult(source, query) {
    const fullQuery = `${SERVER_URL}${source.toLowerCase()}/${SEARCH_ROUTE}${encodeURIComponent(query)}`;
    try {
        const response = await fetch(fullQuery);
        const res = await response.json();
        // console.log(response)
        const songs = res.results.map(result =>
            new Song(result.video_id, result.title, result.video_url, result.length, result.channel, result.thumbnail_url)
        )
        console.log(songs)
        return songs
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];  // Return an empty array in case of error
    }
}
const API = { getSearchResult }

export default API