from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

model = YOLO("model/best.pt")

CLASS_NAMES = {
    0: "Cross",
    1: "Square",
    2: "L-Shape"
}

@app.route("/")
def home():
    return "Backend Running"

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files["image"]

    temp_path = "temp.jpg"
    file.save(temp_path)

    results = model.predict(
        temp_path,
        conf=0.25,
        verbose=False
    )

    if len(results[0].boxes) == 0:
        return jsonify({
            "message": "No marker detected"
        })

    box = results[0].boxes.xyxy[0].cpu().numpy()

    x1, y1, x2, y2 = box

    center_x = float((x1 + x2) / 2)
    center_y = float((y1 + y2) / 2)

    cls = int(results[0].boxes.cls[0])

    return jsonify({
        "shape": CLASS_NAMES[cls],
        "x": center_x,
        "y": center_y
    })

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )