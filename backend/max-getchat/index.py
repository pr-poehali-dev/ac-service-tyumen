"""
Business: Временная функция для получения chat_id из MAX через /updates
Args: event с httpMethod
Returns: JSON со списком updates от MAX Bot API
"""
import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    token = os.environ.get('MAX_BOT_TOKEN', '')
    url = f'https://botapi.max.ru/updates?access_token={token}&limit=100'

    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read().decode('utf-8')
            status = resp.status
    except urllib.error.HTTPError as e:
        data = e.read().decode('utf-8', errors='replace')
        status = e.code
    except Exception as e:
        data = str(e)
        status = 0

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({'max_status': status, 'max_body': data, 'token_len': len(token)})
    }
