from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict


app = Flask(__name__)

CORS(app)


@app.route("/predict", methods=["POST"])
def predict_route():

    image = request.files["image"]

    result = predict(image)

    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from model import predict

# app = Flask(__name__)

# CORS(app, origins=[
#     "https://YOUR_USERNAME.github.io"
# ])


# @app.route("/predict", methods=["POST"])
# def predict_route():

#     if "image" not in request.files:
#         return jsonify({
#             "error": "No image uploaded"
#         }), 400

#     image = request.files["image"]

#     result = predict(image)

#     return jsonify(result)


# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({
#         "status": "Silford API running"
#     })


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)

