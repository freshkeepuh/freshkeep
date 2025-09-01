![](https://raw.githubusercontent.com/ics-software-engineering/nextjs-example-form/main/doc/create-student-page.png)

nextjs-example-form is a sample Next.js 14 application that illustrates how to use [React Hook Form](https://www.react-hook-form.com/) and [Yup](https://www.npmjs.com/package/yup) for form development and validation.

Some features of this example:

- In order to focus on form processing, the application has just two pages: Create Student and Edit Student.
- [Yup](https://www.npmjs.com/package/yup) for form validation.
- A variety of common controllers are shown: text box, text area, single selection, multiple selection, date selection, and radio boxes.
- [Prisma ORM](https://www.prisma.io/) for type safe mapping between Typescript and PostgreSQL tables.
- The forms in this example update two PostgreSQL tables, illustrating the situation where there is not a one-to-one correspondence between the Prisma schema and the form schema.
- There is a 35 minute YouTube screencast providing a walkthrough of the code.

## Installation

First, [install PostgreSQL](https://www.postgresql.org/download/). Then create a database for your application.

```

$ createdb nextjs-example-form
Password:
$

```

Second, download this repository to your computer. You can download it as a zip file, or you can click the "Use as template" button to create your own copy of the system, then clone it to your local computer.

Third, go to your newly created repository, and click the "Clone or download" button to download your new GitHub repo to your local file system. Using [GitHub Desktop](https://desktop.github.com/) is a great choice if you use MacOS or Windows.

Fourth, cd into the directory of your local copy of the repo, and install third party libraries with:

```
$ npm install
```

Fifth, create a `.env` file from the `sample.env`. Set the `DATABASE_URL` variable to match your PostgreSQL database you created in the first step. See the Prisma docs [Connect your database](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/connect-your-database-typescript-postgresql). Then run the Prisma migration `npx prisma migrate dev` to set up the PostgreSQL tables.

```
$ npx prisma migrate dev
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "<your database name>", schema "public" at "localhost:5432"

Applying migration `20240702013420_init`
Applying migration `20240702172401_unique_email`

The following migration(s) have been applied:

migrations/
  └─ 20240702013420_init/
    └─ migration.sql
  └─ 20240702172401_unique_email/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.16.1) to ./node_modules/@prisma/client in 51ms

$
```

## Running the system

Once the libraries are installed and the database is migrated, you can run the application by invoking the "dev" script in the [package.json file](https://github.com/ics-software-engineering/nextjs-example-form/blob/main/app/package.json):

```shell
$ npm run dev

> nextjs-example-form@0.1.0 dev
> next dev

  ▲ Next.js 14.2.4
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 2.6s

```

### Viewing the running app

If all goes well, the application will appear at [http://localhost:3000](http://localhost:3000).

### ESLint

You can verify that the code obeys our coding standards by running ESLint over the code in the imports/ directory with:

```
$ npm run lint

> nextjs-example-form3@0.1.0 lint
> next lint

✔ No ESLint warnings or errors
```

If you see a Typescript warning you can ignore it.

### Prerequisites

To best understand this application, it is useful to familiarize yourself with:

- [Next.js Application Template](http://ics-software-engineering.github.io/nextjs-application-template/). This sample application illustrates conventions for directory layout, naming conventions, routing, integration of Bootstrap, and coding standards. nextjs-example-form is based on this template, so we won't discuss any of these issues here.

- [Bootstrap 5 React](https://react-bootstrap.github.io/). We use Bootstrap 5 for this template.

- [React Hook Form](https://www.react-hook-form.com/). React hook form is a performant, flexible and extensible forms with easy-to-use validation.

## Walkthrough

The landing page for this application provides the Create Student form:

![](https://github.com/ics-software-engineering/nextjs-example-form/raw/main/doc/create-student-page.png)

This form has the following input controls:

- Name and Email: text fields, both required.
- Biographical statement: text area, optional.
- Level: select field, required. Default is Freshman
- GPA: select field, required. User must choose one.
- Date enrolled: date field. Defaults to current time and day.
- Hobbies: multiple select field.
- Major: select field implemented as Radio buttons.

A filled out but not yet submitted Create Student form looks like this:

![](https://github.com/ics-software-engineering/nextjs-example-form/raw/main/doc/create-student-page-filled-in.png)

After submission, the page pops up an alert showing the submission was successful:

![](https://github.com/ics-software-engineering/nextjs-example-form/raw/main/doc/create-student-page-submitted.png)

Also note that after dismissing the alert, there is a link of the Create Student page to a page where you can edit the document. Here is this page:

![](https://github.com/ics-software-engineering/nextjs-example-form/raw/main/doc/edit-student-page.png)

You can edit the fields, then click 'Update' to save the changes.

<!--
## Screencast

Watch a 35 minute screencast explaining this system at [https://www.youtube.com/watch?v=ZCHf_rNbDaM](https://www.youtube.com/watch?v=ZCHf_rNbDaM).
-->
