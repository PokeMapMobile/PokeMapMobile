# PokéMapMobile

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](paypal.me/pokemapmobile)

PokeMapMobile is a web service that brings your scanning results from your [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) to your phone. Get the mobile app on Google Play (link here).



* Background location tracking to focus your maps to scan where you currently are through your phone's GPS
* Push notifications via [Pushbullet](https://www.pushbullet.com) to notify you of pokemon even while the app is in the background or when your phone is locked.
* Customize which Pokemon you are notified of as well as how far the Pokémon is. 
* View Pokémon Locations through the in-app Map or Google Maps locations via Pushbullet

**Note**: Currently the app is only for Android. Good news is that the iOS version is ready to go! However being being poor college students and all makes it hard to get on the iOS app store. Donating to help bring this to iOS would be very appreciated. Until then, we have placed Ads in the app.

This Repository is specifically for the Desktop application, which serves as the connection between your [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) instances and your phone.

## Setup

PokéMapMobile consists of three parts:

1. Your instances of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map).
2. The PokéMapMobile Desktop Application.
3. The mobile application.

We assume that you already know how to run [PokemonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) through the command line. The application interfaces with the program's [webhook's](https://github.com/PokemonGoMap/PokemonGo-Map/wiki/Using-Webhooks).

The complete setup is as follows:

1. Run all of your instances of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map), but add the command line parameter `-wh http://localhost:3001`. **Note**: You can not use the `-ns` flag, as the web server is needed to change to location. You must also specify a port with the `-P` flag!
  * Example command: `python runserver.py <login credentials -a -u -p...> -k $GMAPS_KEY -l $LOCATION -st $STEP_LIMIT -P 5000 -wh http://localhost:3001` 

2. Run the PokéMapMobile Desktop.
3. For each instance of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) you ran earlier, add in their url. For example, if you used port 5000 above, you would input `http://localhost:5000`. Then input the step size for that instance.
4. Click the connect button. If it turns green then you are all set!
5. Open the PokéMapMobile app on your phone. Touch the gear icon to go to the settings. In the Notification Code field, enter the notification code given in the app. Optionally add in your Pushbullet Access Token. Then Press save.

If you did everything correctly, you will begin to receive pokemon and notifications. Congrats! 

## Screenshots

![alt text](http://i.imgur.com/FwhscSv.png)
![alt text](http://i.imgur.com/3ZdhtpT.png)
![alt text](http://i.imgur.com/WUbxOQH.png)
![alt text](http://i.imgur.com/GXvicBl.png)
![alt text](http://i.imgur.com/16nfV6W.png)
![alt text](http://i.imgur.com/s7YRSor.png)
