import os
from fastapi import FastAPI
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from middleware import limiter
from routes.simulate import router as simulate_router

# Initialize FastAPI App
app = FastAPI()

# Attach rate limiter to app state
app.state.limiter = limiter

app.add_middleware(SlowAPIMiddleware)
# CORS configuration with stricter settings
# app.add_middleware(
#     SlowAPIMiddleware,
#     CORSMiddleware,
#     allow_origins=["*"],  # Allow specific origin
#     allow_credentials=True,
#     allow_methods=["GET", "POST"],  # Allow only POST requests
#     allow_headers=["*"],  # Allow specific headers
# )

# Register Routes
app.include_router(simulate_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

# TODO: handle api response where things are -ve
# TODO: Downpayment adjust is pending
