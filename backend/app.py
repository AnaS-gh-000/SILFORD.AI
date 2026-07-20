


from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # allow max 10 MB


CORS(app, origins=[
    "https://anas-gh-000.github.io",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
])


@app.route("/predict", methods=["POST"])
def predict_route():

    try:
        if "image" not in request.files:
            return jsonify({
                "error": "No image uploaded"
            }), 400

        image = request.files["image"]

        result = predict(image)

        return jsonify(result)
    
    except Exception as e:

        print(e)

        return jsonify({
            "error": str(e)
        }),500



@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Silford API running"
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

