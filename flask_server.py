from flask import Flask, request, jsonify
from pyngrok import ngrok
import threading
import requests
import time

app = Flask(__name__)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    question = data.get("question", "")
    answer = f"You asked: '{question}' — here's a placeholder response."
    return jsonify({"answer": answer})

def run_flask():
    app.run(port=5000)

flask_thread = threading.Thread(target=run_flask)
flask_thread.daemon = True
flask_thread.start()

print("Starting ngrok tunnel...")
public_url = ngrok.connect(5000)
print(f"{public_url}/api/chat")

time.sleep(2)

payload = {
    "question": "What is the capital of France?"
}

try:
    response = requests.post(f"{public_url}/api/chat", json=payload)
    print("Response:")
    print(response.json())
except Exception as e:
    print("Error:", e)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    ngrok.kill()
