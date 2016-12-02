# babpi
Follow score and rank players for your football table games, using a [Raspberry Pi](https://www.raspberrypi.org/). Not a new idea, but never found a complete solution.

![babPi in action](photo.jpg)

Features:

* Game booking
* Player ranking using XBox's Trueskill algorithm.
* History for all games played
* Simple wiring
* ... or if you want, nrf24l01 transceiver support for wireless.
* Retro look'n'feel

You'll need:

* A Football table
* [Raspberry-pi B+ with 2016-02-09-raspbian-jessie-lite clean](https://www.raspberrypi.org/downloads/raspbian)
* A screen (to display current game scoreboard)
* Two arcade plunger buttons (to increment score and interact with scoreboard)
* Basic shell understanding

## Installation
### For development
babpi can be run straight from your dev machine with:

    npm install
    npm run dev

Then just open http://127.0.0.1:3000/ in your favorite browser. You can mock the button interface by pressing a, A, b and B.


### Raspberry pi
Let's start with a fresh raspberry pi, minimal Raspbian:
    
    # Setup python for the ranking system
    sudo apt-get install python-pip
    sudo pip install trueskill
    
    # Install node
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb
    
    # We need git (@todo explain direct download install)
    sudo apt-get install git
    
    # Lets put babpi inside the /opt folder
    sudo mkdir /opt/babpi
    sudo chown pi: /opt/babpi
    cd /opt/babpi
    git clone https://github.com/dav-m85/babpi.git .
    
    # Install dependencies and build the thing
    npm install
    npm run build
    
    # Run the server for a test
    node server.js

Opening ```http://ip-of-your-raspberrypi:3000/scoreboard``` should display... the scoreboard.

From here, depending on your hardware setup, you can decide to use one of the following input method:

- **wire**: Pi GPIO is directly connected to the buttons.
- **radio**: A nrf24 remote board is used. You connect a nrf24l01 to the GPIO.

Installation differs for both methods.

#### wire ####
Just wire the buttons straight to the Pi GPIO. By default GPIO17 and 18 are used.

    # We need the on off library
    npm install onoff
    # Lets activate pull ups
    sudo apt-get install device-tree-compiler
    dtc -@ -I dts -O dtb -o mygpio-overlay.dtb hardware/wire/mygpio-overlay.dts
    sudo cp mygpio-overlay.dtb /boot/overlays/mygpio-overlay.dtb
    echo "device_tree_overlay=overlays/mygpio-overlay.dtb" | sudo tree /boot/config.txt
    sudo reboot


#### radio ####
You can find hardware sources in the [radio folder](./hardware/radio).
    npm install nrf
    
    # edit rc.local
    echo "25" >> /sys/class/gpio/export
    echo "24" >> /sys/class/gpio/export
    ...
    exit 0;

### Kiosk ###
Having the scoreboard displayed at all time with the Raspberry Pi needs some installation.

    # Install chromium 48
    cd
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb
    sudo dpkg -i chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb

    # Install on raspberry
    sudo cp initd.sh /etc/init.d/babpi.sh
    sudo chmod +x /etc/init.d/babpi.sh
    sudo update-rc.d babpi.sh defaults  

    # Replace /home/pi/.config/lxsession/LXDE/autostart with the following lines
    @lxpanel --profile LXDE
    @pcmanfm --desktop --profile LXDE
    #@xscreensaver -no-splash
    @xset s off
    @xset -dpms
    @xset s noblank
    unclutter -idle 0
    chromium-browser --kiosk http://127.0.0.1/scoreboard --incognito

## TODO
There's still a few things I would like to improve:

* Deal with longClick and shortClick on the GPIO
* Autocomplete player in book page
* Competition mode
* Nicer scoreboard
* Write doc and hardware guide
* long click cancel point instead of canceling game
* long click on both sides cancel the game
* General code cleanup
* Provide graph with player stats, http://nvd3.org/examples/cumulativeLine.html

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
* http://www.moserware.com/2010/03/computing-your-skill.html (amazing resource on trueskill)
* http://www.miniinthebox.com/nrf24l01-2-4ghz-wireless-transceiver-module-for-arduino_p903473.html (low energy transceiver used)
* https://davidwalsh.name/street-fighter (the ken used on first page)
* https://github.com/fivdi/onoff/wiki/Enabling-Pullup-and-Pulldown-Resistors-on-The-Raspberry-Pi

Those below are outdated but I did use them for inspiration...

* https://learn.adafruit.com/node-embedded-development/installing-node-dot-js
* http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
* https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/
* https://github.com/basdegroot/raspberry-pi-kiosk
* https://lokir.wordpress.com/2012/09/16/raspberry-pi-kiosk-mode-with-chromium/

* http://www.framboise314.fr/faire-dialoguer-un-raspberry-et-un-arduino-via-nrf24l01/#Installation_de_SPI (wireless inspiration)
* http://www.helmancnc.com/g-code-example-mill-sample-g-code-program-for-beginners/

## Other projects
* http://blog.makingwaves.com/technology/the-foosball-table-live-status-system/
* http://austin.foos.buzz/about
* https://developer.ibm.com/bluemix/2015/08/06/built-iot-foosball-table-ibm-bluemix/
* https://www.reddit.com/r/AskElectronics/comments/2rqlhy/help_with_building_an_electronic_foosball_scoring/
* http://www.semageek.com/projet-le-robot-champion-de-babyfoot-de-epfl/
* Check [pongdome](https://github.com/busbud/pongdome) it's quite the same thing
