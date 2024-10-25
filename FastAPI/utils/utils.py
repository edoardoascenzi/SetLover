from datetime import datetime, timedelta, timezone
import logging
import os

from FastAPI.utils.const import *

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def cleanup_temp_files():
    """
    Deletes files in TEMP_AUDIO_DIR that have not been accessed in the last TIMEOUT_DELETE_TEMP_AUDIO_H hours.
    """
    threshold_time = datetime.now(timezone.utc) - timedelta(hours=TIMEOUT_DELETE_TEMP_AUDIO_H)
    for filename in os.listdir(TEMP_AUDIO_DIR):
        file_path = os.path.join(TEMP_AUDIO_DIR, filename)
        try:
            # Check last accessed time
            last_accessed_time = datetime.fromtimestamp(os.path.getatime(file_path), timezone.utc)
            if last_accessed_time < threshold_time:
                os.remove(file_path)
                logger.info(f"Deleted old temp file: {file_path}")
                print(f"Deleted old temp file: {file_path}")
        except Exception as e:
            logger.error(f"Error while deleting file {file_path}: {e}")