from flask import Flask, request, render_template, jsonify
import stubs
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def index():
    return render_template("index.html")


# URL routes are named from the client (javascript) perspective.
# ie. for the client to "get-org-data", the server (py-flask) needs to POST the org data.

@app.route('/get-org-data', methods=["GET", "POST"])
def get_org_data():
    org = request.get_json()
    org_data = stubs.org_resources_dump()
    print(org_data)
    return jsonify(org_data)


@app.route('/post-edited-task', methods=["GET", "POST"])
def post_edited_task():
    task_data = request.get_json()
    print(task_data)
    return stubs.replace_edited_task()


@app.route('/post-new-task', methods=["GET", "POST"])
def post_new_task():
    task = request.get_json()
    print(task)
    return stubs.store_new_task()


@app.route('/post-delete-task', methods=["GET", "POST"])
def post_delete_task():
    task_data = request.get_json()
    print(task_data)
    return "Success", 200


@app.route('/post-new-routine', methods=["GET", "POST"])
def post_new_routine():
    js_input = request.get_json()
    org_data = stubs.org_resources_dump()
    print(org_data)
    return jsonify(org_data)


@app.route('/post-delete-routine', methods=["GET", "POST"])
def post_delete_routine():
    js_input = request.get_json()
    org_data = stubs.org_resources_dump()
    print(org_data)
    return jsonify(org_data)


if __name__ == '__main__':
    app.run()
