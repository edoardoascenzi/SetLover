from fastapi import APIRouter, BackgroundTasks, Response
from fastapi import Query
import requests
from bs4 import BeautifulSoup
import re
import yt_dlp
import os
import uuid
import aiofiles

YOUTUBE_SEARCH_URL = "https://www.youtube.com/results"

# Directory for temporary audio files
TEMP_AUDIO_DIR = "temp_audio"


# Ensure the temp audio directory exists
if not os.path.exists(TEMP_AUDIO_DIR):
    os.makedirs(TEMP_AUDIO_DIR)

# good to have this but not only @ startup and shoutdown, we need cyclically 
# @app.on_event("startup")
# async def cleanup_temp_files():
#     """
#     Clean up any leftover temporary audio files on startup.
#     """
#     shutil.rmtree(TEMP_AUDIO_DIR)
#     os.makedirs(TEMP_AUDIO_DIR)



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
async def youtube_audio(video_id: str, background_tasks: BackgroundTasks):
    """
    Endpoint to extract audio from a YouTube video and stream it.
    """
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    # Generate a unique filename for the extracted audio
    audio_file = os.path.join(TEMP_AUDIO_DIR, f"{uuid.uuid4()}")  

    # Start the audio extraction asynchronously
    await extract_audio(video_url, audio_file)

    # # Add background task to delete the file after serving
    # background_tasks.add_task(os.remove, audio_file)

    # Stream the audio file back to the client
    return Response(stream_audio(audio_file), media_type="audio/mpeg")
    # return {"respose":"OK"}



def scrape_youtube_search(query: str):
    # Format the YouTube search URL with the query
    search_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
    
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
    
    # if isinstance(video_results, list):
    #     for idx, video in enumerate(results, start=1):
    #         print(f"{idx}. {video['title']} by {video['channel']}")
    #         print(f"   Length: {video['length']}")
    #         print(f"   Thumbnail: {video['thumbnail_url']}")
    #         print(f"   URL: {video['video_url']}")
    #         print(f"   Video ID: {video['video_id']}")
    #         print()
    # else:
    #     print(video_results['error'])

    return video_results



async def extract_audio(video_url: str, audio_file: str):
    """
    Extracts the audio from the YouTube video and saves it as an MP3 file.
    """
    ffmpeg_location = './FastAPI/third_party/ffmpeg/bin/' 
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': audio_file,  # Save the file as a unique name
        'quiet': True,  # Suppress output for cleanliness
        'ffmpeg_location': ffmpeg_location,  # Point to local ffmpeg binary
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
 

async def stream_audio(file_path: str):
    """
    Streams the audio file in chunks.
    """
    async with aiofiles.open(file_path, mode='rb') as audio_file:
        while True:
            chunk = await audio_file.read(1024 * 1024)  # Read in 1MB chunks
            if not chunk:
                break
            yield chunk
