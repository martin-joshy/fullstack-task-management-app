from dj_rest_auth.serializers import PasswordResetSerializer
from django.conf import settings


RESET_PASSWORD_REDIRECT_URL = settings.RESET_PASSWORD_REDIRECT_URL


def custom_url_generator(request, user, temp_key):
    return f"{RESET_PASSWORD_REDIRECT_URL}?uid={user.id}&token={temp_key}"


class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        return {"url_generator": custom_url_generator}
