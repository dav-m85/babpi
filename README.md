# babPi

Use a Raspberry Pi to track your football table games.

## TODO
* mock longTouch shortTouch
* SAP for scoreboard
* Post form for reservation of a Game
* Stat endpoint
* Ranking page

## Installation
### Kiosk mode on Raspberry Pi
Setup your beloved Raspberry Pi with
https://www.raspberrypi.org/downloads/raspbian/

    # Update system
    sudo apt-get update
    sudo apt-get upgrade

    # Install chromium 48
    cd
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb
    sudo dpkg -i chromium-browser-l10n_48.0.2564.82-0ubuntu0.15.04.1.1193_all.deb chromium-browser_48.0.2564.82-0ubuntu0.15.04.1.1193_armhf.deb

    # oops does not wework
    https://www.raspberrypi.org/blog/web-browser-released/
    https://github.com/stackgl/headless-gl

    # Install other things
    sudo apt-get install x11-xserver-utils unclutter

    # try /etc/xdg/lxsession/LXDE/autostart
    @xset s off
    @xset -dpms
    @xset s noblank
    @chromium --kiosk --incognito https://www.google.com

### Have a node JS running

    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb
    touch /home/pi/app.js
    su pi -c 'node /home/pi/app.js < /dev/null &'

# Reference
https://www.raspberrypi.org/downloads/raspbian/ (root of it all)
https://www.raspberrypi.org/forums/viewtopic.php?t=121195 (how to get chromium 48)
http://weworkweplay.com/play/raspberry-pi-nodejs/ (how to get nodejs)
https://learn.adafruit.com/adafruits-raspberry-pi-lesson-2-first-time-configuration/overview (using all partition)
http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/ (outdated)
https://www.danpurdy.co.uk/web-development/raspberry-pi-kiosk-screen-tutorial/ (big, too big)
https://github.com/basdegroot/raspberry-pi-kiosk (bit outdated too)
https://lokir.wordpress.com/2012/09/16/raspberry-pi-kiosk-mode-with-chromium/ (nearly the thing)
