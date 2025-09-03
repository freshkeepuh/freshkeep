# UI Checklist

### UI-01: The "goal" of the page is clear.

Can you describe what the page is supposed to accomplish in one sentence?

Does the page provide sufficient information and/or controllers to accomplish the goal?

### UI-02: The layout is appropriate at both desktop and mobile screen sizes.

The organization of information on the page utilizes the "screen real estate" in an appropriate manner at both desktop and mobile sizes.

To check mobile size, there is [device mode](https://developers.google.com/web/tools/chrome-devtools/device-mode) in Chrome Developer Tools to simulate various screen sizes.

### UI-03: Links, buttons, and other controllers are obvious.

There should be no "easter eggs", i.e. things you have to hover over to see that they are interactive.

### UI-04: Forms provide example values.

Form controllers should be annotated or documented with appropriate sample values.

### UI-05: Requests for information or access should make the "why" available.

When asking for information, consider if some explanation of why the information is being requested should be provided.

### UI-06: The page loads acceptably quickly.

Pages for "normal users" should load in less than 3 seconds. It is acceptable for admin users to wait longer under certain circumstances.

### UI-07: The console does not generate errors.

When loading and/or interacting with the page with Chrome Developer Tools open, no errors should be generated.
