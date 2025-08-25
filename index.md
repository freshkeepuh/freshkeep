![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/landing-page.png)

meteor-application-template-production is a sample Meteor 2.7.3 application that illustrates: 

  * A standard directory layout using 'imports/' as recommended in the [Meteor Guide](https://guide.meteor.com/structure.html)
  * [Bootstrap 5 React](https://react-bootstrap.github.io/) for user interface.
  * [Uniforms](https://uniforms.tools/) for form development.
  * [alanning:roles](https://github.com/alanning/meteor-roles) to implement a special "Admin" user.
  * Authorization, authentication, and registration using built-in Meteor packages.
  * Initialization of users and data from a settings file.
  * Alerts regarding success or failure of DB updates using [Sweet Alert](https://sweetalert.js.org/).
  * Quality assurance using [ESLint](http://eslint.org) with packages to partially enforce the [Meteor Coding Standards](https://guide.meteor.com/code-style.html) and the [AirBnB Javascript Style Guide](https://github.com/airbnb/javascript).
  * Unit and integration testing using [Meteor test](https://guide.meteor.com/testing.html).
  * Acceptance testing using [TestCafe](https://testcafe.io/).

The goal of this template is to help you get quickly started doing Meteor development by providing a reasonable directory structure for development and deployment, a set of common extensions to the core framework, and boilerplate code to implement basic page display, navigation, forms, roles, and collection manipulation.

## Installation

First, [install Meteor](https://www.meteor.com/install).

Second, go to [https://github.com/ics-software-engineering/meteor-application-template-production](https://github.com/ics-software-engineering/meteor-application-template-production), and click the "Use this template" button. Complete the dialog box to create a new repository that you own that is initialized with this template's files.

Third, go to your newly created repository, and click the "Clone or download" button to download your new GitHub repo to your local file system.  Using [GitHub Desktop](https://desktop.github.com/) is a great choice if you use MacOS or Windows.

Fourth, cd into the app/ directory of your local copy of the repo, and install third party libraries with:

```
$ meteor npm install
```

## Running the system

Once the libraries are installed, you can run the application by invoking the "start" script in the [package.json file](https://github.com/ics-software-engineering/meteor-application-template-production/blob/master/app/package.json):

```
$ meteor npm run start
```

The first time you run the app, it will create some default users and data. Here is the output:

```
 meteor npm run start 

> meteor-application-template-production@ start /Users/carletonmoore/GitHub/ICS314/meteor-application-template-production/app
> meteor --no-release-check --exclude-archs web.browser.legacy,web.cordova --settings ../config/settings.development.json

[[[[[ ~/GitHub/ICS314/meteor-application-template-production/app ]]]]]

=> Started proxy.                             
=> Started HMR server.                        
=> Started MongoDB.                           
I20220529-12:09:18.384(-10)? Creating the default user(s)
I20220529-12:09:18.389(-10)?   Creating user admin@foo.com.
I20220529-12:09:18.453(-10)?   Creating user john@foo.com.
I20220529-12:09:18.515(-10)? Creating default data.
I20220529-12:09:18.515(-10)?   Adding: Basket (john@foo.com)
I20220529-12:09:18.599(-10)?   Adding: Bicycle (john@foo.com)
I20220529-12:09:18.600(-10)?   Adding: Banana (admin@foo.com)
I20220529-12:09:18.601(-10)?   Adding: Boogie Board (admin@foo.com)
I20220529-12:09:18.773(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3000/
```

Periodically, you might see `Error starting Mongo (2 tries left): Cannot run replSetReconfig because the node is currently updating its configuration` after the `=> Started HMR server.`. It doesn't seem to be a problem since the MongoDB does start.

### Viewing the running app

If all goes well, the template application will appear at [http://localhost:3000](http://localhost:3000).  You can login using the credentials in [settings.development.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/config/settings.development.json), or else register a new account.

### ESLint

You can verify that the code obeys our coding standards by running ESLint over the code in the imports/ directory with:

```
meteor npm run lint
```

## Walkthrough

The following sections describe the major features of this template.

### Directory structure

The top-level directory structure is:

```
.github     # holds the GitHub Continuous Integration action and Issue template.
app/        # holds the Meteor application sources
config/     # holds configuration files, such as settings.development.json
doc/        # holds developer documentation, user guides, etc.
.gitignore  # don't commit IntelliJ project files, node_modules, and settings.production.json
```

This structure separates documentation files (such as screenshots) and configuration files (such as the settings files) from the actual Meteor application.

The app/ directory has this structure:

```
.deploy/
  .gitignore     # don't commit mup.js or settings.json
  mup.sample.js  # sample mup.js file used for deploying the application
  settings.sample.json # sample settings file
  
client/
  main.html      # The boilerplate HTML with a "root" div to be manipulated by React.
  main.js        # import startup files.

imports/
  api/           # Define collections
    stuff/       # The Stuffs collection definition
  startup/       # Define code to run when system starts up (client-only, server-only, both)
    client/
    server/
  ui/
    components/  # Contains page elements, some of which could appear on multiple pages.
    layouts/     # Contains top-level layout (<App> component).
    pages/       # Contains components for each page.

node_modules/    # managed by npm

public/          # static assets (like images) can go here.

server/
   main.js       # import the server-side js files.
   
tests/           # testcafe acceptance tests.
```

### Import conventions

This system adheres to the Meteor guideline of putting all application code in the imports/ directory, and using client/main.js and server/main.js to import the code appropriate for the client and server in an appropriate order.

### Application functionality

The application implements a simple CRUD application for managing "Stuff", which is a Mongo Collection consisting of a name (String), a quantity (Number), a condition (one of 'excellent', 'good', 'fair', or 'poor') and an owner.

By default, each user only sees the Stuff that they have created.  However, the settings file enables you to define default accounts.  If you define a user with the role "admin", then that user gets access to a special page which lists all the Stuff defined by all users.

#### Landing page

When you retrieve the app at http://localhost:3000, this is what should be displayed:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/landing-page.png)

The next step is to use the Login menu to either Login to an existing account or register a new account.

#### Login page

Clicking on the Login link, then on the Sign In menu item displays this page:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/signin-page.png)

#### Register page

Alternatively, clicking on the Login link, then on the Sign Up menu item displays this page:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/register-page.png)


#### Landing (after Login) page, non-Admin user

Once you log in (either to an existing account or by creating a new one), the navbar changes as follows:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/landing-after-login-page.png)

You can now add new Stuff documents, and list the Stuff you have created. Note you cannot see any Stuff created by other users.

#### Add Stuff page

After logging in, here is the page that allows you to add new Stuff:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/add-stuff-page.png)

#### List Stuff page

After logging in, here is the page that allows you to list all the Stuff you have created:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/list-stuff-page.png)

You click the "Edit" link to go to the Edit Stuff page, shown next.

#### Edit Stuff page

After clicking on the "Edit" link associated with an item, this page displays that allows you to change and save it:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/edit-stuff-page.png)

#### Landing (after Login), Admin user

You can define an "admin" user in the settings.json file. This user, after logging in, gets a special entry in the navbar:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/admin-landing-page.png)

#### Admin page (list all users stuff)

To provide a simple example of a "super power" for Admin users, the Admin page lists all of the Stuff by all of the users:

![](https://github.com/ics-software-engineering/meteor-application-template-production/raw/main/doc/admin-list-stuff-page.png)

Note that non-admin users cannot get to this page, even if they type in the URL by hand.

### Collections

The application implements a single Collection called "Stuffs". Each Stuffs document has the following fields: name, quantity, condition, and username.

The Stuffs collection is defined in [imports/api/stuff/stuff.js](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/imports/api/stuff/stuff.js).

The Stuffs collection is initialized in [imports/startup/server/Mongo.js](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/imports/startup/server/Mongo.js).

### CSS

The application uses the [React implementation of Bootstrap 5](https://react-bootstrap.github.io/). You can adjust the theme by editing the `app/client/style.css` file. To change the theme override the Bootstrap 5 CSS variables.

```css
/* Use Open Sans as the default sans serif font. */
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700|Source+Code+Pro:300,400,500,700");

/* Set up some CSS variables to theme the application. */
:root {
  --matr-navbar-bg: #ECECEC;
  --matr-navbar-bg-rgb: 236, 236, 236;
}

/* Change bootstrap variable values.
 See https://getbootstrap.com/docs/5.2/customize/css-variables/
 */
body {
  --bs-light-rgb: var(--matr-navbar-bg-rgb);
}

/* Set the SignIn and SignUp alerts background. */
#signin-page .alert-light, #signup-page .alert-light {
  --bs-alert-bg: var(--matr-navbar-bg);
}

/* Define custom styles */
.gray-background {
  background-color: var(--bs-gray-200);
  color: var(--bs-dark);
  padding-top: 10px;
  padding-bottom: 20px;
}
```

### Routing

For display and navigation among its four pages, the application uses [React Router](https://reacttraining.com/react-router/).

Routing is defined in [imports/ui/layouts/App.jsx](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/imports/ui/layouts/App.jsx).


### Authentication

For authentication, the application uses the Meteor accounts package.

When the application is run for the first time, a settings file (such as [config/settings.development.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/config/settings.development.json)) should be passed to Meteor. That will lead to a default account being created through the code in [imports/startup/server/accounts.js](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/imports/startup/server/accounts.js).

The application allows users to register and create new accounts at any time.

### Authorization

Only logged in users can manipulate Stuff documents (but any registered user can manipulate any Stuff document, even if they weren't the user that created it.)

### Configuration

The [config](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/config) directory is intended to hold settings files.  The repository contains one file: [config/settings.development.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/config/settings.development.json).

The [.gitignore](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/.gitignore) file prevents a file named settings.production.json from being committed to the repository. So, if you are deploying the application, you can put settings in a file named settings.production.json and it will not be committed.

### Quality Assurance

#### ESLint

The application includes a [.eslintrc](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/.eslintrc) file to define the coding style adhered to in this application. You can invoke ESLint from the command line as follows:

```
[~/meteor-application-template-production/app]-> meteor npm run lint

> meteor-application-template-production@ lint /Users/philipjohnson/meteor-application-template-production/app
> eslint --quiet ./imports
```

ESLint should run without generating any errors.

It's significantly easier to do development with ESLint integrated directly into your IDE (such as IntelliJ).

#### Unit testing

The [package.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/package.json) file has a script called `test-unit`. This script uses the `meteor test` command. It searches for `*.test.js` files to run. These files are associated with the Collections. An example of the unit test follows:
```shell
meteor npm run test-unit

> meteor-application-template-react@ test-unit /Users/carletonmoore/GitHub/ICS414/meteor-application-template-production/app
> cross-env TEST_BROWSER_DRIVER=puppeteer MOCHA_TIMEOUT=150000 meteor test --exclude-archs web.browser.legacy,web.cordova --no-release-check --once --driver-package meteortesting:mocha --port 3100

[[[[[ Tests ]]]]]                             

=> Started proxy.                             
=> Started HMR server.                        
=> Started MongoDB.                           
I20220713-10:33:55.520(-10)?                  
I20220713-10:33:55.530(-10)? --------------------------------
I20220713-10:33:55.530(-10)? ----- RUNNING SERVER TESTS -----
I20220713-10:33:55.530(-10)? --------------------------------
I20220713-10:33:55.531(-10)? 
I20220713-10:33:55.531(-10)? 
I20220713-10:33:55.531(-10)? 
I20220713-10:33:55.531(-10)?   StuffCollection
I20220713-10:33:55.544(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3100/
I20220713-10:33:55.941(-10)?     ✓ Can define and removeIt (407ms)
I20220713-10:33:55.942(-10)?     ✓ Can define duplicates
I20220713-10:33:56.043(-10)?     ✓ Can update (101ms)
I20220713-10:33:56.047(-10)?     ✓ Can dumpOne, removeIt, and restoreOne
I20220713-10:33:56.048(-10)? 
I20220713-10:33:56.049(-10)?   AdminProfileCollection
I20220713-10:33:56.133(-10)? Defining ADMIN Alayna.Rath98@yahoo.com with password changeme
  [ SNIP... ]
I20220713-10:34:02.619(-10)? Defining ADMIN Kendrick63@gmail.com with password changeme
I20220713-10:34:02.682(-10)?     ✓ Can define and removeIt (6633ms)
I20220713-10:34:02.683(-10)? Defining ADMIN Quinton55@hotmail.com with password changeme
I20220713-10:34:02.744(-10)?     ✓ Cannot define duplicates (62ms)
I20220713-10:34:02.745(-10)? Defining ADMIN Peyton.Kreiger@yahoo.com with password M0IA1WkjBAiw0xc
I20220713-10:34:02.892(-10)?     ✓ Can update (148ms)
I20220713-10:34:02.893(-10)? 
I20220713-10:34:02.893(-10)?   UserProfileCollection
I20220713-10:34:02.895(-10)? Defining USER Everett87@hotmail.com with password changeme
  [ SNIP... ]
I20220713-10:34:09.321(-10)? Defining USER Chase.Kuphal@hotmail.com with password changeme
I20220713-10:34:09.385(-10)?     ✓ Can define and removeIt (6490ms)
I20220713-10:34:09.385(-10)? Defining USER Zachary_McClure@hotmail.com with password changeme
I20220713-10:34:09.446(-10)?     ✓ Cannot define duplicates (62ms)
I20220713-10:34:09.447(-10)? Defining USER Jovan37@gmail.com with password HTBrtI65Hz6y6a2
I20220713-10:34:09.591(-10)?     ✓ Can update (144ms)
I20220713-10:34:09.591(-10)? 
I20220713-10:34:09.592(-10)? 
I20220713-10:34:09.592(-10)?   10 passing (14s)
I20220713-10:34:09.592(-10)? 
I20220713-10:34:09.592(-10)? 
I20220713-10:34:09.592(-10)? --------------------------------
I20220713-10:34:09.592(-10)? ----- RUNNING CLIENT TESTS -----
I20220713-10:34:09.592(-10)? --------------------------------
I20220713-10:34:09.864(-10)? HeadlessChrome/104.0.5109.0
W20220713-10:34:10.867(-10)? (STDERR) UNKNOWN CONSOLE TYPE: warn
W20220713-10:34:10.867(-10)? (STDERR) HMR: connected
W20220713-10:34:10.871(-10)? (STDERR) UNKNOWN CONSOLE TYPE: warn
W20220713-10:34:10.871(-10)? (STDERR)   0 passing (0ms)
I20220713-10:34:10.909(-10)? All tests finished!
I20220713-10:34:10.909(-10)? 
I20220713-10:34:10.909(-10)? --------------------------------
I20220713-10:34:10.909(-10)? SERVER FAILURES: 0
I20220713-10:34:10.909(-10)? CLIENT FAILURES: 0
I20220713-10:34:10.909(-10)? --------------------------------
⋊> ~/G/I/m/app on main ⨯             
```

#### Integration testing

The [package.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/package.json) file has a script called `test-integration`. This script uses the `meteor test --full-app --once` command. This `meteor test` looks for files `*.app-test.js`. In `meteor-application-template-production we are testing the Meteor methods. For example, the [StuffCollection.methods.app-test.js](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/imports/api/stuff/SuffCollection.methods.app-test.js) tests the define, update, and removeIt methods. Here's an example run:

```shell
% meteor npm run test-integration

> meteor-application-template-react@ test-integration /Users/carletonmoore/GitHub/ICS414/meteor-application-template-production/app
> cross-env METEOR_NO_RELEASE_CHECK=1 TEST_BROWSER_DRIVER=puppeteer meteor test --full-app --once --driver-package meteortesting:mocha --port 3100

[[[[[ Tests ]]]]]                             

=> Started proxy.                             
=> Started HMR server.                        
=> Started MongoDB.                           
I20220713-10:49:00.149(-10)? Cannot initialize the database!  Please invoke meteor with a settings file.
I20220713-10:49:00.314(-10)? 
I20220713-10:49:00.315(-10)? --------------------------------
I20220713-10:49:00.315(-10)? --- RUNNING APP SERVER TESTS ---
I20220713-10:49:00.315(-10)? --------------------------------
I20220713-10:49:00.315(-10)? 
I20220713-10:49:00.316(-10)? 
I20220713-10:49:00.317(-10)? 
I20220713-10:49:00.317(-10)?   0 passing (0ms)
I20220713-10:49:00.317(-10)? 
I20220713-10:49:00.317(-10)? 
I20220713-10:49:00.317(-10)? --------------------------------
I20220713-10:49:00.317(-10)? --- RUNNING APP CLIENT TESTS ---
I20220713-10:49:00.317(-10)? --------------------------------
I20220713-10:49:00.402(-10)? Monti APM: completed instrumenting the app
=> Started your app.

=> App running at: http://localhost:3100/
I20220713-10:49:00.706(-10)? HeadlessChrome/104.0.5109.0
W20220713-10:49:01.574(-10)? (STDERR) Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
W20220713-10:49:02.092(-10)? (STDERR) HMR: connected
W20220713-10:49:02.143(-10)? (STDERR) 
W20220713-10:49:02.144(-10)? (STDERR)   StuffCollection Meteor Methods
W20220713-10:49:02.670(-10)? (STDERR)     ✓ Can define, update, and removeIt (525ms)
W20220713-10:49:02.671(-10)? (STDERR)   AdminProfileCollection Meteor Methods
I20220713-10:49:03.105(-10)? Defining ADMIN Priscilla.Prosacco19@gmail.com with password changeme
W20220713-10:49:03.190(-10)? (STDERR)     ✓ Can define, update, and removeIt (519ms)
W20220713-10:49:03.192(-10)? (STDERR)   UserProfileCollection Meteor Methods
I20220713-10:49:03.538(-10)? Defining USER Rowena.Boyer@gmail.com with password changeme
W20220713-10:49:03.715(-10)? (STDERR)     ✓ Can define, update, and removeIt (522ms)
W20220713-10:49:03.716(-10)? (STDERR)   3 passing (2s)
I20220713-10:49:03.757(-10)? All tests finished!
I20220713-10:49:03.757(-10)? 
I20220713-10:49:03.758(-10)? --------------------------------
I20220713-10:49:03.758(-10)? APP SERVER FAILURES: 0
I20220713-10:49:03.758(-10)? APP CLIENT FAILURES: 0
I20220713-10:49:03.758(-10)? --------------------------------
%    
```

#### Acceptance testing

`meteor-application-template-production` uses [TestCafe](https://testcafe.io/) for acceptance testing. The [package.json](https://github.com/ics-software-engineering/meteor-application-template-production/blob/main/app/package.json) file has three scripts for acceptance testing,

1. `test-acceptance-development` This script runs all the acceptance test against a running development system.
2. `test-acceptance-development-single` This script runs a single acceptance test against a running development system.
3. `test-acceptance-ci` This script runs all the acceptance test durning continuous integration.

In the development acceptance tests, TestCafe opens a browser and you can watch the tests.

Here's an example run of the `test-acceptance-development` script:
```shell
% meteor npm run test-acceptance-development

> meteor-application-template-react@ test-acceptance-development /Users/carletonmoore/GitHub/ICS414/meteor-application-template-production/app
> testcafe chrome tests/*.testcafe.js

 Running tests in:
 - Chrome 103.0.5060.114 / macOS 10.15.7

 meteor-application-template-production localhost test with default db
Waiting 15 seconds before running LandingPage.isDisplayed().
 ✓ Test that landing page shows up
 ✓ Test that signin and signout work
 ✓ Test that user pages show up
 ✓ Test that sign up and sign out work
 ✓ Test that admin pages show up


 5 passed (30s)
%
```

## Screencasts

For more information about this system, please watch one or more of the following screencasts. Note that the current source code might differ slightly from the code in these screencasts, but the changes should be very minor.

  * [Walkthrough of system user interface (4:30 min)](https://youtu.be/0zThbE1Shkw)
  * [Data and accounts structure and initialization (15 min)](https://www.youtube.com/watch?v=p9dvM6MdCGs)
  * [Navigation, routing, pages, components (23 min)](https://www.youtube.com/watch?v=DAv0UjS0VjQ)
  * [Forms (25 min)](https://www.youtube.com/watch?v=z02076QgDA8)
  * [Authorization, authentication, and roles (10 min)](https://www.youtube.com/watch?v=_i1dgcP0zoI)
