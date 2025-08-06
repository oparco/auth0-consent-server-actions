exports.onExecutePostLogin = async (event, api) => {

    const CLIENT_ID = event?.client?.client_id;
    const USER_ID = event?.user?.user_id;
    const M2MToken = api.cache.get("M2M")?.value;

// drop consentCheck when metadata field is set tot true
    if (event.client.metadata?.dropConsent === 'true') {
        console.log("Check-Consent Action is aborted due dropConsent is set tot true")
        return;
    }

    const scope = event?.request?.query?.scope;

    const slicedScopes = scope?.split(' ');

    if (event.transaction?.protocol === "oauth2-password") {
        console.log("Check-Consent Action is aborted due protocol = oauth2-password.")
        return;
    }

    // do not execute this action when a none redirect flow is in exex`cution
    if (event.transaction?.protocol === "oauth2-token-exchange") {
        console.log("Check-Consent Action is aborted due protocol = oauth2-token-exchange.")
        return;
    }
    // do not execute this action when a none redirect flow is in execution
    if (event.transaction?.protocol === 'oauth2-refresh-token') {
        console.log("Check-Consent Action is aborted due protocol = oauth2-refresh-token.")
        return;
    }

    if (!slicedScopes) return;

    const backendUrl = `${event.secrets.CONSENT_SERVER_BACKEND_URL}/comparison/scopes-check?applicationId=${CLIENT_ID}&scope=${scope}&userId=${USER_ID}`;

    const response = await fetch(backendUrl, {
        headers: {
            Authorization: `Bearer ${M2MToken}`,
        },
    });

    // @ts-ignore
    const data = await response.json();

    if(data?.message){
        api.access.deny(data?.message)
    }

    if(!data) {
        api.access.deny('The user requested invalid scopes')

    } else {
        if(slicedScopes?.length){
            slicedScopes.forEach(item =>{
                api.accessToken.addScope(item);
            })} else {
            if (slicedScopes) {
                api.accessToken.addScope(slicedScopes);
            }
        }
    }
}