def send_email(recipient, subject, body):
    """
    Mock send: in real life this would call Composio / Gmail / Slack.
    For demo we just print and return success.
    """
    print("----- SENDING REMINDER -----")
    print(f"To: {recipient}")
    print(f"Subject: {subject}")
    print(body)
    print("----------------------------")
    return {"status": "sent"}
