import requests
from bs4 import BeautifulSoup
import json

def scrape_price(url):
    try:
        # Realiza una solicitud a la página web
        response = requests.get(url)
        response.raise_for_status()  # Lanza un error si la solicitud falla

        # Analiza el HTML con BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extrae el precio (adaptar el selector CSS al sitio específico)
        price_element = soup.find('span', class_='andes-money-amount')
        name_element = soup.find('h1', class_='ui-pdp-title')
        description_element = soup.find('p', class_='ui-pdp-description__content')
        
        if price_element and description_element:
            price = price_element.text.strip()
            description = description_element.text.strip()
            name= name_element.text.strip()
            data = {
                "description": description,
                "price": price,
                "name": name
            }
            return json.dumps(data)  # Convertir a JSON
        else:
            return json.dumps({"error": "El elemento del precio o del nombre no fue encontrado."})

    except requests.exceptions.RequestException as e:
        return json.dumps({"error": f"Error en la solicitud HTTP: {e}"})
    except AttributeError:
        return json.dumps({"error": "Error al procesar el HTML: El precio o el nombre no se encuentran en la página."})

