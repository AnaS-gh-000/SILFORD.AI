from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict():

    image = request.files["image"]

    print("Recieved image:", image.filename)

    return jsonify({
        "message": "Image recieved successfully",
        "filename": image.filename
    })

if __name__ == "__main__":
    app.run(debug=True)