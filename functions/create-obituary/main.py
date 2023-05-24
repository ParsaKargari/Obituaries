import boto3
import json
import requests
from requests_toolbelt.multipart import decoder
import base64
import os
import hashlib
from datetime import datetime

def lambda_handler(event, context):
    ssm = boto3.client('ssm')
    polly = boto3.client('polly')

    cloud_name = 'YOUR_CLOUDINARY_CLOUD_NAME'  # Replace with your Cloudinary cloud name

    # Retrieve the Cloudinary API key and secret from Parameter Store
    api_key = 'YOUR_CLOUDINARY_API_KEY'
    api_secret = 'YOUR_CLOUDINARY_API_SECRET'
    api_key_GPT = 'YOUR_GPT_API_KEY'

    # Parse the request body
    if event["isBase64Encoded"]:
        body = base64.b64decode(event['body'])
    else:
        body = event['body']

    content_type = event['headers']['content-type']

    # Get the image file from the request
    multipart_data = decoder.MultipartDecoder(body, content_type)
    binary_data = [part.content for part in multipart_data.parts]
    key = "obituary.png"
    file_name = os.path.join("/tmp", key)
    with open(file_name, "wb") as f:
        f.write(binary_data[2])

    # Generate a Cloudinary signature
    timestamp = binary_data[6].decode()
    params_to_sign = {
        'eager': 'e_art:zorro',
        'public_id': 'IMAGE-'+binary_data[0].decode(),
        'timestamp': timestamp,
    }
    signature = generate_cloudinary_signature(params_to_sign, api_secret)

    audio_public_id = 'AUDIO-'+binary_data[0].decode()
    audio_params_to_sign = {
        'public_id': audio_public_id,
        'timestamp': timestamp,
    }
    audio_signature = generate_cloudinary_signature(audio_params_to_sign, api_secret)

    try:
        # ChatGPT API
        text = chatgpt(binary_data[3].decode(), binary_data[4].decode(), binary_data[5].decode(), api_key_GPT)
        print(text)

        # Synthesize the speech using AWS Polly
        response = polly.synthesize_speech(Text=text, VoiceId='Joanna', OutputFormat='mp3')
        audio_binary = response['AudioStream'].read()

        # Upload the audio to Cloudinary
        audio_file_name = os.path.join("/tmp", audio_public_id + ".mp3")
        with open(audio_file_name, "wb") as f:
            f.write(audio_binary)

        audio_upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/raw/upload/"
        audio_payload = {
            'timestamp': timestamp,
            'public_id': audio_public_id,
            'api_key': api_key,
            'signature': audio_signature,
        }

        audio_files = {'file': open(audio_file_name, 'rb')}
        audio_response = requests.post(audio_upload_url, data=audio_payload, files=audio_files, timeout=20)
        audio_response_json = audio_response.json()
        audio_url = audio_response_json['secure_url']

        # Upload the image to Cloudinary
        upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload/"
        payload = {
            'timestamp': timestamp,
            'public_id': 'IMAGE-'+binary_data[0].decode(),
            'eager': 'e_art:zorro',
            'api_key': api_key,
            'signature': signature,
        }

        files = {'file': open(file_name, 'rb')}
        response = requests.post(upload_url, data=payload, files=files, timeout=20)
        response_json = response.json()

        image_url = response_json['eager'][0]['secure_url']

        # Save the obituary record to DynamoDB
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('obituary-30140335')  # Replace with your DynamoDB table name
        item = {
            'uuid': binary_data[0].decode(),
            'created_at': str(int(datetime.utcnow().timestamp())),
            'audio': audio_url,
            'image': image_url,
            'name': binary_data[3].decode(),
            'born': binary_data[4].decode(),
            'death': binary_data[5].decode(),
            'text': text,
        }
        table.put_item(Item=item)

        # Return the response
        return {
            'statusCode': 200,
            'body': json.dumps(item)
        }
    except Exception as e:
        # Return error if any exception occurs
        return {
            'statusCode': 500,
            'body': f'Error creating obituary -- {e}'
        }

def chatgpt(name, born, death, key):
    # Define the API endpoint URL
    url = 'https://api.openai.com/v1/completions'

    # Define the API key
    apiKey = key

    # Define the headers for the API call
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {apiKey}',
    }

    # Define the data for the API call
    data = {
        'model': "text-curie-001",
        'prompt': f"Write an obituary about a fictional character named {name} who was born on {born} and died on {death}.",
        'max_tokens': 600,
    }

    # Make the API call using the requests library
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # Parse the JSON response
    print(response.json())
    obituary = response.json()['choices'][0]['text'].strip()

    # Return the obituary as a string
    return obituary

def generate_cloudinary_signature(params_to_sign, api_secret):
    query_string = '&'.join([f"{k}={v}" for k, v in params_to_sign.items()])
    to_sign = f"{query_string}{api_secret}"
    signature = hashlib.sha1(to_sign.encode()).hexdigest()
    return signature
