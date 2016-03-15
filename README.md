# babPi

Use a Raspberry Pi to track your football table games.

## Installation

There's a few steps. Have a fresh Raspberry Pi 2 with [Raspbian](https://www.raspberrypi.org/downloads/raspbian). Mine is a 2016-02-09-raspbian-jessie-lite.

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
    npm run build-js
     
    # try /home/pi/.config/lxsession/LXDE/autostart
    @lxpanel --profile LXDE
    @pcmanfm --desktop --profile LXDE
    #@xscreensaver -no-splash
    @xset s off
    @xset -dpms
    @xset s noblank
    unclutter -idle 0
    node /home/pi/babpi/server.js < /dev/null &
    chromium-browser --kiosk https://www.google.com --incognito


## TODO
There's still a few things I would like to improve:

* mock longTouch shortTouch
* Stat endpoint
* Ranking page with TrueSkill algo

Feel free to do a Pull Request.


## References
* https://www.raspberrypi.org/downloads/raspbian/ (root of it all)
* https://www.raspberrypi.org/forums/viewtopic.php?t=121195 (how to get chromium 48)
* http://weworkweplay.com/play/raspberry-pi-nodejs/ (how to get nodejs)
* https://learn.adafruit.com/adafruits-raspberry-pi-lesson-2-first-time-configuration/overview (using all partition)
* http://alexba.in/blog/2013/01/07/use-your-raspberrypi-to-power-a-company-dashboard/ (boot)
* http://conoroneill.net/running-the-latest-chromium-45-on-debian-jessie-on-your-raspberry-pi-2/
* https://medium.com/@icebob/jessie-on-raspberry-pi-2-with-docker-and-chromium-c43b8d80e7e1#.by528ziyc

Those below are outdated but I did use them for inspiration...

* http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
* https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/
* https://github.com/basdegroot/raspberry-pi-kiosk
* https://lokir.wordpress.com/2012/09/16/raspberry-pi-kiosk-mode-with-chromium/


## Other projects
I know [BusBud](https://github.com/busbud) is working on a similar project, but they haven't open sourced it yet.