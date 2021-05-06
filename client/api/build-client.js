import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server side
    // use namespace as base url http://ingress-nginx.ingress-nginx.... for all requests
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers, // has cookies & hostnames from browser's req
    });
  } else {
    // we are on the client side
    // no base url needed, browser will add appropriate prefix
    return axios.create({
      baseURL: '/',
    });
  }
};
