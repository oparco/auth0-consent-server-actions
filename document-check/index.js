exports.onExecutePostLogin = async (event, api) => {

    const REDIRECT_URI = `https://${event.request.hostname}/continue`;
    const CLIENT_ID = event?.client?.client_id;
    const USER_ID = event?.user?.user_id;
    const USER_IP = event?.request?.ip;
    const M2MToken = api.cache.get("M2M")?.value;
    const countryCode = event?.user?.user_metadata?.['countryCode'];

    // drop consentCheck when metadata field is set tot true
    if (event.client.metadata?.dropConsent === 'true') {
        console.log("Check-Consent Action is aborted due dropConsent is set tot true")
        return;
    }

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

    const backendUrl = `${event.secrets.CONSENT_SERVER_BACKEND_URL}/compare_general_documents?clientId=${CLIENT_ID}&userId=${USER_ID}&countryCode=${countryCode}`;

    const response = await fetch(backendUrl);
    // @ts-ignore
    const data = await response.json();

    if(data?.message){
        api.access.deny(data?.message)
    }

    if(data?.length) {
        const sessionToken = api.redirect.encodeToken({
            secret: event.secrets.SESSION_TOKEN_SECRET,
            payload: {
                m2m_token: M2MToken,
                iss: `https://${event.request.hostname}/`,
                email: event.user.email,
                lng: event.request.language,
                clientId: CLIENT_ID,
                email_verified: event.user.email_verified,
                cc: event.user.app_metadata.countryOfResidence,
                app_display_name: event.client.metadata.app_display_name || event.client.name,
            },
        });

        api.redirect.sendUserTo(event.secrets.CONSENT_SERVER_REDIRECT_URL, {
            query: {
                clientId: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                userId: USER_ID,
                session_token: sessionToken,
                userIp: USER_IP,
                countryCode,
                scope: event?.request?.query?.scope,
            },
        });
    }
}

exports.onContinuePostLogin = async(event, api) =>{
    try {
        const isUserDeclineConsenting = JSON.parse(event?.request?.query?.isDecline)

        const countryCode = event?.request?.query?.countryCode

        if(countryCode){
            api.user.setUserMetadata('countryCode', countryCode)
        }

        if(isUserDeclineConsenting) {
            api.access.deny('User declined documents sign')
        }

    } catch (e) {
        console.error(e)
        api.access.deny('error')
    }
}

