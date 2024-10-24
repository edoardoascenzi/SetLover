import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import { useState, useEffect } from 'react';
import ResultList from './components/ResultList';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import MusicPlayer from './components/MusicPlayer';
// import {Song, FAKE_SONGS} from './modules.mjs'
// import Button from 'react-bootstrap/Button';
import {Routes, Route} from 'react-router-dom';
import {Login, Signup} from './components/Auth'

import API from './API.mjs';

function App() {
  const [searchQuery, setSearchQuery] = useState({source:'Youtube' , query: ''});
  const updateSearchQuery = (sq) => {
    setSearchQuery(sq)
    API.getSearchResult(sq.source, sq.query).then(
      res => setSongs(res)
    )
  };

  const [songs, setSongs] = useState([]);
  const foundSongs = songs.length > 0;
  const clearSongs = () => setSongs([]);


  const [playingSong, setPlayingSong] = useState({});
  const [bufferingState, setBufferingState] = useState(false)
  const clearPlayingSong = () => setPlayingSong({});
  const playSong = (song) => {
    if (song.stream_url === "") {
      setBufferingState(true)
      API.getAudioStream(song.source, song.id).then(
        res => {
          setBufferingState(false)
          song.stream_url = res;
          // needed here beacuse it has to be linked to this promise
          setPlayingSong(song);
        }
      ).catch(err => {
        setBufferingState(false); // Handle errors and stop buffering
        console.error('Error fetching audio stream:', err);
      });
    }
    else {
      setPlayingSong(song);
    }
  }
  const isPlaying = Object.keys(playingSong).length > 0; // true if a song is playing


  //####### queue and queue methods
  const [queue, setQueue] = useState([]);

  const addToQueue = (song) => {
    setQueue(oldQueue => [...oldQueue, song]);

  };
  
  const clearQueue = () => {
    setQueue([]);
  };

  const removeElementFromQueue = (index) => {
    setQueue(oldQueue => {
      oldQueue.splice(index, 1);
      return [...oldQueue];
    });
  };

  return (
    <Container>
      <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
        <NavigationBar />
        <Routes>
          <Route path="*" element={<>
            {isPlaying || bufferingState ? <MusicPlayer clearPlayingSong={clearPlayingSong} playingSong={playingSong} playSong={playSong} queue={queue} removeElementFromQueue={removeElementFromQueue} bufferingState={bufferingState} /> : null}
            <SearchBar searchQuery={searchQuery} updateSearchQuery={updateSearchQuery} clearSongs={clearSongs} />
            {foundSongs ? <ResultList songs={songs} playSong={playSong} addToQueue={addToQueue} /> : null}
          </>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </Col>
    </Container>
  );
}

export default App;
