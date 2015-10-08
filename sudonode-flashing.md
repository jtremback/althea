### MyNet

- Connect on LAN
- Hold reset button while turning on
- Wait 10 seconds, blue power light starts flashing
- sudo ip addr add 192.168.1.10/24 dev eth0
- build-test2.sudomesh.org/builds has the builds for ar71xx and extender node
- search for the correct model in the list
- download the binary
- Open incognito window, go to 192.168.1.1, upload binary (-factory version)
- pull sudomesh/makenode
- sudo ip addr add 172.22.0.10/24 dev eth0
- ping to see if this worked
- you can ssh in, check the makenode config
- run makenode.js
- unique name
- 20000
- 50000
- reboot


### TP-Link
- http://wiki.openwrt.org/toh/tp-link/tl-wdr4300#installation
- id addr add 192.168.0.66/24 dev eth0
- run tftp server etc
- turn off
- hold reset button and turn on
- check tcpdump for the tftp packets (lots of packets)
