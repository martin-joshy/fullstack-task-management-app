import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Task
from .serializers import TaskSerializer

class TaskConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("tasks", self.channel_name)
        await self.accept()
        await self.send_initial_tasks()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("tasks", self.channel_name)

    async def tasks_update(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_tasks(self):
        return TaskSerializer(Task.objects.all(), many=True).data

    async def send_initial_tasks(self):
        tasks = await self.get_tasks()
        await self.send(text_data=json.dumps({
            'type': 'tasks_update',
            'tasks': tasks
        }))