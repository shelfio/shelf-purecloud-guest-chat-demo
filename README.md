# shelf-purecloud-guest-chat-demo

## How use widget:

```html
<!-- Mount point -->
<div id="not-root"></div>
<script src="/lib/main.js"></script>
<script>
  EmbeddableChat.mount({
    parentElement: 'body', // Mounting selector
    pureCloudAPIHost: 'api.mypurecloud.com', //API host of purecloud (to connect with an agent)
    pureCloudCredentials: {
      chatBotCredentials: {
        accountId: 'SHELF_ACCOUNT_ID',
        shelfDomain: 'shelf.io'
      },
      chatCredentials: {
        organizationId: 'PURE_CLOUD_ORG_ID',
        deploymentId: 'PURE_CLOUD_DEPLOYMENT_ID',
        memberInfo: {
          displayName: 'Guest' // Purecloud Name of guest
        },
        routingTarget: {
          targetType: 'queue', // Purecloud API target type
          targetAddress: 'Name of queue' // Purecloud API queue
        }
      }
    }
  });
</script>
```

## Working example

- install dependencies
- `yarn run-widget` or `npm run run-widget`
- open browser in `http://localhost:8080/widget-test.html`

## Make changes in widget
Check `src` folder with widget code, change and run `yarn build-widget`

## Folder structure 

```
src                # Exports + components 
├── actions        # Redux for chat 
├── api            # API calls for Purecloud, Dialogflow, Shelf
├── helpers        # Search in library helpers
├── i18n           # Localization
├── stores         # Init of redux + reducers
│   └── reducers
└── types          # TS types for every component
```
