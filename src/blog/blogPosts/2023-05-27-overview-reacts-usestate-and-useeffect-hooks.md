---
title: Overview React's useState and useEffect Hooks
date: 2023-01-11T16:05:49.472Z
tags:
  - React
image: /images/hook.jpg
imageAlt: A hook image
description: Hooks are an important topic in React, and understanding common
  hooks like useState and useEffect is crucial for developing React
  applications. Here is a brief overview.
---
Hooks are an important topic in React, and understanding common hooks like **`useState`** and **`useEffect`** is crucial for developing React applications.

### u﻿seState Hook:

T﻿he `useState `hook provides functional components with their own internal state. It returns a pair of value:

1. t﻿he current value
2. a﻿ function to update that value

A﻿ common example using a counter:

<script src="https://gist.github.com/RayLThomas/3455bd91735a8ea9832677f0f6c539dc.js"></script>

I﻿n this example, the `useState `hook defines the **`count`** state variable and the **`setCount`** function used to update the state. The initial value of **`count`** is set to 0. 

### u﻿seEffect Hook:

T﻿he `useEffect `hook allows you to perform side effects in functional components. It is somewhat similar to lifecycle methods like **`componentDidMount`** and **`componentDidUpdate`**. This hook can be used to fetch data, subscribe to events, or any other action that has side effects. 

A﻿n example from rendering returned API data:

<script src="https://gist.github.com/RayLThomas/23fd8d87ae12e7db4d1dd1702d880752.js"></script>

I﻿n this example, the **`useEffect`** hook fetches data from a made up API endpoint when the component mounts for the first time. The empty array passed in is the dependency array and makes the hook run only once. The fetched data is stored in the **`data`** state variable by use of the **`setData`** function.