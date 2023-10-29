export function splitUrl(url) {
    console.log(url);
    const queryIndex = url.indexOf("?");
    const urlSegments = url.substring(0, queryIndex).split('/');
    const queryparams = {};
    url.substring(queryIndex + 1, url.length).split("&").forEach(query => {
        const params = query.split("=");
        if (params.length === 2) {
            queryparams[params[0]] = params[1];
        }
    })
    return {paths: urlSegments, params: queryparams};
}

export function getDomain(url) {
    console.log("url : " + url);
    const domain = url.split('/api')[0];
    console.log("domain : " + domain);
    return domain;
}