import os
from google.auth.transport import requests
from google.oauth2 import id_token
from fastapi import Request, HTTPException

# ✅ Load Google Client ID from environment variable
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    raise ValueError("GOOGLE_CLIENT_ID is not set in environment variables")

async def verify_google_token(request: Request):
    """Verify the Google ID Token from Authorization header."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: No token provided")

    token = auth_header.split("Bearer ")[1]  # Extract token
    try:
        # Verify the token using Google's public keys
        payload = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Check if the token is valid
        if not payload or "email" not in payload:
            raise HTTPException(status_code=403, detail="Invalid token: No email found")

        return payload  # Token is valid, return user info

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

