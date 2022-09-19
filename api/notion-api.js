import got from 'got'

export async function getPage(pageId) {
    const searchParams = new URLSearchParams([['id', pageId]]);
    return await got('http://guides-api-test.ekaterinburg.design:48700/api/content/root', {
        searchParams
    }).json()
}

export async function getAllPage() {
    return await got('http://guides-api-test.ekaterinburg.design:48700/api/options').json()
}

export async function getTree() {
    return await got('http://guides-api-test.ekaterinburg.design:48700/api/tree').json();
}

export async function getPageByUrl(url) {
    return await got('http://guides-api-test.ekaterinburg.design:48700/api/content/root/${url}').json();
}

export const getAllUrls = (children, path = []) => {
    let urls = []
    for (const child of children) {
        const curUrl = child.properties.pageUrl.url
        const curPath = [...path, curUrl]
        urls.push(curPath)

        const childUrls = getAllUrls(child.children, curPath)
        urls = [...urls, ...childUrls]
    }

    return urls
}