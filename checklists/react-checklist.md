# React Checklist

Best practices for the React UI framework.

### RE-01: Components should be simple.

Components should do one thing.  If they are doing many things, then consider breaking them up into subcomponents.

### RE-02: No state updates in loops.

Are there state updates in loops?

### RE-03: Do not rename default exports.

When importing a component that is exported "by default", do not rename the component.  The code is more understandable if every component is always referenced by its original name.

### RE-04: Destructure props in component parameter.

Consider [destructuring props](https://medium.com/@lcriswell/destructuring-props-in-REb1c295005ce0). This makes the code clearer by identifying exactly which properties are of interest in the function signature.

### RE-05: Imported component names and file names should match

Many React components are exported "by default", which gives the importing client the ability to rename them in the file that they are used in.

The convention in RadGrad is to import a component with a name that matches the file name used to define the component. Let's look at a simple example:

```js
// File: AdminAnalyticsNewsletterWidget.ts

const AdminAnalyticsNewsletterWidget = () => {
  :
  :
}

const AdminAnalyticsNewsletterWidgetContainer = connect(mapStateToProps, mapDispatchToProps)(AdminAnalyticsNewsletterWidget);
export default AdminAnalyticsNewsletterWidgetContainer;
```

In this case, we have a component (AdminAnalyticsNewsletterWidget), defined in a file called "AdminAnalyticsNewsletterWidget.ts", but the actual exported object is a wrapped version of the widget called AdminAnalyticsNewsletterWidgetContainer.

Our convention is to import this component in the following way:

```js
import AdminAnalyticsNewsletterWidget from '../../components/admin/analytics/newsletter/AdminAnalyticsNewsletterWidget';
```

In other words, we name the imported component using the name associated with the file, and not the "containerized" name.

### RE-06: Prefer functions vs. classes for stateless components.

```jsx
class AdminHomeBanner extends React.Component {
  render() {
    const gridStyle = { height: '500px' };
    return (
        <div className="adminhome-banner">
          <Grid container verticalAlign="middle" textAlign="center" style={gridStyle}>
            <Grid.Row>
              <Grid.Column>
                <div className="welcome-text"><p>Hello there</p></div>
                <Header as="h1" inverted>
                  Manage your site
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}
```

Should be

```jsx
const AdminHomeBanner = () => {
  const gridStyle = { height: '500px' };
  return (
      <div className="adminhome-banner">
        <Grid container verticalAlign="middle" textAlign="center" style={gridStyle}>
          <Grid.Row>
            <Grid.Column>
              <div className="welcome-text"><p>Hello there</p></div>
              <Header as="h1" inverted>
                Manage your site
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
  );
}
```
