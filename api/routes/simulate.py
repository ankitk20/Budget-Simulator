import asyncio
import json
from typing import Dict
from fastapi import APIRouter, Query, Request, Depends, HTTPException, status
from fastapi.responses import JSONResponse, StreamingResponse
import pandas as pd
from pydantic import ValidationError
from slowapi.errors import RateLimitExceeded
from middleware import limiter
from services.simulation import simulate_years
from services.analysis import analyze_trend
from models.models import AnalysisModel, SimulationInput
from utils.country_mapping import get_country_data, get_country_glossary
from auth.auth import verify_google_token

# Initialize Router
router = APIRouter()

# API to get glossary
@router.get("/glossary")
@limiter.limit("20/minute")  # Rate limiting per IP
async def glossary(request: Request, user: dict = Depends(verify_google_token), country: str = Query(...)):
    """
    Endpoint returns country specific default values.
    - Includes error handling to return appropriate status codes and messages.
    """

    try:
        # Check the cache or generate new report
        glossary = await get_country_glossary(country)

        # Return the trend analysis summary as a response
        return  JSONResponse(
            status_code=status.HTTP_200_OK,
            content=glossary
        )

    except ValueError as ve:
        # Custom error for specific issues like missing or invalid data
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid data: {str(ve)}"
        )

    except HTTPException as he:
        # If an HTTPException was raised manually, return it
        raise he

    except Exception as e:
        # Generic catch for unexpected errors
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )

# API route to get insights
@router.post("/analyze")
@limiter.limit("10/minute")  # Rate limiting per IP
async def trend_analysis(request: Request, payload: AnalysisModel, user: dict = Depends(verify_google_token)) -> JSONResponse:
    """
    Endpoint to analyze trends from the provided data.
    - Includes error handling to return appropriate status codes and messages.
    """

    parsed_payload = AnalysisModel.model_validate(payload)  # Validate using Pydantic
    parsed_payload = parsed_payload.model_dump()  # Convert to dict with camelCase keys

    try:
        # Example of payload validation (ensure it has required data)
        if not parsed_payload:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payload format.")

        # Check the cache or generate new report
        summary = await analyze_trend(payload)

        # Return the trend analysis summary as a response
        return  JSONResponse(
            status_code=status.HTTP_200_OK,
            content=summary
        )

    except ValueError as ve:
        # Custom error for specific issues like missing or invalid data
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid data: {str(ve)}"
        )

    except HTTPException as he:
        # If an HTTPException was raised manually, return it
        raise he

    except Exception as e:
        # Generic catch for unexpected errors
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": f"An unexpected error occurred: {str(e)}"}
        )

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
                    "locale": await get_country_data(parsed_payload["country"], "locale"),
                    "currency": await get_country_data(parsed_payload["country"], "currency"),
                    "symbol": await get_country_data(parsed_payload["country"], "symbol"),
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
                    "locale": await get_country_data(parsed_payload["country"], "locale"),
                    "currency": await get_country_data(parsed_payload["country"], "currency"),
                    "symbol": await get_country_data(parsed_payload["country"], "symbol"),
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
