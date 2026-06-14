import logging

import requests
from fastapi import APIRouter, HTTPException, Request

from config import settings
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
    logger.info(
        "POST /leads/capture user_id=%s email=%s subject=%s ip=%s",
        getattr(current_user, "id", "N/A"),
        getattr(current_user, "email", "N/A"),
        data.subject,
        request.client.host if request.client else "unknown",
    )

    payload = data.model_dump(by_alias=True)

    try:
        response = requests.post(settings.LEAD_CAPTURE_WEBHOOK_URL, json=payload, timeout=7)

        if response.status_code >= 500:
            logger.error("Lead webhook upstream failed with status %s", response.status_code)
            raise HTTPException(status_code=502, detail="Notification service is currently unavailable")

        response.raise_for_status()
        return {"message": "Lead captured successfully"}
    except requests.Timeout:
        logger.error("Timeout connecting to lead webhook")
        raise HTTPException(status_code=504, detail="Notification service timed out. Please try again.")
    except requests.RequestException as e:
        logger.error("Lead webhook request failed: %s", e)
        raise HTTPException(status_code=502, detail="Failed to notify due to a communication error")
