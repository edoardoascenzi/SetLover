from fastapi import FastAPI, Response, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os
import uuid
import aiofiles
import shutil

app = FastAPI()

# Directory for temporary audio files
TEMP_AUDIO_DIR = "temp_audio"


# Ensure the temp audio directory exists
if not os.path.exists(TEMP_AUDIO_DIR):
    os.makedirs(TEMP_AUDIO_DIR)


async def extract_audio(video_url: str, audio_file: str):
    """
    Extracts the audio from the YouTube video and saves it as an MP3 file.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': audio_file,  # Save the file as a unique name
        'quiet': True,  # Suppress output for cleanliness
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


origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message":"hello world"}

# good to have this but not only @ startup and shoutdown, we need cyclically 
# @app.on_event("startup")
# async def cleanup_temp_files():
#     """
#     Clean up any leftover temporary audio files on startup.
#     """
#     shutil.rmtree(TEMP_AUDIO_DIR)
#     os.makedirs(TEMP_AUDIO_DIR)


@app.get("/youtube-audio/")
async def youtube_audio(video_id: str, background_tasks: BackgroundTasks):
    """
    Endpoint to extract audio from a YouTube video and stream it.
    """
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    # Generate a unique filename for the extracted audio
    audio_file = os.path.join(TEMP_AUDIO_DIR, f"{uuid.uuid4()}.mp3")

    # Start the audio extraction asynchronously
    await extract_audio(video_url, audio_file)

    # Add background task to delete the file after serving
    background_tasks.add_task(os.remove, audio_file)

    # Stream the audio file back to the client
    return Response(stream_audio(audio_file), media_type="audio/mpeg")