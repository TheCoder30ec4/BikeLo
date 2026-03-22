import requests
from fastapi import APIRouter, HTTPException, Depends, Request

from DTOs.lead_DTO import LeadCaptureRequest
from dependencies.auth import CurrentUser
from utils.rate_limit import limiter

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("/capture")
@limiter.limit("5/minute")
def capture_lead(request: Request, data: LeadCaptureRequest, _: CurrentUser):
    """
    Send a lead notification (e.g. book a bike, sell a bike) to the admin and user via n8n webhook.
    Requires user authentication to prevent spam.
    """
    url = "https://n8n.ch-varun.xyz/webhook/lead-capture"
    
    # Dump the data using aliases to match the expected n8n payload format
    payload = data.model_dump(by_alias=True)
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return {"message": "Lead captured successfully"}
    except requests.RequestException as e:
        print(f"Error sending lead webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to notify via email. Please try again later.")
