import json
import boto3
import bcrypt


def lambda_handler(event, context):

    try:
        dynamodb = boto3.resource('dynamodb')
        users_table = dynamodb.Table('Users')

        body = json.loads(event["body"])

        email = body["email"].lower()
        password = body["password"]

        # ---- Query user by email ----
        result = users_table.query(
            IndexName="email-index",
            KeyConditionExpression="Email = :e",
            ExpressionAttributeValues={":e": email}
        )

        # ---- User not found ----
        if not result.get("Items"):
            return {
                "statusCode": 404,
                "body": json.dumps({
                    "message": "User not found"
                })
            }

        user = result["Items"][0]
        stored_hash = user["passwordHash"]

        # ---- Password verification ----
        if bcrypt.checkpw(
            password.encode(),
            stored_hash.encode()
        ):
            return {
                "statusCode": 200,
                "body": json.dumps({
                    "message": "Login successful",
                    "userId": user["UID"].decode(),
                    "email": user["Email"],
                    "roleId": user["roleId"]
                })
            }

        else:
            return {
                "statusCode": 401,
                "body": json.dumps({
                    "message": "Invalid password"
                })
            }

    except Exception as e:
        print("Lambda error:", str(e))

        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal server error",
                "error": str(e)
            })
        }