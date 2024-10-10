from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save()
        self.send_task_update()

    def perform_update(self, serializer):
        task = serializer.save()
        self.send_task_update()

    def perform_destroy(self, instance):
        instance.delete()
        self.send_task_update()

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_tasks = Task.objects.count()
        completed_tasks = Task.objects.filter(is_done=True).count()
        remaining_tasks = total_tasks - completed_tasks
        
        return Response({
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'remaining_tasks': remaining_tasks,
        })

    def send_task_update(self):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "tasks",
            {
                "type": "tasks_update",
                "tasks": TaskSerializer(Task.objects.all(), many=True).data,
                "statistics": self.get_statistics()
            }
        )

    def get_statistics(self):
        total_tasks = Task.objects.count()
        completed_tasks = Task.objects.filter(is_done=True).count()
        remaining_tasks = total_tasks - completed_tasks
        return {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'remaining_tasks': remaining_tasks,
        }