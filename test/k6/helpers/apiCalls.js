import http from 'k6/http';
import { getBaseUrl } from './baseUrl.js';

export function postCall(resource, payload) {
    const url = `${getBaseUrl()}${resource}`;

    let res = http.post(
        url,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );

    return res;
}
