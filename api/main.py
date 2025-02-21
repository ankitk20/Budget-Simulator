from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import StreamingResponse
import json
from pydantic import ValidationError
from country_mapping import get_country_data
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from models import SimulationInput
from auth import verify_google_token
from simulation import simulate_years

# Initialize FastAPI App with Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app = FastAPI()

# Setup rate limiter (limits requests per user based on IP)
limiter = Limiter(key_func=get_remote_address)

# TODO: currently all inv types are mandatory due to bal eat hardcoding
# TODO: handle api response where things are -ve
# TODO: Downpayment adjust is pending
@app.post("/simulate")
@limiter.limit("50/minute")  # Limit requests per minute
async def simulate_financials(request: Request, payload: SimulationInput, user: dict = Depends(verify_google_token)) -> StreamingResponse:
    """
    Processes financial simulation input while enforcing rate limits and authentication.
    
    Args:
        request (Request): The FastAPI request object (used for headers, rate limit).
        payload (SimulationInput): The request body containing financial data.
        user (dict): The authenticated user object.

    Returns:
        dict: Processed financial simulation response.
    """
    try:
        parsed_payload = SimulationInput.model_validate(payload)  # Validate using Pydantic
        parsed_payload = parsed_payload.model_dump(by_alias=True)  # Convert to dict with camelCase keys

        # Call your processing function
        async def result_generator():
            async for result in simulate_years(parsed_payload):
                result.update({
                    "locale": get_country_data(parsed_payload["country"], "locale"),
                    "currency": get_country_data(parsed_payload["country"], "currency"),
                    "symbol": get_country_data(parsed_payload["country"], "symbol"),
                })
                yield json.dumps(result) + "\n"
                # await asyncio.sleep(0.1)

        return StreamingResponse(result_generator(), media_type="application/json")

    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors())  # Return validation errors
    
    except RateLimitExceeded:
        raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
