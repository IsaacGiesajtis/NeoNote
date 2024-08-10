from fastapi import FastAPI, UploadFile, File
from starlette.responses import JSONResponse
import pytesseract
from PIL import Image
import uvicorn
import os
import tempfile
import speech_recognition as sr

app = FastAPI()

@app.post("/transcribe/")#define post for voice to text 
async def transcribe_audio(wavFile: UploadFile):
    if not wavFile.filename.endswith(".wav"):
        return {"error": "Only wav files supported. Please Try again"}#If file not a wav file type return error to user

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tempAudio:
        tempAudio.write(wavFile.file.read())#Save the wav file temporarly to the phone so it can read the file

    record = sr.Recognizer()
    with sr.AudioFile(tempAudio.name) as source:
        audio = record.record(source)
    result = record.recognize_google(audio)#Use google cloud speech to process wav file

    os.remove(tempAudio.name)#Clears temp file from phone

    return {"transcription": result}#Return voice to text result to user

#@app.post("/transcribe/") def created By Barrett Bujack

@app.post("/ocr")#define post for image to text 
async def ocr(file: UploadFile):
    image = Image.open(file.file)
    text = pytesseract.image_to_string(image)#Uses tesseract to do ocr getting text from image
    #print("OCR Result:", text) 
    return JSONResponse(content={"text": text})#Return text from image

#@app.post("/ocr") def created By Isaac Giesajtis

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)