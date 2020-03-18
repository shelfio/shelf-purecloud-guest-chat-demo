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
        shelfDomain: 'shelf.io',
        intentGroupId: 'pure-cloud-demo', //
        dialogFlowAccessToken: 'GOGGLE_DIALOG_FLOW_API_KEY'
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
- open browser in `http://localhost:8080`
