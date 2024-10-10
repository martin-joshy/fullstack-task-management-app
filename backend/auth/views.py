from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


class ValidatePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        password = request.data.get("password")
        try:
            validate_password(password)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_200_OK)


class ValidateUsernameView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        if username:
            if User.objects.filter(username=username).exists():
                return Response(
                    {"is_available": False},
                    status=status.HTTP_200_OK,
                )
            return Response({"is_available": True}, status=status.HTTP_200_OK)
        elif username == "":
            return Response(status=status.HTTP_204_NO_CONTENT)
