import logging
import requests
from fastapi import APIRouter, HTTPException, Depends, Request

from DTOs.lead_DTO import LeadCaptureRequest
from dependencies.auth import CurrentUser
from utils.rate_limit import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("/capture")
@limiter.limit("5/minute")
def capture_lead(request: Request, data: LeadCaptureRequest, current_user: CurrentUser):
    """
    Send a lead notification (e.g. book a bike, sell a bike) to the admin and user via n8n webhook.
    Requires user authentication to prevent spam.
    """
    # ── Debug: log incoming auth & payload ────────────────────────────────────
    auth_header = request.headers.get("Authorization", "MISSING")
    logger.debug("POST /leads/capture — Authorization header: %s", auth_header)
    logger.debug(
        "POST /leads/capture — Authenticated user: id=%s email=%s role=%s status=%s",
        getattr(current_user, "id", "N/A"),
        getattr(current_user, "email", "N/A"),
        getattr(current_user, "role", "N/A"),
        getattr(current_user, "status", "N/A"),
    )
    logger.debug("POST /leads/capture — Payload: %s", data.model_dump(by_alias=True))
    # ──────────────────────────────────────────────────────────────────────────

    url = "https://n8n.ch-varun.xyz/webhook/lead-capture"

    # Dump the data using aliases to match the expected n8n payload format
    payload = data.model_dump(by_alias=True)

    try:
        logger.debug("Forwarding lead payload to n8n: %s", url)
        response = requests.post(url, json=payload, timeout=5)
        logger.debug("n8n response status: %s", response.status_code)
        response.raise_for_status()
        return {"message": "Lead captured successfully"}
    except requests.RequestException as e:
        logger.error("Error sending lead webhook: %s", e)
        print(f"Error sending lead webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to notify via email. Please try again later.")
