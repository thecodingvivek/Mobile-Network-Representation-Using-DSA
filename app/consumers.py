import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from urllib.parse import parse_qs


from django.core.cache import cache


class TelephoneHashMap:
    def __init__(self, capacity=100): 
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def telephone_hash(self, phone_number):
        if not (1000000000 <= phone_number <= 9999999999):
            raise ValueError("Input must be a 10-digit telephone number.")
        
        part1 = phone_number // 100000  # First 5 digits
        part2 = phone_number % 100000   # Last 5 digits
        combined_value = part1 ^ part2  # XOR to mix parts
        return combined_value % self.capacity  # Resulting hash value

    def put(self, phone_number, value):
        index = self.telephone_hash(phone_number)
        bucket = self.buckets[index]
        
        for i, (pn, v) in enumerate(bucket):
            if pn == phone_number:
                bucket[i] = (phone_number, value)
                return

        bucket.append((phone_number, value))
        self.size += 1

    def get(self, phone_number):
        index = self.telephone_hash(phone_number)
        bucket = self.buckets[index]
        
        for pn, v in bucket:
            if pn == phone_number:
                return v
        return None  # Phone number not found

    def remove(self, phone_number):
        index = self.telephone_hash(phone_number)
        bucket = self.buckets[index]
        
        for i, (pn, _) in enumerate(bucket):
            if pn == phone_number:
                del bucket[i]
                self.size -= 1
                return True
        return False  # Phone number not found

    def __str__(self):
        return str(self.buckets)


class YourConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        self.msc = query_params.get('msc', [None])[0]
        if not cache.get("asgi:group:msc_"+self.msc):
            self.user_group_name = f"msc_{self.msc}"

            # Join user group
            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )

            await self.accept()
            await self.send(text_data=json.dumps({
                'message': 'Handshake successful'
            }))
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Ensure user_group_name is defined before trying to discard the group
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action=data['action']

        if action == 'send_message':
            msc = data['msc']
            message = data['number']
            self.user_group_name = f"user_{msc}"
            # Join user group
            
            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )


        elif action=="register_user":
            msc = data['msc']
            message = data['number']

            cache.set(int(message),msc,timeout=None)

        elif action=="call_user":
            message = data['number']
            msc=cache.get(int(message))
            self.user_group_name = f"msc_{msc}"
            print(message,self.msc)
            await self.channel_layer.group_send(
                self.user_group_name,
                {
                    'type': 'chat_message',
                    'message': 'incomming call for '+message
                }
            )


    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def add_user(self, event):
        message = event['message']
        msc=event['msc']
        await self.send(text_data=json.dumps({
            'action':'add_user',
            'message': message,
            'msc':msc
        }))