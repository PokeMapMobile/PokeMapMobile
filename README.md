# PokéMapMobile

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/pokemapmobiledev)

PokéMapMobile is a web service that brings your scanning results from your [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) to your phone.

* Background location tracking to focus your maps to scan where you currently are through your phone's GPS
* Push notifications via [Pushbullet](https://www.pushbullet.com) to notify you of pokemon even while the app is in the background or when your phone is locked.
* Customize which Pokémon you are notified of as well as how far the Pokémon is. 
* View Pokémon Locations through the in-app Map or Google Maps locations via Pushbullet

PokéMapMobile is for both iOS and Android. See our release section for the Android .apk. Working on iOS distribution for jailbroken phones!

[Link to latest release](https://github.com/PokeMapMobile/PokeMapMobile/releases/latest)

## Setup

PokéMapMobile consists of three parts:

1. Your instances of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map).
2. The PokéMapMobile Desktop Application.
3. The mobile application.

We assume that you already know how to run [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) through the command line. The application interfaces with the app's [webhooks](https://github.com/PokemonGoMap/PokemonGo-Map/wiki/Using-Webhooks).

The complete setup is as follows:

1. Download and unzip the desktop app for your OS and download the PokeMapMobile.apk from the [releases section](https://github.com/PokeMapMobile/PokeMapMobile/releases/latest).
2. Run all of your instances of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map), but add the command line parameter `-wh http://localhost:3001`. **Note**: You can not use the `-ns` flag, as the web server is needed to change to location. You must also specify a port with the `-P` flag!
  * Example command: `python runserver.py <login credentials -a -u -p...> -k $GMAPS_KEY -l $LOCATION -st $STEP_LIMIT -P 5000 -wh http://localhost:3001` 

3. Run the PokéMapMobile desktop app.
4. Open the PokéMapMobile app on your phone. Touch the gear icon to go to the settings. In the Notification Code field, enter the notification code given in the desktop app. Optionally add in your Pushbullet Access Token. Then press save.
5. For each instance of [PokémonGo-Map](https://github.com/PokemonGoMap/PokemonGo-Map) you ran earlier, add in their url. For example, if you used port 5000 above, you would input `http://localhost:5000`. Then input the step size for that instance.
6. Click the connect button in the desktop app for each map. If it turns green then you are all set!


If you did everything correctly, you will begin to receive pokemon and notifications. Congrats! 

## Running the desktop app without the UI.

To run the desktop app in the terminal, clone the repo and run `npm install`, then use the following command:

`node server_only.js -h http://localhost:5000 -s $STEP_SIZE`

To connect to multiple instances, use:

`node server_only.js -h http://localhost:5000 -s $STEP_SIZE_1 -h http://localhost:5001 -s $STEP_SIZE_2`

## Screenshots

<img src="http://i.imgur.com/FwhscSv.png" height=960 width=540>
<img src="http://i.imgur.com/WUbxOQH.png" height=960 width=540>
<img src="http://i.imgur.com/GXvicBl.png" height=960 width=540>
<img src="http://i.imgur.com/s7YRSor.png" height=960 width=540>
<img src="http://i.imgur.com/3ZdhtpT.png">
