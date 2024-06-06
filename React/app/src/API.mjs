const SERVER_URL = 'http://localhost:8000/';

async function getHello() {
    const hello = await fetch(SERVER_URL)
    .then(response => response.json())
    return hello

}

const API = {getHello}

export default API