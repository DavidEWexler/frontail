# mining-frontail – mining config and streaming logs to the browser

```mining-frontail``` us currently under development and is a fork of [frontail](https://github.com/mthenw/frontail/)

![frontial](https://user-images.githubusercontent.com/455261/29570317-660c8122-8756-11e7-9d2f-8fea19e05211.gif)

## Quick start

- Coming Soon

## Features

* log rotation
* auto-scrolling
* marking logs
* number of unread logs in favicon
* themes (default, dark)
* [highlighting](#highlighting)
* search (```Tab``` to focus, ```Esc``` to clear)
* tailing [multiple files](#tailing-multiple-files) and [stdin](#stdin)
* basic authentication
* Miner configuration, specific to nvidia-miner-node (public repo coming)

## Installation options

* Coming soon

## Usage

    miner-frontail [options] [file ...]

    Options:

      -h, --help                    output usage information
      -V, --version                 output the version number
      -h, --host <host>             listening host, default 0.0.0.0
      -p, --port <port>             listening port, default 9001
      -n, --number <number>         starting lines number, default 10
      -l, --lines <lines>           number on lines stored in browser, default 2000
      -t, --theme <theme>           name of the theme (default, dark)
      -d, --daemonize               run as daemon
      -U, --user <username>         Basic Authentication username, option works only along with -P option
      -P, --password <password>     Basic Authentication password, option works only along with -U option
      -k, --key <key.pem>           Private Key for HTTPS, option works only along with -c option
      -c, --certificate <cert.pem>  Certificate for HTTPS, option works only along with -k option
      --pid-path <path>             if run as daemon file that will store the process id, default /var/run/frontail.pid
      --log-path <path>             if run as daemon file that will be used as a log, default /dev/null
      --ui-hide-topbar              hide topbar (log file name and search box)
      --ui-no-indent                don't indent log lines
      --ui-highlight                highlight words or lines if defined string found in logs, default preset
      --ui-highlight-preset <path>  custom preset for highlighting (see ./preset/default.json)
      --config-in <path>            configuration file to be loaded by the config rest call, default /opt/miner/config.json
      --config-out <path>           configuration file to be saved by the config-save rest call, default /opt/miner/config_new.json
      --min-power <watts>           minimum acceptable power level for the GPUs, default 80
      --max-power <watts>           maximum acceptable power level for the GPUs, default 150
      --max-gpu-oc <mhz>            maximum acceptable gpu overclock, default 0
      --max-mem-oc <mhz>            maximum acceptable gpu memory overclock, default 0
      --min-fan-speed <percent>     minimum acceptable gpu fan speed, default 60
      --max-fan-speed <percent>     maximum acceptable gpu fan speed, default 100

Web interface runs on **http://127.0.0.1:[port]**.

### Tailing multiple files

`[file ...]` accepts multiple paths, `*`, `?` and other shell special characters([Wildcards, Quotes, Back Quotes and Apostrophes in shell commands](http://www.codecoffee.com/tipsforlinux/articles/26-1.html)).

### stdin

Use `-` for streaming stdin:

    ./server | frontail -

### Highlighting

```--ui-highlight``` option turns on highlighting in UI. By default preset from ```./preset/default.json``` is used:

```
{
    "words": {
        "err": "color: red;"
    },
    "lines": {
        "err": "font-weight: bold;"
    }
}
```

which means that every "err" string will be in red and every line containing "err" will be bolded.

*New presets are very welcome. If you don't like default or you would like to share yours, please create PR with json file.*
