//Внёс правки по проекту. Убран функционал ПР11 (что вышло по невнимательности, так как ТЗ просто не удосужился внимательно прочитать).

import { apiConfig } from "./apiConf";

class Api {
  constructor(options) {
    this._url = options.url;
    this._headers = options.headers;
  }

  _checkResponse(response) {
    if (!response.ok) {
      return Promise.reject(response.status);
    }
    return response.json();
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, { headers: this._headers }).then(
      (response) => this._checkResponse(response)
    );
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, { headers: this._headers }).then(
      (response) => this._checkResponse(response)
    );
  }
}

export const api = new Api(apiConfig);
