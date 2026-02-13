import json
import boto3
import bcrypt
import uuid
import time
import requests

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('Users')

OTP_API_URL = "https://n8n.ch-varun.xyz/webhook/send-mail"


def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(body)
    }


def send_verification_otp(email):
    """
    Calls n8n webhook to send verification OTP email.
    Returns True only if email is accepted by SMTP server.
    """
    try:
        api_response = requests.post(
            OTP_API_URL,
            json={"email": email},
            timeout=5
        )

        data = api_response.json()
        print("OTP API response:", data)

        if (
            api_response.status_code == 200 and
            len(data.get("accepted", [])) > 0
        ):
            return True

        return False

    except Exception as e:
        print("OTP API error:", str(e))
        return False


def lambda_handler(event, context):
    try:
        body = json.loads(event["body"])

        email = body["email"].lower()
        password = body["password"]
        name = body.get("name", "")
        phone_number = body["number"]

        # ---- Check if user already exists ----
        result = users_table.query(
            IndexName="email-index",
            KeyConditionExpression="Email = :e",
            ExpressionAttributeValues={":e": email}
        )

        if result.get("Items"):
            return response(400, {
                "message": "User already exists"
            })

        # ---- Hash password ----
        password_hash = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

        user_id = str(uuid.uuid4())

        # ---- Role assignment ----
        role_id = 0 if email == "bikelo.admin@bikelo.com" else 1

        # ---- Save user ----
        users_table.put_item(
            Item={
                "UID": bytes(f"USER#{user_id}", "utf-8"),
                "Email": email,
                "passwordHash": password_hash,
                "name": name,
                "phoneNo": phone_number,
                "roleId": role_id,
                "status": "ACTIVE",
                "createdAt": int(time.time())
            }
        )

        # ---- Send OTP ----
        otp_sent = send_verification_otp(email)

        # ---- Response ----
        if otp_sent:
            return response(200, {
                "message": "Signup successful. Verification OTP sent.",
                "userId": user_id
            })
        else:
            return response(200, {
                "message": "Signup successful but OTP sending failed",
                "userId": user_id
            })

    except Exception as e:
        print("Lambda error:", str(e))
        return response(500, {
            "message": "Internal server error",
            "error": str(e)
        })