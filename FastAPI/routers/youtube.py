from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse
import requests
from bs4 import BeautifulSoup
import re
import yt_dlp
import os
import aiofiles

from FastAPI.utils.const import *



router = APIRouter(
    prefix="/youtube",
    tags=['Youtube']
)


@router.get('/search')
async def youtube_search(q: str = Query(..., min_length=1)):
    """
    Endpoint that scrapes YouTube and returns search results for the query.
    """
    results = scrape_youtube_search(q)
    return {"results": results}

@router.get("/play")
async def youtube_play(id: str = Query(..., min_length=1)):
    """
    Endpoint to extract audio from a YouTube video and stream it.
    """
    audio_file = extract_audio(id)

    # Stream the audio file back to the client
    return StreamingResponse(stream_audio(audio_file), media_type="audio/mpeg")

@router.get("/download")
async def youtube_download(id: str = Query(..., min_length=1)):
    """
    Endpoint to download audio from a YouTube video.
    """
    extract_audio(id)
    
    return{"status" : "Downloaded"} 




def scrape_youtube_search(query: str):
    # Format the YouTube search URL with the query
    search_url = f"{YOUTUBE_SEARCH_URL}{query.replace(' ', '+').replace('%','+')}"
    
    # Send a request to the YouTube search results page
    response = requests.get(search_url)
    # Check if the request was successful
    if response.status_code != 200:
        return {"error": f"Failed to retrieve search results. Status code: {response.status_code}"}
    
    # Parse the page content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract JavaScript data that contains video info
    scripts = soup.find_all("script")
    video_data_script = None
    
    for script in scripts:
        if 'ytInitialData' in script.text:
            video_data_script = script
            break

    if not video_data_script:
        return {"error": "Failed to locate video data on the page"}

    # Use regex to extract JSON from the JavaScript
    json_str = re.search(r"ytInitialData\s*=\s*(\{.*?\});", video_data_script.string).group(1)
    
    # Convert the string to a Python dictionary
    import json
    video_data = json.loads(json_str)
    
    # Locate the video details in the data
    video_results = []
    
    try:
        video_items = video_data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents']
        
        for item in video_items:
            if 'videoRenderer' in item:
                video_info = item['videoRenderer']
                video_title = video_info['title']['runs'][0]['text']
                video_id = video_info['videoId']
                video_url = f"https://www.youtube.com/watch?v={video_id}"
                thumbnail_url = video_info['thumbnail']['thumbnails'][0]['url']
                channel_name = video_info['longBylineText']['runs'][0]['text']
                length_text = video_info.get('lengthText', {}).get('simpleText', 'Unknown')

                video_results.append({
                    'title': video_title,
                    'channel': channel_name,
                    'length': length_text,
                    'thumbnail_url': thumbnail_url,
                    'video_id': video_id,
                    'video_url': video_url
                })
    except KeyError:
        return {"error": "Failed to parse video data from the search results"}
    
    return video_results

# async def extract_audio(video_url: str, audio_file: str):
def extract_audio(id: str) -> str: # TODO add error catch and raise HTTPException(status_code=status.)
    """
    Extracts the audio from the YouTube video and saves it as an MP3 file.
    """
    video_url = f"{YOUTUBE_VIDEO_URL}{id}"

    audio_file_no_extension = os.path.join(TEMP_AUDIO_DIR, f"{router.tags[0].lower()}_{id}")
    audio_file = audio_file_no_extension + ".mp3"

    # Check if the audio is already available
    if os.path.isfile(audio_file):    
        # exit and return the audio file name
        return audio_file

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': audio_file_no_extension,  # Save the file as a unique name adding the ext
        'quiet': True,  # Suppress output for cleanliness
        'ffmpeg_location': FFMPEG_LOCATION,  # Point to local ffmpeg binary
        'postprocessor_args': ['-f', 'mp3'],  # Force output as mp3 without adding an 
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])

    return audio_file
 

async def stream_audio(file_path: str):
    """
    Streams the audio file in chunks.
    """
    async with aiofiles.open(file_path, mode='rb') as audio_file:
        while True:
            chunk = await audio_file.read(1024 * 1024 *10)  # Read in 10MB chunks
            if not chunk:
                break
            yield chunk
