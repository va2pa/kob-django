from django.http import JsonResponse
from django.core.cache import cache
import requests
from django.contrib.auth.models import User
from game.models.player.player import Player
from random import randint

def receive_code(request):
    data = request.GET
    if "errcode" in data:
        return JsonResponse({
            'result': "apply-failed",
            'errcode': data['errcode'],
            'errmsg': data['errmsg'],
        })
    code = data.get('code')
    state = data.get('state')
    if not cache.has_key(state):
        return JsonResponse({
            'result': "state not exist"
        })

    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    params = {
        'appid': "190",
        'secret': "a8c832cf3e14425fbf6fac9e29216199",
        'code': code
    }

    access_token_res = requests.get(apply_access_token_url, params=params).json()

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    players = Player.objects.filter(openid=openid)

    # 该openid对应的用户已存在，无需重新获取信息注册
    if players.exists():
        player = players[0]
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo
        })

    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        "access_token": access_token,
        "openid": openid
    }
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    username = userinfo_res['username']
    photo = userinfo_res['photo']

    # 防止acwing和网站用户重名
    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))

    #注册
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user, photo=photo, openid=openid)

    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo
    })
