# Pow

A command line tool to manage proxy and enable/disable proxy (on mac)

## Features

0. platform selection/detection
    - mac (first version)
    - windows
    - linux(ubuntu...)

1. create proxy rules
    1.0 name
    1.1 mode: http, https, socks4, socks5
    1.2 url for mode: http://xxx, socks5://yyy

2. apply proxy rules to which program
    2.1 current terminal
    2.2 npm global
    2.3 yarn global
    2.4 ...




---

### Create proxy setting

cmd: `pox create profile`

will display a prompt to let user select which proxy type will be setted.

what kind of proxys cmd have?

http? https? socks4? socks5?

### enable proxy 

cmd: `pox on name`

### disable proxy

cmd: `pox off`

### list existing proxy setting

cmd: `pox list`

### see current proxy status

cmd: `pox now`



