async function requester(method, url, data, credentials) {
    const options = {}
    if (method !== "GET") options.method = method
    if (data) {
        options.headers = {
            'Content-Type': 'application/json'
        }
        options.body = JSON.stringify(data)
    }
    if (credentials) options.credentials = credentials

    const response = await fetch(url, options)
    const result = await response.json();

    return result;
}
const get = requester.bind(null, "GET");
const post = requester.bind(null, "POST");
const put = requester.bind(null, "PUT");
const del = requester.bind(null, "DELETE");

const request = {
    get, put, post, del
}
export default request