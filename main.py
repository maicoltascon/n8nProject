from fastapi import FastAPI, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl
import requests
from scraper import scrape_price
import json
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request

app = FastAPI()

# Sirve archivos estáticos desde la carpeta 'static'
app.mount("/static", StaticFiles(directory="static"), name="static")

N8N_WEBHOOK_URL = "https://codezium.com:5678/webhook-test/query"


class Item(BaseModel):
    nombre: str
    descripcion: str
    precio: float


class URLRequest(BaseModel):
    url: HttpUrl

# Configurar Jinja2 para las plantillas HTML
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/test")
def read_root():
    return {"message": "¡Hola, FastAPI!"}


@app.post("/api/send-product/")
def crear_item(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...)
):
    data = {
        "name": nombre,
        "description": descripcion,
        "price": precio
    }
    
    response = requests.post(N8N_WEBHOOK_URL, json=data)

    return {
        "mensaje": "Datos enviados a n8n",
        "datos_enviados": data,
        "respuesta_n8n": response.json() if response.status_code == 200 else "Error en n8n"
    }



@app.post("/api/scraping/")
def scrapear_pagina(request: URLRequest):
    # Usamos la función scrape_price del archivo scraper.py
    result = scrape_price(request.url)
    
    # Convertir el resultado a un diccionario para devolverlo como JSON
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Error al procesar los datos del scraper")