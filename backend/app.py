from flask import Flask, jsonify, request
from flask_cors import CORS
from invoice_parser import load_invoices
from message_generator import generate_message
from send_reminder import send_email

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Invoice Reaper backend is running"})

@app.route("/api/invoices", methods=["GET"])
def get_invoices():
    invoices = load_invoices()
    return jsonify(invoices)

@app.route("/api/reap", methods=["POST"])
def reap():
    """
    Go through all invoices, send reminders for overdue ones,
    and return a summary.
    """
    invoices = load_invoices()
    results = []

    for inv in invoices:
        # if it's overdue, act on it
        if inv.get("days_overdue", 0) > 0:
            subject, body = generate_message(
                inv["client"],
                inv["amount"],
                inv["days_overdue"]
            )
            send_result = send_email(inv["email"], subject, body)
            results.append({
                "invoice_id": inv["invoice_id"],
                "client": inv["client"],
                "status": send_result["status"]
            })
        else:
            results.append({
                "invoice_id": inv["invoice_id"],
                "client": inv["client"],
                "status": "not_overdue"
            })

    return jsonify({"summary": results})

if __name__ == "__main__":
    app.run(debug=True)
