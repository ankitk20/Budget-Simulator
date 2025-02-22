from fastapi import FastAPI
from slowapi.middleware import SlowAPIMiddleware
from middleware import limiter
from routes.simulate import router as simulate_router

# Initialize FastAPI App
app = FastAPI()

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# Register Routes
app.include_router(simulate_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# TODO: handle api response where things are -ve
# TODO: Downpayment adjust is pending
