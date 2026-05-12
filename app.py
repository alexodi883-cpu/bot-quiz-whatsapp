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
    print("Meta API response:", response.status_code, response.text)
    return response

@app.route('/')
def home():
    return 'Bot Quiz WhatsApp actif ✅'

@app.route('/webhook', methods=['GET'])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if mode == "subscribe" and token == VERIFY_TOKEN:
        return challenge, 200
    return 'Erreur Token', 403

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    print("Message reçu:", data)
    
    try:
        value = data['entry'][0]['changes'][0]['value']
        if 'messages' in value:
            message = value['messages'][0]
            sender = message['from']
            text = message['text']['body'].lower()
            
            if 'hello' in text or 'salut' in text:
                send_whatsapp_message(sender, "Salut frérot! 🎉 Bot opérationnel. Tape 'quiz'")
            elif 'quiz' in text:
                send_whatsapp_message(sender, "Quiz Q1: 2+2=?\nA)3 B)4 C)5")
            else:
                send_whatsapp_message(sender, "Tape 'quiz' pour jouer 📝")
                
    except Exception as e:
        print("Erreur:", e)
    
    return 'OK', 200

if __name__ == '__main__':
    app.run()
