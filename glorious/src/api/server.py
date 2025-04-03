import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="build")

@app.route("/")
def index():
    return send_from_directory(os.path.join(app.static_folder, "index.html"))

# Serve other static files like JS, CSS
@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(os.path.join(app.static_folder, path))

if __name__ == "__main__":
    app.run(debug=True)