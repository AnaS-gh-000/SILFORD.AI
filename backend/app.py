from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict


app = Flask(__name__)

CORS(app)


@app.route("/predict", methods=["POST"])
def predict_route():

    image = request.files["image"]

    print("Received:", image.filename)

    result = predict(image)

    print(result)

    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)
