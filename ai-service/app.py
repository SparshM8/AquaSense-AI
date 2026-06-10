from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

from models.predictor import predict_consumption
from models.anomaly_detector import detect_anomalies

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'service': 'AquaSense AI Engine'})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('data', [])
    if len(data) < 5:
        return jsonify({'error': 'Need at least 5 records'}), 400
    result = predict_consumption(data)
    return jsonify(result)

@app.route('/anomaly', methods=['POST'])
def anomaly():
    data = request.json.get('data', [])
    if len(data) < 10:
        return jsonify({'error': 'Need at least 10 records'}), 400
    result = detect_anomalies(data)
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
