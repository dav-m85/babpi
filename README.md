# babpi
Follow score and rank players for your football table games, using a raspberry-pi. Not a new idea, but never found a complete solution.

You'll need:
* Football table
* [Raspberry-pi B+ with 2016-02-09-raspbian-jessie-lite clean](https://www.raspberrypi.org/downloads/raspbian)
* An HDMI screen (to display current game scoreboard)
* Two arcade plunger buttons (to increment score and interact with scoreboard)
* Lot of wires
* Basic shell understanding

And you'll get:

__provide screenshot__

## Installation
### For development
babpi can be run straight from your dev machine with:

    npm install
    npm run dev

Then just open http://127.0.0.1:3000/ in your favorite browser. You can mock the button interface by pressing a, A, b and B.


### Raspberry pi
Let's start with a fresh raspberry pi:

    # Update system
    sudo apt-get update
    sudo apt-get upgrade

    # Install chromium 48
    cd
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb
    sudo dpkg -i chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb

    # Install node
    cd
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb

    # Install babPi (this)
    cd
    sudo apt-get install git
    git clone https://github.com/dav-m85/babpi.git
    cd babpi
    npm install
    npm install onoff
    npm run build

    # Setup GPIO
    cd wiringPi-b0a60c3/
    gpio -v
    gpio readall
    gpio mode 0 up

    # Replace /home/pi/.config/lxsession/LXDE/autostart with the following lines
    @lxpanel --profile LXDE
    @pcmanfm --desktop --profile LXDE
    #@xscreensaver -no-splash
    @xset s off
    @xset -dpms
    @xset s noblank
    unclutter -idle 0
    gpio mode 0 up
    node /home/pi/babpi/server.js </dev/null >/home/pi/babpi/server.log 2>&1 &
    chromium-browser --kiosk http://192.168.0.107:3000/scoreboard --incognito

## TODO
There's still a few things I would like to improve:

* Stat endpoint
* Ranking page with TrueSkill algo, could use http://www.moserware.com/2010/03/computing-your-skill.html, and even https://github.com/freethenation/node-trueskill
* Deal with longClick and shortClick on the GPIO
* Autocomplete player in book page
* Competition mode
* Proper build to ease installation
* Propose a wireless version with a [low energy transceiver](http://www.miniinthebox.com/nrf24l01-2-4ghz-wireless-transceiver-module-for-arduino_p903473.html). 
* long click cancel point instead of canceling game
* long click on both sides cancel the game
* On win screen, long click replay

Feel free to do a Pull Request.


## References
* https://www.raspberrypi.org/downloads/raspbian/ (root of it all)
* https://www.raspberrypi.org/forums/viewtopic.php?t=121195 (how to get chromium 48)
* http://weworkweplay.com/play/raspberry-pi-nodejs/ (how to get nodejs)
* https://learn.adafruit.com/adafruits-raspberry-pi-lesson-2-first-time-configuration/overview (using all partition)
* http://alexba.in/blog/2013/01/07/use-your-raspberrypi-to-power-a-company-dashboard/ (boot)
* http://conoroneill.net/running-the-latest-chromium-45-on-debian-jessie-on-your-raspberry-pi-2/
* https://medium.com/@icebob/jessie-on-raspberry-pi-2-with-docker-and-chromium-c43b8d80e7e1#.by528ziyc
* http://hackaday.com/2015/12/09/embed-with-elliot-debounce-your-noisy-buttons-part-i/ (debouncing them all)

Those below are outdated but I did use them for inspiration...

* https://learn.adafruit.com/node-embedded-development/installing-node-dot-js
* http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
* https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/
* https://github.com/basdegroot/raspberry-pi-kiosk
* https://lokir.wordpress.com/2012/09/16/raspberry-pi-kiosk-mode-with-chromium/


## Other projects
* http://blog.makingwaves.com/technology/the-foosball-table-live-status-system/
* http://austin.foos.buzz/about
* https://developer.ibm.com/bluemix/2015/08/06/built-iot-foosball-table-ibm-bluemix/
* https://www.reddit.com/r/AskElectronics/comments/2rqlhy/help_with_building_an_electronic_foosball_scoring/
* http://www.semageek.com/projet-le-robot-champion-de-babyfoot-de-epfl/
* I know [BusBud](https://github.com/busbud) is working on a similar project, but they haven't open sourced it yet.
