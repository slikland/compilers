(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var ServiceWorker;
ServiceWorker = (function() {
  ServiceWorker.CACHE_VERSION = "0.0.54670456789741";
  function ServiceWorker(self) {
    this.self = self;
    this._activate = __bind(this._activate, this);
    this._fetch = __bind(this._fetch, this);
    this._install = __bind(this._install, this);
    this._staticAssets = ["../../js/preloader.js", "../../js/vendors.js", "../../js/main.js", "../../css/preloader.css", "../../css/main.css", "../../css/fonts.css"];
    console.log(ServiceWorker.CACHE_VERSION);
    this.self.addEventListener('install', this._install);
    this.self.addEventListener('fetch', this._fetch);
    this.self.addEventListener('activate', this._activate);
  }
  ServiceWorker.prototype._install = function(event) {
    return console.log("ServiceWorker install");
  };
  ServiceWorker.prototype._fetch = function(event) {
    if (event.request.method !== 'GET' || event.request.url.indexOf('sw.js') > -1) {
      return;
    }
    return event.respondWith(caches.match(event.request).then((function(_this) {
      return function(response) {
        var fetchRequest;
        if (response) {
          return response;
        }
        fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(function(response) {
          var responseToCache;
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          responseToCache = response.clone();
          caches.open(ServiceWorker.CACHE_VERSION).then(function(cache) {
            return cache.put(event.request, responseToCache);
          });
          return response;
        });
      };
    })(this)));
  };
  ServiceWorker.prototype._activate = function(event) {
    return event.waitUntil(caches.keys().then((function(_this) {
      return function(cacheNames) {
        return Promise.all(cacheNames.filter(function(cacheName) {
          if (cacheName !== ServiceWorker.CACHE_VERSION) {
            console.log('delete', cacheName);
            return true;
          }
        }).map(function(cacheName) {
          return caches["delete"](cacheName);
        }));
      };
    })(this)));
  };
  return ServiceWorker;
})();
new ServiceWorker(self);
}).call(this);