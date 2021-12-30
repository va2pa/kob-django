from django.http import HttpResponse

def index(request):
    return HttpResponse("My first page!")
def play(request):
    return HttpResponse("play game!")
