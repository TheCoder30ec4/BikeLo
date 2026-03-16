import requests 


def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        response = requests.post(
            "https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages",
            auth=("api", "YOUR_API_KEY"),
            data={
                "from": "Your Name <[EMAIL_ADDRESS]>",
                "to": to_email,
                "subject": subject,
                "text": body,
            },
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending email: {e}")
        return False