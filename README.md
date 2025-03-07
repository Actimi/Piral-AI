# Daiko Microfrontend

## Introduction

The project is based on the **Piral** framework. To get started, refer to the Piral documentation: [Piral Documentation](https://docs.piral.io/guidelines/tutorials/01-introduction). 

Install the Piral CLI by running:

```bash
# Install the Piral CLI
npm i piral-cli -g

# Check version of the Piral CLI
piral --version
```

## Installation

Clone the **Daiko Piral Project** repository: [Daiko Piral Repository](https://github.com/Actimi/daiko-piral).

In this repository, the `piral` folder contains the main Piral instance where micro-frontends (pilets) are loaded. Follow these steps to set up:

```bash
# Navigate to the piral folder
cd piral

# Install dependencies
npm install

# Build the project
npm run build

# Start the application
npm run start
```

**Note**: Update the `package.json` file to change the port to 3000 if you are using Medplum:

```json
"start": "piral debug --port 3000"
```

## Pilets

Each tab (menu item in the navbar) in this project is a separate React project, referred to as a **pilet**. Piral fetches the uploaded pilets and integrates them into the application dynamically. 

The feed for this project is available at: [Daiko Pilet Feed](https://feed.piral.cloud/api/v1/pilet/daiko-piral).

You can view the available pilets there. 

To create your own feed (where you can create your own tabs instead of Daiko tabs), follow the Piral documentation to create your own feed and change the `feedUrl` in the piral repo to your own URL.

### Creating a Pilet

Run the following command to create a new pilet:

```bash
pilet new ./piral/dist/emulator/daiko-piral-1.0.1.tgz --target {name-of-pilet}
```

**Note**: Ensure that the correct `.tgz` file is specified in the `dist/emulator/` directory. for example, make note of the daiko-piral version (currently 1.0.1)

### Build and Run a Pilet

Make sure to update the port to 3000 if working with Ovok or Medplum. Then, run:

```bash
npm install
npm run build
npm run start
```
Use vite when asked to chose bundling and tooling to be consistent with this project.

Edit the `index.tsx` file to configure menu and routing. For example:

```tsx
app.registerPage("/test/*", () => (<Page />));
```

This registers a route such that URLs like `{baseurl}/test` or `{baseurl}/test/123` will be handled by this pilet.

To add a menu item in the navbar:

```tsx
app.registerMenu(() => (<span>{"Test"}</span>));
```

### Navbar Menu and UI Design

This project uses the **Mantine UI library** and **Medplum** react components. If you would like to publish the tab in our current daiko feed then you will have to follow our design pattern to create styles for navbar menu.

- First make sure you install the necessary dependencies
```json
"@mantine/core": "^7.16.3",
		"@mantine/emotion": "^7.16.3",
		"@mantine/notifications": "^7.16.3",
		"@medplum/core": "^3.2.31",
		"@medplum/react": "^3.2.31",
		"@tabler/icons-react": "^3.30.0"
```
- 

 Here is an example navbar design:

```tsx
interface NavbarLinkProps {
  readonly to: string;
  readonly active: boolean;
  readonly onClick: React.MouseEventHandler;
  readonly children: React.ReactNode;
}
interface NavLinkIconProps {
  readonly to: string;
  readonly icon?: React.JSX.Element;
}

function NavbarLink(props: NavbarLinkProps): React.JSX.Element {
  return (
    <MedplumLink onClick={props.onClick} to={props.to} className="css-1dq80ci">
      {props.children}
    </MedplumLink>
  );
}

function NavLinkIcon(props: NavLinkIconProps): React.JSX.Element {
  if (props.icon) {
    return props.icon;
  }
  return <Space w={30} />;
}

app.registerMenu(() => (
  <MedplumProvider medplum={medplum}>
    <MantineProvider theme={mantinetheme} stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <React.Fragment key={`Task`}>
          <NavbarLink
            key={"Task"}
            to={"/task"}
            active={true}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/task";
            }}
          >
            <NavLinkIcon to={"/task"} icon={<IconSubtask />} />
            <span>{"Tasks"}</span>
          </NavbarLink>
        </React.Fragment>
      </MantineEmotionProvider>
    </MantineProvider>
  </MedplumProvider>
));
```

**Note**:  For registering the page, you must again provide medplum and mantine provider in order for the them and medplum client to be available thoughout your pilet

### Authentication and Medplum

To access Medplum in a pilet, use:

```tsx
const medplum: MedplumClient = app.getData("medplum");
```

You can retrieve the access token using:

```tsx
medplum.getAccessToken();
```

Provide the Medplum client to `MedplumProvider` as needed. Refer to the `test` folder for a working example.



## Publishing a Pilet

After updating the Pilet with you changes, build the pilet project to see if build works.
Then publish it to the feed with the following command:

```bash
npx pilet publish --fresh --url https://feed.piral.cloud/api/v1/pilet/daiko-piral --api-key <your-api-key>
```
If using the Daiko feed, contact the team for API keys. 

Refer to the [Piral Documentation](https://docs.piral.io/guidelines/tutorials/03-publishing-pilets) for more details.


**Important**: Update the pilet version in `package.json` before publishing. Only three versions of a pilet are allowed. Request the team to delete older versions if needed.

After successful publishing, the new tab should appear in the Daiko app.
