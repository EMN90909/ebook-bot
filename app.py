from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
import mimetypes
import pickle
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCOPES = ['https://www.googleapis.com/auth/drive.file']
TOKEN_FILE = 'token.pickle'
CREDENTIALS_FILE = 'credentials.json'

def get_drive_service():
    """Authenticate and return Google Drive service instance."""
    creds = None
    if os.path.exists(TOKEN_FILE):
        try:
            with open(TOKEN_FILE, 'rb') as token:
                creds = pickle.load(token)
        except (pickle.UnpicklingError, EOFError, FileNotFoundError) as e:
            logger.warning(f"Token loading failed: {str(e)}")
            os.remove(TOKEN_FILE)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
            except Exception as e:
                logger.error(f"Token refresh failed: {str(e)}")
                creds = None
        else:
            try:
                flow = InstalledAppFlow.from_client_secrets_file(
                    CREDENTIALS_FILE, SCOPES)
                creds = flow.run_local_server(port=0)
            except FileNotFoundError:
                logger.error("Credentials file not found")
                raise

        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)

    return build('drive', 'v3', credentials=creds)

def upload_to_drive(file_path, folder_id=None):
    """
    Upload file to Google Drive and return shareable link.
    
    Args:
        file_path: Path to file to upload
        folder_id: Optional target folder ID
    
    Returns:
        Shareable URL or None if failed
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None

    try:
        service = get_drive_service()
        file_name = os.path.basename(file_path)
        
        # Detect MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = 'application/octet-stream'
            logger.warning(f"Unknown file type, using {mime_type}")

        # Prepare file metadata
        file_metadata = {'name': file_name}
        if folder_id:
            file_metadata['parents'] = [folder_id]

        media = MediaFileUpload(file_path, mimetype=mime_type)
        
        # Execute upload
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        file_id = file.get('id')
        logger.info(f"Uploaded {file_name} with ID: {file_id}")

        # Generate shareable link
        return f"https://drive.google.com/file/d/{file_id}/view"
    
    except HttpError as e:
        logger.error(f"Google API error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
    
    return None

# Example usage
if __name__ == "__main__":
    ebook_url = upload_to_drive(
        file_path="/path/to/your/ebook.pdf",
        folder_id="your-folder-id-here"  # Optional
    )
    if ebook_url:
        print(f"eBook URL: {ebook_url}")
    else:
        print("Upload failed")
