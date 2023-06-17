from fastapi import FastAPI, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from generateWebsite import getContent
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/create")
async def create(request: Request):
    try:
        data = await request.form()
        description = data["description"]

        final = getContent(description)

        final["testimonial1Quote"] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
        final["testimonial2Quote"] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
        final["testimonial1Name"] = "John Doe"
        final["testimonial2Name"] = "Jane Doe"
        final["testimonial1Position"] = "Person"
        final["testimonial2Position"] = "Person"

        return {"status": "success", "data": final}
    except Exception as e:
        print(e)
        return {"status": "failed"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")