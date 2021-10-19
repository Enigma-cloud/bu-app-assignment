"""
 Application of Programming Principles
 Assignment Template 2021 - Flask & Python
 Kristian Torres 
"""
from os import error, get_exec_path
from flask import Flask, render_template, jsonify, request, make_response, redirect
import sys, json, random, datetime

# INITIALIZE APP
app = Flask(__name__)

# FILENAMES
THOUGHTS_FILE = "data/thoughts.json"
JOURNAL_FILE = "data/journal_test.json"

# JSON FUNCTIONS
def open_jsonfile(filename):
    with open(filename) as json_file:
                data = json.load(json_file)
    return data
  
def update_jsonfile(data, filename):
    with open(filename,'w') as f:
        json.dump(data, f, indent=4)

def get_thought_entries():
    data = open_jsonfile(THOUGHTS_FILE)
    return data["thoughts"]


# HOME FUNCTION
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/thought-of-the-day")
def thoughts():
    return render_template("thoughts.html")

# THOUGHT OF THE DAY FUNCTIONS
@app.route("/api/thought-of-the-day", methods=['GET', 'PUT'])
def thought_of_the_day():
    """
    This function performs the following:
        GET request: retrieves 'Thoughts' JSON file to be sent back.
        PUT request: receives JSON object from frontend to be stored and saved.

    Returns HTTP response object.
    """
    response_obj = {"result": "",
                "error": ""}
    status_code = 500

    if request.method == 'GET':
        list_of_entries = get_thought_entries()
        try:
            response_obj["result"] = list_of_entries
            status_code = 200
        except Exception:
            response_obj["error"] = "Error occured while retrieving thought."
        finally:
            response = make_response(
                        jsonify(response_obj), 
                        status_code) 
            response.headers["Content-Type"] = "application/json"
            return response

    if request.method == 'PUT':
        try:
            new_entries = request.get_json('jsonData')
            update_jsonfile(new_entries, THOUGHTS_FILE)
            status_code = 200
            response_obj["result"] = "'Thoughts' successfully uploaded!"
        except Exception:
            status_code = 500
            response_obj["error"] = "Error occured while uploading 'Thoughts'"
        finally:
            response = make_response(
                    jsonify(response_obj), 
                    status_code) 
            response.headers["Content-Type"] = "application/json"
            return response


@app.route("/api/get-thought", methods = ['GET'])
def send_thought():
    """
    This function picks a random 'thought' from the 'thoughts' JSON file.

    Returns 'thought' as a string within a JSON object.
    """
    data = open_jsonfile(THOUGHTS_FILE)
    response_obj = {"result": "",
                    "error": ""}
    status_code = 500

    try:
        response_obj["result"] = str(random.choice(data['thoughts'])['content'])
        status_code = 200
    except Exception:
        response_obj["error"] = "Error occured while retrieving thought." 
    finally:
        response = make_response(
                    jsonify(response_obj), 
                    status_code) 
        response.headers["Content-Type"] = "application/json"
        return response


# CALCULATOR FUNCTIONS
@app.route("/api/add", methods = ['GET'])
def add():
    """
    This function receives values from the frontend,
    and finds the sum of two values.

    Returns the sum as a string within a JSON object.
    """
    value1 = request.args.get('val1')
    value2 = request.args.get('val2')
    response_obj = {"result": "",
                    "error": ""}
    status_code = 200
    
    try:
        total = float(value1) + float(value2)
        response_obj["result"] = str(total)
    except Exception:
        response_obj["error"] = "Error occured while performing addition"
        status_code = 500
    finally:
        response = make_response(
                jsonify(response_obj), 
                status_code) 
        response.headers["Content-Type"] = "application/json"
        return response


@app.route("/api/subtract", methods = ['GET'])
def subtract():
    """
    This function receives values from the frontend,
    and finds the difference between two values through subtraction.

    Returns the difference as a string within a JSON object.
    """
    value1 = request.args.get('val1')
    value2 = request.args.get('val2')
    response_obj = {"result": "",
                    "error": ""}
    status_code = 200

    try:
        difference = float(value1) - float(value2)
        response_obj["result"] = str(difference)
    except Exception:
        response_obj["error"] = "Error occured while performing subtraction"
        status_code = 500
    finally:
        response = make_response(
                jsonify(response_obj), 
                status_code) 
        response.headers["Content-Type"] = "application/json"
        return response


@app.route("/api/multiply", methods = ['GET'])
def multiply():
    """
    This function receives values from the frontend
    and gets the product of two values through multiplication.

    Returns the product as a string within a JSON object.
    """
    value1 = request.args.get('val1')
    value2 = request.args.get('val2')
    response_obj = {"result": "",
                    "error": ""}
    status_code = 200

    try:
        product = float(value1) * float(value2)
        response_obj["result"] = str(product)
    except Exception:
        response_obj["error"] = "Error occured while performing multiplication"
        status_code = 500
    finally:
        response = make_response(
                jsonify(response_obj), 
                status_code) 
        response.headers["Content-Type"] = "application/json"
        return response


@app.route("/api/divide", methods = ['GET'])
def divide():
    """
    This function receives values from the frontend,
    and finds the quotient of two values through division.

    Returns the quotient as a string within a JSON object.
    """
    value1 = request.args.get('val1')
    value2 = request.args.get('val2')
    response_obj = {"result": "",
                    "error": ""}
    status_code = 200

    try:
        quotient = float(value1) / float(value2)
        response_obj["result"] = str(quotient)
    except ZeroDivisionError:
        response_obj["error"] = "Division by zero error"
        status_code = 500
    except Exception:
        response_obj["error"] = "Error occured while performing division"
        status_code = 500
    finally:
        response = make_response(
                jsonify(response_obj), 
                status_code) 
        response.headers["Content-Type"] = "application/json"
        return response
        


# JOURNAL FUNCTIONS
@app.route("/api/journal", methods = ['GET', 'PUT'])
def journal():
    """
    This function sends and updates journal data, these 
    each action is performed depending on the received HTTP requests
    (sent from the frontend).

    Returns the journal data or acknowledgements within a JSON object.
    """
    response_obj = {"result": "",
                    "error": ""}
    status_code = 404

    if request.method == 'GET':
        try:
            data = open_jsonfile(JOURNAL_FILE)
            json_string_data = json.dumps(data)
            response_obj["result"] = json_string_data
            status_code = 200
        except Exception:
            response_obj["error"] = "Error occured while retrieving journal entries"
        finally:
            response = make_response(
                    jsonify(response_obj), 
                    status_code) 
            response.headers["Content-Type"] = "application/json"
            return response

    if request.method == 'PUT':
        try:
            new_entries = request.get_json('jsonData')
            update_jsonfile(new_entries, JOURNAL_FILE)
            status_code = 200
            response_obj["result"] = "Entries successfully uploaded!"
        except Exception:
            status_code = 500
            response_obj["error"] = "Error occured while uploading journal entries"
        finally:
            response = make_response(
                    jsonify(response_obj), 
                    status_code) 
            response.headers["Content-Type"] = "application/json"
            return response


if __name__ == '__main__':
    app.run(debug=True)