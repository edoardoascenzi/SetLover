from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

from FastAPI.utils.const import *
from .routers import youtube
from FastAPI.utils.utils import *

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    ## START STARTUP
    if not os.path.exists(TEMP_AUDIO_DIR):
        # Create the temp audio dir
        os.makedirs(TEMP_AUDIO_DIR)
    #run the clean temp file in the startup 
    cleanup_temp_files()
    # add the clean temp file job to a schedule
    scheduler.add_job(cleanup_temp_files, 'interval', minutes=TIMEOUT_DELETE_TEMP_AUDIO_H)
    scheduler.start()
    ## END STARTUP
    yield
    ## START SHUTDOWN
    scheduler.shutdown()
    ## END SHUTDOWN

# Scheduler instance
scheduler = BackgroundScheduler()

app = FastAPI(lifespan=lifespan)

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

app.include_router(youtube.router)
