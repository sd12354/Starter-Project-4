"""
Firebase service for interacting with Firestore
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

# Initialize Firebase Admin SDK
_initialized = False
_db = None

def get_firestore_db():
    """Get Firestore database instance"""
    global _initialized, _db
    
    if not _initialized:
        # Try to find service account key
        service_account_paths = [
            Path(__file__).parent.parent / 'myboggle-app' / 'serviceAccountKey.json',
            Path(__file__).parent.parent / 'serviceAccountKey.json',
            Path.home() / '.config' / 'firebase' / 'serviceAccountKey.json',
        ]
        
        service_account_path = None
        for path in service_account_paths:
            if path.exists():
                service_account_path = path
                break
        
        if service_account_path:
            cred = credentials.Certificate(str(service_account_path))
            firebase_admin.initialize_app(cred)
        else:
            # Try environment variables (for Heroku)
            import os
            project_id = os.getenv('FIREBASE_PROJECT_ID')
            private_key = os.getenv('FIREBASE_PRIVATE_KEY', '')
            client_email = os.getenv('FIREBASE_CLIENT_EMAIL')
            
            if project_id and private_key and client_email:
                # Handle newlines in private key (Heroku config vars)
                private_key = private_key.replace('\\n', '\n')
                
                cred = credentials.Certificate({
                    'project_id': project_id,
                    'private_key': private_key,
                    'client_email': client_email,
                })
                firebase_admin.initialize_app(cred)
            else:
                raise ValueError(
                    "Firebase service account key not found. "
                    "Please place serviceAccountKey.json in the project root or set environment variables: "
                    "FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL"
                )
        
        _initialized = True
        _db = firestore.client()
    
    return _db

