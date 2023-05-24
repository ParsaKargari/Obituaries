import json
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(o)
        return super(DecimalEncoder, self).default(o)


def lambda_handler(event, context):
    try:
        # Connect to DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        # Get the table object
        table = dynamodb.Table('obituary-30140335')

        # Scan the table to retrieve all obituaries
        response = table.scan()
        obituaries = response['Items']

        # Paginate through the table if LastEvaluatedKey is present
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            obituaries.extend(response['Items'])

        # Sort the obituaries based on the 'created_at' attribute
        sorted_obituaries = sorted(obituaries, key=lambda x: x['created_at'])

        # Return the sorted obituaries as the response
        return {
            'statusCode': 200,
            'body': json.dumps(sorted_obituaries, cls=DecimalEncoder)
        }
    
    except Exception as e:
        # Handle any exceptions and return an error response
        return {
            'statusCode': 500,
            'body': f'Error retrieving obituaries -- {e}'
        }
