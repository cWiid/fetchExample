from flask import Flask, request, render_template, jsonify
import stubs
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/get-org-data', methods=["GET", "POST"])
def get_org_data():
    js_input = request.get_json()
    org_data = stubs.org_resources_dump()
    print(org_data)
    return jsonify(org_data)


if __name__ == '__main__':
    app.run()
