# Adblock Radio web player

![](https://www.adblockradio.com/blog/content/images/2018/08/abr_UI.png)

## Choice of the host to connect to

This web player is an interface that connects to the backend servers of Adblock Radio, that run the [ad filter algorithms](https://github.com/adblockradio/adblockradio).

By default, the player will connect to a random server in the list available at `https://www.adblockradio.com/api/servers`, under the form `https://status.xxx.adblockradio.com/`. You can force the player to choose a given server by appending the query string `/?dev=xxx`. Setting `/?dev=local` will connect to `http://localhost:3066/`.

## Change language

The player supports two locales, English and French. Language can be set in the UI but you can force it on startup with the query string `/?lang=XX` with `XX` being either `en` or `fr`.

## Setup account

The player uses a token 
`?t=XXX` with `XXX` being a JWT.
