import asyncio
import json
from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import ValidationError
from slowapi.errors import RateLimitExceeded
from middleware import limiter
from services.simulation import simulate_years
from models.models import SimulationInput
from utils import get_country_data
from auth.auth import verify_google_token

# Initialize Router
router = APIRouter()

@router.post("/simulate")
@limiter.limit("10/minute")  # Rate limiting per IP
async def simulate_financials(request: Request, payload: SimulationInput, user: dict = Depends(verify_google_token)) -> StreamingResponse:
    """
    Processes financial simulation input while enforcing rate limits and authentication.
    """
    try:
        parsed_payload = SimulationInput.model_validate(payload)  # Validate using Pydantic
        parsed_payload = parsed_payload.model_dump(by_alias=True)  # Convert to dict with camelCase keys

        async def result_generator():
            async for result in simulate_years(parsed_payload):
                result.update({
                    "locale": get_country_data(parsed_payload["country"], "locale"),
                    "currency": get_country_data(parsed_payload["country"], "currency"),
                    "symbol": get_country_data(parsed_payload["country"], "symbol"),
                })
                yield json.dumps(result) + "\n"
                await asyncio.sleep(0.1)

        return StreamingResponse(result_generator(), media_type="application/json")

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors())

    except RateLimitExceeded:
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/demosimulate")
@limiter.limit("15/minute")  # Rate limiting per IP
async def simulate_financials(request: Request, payload: SimulationInput) -> StreamingResponse:
    """
    Processes financial simulation input while enforcing rate limits and authentication.
    """
    try:
        parsed_payload = SimulationInput.model_validate(payload)  # Validate using Pydantic
        parsed_payload = parsed_payload.model_dump(by_alias=True)  # Convert to dict with camelCase keys

        async def result_generator():
            async for result in simulate_years(parsed_payload):
                result.update({
                    "locale": get_country_data(parsed_payload["country"], "locale"),
                    "currency": get_country_data(parsed_payload["country"], "currency"),
                    "symbol": get_country_data(parsed_payload["country"], "symbol"),
                })
                yield json.dumps(result) + "\n"
                await asyncio.sleep(0.1)

        return StreamingResponse(result_generator(), media_type="application/json")

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors())

    except RateLimitExceeded:
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
