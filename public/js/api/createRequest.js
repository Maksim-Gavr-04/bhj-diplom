/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  let xhrUrl = options.url;
  let formData = null;
  
  if (options.method === 'GET' && options.data) {
    xhrUrl += '?';
    Object.entries(options.data).forEach(([key, value]) => xhrUrl += `${key}=${value}&`);
    xhrUrl = xhrUrl.slice(0, -1);
  } else {
    if (options.data) {
      formData = new FormData();
      Object.entries(options.data).forEach(([key, value]) => formData.append(key, value));
    }
  }

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      options.callback(null, xhr.response);
    }
  }

  try {
    xhr.open(options.method, xhrUrl);
    xhr.send(formData);
  } catch (err) {
    options.callback(err);
  }
};