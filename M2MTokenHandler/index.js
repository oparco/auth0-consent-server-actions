exports.onExecutePostLogin = async (event, api) =>  {

    const getManagementAPIAccessToken = async () => {
        // try to read existing access-token from the actions cache with static value "M2M" as cache-key
        const cacheEntry = api.cache.get("M2M");
        console.log('cacheEntry',cacheEntry)
        // if there is an entry, use the accesstoken from cache
        if (cacheEntry) {
            console.log("access-token provided from cache");
            return cacheEntry.value;
        }

        console.log("access-token will be generated with a new client_credentials grant");

        const url = "https://" + event.secrets.AUTH0_CUSTOM_DOMAIN + "/oauth/token";
        const tokenOptions = {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({
                client_id: event.secrets.CLIENT_ID,
                client_secret: event.secrets.CLIENT_SECRET,
                audience: event.secrets.ACCOUNT_API,
                grant_type: "client_credentials",
            }),
        };

        // execute client credentials grant to Auth0
        console.log("Requesting access token for Auth0 Management API...");
        try {
            const response = await fetch(url, tokenOptions);

            // @ts-ignore
            const data = await response.json();

            const accessToken = data.access_token;

            if (!accessToken || accessToken.length === 0) {
                console.error("Auth0 Management API did not respond with a valid access token");
                return null;
            }
            console.log(`Successfully received access token for Auth0 Management API with length `+ accessToken.length);

            // set the new requested token into the cache
            api.cache.set("M2M", accessToken, {ttl: 86000000});
            console.log("received access token for Auth0 Management API pushed into the Actions Cache");
            return accessToken;
        }
        catch (error) {
            console.error(`Error received access token for Auth0 Management API with length `+ accessToken.length);
            return null;
        }
    };

    const accessToken = await getManagementAPIAccessToken();
    if (!accessToken) console.log("access-token could not be provided." + accessToken);
}