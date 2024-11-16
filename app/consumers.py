import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from urllib.parse import parse_qs


from django.core.cache import cache

class YourConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        
        await self.channel_layer.group_add(
            "test",
            self.channel_name
        )

        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'Handshake successful'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "test",
            self.channel_name
        )
        print("completed")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action=data['action']


        if action=="call_user":
            message = data['number']
            await self.channel_layer.group_send(
                "test",
                {
                    'type': 'chat_message',
                    'message': message
                }
            )


    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'action': 'call_user',
            'message': message
        }))