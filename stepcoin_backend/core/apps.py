from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"
    
    ## set up signals to be registered
    def ready(self):
        import core.signals
