def generate_message(client, amount, days_overdue):
    """Returns a subject and body for the reminder email."""
    subject = f"Payment Reminder – Invoice ${amount}"
    if days_overdue < 30:
        tone_line = "just a quick reminder"
    else:
        tone_line = "this is a follow-up on an overdue invoice"

    body = (
        f"Hi {client},\n\n"
        f"This is {tone_line} that your invoice of ${amount} "
        f"is now {days_overdue} days past due.\n"
        "Please let us know if there are any issues with payment.\n\n"
        "Thank you,\nInvoice Reaper"
    )
    return subject, body
