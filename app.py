from flask import Flask, request
app = Flask(__name__)

@app.route('/webhook', methods=['GET'])
def verify():
    verify_token = request.args.get('hub.verify_token')
    challenge = request.args.get('hub.challenge')
    if verify_token == 'quiz123':
        return challenge
    return 'Erreur Token', 403

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    print(data) # Pour voir les messages WhatsApp
    return 'OK', 200

@app.route('/')
def home():
    return 'Bot Quiz WhatsApp actif ✅'

if __name__ == '__main__':
    app.run()
