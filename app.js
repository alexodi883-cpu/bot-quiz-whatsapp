import requests
import os
from flask import Flask, request

app = Flask(__name__)

VERIFY_TOKEN = os.environ.get("VERIFY_TOKEN")
WHATSAPP_TOKEN = os.environ.get("WHATSAPP_TOKEN") 
PHONE_NUMBER_ID = os.environ.get("PHONE_NUMBER_ID")

def send_whatsapp_message(phone_number, text):
    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "text": {"body": text}
    }
    response = requests.post(url, headers=headers, json=data)
    print("Meta API response:", response.status_code, response.text) # Pour debug
    return response

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    print("Message reçu:", data) # Tu le vois déjà dans tes logs
    
    try:
        message = data['entry'][0]['changes'][0]['value']['messages'][0]
        sender_number = message['from'] # 22596886696
        message_text = message['text']['body'] # Hello
        
        # ICI ON RÉPOND 👇
        if message_text.lower() == "hello":
            send_whatsapp_message(sender_number, "Salut frérot! Bot Quiz actif ✅ Tape 'quiz' pour jouer")
        else:
            send_whatsapp_message(sender_number, "J'ai pas compris. Tape 'quiz' pour commencer")
            
    except Exception as e:
        print("Erreur:", e)
    
    return "200 OK", 200
