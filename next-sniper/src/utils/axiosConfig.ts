import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.88 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15'
];

const axiosConfig: AxiosRequestConfig = {};

const proxyUrl = process.env.PROXY_URL;
if (proxyUrl) {
  const agent = new HttpsProxyAgent(proxyUrl);
  axiosConfig.httpAgent = agent;
  axiosConfig.httpsAgent = agent;
  axiosConfig.proxy = false;
}

const instance: AxiosInstance = axios.create(axiosConfig);

instance.interceptors.request.use(config => {
  const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
  config.headers = config.headers || {};
  config.headers['User-Agent'] = ua;
  return config;
});

export default instance;