const parseGuideUrls = async () => {
    const response = await got('http://guides-api-test.ekaterinburg.design:48700/api/tree').json()
    for (const i in response) {
        if (Array.isArray(response[i])) {
            return response[i].map(i => i.properties.pageUrl.url)
        };
    }
}