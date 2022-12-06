---
title: How to Code the Infamous Weather App
date: 2022-12-05T23:13:38.464Z
tags:
  - JavaScript
  - Featured
image: /images/weather.jpg
imageAlt: A lovely sunset
description: An solid starting point to make your own. I hope you know some CSS!
---
O﻿ur app is very simple, but covers topics like `async/await`, `for/of loops`, `Unix timestamp conversion`, the `fetch API`, and more. \
\
L﻿et me begin by showing you what our (almost) entirely JavaScript site will look like. Keep in mind that you can easily add whatever weather data you wish to this code, and even style it to make it look really professional. \
A﻿ll code for this project can be found [here on GitHub](https://github.com/RayLThomas/Infamous-Weather-App-Guts).

## T﻿he Project

1﻿. A prompt for your US zip code:

![A prompt asking for your US zip code](/images/screenshot-from-2022-12-05-18-23-39.png)

\
2﻿.  Some weather data about today's forecast in your area:

![returned data to the DOM](/images/screenshot-from-2022-12-05-16-41-31.png)

## F﻿ile and Directory Setup

F﻿irst, we'll set up the container for us to inject HTML elements to the DOM.

<script src="https://gist.github.com/RayLThomas/69abaae4352b35fc14f10fdbc0f8c4d1.js"></script>

N﻿ext, we'll add a `script.js` file. I've put mine in within a script directory. `scripts/script.js`

<script src="https://gist.github.com/RayLThomas/dfc3fd6b1069b91f00679b73fbdc2812.js"></script>

## W﻿eather Account Sign Up

H﻿ead over to <https://openweathermap.org/> and sign up for a free account.
T﻿here are a few tiers and product offerings, but the free version is perfect for our use.

C﻿lick on your profile and My API Keys.\
\
F﻿rom here you should see a default key waiting for you. You're also welcome to generate another API key if you prefer. Name it whatever you like. \
\
V﻿isit [their documentation](https://openweathermap.org/forecast5) to learn about the shape of the returned data, what you have access to, and what parameters should be included in your API call.\
\
Y﻿ou will need to confirm your email address with them. Conveniently, they provide a test API GET request with your API in it. I recommend downloading and using something like [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download) to confirm your API keys are working. There may be a 2-hour delay, but most users report only a few minutes of wait time. 



## F﻿etch the Data

W﻿e are going to begin by prompting the user for their zip code. Once we have that number, we will build our API Get request.

<script src="https://gist.github.com/RayLThomas/72d51e5054db24bd1a1dc68df7631d47.js"></script>

A﻿ few quick callouts:

1. W﻿e've exposed our API key. Ideally this should be saved in something like a `.env` file and not published with it exposed. Imagine if you were paying for calls and someone used your API key to rack up a giant bill! In this example, I don't mind exposing it.
2. O﻿ur code is wrapped in an asynchronous function called `main()`. Without this wrapper, we could not save the asynchronous API call to a variable, since promises can't return values globally. 
3. A﻿fter setting the variables, we wrap everything else in a try/catch block for a basic error handling.
4. W﻿e are calling a `getJsonData` function that we've written to return a parsed data `string` to `JSON`.
5. W﻿e make use of `fetch`'s second (optional) argument that resolves any `CORS` errors we may receive when making API calls to an external server.
6. I﻿n the `catch` block, I alerted the user that something went wrong and restarted the app by calling `main()` once more.

I﻿n the try block, go ahead and `console.log` the `jsondata` variable to see it in the console.



## Render the Data With String Interpolation

O﻿k, here comes the fun part! Grab each node that we created at the beginning and add `.textContent` that utilizes the returned `jsondata`. (This should be within the `try` block.)\
\
I﻿ added sunrise and sunset data to mine. This requires a quick little Unix timestamp conversion that I wrote about [here](https://www.raymond-thomas.com/code/codeposts/2022-12-05-unix-time-conversion-method/).

I﻿ also found that appending all the nodes to the container div was awful repetitive. To keep things nice and D.R.Y., I wrote a quick function to loop through an array of created nodes and append each:

<script src="https://gist.github.com/RayLThomas/85b979043441eee0eaa27c385f66f8b3.js"></script>



## S﻿ummary

W﻿e've done a lot! Remember, a﻿ll code for this project can be found [here on GitHub](https://github.com/RayLThomas/Infamous-Weather-App-Guts).

W﻿e made an account with Open Weather Map, set up API keys, called some weather data, formatted and injected it to the DOM, added a few helper functions, and implemented a basic error handling mechanism. \
\
N﻿ow it is up to you to style it up and make it something worth sharing with the world!