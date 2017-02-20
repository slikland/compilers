(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var ServiceWorker;
ServiceWorker = (function() {
  ServiceWorker.CACHE_VERSION = "5.4.6";
  function ServiceWorker(self) {
    this.self = self;
    this.activate = __bind(this.activate, this);
    this.fetch = __bind(this.fetch, this);
    this.cacheFiles = __bind(this.cacheFiles, this);
    this.install = __bind(this.install, this);
    this.error = __bind(this.error, this);
    this.messages = __bind(this.messages, this);
    this.self.addEventListener('message', this.messages);
    this.self.addEventListener('fetch', this.fetch);
    this.self.addEventListener('activate', this.activate);
    this.self.skipWaiting();
  }
  ServiceWorker.prototype.messages = function(evt) {
    return console.log("from controller:", evt.data);
  };
  ServiceWorker.prototype.error = function(err) {
    return console.log(err);
  };
  ServiceWorker.prototype.install = function(evt) {
    return evt.waitUntil(caches.open(ServiceWorker.CACHE_VERSION).then(this.cacheFiles)["catch"](this.error));
  };
  ServiceWorker.prototype.cacheFiles = function(evt) {
    return evt.addAll(this._staticAssets).then((function(_this) {
      return function() {
        return _this.self.skipWaiting();
      };
    })(this));
  };
  ServiceWorker.prototype.fetch = function(evt) {
    if (evt.request.method !== 'GET') {
      console.log('fetch evt ignored.', evt.request.method, evt.request.url);
      return;
    }
    return evt.respondWith(caches.match(evt.request).then((function(_this) {
      return function(response) {
        var cacheRequest, fetchRequest;
        if (response) {
          return response;
        }
        fetchRequest = evt.request.clone();
        cacheRequest = evt.request.clone();
        return fetch(fetchRequest).then(function(response) {
          var responseToCache;
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          responseToCache = response.clone();
          caches.open(ServiceWorker.CACHE_VERSION).then(function(cache) {
            var cacheSaveRequest;
            cacheSaveRequest = evt.request.clone();
            return cache.put(cacheSaveRequest, responseToCache);
          });
          return response;
        })["catch"](function(err) {
          return caches.match(cacheRequest);
        });
      };
    })(this))["catch"](this.error));
  };
  ServiceWorker.prototype.activate = function(evt) {
    return evt.waitUntil(caches.keys().then((function(_this) {
      return function(cacheNames) {
        return Promise.all(cacheNames.filter(function(cacheName) {
          if (cacheName !== ServiceWorker.CACHE_VERSION) {
            return true;
          }
        }).map(function(cacheName) {
          console.log('delete files of version:', cacheName);
          return caches["delete"](cacheName);
        }));
      };
    })(this))["catch"](this.error), this.self.clients.claim());
  };
  return ServiceWorker;
})();
new ServiceWorker(this);
}).call(this);