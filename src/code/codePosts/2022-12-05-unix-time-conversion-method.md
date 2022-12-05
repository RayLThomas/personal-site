---
title: Unix Time Conversion Method
date: 2022-12-05T21:12:07.453Z
tags:
  - JavaScript
  - snippet
  - Featured
image: /images/colorfulclock.jpg
imageAlt: A colorful clock
description: A quick code snippet that converts a unix timestamp to something
  human readable.
---
T﻿his function takes in a unix timestamp as an argument and returns the time in HH:MM:SS format.

<script src="https://gist.github.com/RayLThomas/bfcb933422e5c7bd16aea6f87330e87f.js"></script>

B﻿ecause Unix times are recorded in seconds, we need to multiply by 1000 to get the number of milliseconds. Milliseconds are used for JavaScript Datetimes.\
\
F﻿inally, we simply use JavaScript's Date method `toLocaleTimeString();` and pass in the `en-US` locales.\
\
Y﻿ou may find information about acceptable locales and options at [Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).