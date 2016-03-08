var ArrayUtils, BarButton, BaseCanvasDisplay, BaseLoaderView, BaseMediaPlayer, BaseScrollItem, BlurImage, BorderButton, Button, CloseIcon, ColorMapImage, Compare, ComparePerlin, FeatureItem, FeaturesMenu, GTMController, GalleryCanvasTransition, GalleryContent, GalleryInternalView, GalleryMap, GalleryOpenContent, GalleryThumbs, GalleryView, GroupLoader, HomeBannerMobile, HomeFeatureItem, HomeLogoFastBack, HomeView, InternalFeatureImage, InternalFeatureItem, InternalFeatureText, InternalView, LoadController, LupeIcon, Main, MainMenu, MapArrow, MapThumb, MetaController, MouseEvent, NavArrow, NavIcon, Navigation, NavigationContainer, NavigationController, NavigationRouter, NumberUtils, PaginationArrows, PaginationIcons, Perlin, Resizer, RoundedButton, ScrollIcon, SpeedLines, SquareButton, SquarePlay, ThumbItem, ThumbLines, Touch, VersionsHeader, VersionsList, VersionsListItem, VersionsView, ViewController, ViewsData, YoutubeController, YoutubePlayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

ViewsData = (function(superClass) {
  extend(ViewsData, superClass);

  ViewsData.VIEW_CREATED = 'view_created';

  ViewsData.ALL_VIEWS_CREATED = 'all_views_created';

  function ViewsData(p_data) {
    if (p_data == null) {
      throw new Error('The param p_data is null');
    }
    this._data = [];
    this._views = p_data.views;
  }

  ViewsData.prototype.getData = function(p_id) {
    if (this._views[p_id] == null) {
      throw new Error('The view with id "' + p_id + '" does not exists in config file');
    }
    return this._views[p_id];
  };

  ViewsData.prototype.get = function(p_id) {
    if (this._data[p_id] != null) {
      return this._data[p_id];
    } else {
      return null;
    }
    return false;
  };

  ViewsData.prototype.set = function(p_view) {
    if (!this.get(p_view.id)) {
      this._data[p_view.id] = p_view;
    }
    return false;
  };

  ViewsData.prototype.createAll = function() {
    var id;
    for (id in this._views) {
      this.create(id);
    }
    this.trigger(ViewsData.ALL_VIEWS_CREATED, {
      views: this._data
    });
    return false;
  };

  ViewsData.prototype.create = function(p_id) {
    var base1, data, k, klass, ref, subview, v, view;
    if (this.get(p_id) != null) {
      view = this.get(p_id);
    } else {
      data = this.getData(p_id);
      klass = eval(data["class"]);
      view = new klass(data, data.id + '-view');
    }
    if (view.parentView == null) {
      view.type = 'view';
      view.parentView = app.container;
      if ((base1 = app.container).subviews == null) {
        base1.subviews = {};
      }
      app.container.subviews[view.id] = view;
    } else {
      if (typeof view.parentView === 'string') {
        view.parentView = this.get(view.parentView);
      }
    }
    if (view.subviews != null) {
      ref = view.subviews;
      for (k in ref) {
        v = ref[k];
        subview = this.create(v.id);
        subview.type = 'subview';
        subview.parentView = view;
        view.subviews[v.id] = subview;
      }
    }
    this.set(view);
    this.trigger(ViewsData.VIEW_CREATED, {
      view: view
    });
    return view;
  };

  ViewsData.prototype.remove = function(p_id) {
    this._data[p_id] = null;
    delete this._data[p_id];
    return false;
  };

  ViewsData.prototype.normalize = function(p_id) {
    var view;
    view = this._views[p_id];
    if ((view != null ? view.parentView : void 0) != null) {
      return this.normalize(view.parentView);
    } else {
      return view != null ? view.id : void 0;
    }
  };

  return ViewsData;

})(EventDispatcher);

NavigationController = (function(superClass) {
  extend(NavigationController, superClass);

  NavigationController.CHANGE = 0;

  NavigationController.CHANGE_VIEW = 1;

  NavigationController.HIDE_ALL_SUBVIEWS = 2;

  NavigationController.SHOW_ALL_SUBVIEWS = 3;

  NavigationController.prototype._currentView = null;

  NavigationController.prototype._previousView = null;

  function NavigationController() {
    this._removeFromWrapper = bind(this._removeFromWrapper, this);
    this._appendToWrapper = bind(this._appendToWrapper, this);
    this._destroyComplete = bind(this._destroyComplete, this);
    this._hideNext = bind(this._hideNext, this);
    this._hideComplete = bind(this._hideComplete, this);
    this._hide = bind(this._hide, this);
    this._hideAllCallback = bind(this._hideAllCallback, this);
    this._showNext = bind(this._showNext, this);
    this._showComplete = bind(this._showComplete, this);
    this._show = bind(this._show, this);
    this._create = bind(this._create, this);
    this._change = bind(this._change, this);
    NavigationController.__super__.constructor.apply(this, arguments);
  }

  NavigationController.prototype.setup = function(p_data) {
    var ref, ref1;
    this._views = new ViewsData(p_data);
    if (((ref = app.navigation) != null ? ref.instantiateViews : void 0) || ((ref1 = app.navigation) != null ? ref1.instantiateViews : void 0) === void 0) {
      this._views.createAll();
    }
    return false;
  };

  NavigationController.prototype.start = function(p_id) {
    var view;
    if (p_id == null) {
      p_id = null;
    }
    if (this._started) {
      throw new Error('This instance of NavigationController already started');
    }
    this._started = true;
    if (!p_id) {
      view = app.config.navigation.defaultView;
    } else {
      view = p_id;
    }
    this.goto(view);
    return false;
  };

  NavigationController.prototype.goto = function(p_id) {
    this._change(p_id);
    return false;
  };

  NavigationController.prototype._change = function(p_id) {
    var ref;
    if (!this._started) {
      throw new Error('This instance of NavigationController is not started');
    }
    if (((ref = this._currentView) != null ? ref.id : void 0) === p_id) {
      return;
    }
    if (this._currentView != null) {
      this._previousView = this._currentView;
      this._currentView = this._views.create(p_id);
      if (this._currentView.parentPath.indexOf(this._previousView.id) !== -1) {
        this.indexView = this._currentView.parentPath.indexOf(this._previousView.id) + 1;
        this.maxIndexView = this._currentView.parentPath.length - 1;
        this._create();
      } else if (this._previousView.parentPath.indexOf(p_id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = (this._previousView.parentPath.length - 1) - (this._previousView.parentPath.indexOf(p_id) + 1);
        this._hide();
      } else if (this._currentView.parentPath.indexOf(this._previousView.parentView.id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = this._currentView.parentPath.indexOf(this._previousView.parentView.id);
        this.on(NavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else if (this._previousView.parentPath.indexOf(this._currentView.parentView.id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = (this._previousView.parentPath.length - 1) - (this._previousView.parentPath.indexOf(this._currentView.parentView.id) + 1);
        this.on(NavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else {
        this.indexView = 0;
        this.maxIndexView = this._previousView.parentPath.length - 1;
        this.on(NavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      }
    } else {
      this._currentView = this._views.create(p_id);
      this.indexView = 0;
      this.maxIndexView = this._currentView.parentPath.length - 1;
      this._create();
    }
    this.trigger(NavigationController.CHANGE_VIEW, {
      currentView: this._currentView,
      previousView: this._previousView
    });
    return false;
  };

  NavigationController.prototype._create = function(evt) {
    var ref, view;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((ref = evt.currentTarget) != null) {
        if (typeof ref.off === "function") {
          ref.off(evt != null ? evt.type : void 0, this._create);
        }
      }
    }
    view = this._views.create(this._currentView.parentPath[this.indexView]);
    this._appendToWrapper(view);
    if (!view.created) {
      view.on(BaseView.CREATE_COMPLETE, this._show);
      view.createStart();
    } else {
      this._show(view);
    }
    return false;
  };

  NavigationController.prototype._show = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget == null ? evt : evt.currentTarget;
    view.off(BaseView.CREATE_COMPLETE, this._show);
    if (!view.showed) {
      view.on(BaseView.SHOW_COMPLETE, this._showComplete);
      view.showStart();
    } else {
      this._showComplete(view);
    }
    return false;
  };

  NavigationController.prototype._showComplete = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget == null ? evt : evt.currentTarget;
    view.off(BaseView.SHOW_COMPLETE, this._showComplete);
    this._showNext(view);
    return false;
  };

  NavigationController.prototype._showNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._create();
    } else {
      this.trigger(NavigationController.SHOW_ALL_SUBVIEWS);
    }
    this.trigger(NavigationController.CHANGE, {
      view: p_view,
      transition: 'show'
    });
    return false;
  };

  NavigationController.prototype._hideAllCallback = function(evt) {
    var ref;
    if (evt != null) {
      if ((ref = evt.currentTarget) != null) {
        if (typeof ref.off === "function") {
          ref.off(evt != null ? evt.type : void 0, this._hideAllCallback);
        }
      }
    }
    this.indexView = 0;
    this.maxIndexView = this._currentView.parentPath.length - 1;
    this._create();
    return false;
  };

  NavigationController.prototype._hide = function(evt) {
    var ref, view;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((ref = evt.currentTarget) != null) {
        if (typeof ref.off === "function") {
          ref.off(evt != null ? evt.type : void 0, this._hide);
        }
      }
    }
    view = this._views.create(this._previousView.reverseParentPath[this.indexView]);
    view.on(BaseView.HIDE_COMPLETE, this._hideComplete);
    view.hideStart();
    return false;
  };

  NavigationController.prototype._hideComplete = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget;
    view.off(BaseView.HIDE_COMPLETE, this._hideComplete);
    if (view.destroyable) {
      view.on(BaseView.DESTROY_COMPLETE, this._destroyComplete);
      view.destroy();
    } else {
      this._removeFromWrapper(view);
      this._hideNext(view);
    }
    return false;
  };

  NavigationController.prototype._hideNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._hide();
    } else {
      this.trigger(NavigationController.HIDE_ALL_SUBVIEWS);
    }
    this.trigger(NavigationController.CHANGE, {
      view: p_view,
      transition: 'hide'
    });
    return false;
  };

  NavigationController.prototype._destroyComplete = function(evt) {
    var view;
    view = evt.currentTarget;
    view.off(BaseView.DESTROY_COMPLETE, this._destroyComplete);
    this._removeFromWrapper(view);
    this._views.remove(view.id);
    this._hideNext(view);
    return false;
  };

  NavigationController.prototype._appendToWrapper = function(p_view) {
    var wrapper;
    wrapper = p_view.parentView;
    if (p_view.parentView.subviewsWrapper != null) {
      if (p_view.attachToParentWrapper == null) {
        wrapper = p_view.parentView.subviewsWrapper;
      } else {
        wrapper = p_view.parentView.find(p_view.attachToParentWrapper);
      }
    }
    if (wrapper == null) {
      throw new Error('The instance of wrapper is not attached on the parent view');
    } else {
      return wrapper.appendChild(p_view);
    }
  };

  NavigationController.prototype._removeFromWrapper = function(p_view) {
    var err, wrapper;
    wrapper = (p_view != null ? p_view.parent : void 0) || (p_view != null ? p_view.parentView : void 0);
    try {
      return wrapper != null ? wrapper.removeChild(p_view) : void 0;
    } catch (_error) {
      err = _error;
      return console.log(err.stack);
    }
  };

  return NavigationController;

})(EventDispatcher);

NavigationRouter = (function(superClass) {
  extend(NavigationRouter, superClass);

  NavigationRouter.CHANGE = 'route_path_change';

  NavigationRouter.ROUTE = 'route_match';

  function NavigationRouter() {
    this._onPathChange = bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
  }

  NavigationRouter.prototype.init = function(p_rootPath, p_forceHashBang) {
    var base, path, ref;
    if (p_rootPath == null) {
      p_rootPath = null;
    }
    if (p_forceHashBang == null) {
      p_forceHashBang = false;
    }
    if (!p_rootPath) {
      p_rootPath = window.location.href;
      try {
        base = document.getElementsByTagName('base');
        if (base.length > 0) {
          base = base[0];
          p_rootPath = base.getAttribute('href');
        }
      } catch (_error) {}
    }
    this._rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/');
    this._rawPath = '';
    if (p_forceHashBang) {
      this._usePushState = false;
    } else {
      this._usePushState = (typeof window !== "undefined" && window !== null ? (ref = window.history) != null ? ref.pushState : void 0 : void 0) != null;
    }
    if (this._usePushState) {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        this.goto(path, false);
      }
      if (window.addEventListener) {
        window.addEventListener('popstate', this._onPathChange);
      } else {
        window.attachEvent("onpopstate", this._onPathChange);
      }
    } else {
      if (this._rootPath !== window.location.href) {
        path = this._getPath();
        window.location = this._rootPath + '#!/' + path;
      }
      if (window.addEventListener) {
        window.addEventListener('hashchange', this._onPathChange);
      } else {
        window.attachEvent("onhashchange", this._onPathChange);
      }
      this._onPathChange();
    }
    return this;
  };

  NavigationRouter.prototype._getPath = function() {
    var hasSlash, rawPath;
    rawPath = window.location.href;
    hasSlash = rawPath.substr(rawPath.length - 1, rawPath.length) === '/';
    if (hasSlash) {
      rawPath = rawPath.substr(0, rawPath.length - 1);
    }
    if (rawPath.indexOf(this._rootPath) === 0) {
      rawPath = rawPath.substr(this._rootPath.length);
    }
    rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    return rawPath;
  };

  NavigationRouter.prototype._parsePath = function(p_rawPath) {
    var params, path, pathParts;
    pathParts = /^(?:#?!?\/*)([^?]*)\??(.*?)$/.exec(p_rawPath);
    path = pathParts[1];
    params = this._parseParams(pathParts[2]);
    return {
      rawPath: p_rawPath,
      path: path,
      params: params
    };
  };

  NavigationRouter.prototype._parseParams = function(p_path) {
    var c, o, pRE, params;
    params = {};
    if (p_path) {
      pRE = /&?([^=&]+)=?([^=&]*)/g;
      c = 0;
      while (o = pRE.exec(p_path)) {
        params[o[1]] = o[2];
      }
    }
    return params;
  };

  NavigationRouter.prototype._onPathChange = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._currentPath = this._getPath();
    if (this._trigger) {
      this._triggerPath(this._currentPath);
    }
    this._trigger = true;
    if (this._replaceData) {
      this.goto(this._replaceData[0], false);
      return this._replaceData = null;
    } else {
      return this.trigger(NavigationRouter.CHANGE, this._parsePath(this._currentPath));
    }
  };

  NavigationRouter.prototype._triggerPath = function(p_path) {
    var i, pathData, ref, results1, route, routeData, routes;
    pathData = this._parsePath(p_path);
    ref = this._checkRoutes(pathData.path), routes = ref[0], routeData = ref[1];
    if (routes) {
      i = routes.length;
      results1 = [];
      while (i-- > 0) {
        route = routes[i];
        if (typeof route.callback === "function") {
          route.callback(route.route, routeData, p_path, pathData, route.data);
        }
        results1.push(this.trigger(NavigationRouter.ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        }));
      }
      return results1;
    }
  };

  NavigationRouter.prototype.getCurrentPath = function() {
    return this._currentPath;
  };

  NavigationRouter.prototype.getParsedPath = function() {
    return this._parsePath(this._currentPath);
  };

  NavigationRouter.prototype.goto = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = true;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path === this._currentPath) {
      return;
    }
    this._currentPath = p_path;
    this._trigger = p_trigger;
    if (this._usePushState) {
      history.pushState({}, p_path, this._rootPath + p_path);
      if (this._trigger) {
        this._onPathChange();
      }
      return this._trigger = true;
    } else {
      return window.location.hash = '!' + '/' + p_path;
    }
  };

  NavigationRouter.prototype.replace = function(p_path, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    p_path = p_path.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    if (p_path !== this._currentPath) {
      this._currentPath = p_path;
      if (this._usePushState) {
        history.replaceState({}, p_path, this._rootPath + p_path);
      } else {
        this._trigger = false;
        history.back();
        this._replaceData = [p_path];
      }
    }
    if (p_trigger) {
      return this.triggerPath(p_path);
    }
  };

  NavigationRouter.prototype.triggerPath = function(p_path) {
    return this._triggerPath(p_path);
  };

  NavigationRouter.prototype.triggerCurrentPath = function() {
    return this._triggerPath(this._getPath());
  };

  NavigationRouter.prototype.addRoute = function(p_route, p_callback, p_data) {
    var e, i, labels, o, p, r, routeRE;
    if (p_data == null) {
      p_data = null;
    }
    if (typeof p_route !== 'string') {
      i = p_route.length;
      while (i-- > 0) {
        this.addRoute(p_route[i], p_callback, p_data);
      }
    } else {

    }
    r = /\{(.*?)\}/g;
    labels = [];
    p = 0;
    while (o = r.exec(p_route)) {
      labels[p++] = o[1];
    }
    r = p_route;
    if (r === '*') {
      r = '.*';
    }
    try {
      r = r.replace(/(.*?)\/*$/, '$1');
      routeRE = new RegExp('(?:' + r.replace(/\{.*?\}/g, '(.+?)') + '$)', 'g');
    } catch (_error) {
      e = _error;
      return;
    }
    this._routes[this._numRoutes++] = {
      data: p_data,
      route: p_route,
      routeRE: routeRE,
      labels: labels,
      numLabels: labels.length,
      numSlashes: p_route.split('/').length,
      callback: p_callback
    };
    return this._routes.sort(this._sortRoutes);
  };

  NavigationRouter.prototype.removeRoute = function(p_route, p_callback) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        if (p_callback) {
          if (p_callback === route.callback) {
            this._routes.splice(i, 1);
          }
        } else {
          this._routes.splice(i, 1);
        }
      }
    }
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype._checkRoutes = function(p_path) {
    var data, foundRoute, i, j, label, len1, m, o, re, ref, route, routes, routesIndex, v;
    i = this._numRoutes;
    p_path = '/' + p_path;
    foundRoute = null;
    routes = [];
    routesIndex = 0;
    data = null;
    while (i-- > 0) {
      route = this._routes[i];
      if (foundRoute) {
        if (route.route === foundRoute) {
          routes[routesIndex++] = route;
        } else {
          break;
        }
      }
      re = route.routeRE;
      re.lastIndex = 0;
      if (!(o = re.exec(p_path))) {
        continue;
      }
      data = {};
      routes[routesIndex++] = route;
      foundRoute = route.route;
      ref = route.labels;
      for (j = m = 0, len1 = ref.length; m < len1; j = ++m) {
        label = ref[j];
        v = o[j + 1];
        data[label] = v;
      }
    }
    return [routes, data];
  };

  NavigationRouter.prototype._sortRoutes = function(p_a, p_b) {
    if (p_a.numLabels < p_b.numLabels) {
      return -1;
    }
    if (p_a.numLabels > p_b.numLabels) {
      return 1;
    }
    if (p_a.numSlashes < p_b.numSlashes) {
      return -1;
    }
    if (p_a.numSlashes > p_b.numSlashes) {
      return 1;
    }
    if (p_a.route === p_b.route) {
      return 0;
    }
    if (p_a.route < p_b.route) {
      return -1;
    }
    if (p_a.route > p_b.route) {
      return 1;
    }
    return 0;
  };

  return NavigationRouter;

})(EventDispatcher);

MetaController = (function(superClass) {
  extend(MetaController, superClass);

  function MetaController() {
    MetaController.__super__.constructor.apply(this, arguments);
  }

  MetaController.prototype.change = function(p_data) {
    this.title = (p_data != null ? p_data.title : void 0) != null ? p_data.title : "";
    this.description = (p_data != null ? p_data.description : void 0) != null ? p_data.description : "";
    return this.favicon = (p_data != null ? p_data.favicon : void 0) != null ? p_data.favicon : "";
  };

  MetaController.get({
    head: function() {
      return document.head || document.getElementsByTagName('head')[0];
    }
  });

  MetaController.set({
    title: function(p_value) {
      return document.title = p_value;
    }
  });

  MetaController.set({
    description: function(p_value) {
      var meta;
      if (document.querySelector('meta[name=description]') != null) {
        return document.querySelector('meta[name=description]').content = p_value;
      } else {
        meta = document.createElement('meta');
        this.head.appendChild(meta);
        meta.name = 'description';
        return meta.content = p_value;
      }
    }
  });

  MetaController.set({
    favicon: function(p_value) {
      var link;
      if (!p_value || p_value.trim().length === 0) {
        return;
      }
      if (document.querySelector('link[rel=icon]') != null) {
        document.querySelector('link[rel=icon]').type = "image/x-icon";
        return document.querySelector('link[rel=icon]').href = p_value;
      } else {
        link = document.createElement('link');
        this.head.appendChild(link);
        link.rel = "icon";
        link.type = "image/x-icon";
        return link.href = p_value;
      }
    }
  });

  return MetaController;

})(EventDispatcher);

Navigation = (function(superClass) {
  var _controller, _meta, _router;

  extend(Navigation, superClass);

  Navigation.CHANGE = 'navigation_change';

  Navigation.CHANGE_VIEW = 'navigation_change_view';

  Navigation.CHANGE_ROUTE = 'navigation_change_route';

  _controller = null;

  _router = null;

  _meta = null;

  function Navigation() {
    this._routeChange = bind(this._routeChange, this);
    this._navigationChange = bind(this._navigationChange, this);
    this._getRouteByView = bind(this._getRouteByView, this);
    this._getViewByRoute = bind(this._getViewByRoute, this);
    this.gotoView = bind(this.gotoView, this);
    this.gotoRoute = bind(this.gotoRoute, this);
    this.setRoute = bind(this.setRoute, this);
    this.goto = bind(this.goto, this);
    this.gotoDefault = bind(this.gotoDefault, this);
    this.start = bind(this.start, this);
    this.setup = bind(this.setup, this);
    _controller = new NavigationController();
    _router = new NavigationRouter();
    _meta = new MetaController();
    app.navigation = this;
    Navigation.__super__.constructor.apply(this, arguments);
  }

  Navigation.prototype.setup = function(p_data) {
    var k, ref, ref1, ref2, v;
    _controller.on(NavigationController.CHANGE_VIEW, this._navigationChange);
    _controller.on(NavigationController.CHANGE, this._navigationChange);
    _controller.setup(p_data);
    _router.init(app.root);
    ref = p_data.views;
    for (k in ref) {
      v = ref[k];
      if (v.route != null) {
        _router.addRoute(v.route, this._routeChange);
      }
    }
    if (((ref1 = app.config.navigation) != null ? ref1.autoStart : void 0) || ((ref2 = app.config.navigation) != null ? ref2.autoStart : void 0) === void 0) {
      this.start();
    }
    return false;
  };

  Navigation.prototype.start = function(evt) {
    var current, pathData, routes, viewID;
    if (evt == null) {
      evt = null;
    }
    viewID = null;
    pathData = _router._parsePath(_router.getCurrentPath());
    routes = _router._checkRoutes(pathData.path)[0];
    if (routes.length > 0) {
      current = routes[0].route;
      viewID = this._getViewByRoute(current);
    } else {
      viewID = null;
    }
    _controller.start(viewID);
    return false;
  };

  Navigation.prototype.gotoDefault = function() {
    var ref, ref1;
    if (((ref = app.config.navigation) != null ? ref.defaultView : void 0) != null) {
      this.goto((ref1 = app.config.navigation) != null ? ref1.defaultView : void 0);
    }
    return false;
  };

  Navigation.get({
    currentView: function() {
      return this._currentView || _controller._currentView;
    }
  });

  Navigation.get({
    previousView: function() {
      return this._previousView || _controller._previousView;
    }
  });

  Navigation.prototype.goto = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      this.gotoRoute(p_value);
    } else {
      this.gotoView(p_value);
    }
    return false;
  };

  Navigation.get({
    routeData: function() {
      var pathData, results, routeData;
      pathData = _router._parsePath(_router.getCurrentPath());
      routeData = _router._checkRoutes(pathData.path);
      results = {};
      if (routeData != null) {
        results.raw = pathData.rawPath;
        results.params = pathData.params;
        results.route = routeData[0][0].route;
        results.parsed = routeData[1];
      }
      return results;
    }
  });

  Navigation.prototype.setRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    this.gotoRoute(p_value, p_trigger);
    return false;
  };

  Navigation.prototype.gotoRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_value.indexOf('/') === 0) {
      _router.goto(p_value, p_trigger);
    } else {
      throw new Error('The value "' + p_value + '" is not a valid format to route ("/example")');
    }
    return false;
  };

  Navigation.prototype.gotoView = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      throw new Error('The value "' + p_value + '" is not a valid format to viewID ("exampleID")');
    } else {
      _controller.goto(p_value);
    }
    return false;
  };

  Navigation.prototype._getViewByRoute = function(p_value) {
    var k, ref, view;
    ref = app.config.views;
    for (k in ref) {
      view = ref[k];
      if ((view.route != null) && view.route === p_value) {
        return view.id;
      }
    }
    return null;
  };

  Navigation.prototype._getRouteByView = function(p_value) {
    var k, ref, view;
    ref = app.config.views;
    for (k in ref) {
      view = ref[k];
      if ((view.route != null) && view.id === p_value) {
        return view.route;
      }
    }
    return null;
  };

  Navigation.prototype._navigationChange = function(evt) {
    switch (evt.type) {
      case NavigationController.CHANGE_VIEW:
        this._currentView = evt.currentView;
        this._previousView = evt.previousView;
        this.trigger(Navigation.CHANGE_VIEW, {
          currentView: this._currentView,
          previousView: this._previousView
        });
        break;
      case NavigationController.CHANGE:
        this.trigger(Navigation.CHANGE, {
          view: evt.view,
          transition: evt.transition
        });
    }
    _meta.change(this.currentView.meta);
    return false;
  };

  Navigation.prototype._routeChange = function() {
    this.trigger(Navigation.CHANGE_ROUTE, {
      data: arguments
    });
    if (arguments[0] != null) {
      this.goto(this._getViewByRoute(arguments[0]));
    }
    return null;
  };

  return Navigation;

})(EventDispatcher);

NavigationContainer = (function(superClass) {
  extend(NavigationContainer, superClass);

  function NavigationContainer() {
    this.setupNavigation = bind(this.setupNavigation, this);
    NavigationContainer.__super__.constructor.call(this, null, 'nav-container');
  }

  NavigationContainer.prototype.setupNavigation = function(p_data) {
    var navigation;
    navigation = new Navigation();
    return navigation.setup(p_data);
  };

  return NavigationContainer;

})(BaseView);

Perlin = (function() {
  function Perlin() {}

  Perlin._permutation = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

  Perlin.noise = function(x, y, z) {
    var A, AA, AB, B, BA, BB, X, Y, Z, fx, fy, fz, p, u, v, w, x_1, y_1, z_1;
    p = this._permutation;
    fx = x >> 0;
    fy = y >> 0;
    fz = z >> 0;
    X = fx & 255;
    Y = fy & 255;
    Z = fz & 255;
    x -= fx;
    y -= fy;
    z -= fz;
    u = this._fade(x);
    v = this._fade(y);
    w = this._fade(z);
    A = p[X] + Y;
    AA = p[A] + Z;
    AB = p[A + 1] + Z;
    B = p[X + 1] + Y;
    BA = p[B] + Z;
    BB = p[B + 1] + Z;
    x_1 = x - 1;
    y_1 = y - 1;
    z_1 = z - 1;
    return this._scale(this._lerp(w, this._lerp(v, this._lerp(u, this._grad(p[AA], x, y, z), this._grad(p[BA], x_1, y, z)), this._lerp(u, this._grad(p[AB], x, y_1, z), this._grad(p[BB], x_1, y_1, z))), this._lerp(v, this._lerp(u, this._grad(p[AA + 1], x, y, z_1), this._grad(p[BA + 1], x_1, y, z_1)), this._lerp(u, this._grad(p[AB + 1], x, y_1, z_1), this._grad(p[BB + 1], x_1, y_1, z_1)))));
  };

  Perlin._fade = function(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  Perlin._lerp = function(t, a, b) {
    return a + t * (b - a);
  };

  Perlin._grad = function(hash, x, y, z) {
    var h, u, v;
    h = hash & 15;
    if (h < 8) {
      u = x;
    } else {
      u = y;
    }
    if (h < 4) {
      v = y;
    } else if (h === 12 || h === 14) {
      v = x;
    } else {
      v = z;
    }
    if ((h & 1) !== 0) {
      u = -u;
    }
    if ((h & 2) !== 0) {
      v = -v;
    }
    return u + v;
  };

  Perlin._scale = function(n) {
    return (1 + n) * 0.5;
  };

  return Perlin;

})();

MouseEvent = (function() {
  MouseEvent.CLICK = 'click';

  MouseEvent.OVER = 'mouseenter';

  MouseEvent.OUT = 'mouseleave';

  MouseEvent.MOVE = 'mousemove';

  MouseEvent.normalizeClick = function(e) {
    var _x, _y, body, doc;
    doc = document;
    body = document.body;
    _x = e.pageX ? e.pageX : e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
    _y = e.pageY ? e.pageY : e.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    return {
      x: _x,
      y: _y
    };
  };

  MouseEvent.getInstance = function() {
    return MouseEvent._instance != null ? MouseEvent._instance : MouseEvent._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(MouseEvent, arguments, function(){});
  };

  function MouseEvent(dd) {
    if (dd.mobile || dd.tablet) {
      MouseEvent.MOVE = 'touchmove';
    }
  }

  return MouseEvent;

})();

Touch = (function(superClass) {
  extend(Touch, superClass);

  Touch.SWIPE = 'swipeTouch';

  Touch.DRAG = 'dragTouch';

  Touch.PINCH = 'pinchTouch';

  Touch.prototype.capturePinch = false;

  Touch.prototype.horizontal_sensitivity = 22;

  Touch.prototype.vertical_sensitivity = 6;

  Touch.prototype.pinch_sensitivity = 20;

  Touch.prototype.touchDX = 0;

  Touch.prototype.touchDY = 0;

  Touch.prototype.touchStartX = 0;

  Touch.prototype.touchStartY = 0;

  Touch.prototype.dragDX = 0;

  Touch.prototype.dragDY = 0;

  Touch.prototype.dragStartX = 0;

  Touch.prototype.dragStartY = 0;

  Touch.prototype.pinchStartDist = 0;

  Touch.prototype.pinchDist = 0;

  function Touch() {
    var elem, elements, len1, m;
    elements = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    for (m = 0, len1 = elements.length; m < len1; m++) {
      elem = elements[m];
      elem.addEventListener("touchstart", (function(_this) {
        return function(event) {
          return _this.handleStart(event, elem);
        };
      })(this));
      elem.addEventListener("touchmove", (function(_this) {
        return function(event) {
          return _this.handleMove(event, elem);
        };
      })(this));
      elem.addEventListener("touchend", (function(_this) {
        return function(event) {
          return _this.handleEnd(event, elem);
        };
      })(this));
    }
  }

  Touch.prototype.emitSlideLeft = function() {
    return this.trigger(Touch.SWIPE, {
      direction: 'left'
    });
  };

  Touch.prototype.emitSlideRight = function() {
    return this.trigger(Touch.SWIPE, {
      direction: 'right'
    });
  };

  Touch.prototype.emitSlideUp = function() {
    return this.trigger(Touch.SWIPE, {
      direction: 'up'
    });
  };

  Touch.prototype.emitSlideDown = function() {
    return this.trigger(Touch.SWIPE, {
      direction: 'down'
    });
  };

  Touch.prototype.emitDrag = function() {
    return this.trigger(Touch.DRAG, {
      x: this.dragDX,
      y: this.dragDY
    });
  };

  Touch.prototype.emitPinchOut = function() {
    return this.trigger(Touch.PINCH, {
      direction: 'out'
    });
  };

  Touch.prototype.emitPinchIn = function() {
    return this.trigger(Touch.PINCH, {
      direction: 'in'
    });
  };

  Touch.prototype.emitPinch = function() {
    return this.trigger(Touch.PINCH, {
      distance: this.pinchDist
    });
  };

  Touch.prototype.handleStart = function(event, elem) {
    if (event.touches.length === 1) {
      this.touchDX = 0;
      this.touchDY = 0;
      this.dragDX = 0;
      this.dragDY = 0;
      this.touchStartX = this.dragStartX = event.touches[0].pageX;
      this.touchStartY = this.dragStartY = event.touches[0].pageY;
    }
    if (event.touches.length === 2) {
      this.capturePinch = true;
      this.pinchStartDist = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX) * (event.touches[0].pageX - event.touches[1].pageX) + (event.touches[0].pageY - event.touches[1].pageY) * (event.touches[0].pageY - event.touches[1].pageY));
    }
    return false;
  };

  Touch.prototype.handleMove = function(event, elem) {
    if (this.capturePinch) {
      this.handlePinch(event);
      return;
    }
    if (event.touches.length > 1) {
      this.cancelTouch(elem);
      return false;
    }
    this.touchDX = event.touches[0].pageX - this.touchStartX;
    this.touchDY = event.touches[0].pageY - this.touchStartY;
    this.dragDX = event.touches[0].pageX - this.dragStartX;
    this.dragDY = event.touches[0].pageY - this.dragStartY;
    this.dragStartX = event.touches[0].pageX;
    this.dragStartY = event.touches[0].pageY;
    this.emitDrag();
    return false;
  };

  Touch.prototype.handlePinch = function(e) {
    var dist;
    dist = Math.sqrt((e.touches[0].pageX - e.touches[1].pageX) * (e.touches[0].pageX - e.touches[1].pageX) + (e.touches[0].pageY - e.touches[1].pageY) * (e.touches[0].pageY - e.touches[1].pageY));
    this.pinchDist = dist - this.pinchStartDist;
    this.pinchStartDist = dist;
    this.emitPinch();
    return false;
  };

  Touch.prototype.handleEnd = function(event, elem) {
    var dx, dy, pinch;
    dx = Math.abs(this.touchDX);
    dy = Math.abs(this.touchDY);
    pinch = Math.abs(this.pinchDist);
    console.log(dx > this.horizontal_sensitivity, dy < (dx * 2 / 3), dx, this.horizontal_sensitivity);
    if ((dx > this.horizontal_sensitivity) && (dy < (dx * 2 / 3))) {
      if (this.touchDX > 0) {
        this.emitSlideRight();
      } else {
        this.emitSlideLeft();
      }
    }
    if ((dy > this.vertical_sensitivity) && (dx < (dy * 2 / 3))) {
      if (this.touchDY > 0) {
        this.emitSlideDown();
      } else {
        this.emitSlideUp();
      }
    }
    if (this.capturePinch) {
      if (this.pinchDist < 0 && pinch > this.pinch_sensitivity) {
        this.emitPinchOut();
      }
      if (this.pinchDist > 0 && pinch > this.pinch_sensitivity) {
        this.emitPinchIn();
      }
    }
    this.capturePinch = false;
    this.cancelTouch(event, elem);
    return false;
  };

  Touch.prototype.cancelTouch = function(event, elem) {
    elem.removeEventListener('touchmove', this.handleTouchMove, false);
    elem.removeEventListener('touchend', this.handleTouchEnd, false);
    return true;
  };

  return Touch;

})(EventDispatcher);

GTMController = (function(superClass) {
  extend(GTMController, superClass);

  function GTMController() {
    this.trackPushState = bind(this.trackPushState, this);
    this.fixLink = bind(this.fixLink, this);
    return GTMController.__super__.constructor.apply(this, arguments);
  }

  GTMController.getInstance = function() {
    return GTMController._instance != null ? GTMController._instance : GTMController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(GTMController, arguments, function(){});
  };

  GTMController.prototype.fixLink = function(link) {
    if (typeof url_decorate === 'function') {
      return url_decorate(link);
    } else {
      return link;
    }
  };

  GTMController.prototype.trackPushState = function() {
    if (window.dataLayer == null) {
      window.dataLayer = [];
    }
    return window.dataLayer.push({
      'event': 'gtm.pushstate',
      'psurl': window.location.href
    });
  };

  return GTMController;

})(EventDispatcher);

LoadController = (function(superClass) {
  extend(LoadController, superClass);

  LoadController.getInstance = function() {
    return LoadController._instance != null ? LoadController._instance : LoadController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(LoadController, arguments, function(){});
  };

  function LoadController() {
    this._groupLoaded = bind(this._groupLoaded, this);
    this._currentGroup = null;
    this._groups = this._createGroups(app.config.views);
    this._loadNext();
  }

  LoadController.prototype.getGroup = function(id) {
    return this._groups[id];
  };

  LoadController.prototype.loadGroup = function(id) {
    var requestedGroup;
    requestedGroup = this._groups[id];
    if (!requestedGroup) {
      return false;
    }
    if (requestedGroup.loaded || requestedGroup === this._currentGroup) {
      return requestedGroup;
    }
    if (this._currentGroup) {
      this._currentGroup.pause();
      this._currentGroup.off(GroupLoader.COMPLETE, this._groupLoaded);
    }
    this._currentGroup = requestedGroup;
    this._currentGroup.load();
    this._currentGroup.on(GroupLoader.COMPLETE, this._groupLoaded);
    return this._currentGroup;
  };

  LoadController.prototype._createGroups = function(itens) {
    var groups, item, k;
    groups = {};
    for (k in itens) {
      item = itens[k];
      groups[item.id] = new GroupLoader(item.id, item.content);
    }
    return groups;
  };

  LoadController.prototype._loadNext = function() {
    var group, k, ref, results1;
    ref = this._groups;
    results1 = [];
    for (k in ref) {
      group = ref[k];
      if (!group.loaded) {
        this.loadGroup(group.id);
        break;
      } else {
        results1.push(void 0);
      }
    }
    return results1;
  };

  LoadController.prototype._groupLoaded = function(e, id) {
    console.log('loaded >>>', id);
    return this._loadNext();
  };

  return LoadController;

})(EventDispatcher);

GroupLoader = (function(superClass) {
  extend(GroupLoader, superClass);

  GroupLoader.PROGRESS = 'onGroupLoaderProgress';

  GroupLoader.COMPLETE = 'onGroupLoaderComplete';

  GroupLoader.FILE_COMPLETE = 'onGroupLoaderFileComplete';

  function GroupLoader(id, content) {
    this._loadProgress = bind(this._loadProgress, this);
    this._loadComplete = bind(this._loadComplete, this);
    this._fileLoaded = bind(this._fileLoaded, this);
    this._fileError = bind(this._fileError, this);
    this._id = id;
    this._content = content;
    this._loader = app.loader.getGroup(this._id);
    this._manifest = this._getManifest();
    this._hasManifest = false;
  }

  GroupLoader.get({
    id: function() {
      return this._id;
    }
  });

  GroupLoader.get({
    loaded: function() {
      return this._loader.loaded;
    }
  });

  GroupLoader.prototype.load = function() {
    if (this.loaded) {
      return;
    }
    if (this._hasManifest) {
      return this._loader.load();
    } else {
      this._hasManifest = true;
      this._loader.on(AssetLoader.FILE_ERROR, this._fileError);
      this._loader.on(AssetLoader.COMPLETE_FILE, this._fileLoaded);
      this._loader.on(AssetLoader.COMPLETE_ALL, this._loadComplete);
      this._loader.on(AssetLoader.PROGRESS_ALL, this._loadProgress);
      return this._loader.loadManifest(this._manifest);
    }
  };

  GroupLoader.prototype.pause = function() {
    return this._loader.setPaused(true);
  };

  GroupLoader.prototype._getManifest = function() {
    var customValidations, filtered, item, len1, len2, m, method, q, ref, ref1;
    filtered = [];
    if (!this._loader.loaded) {
      ref = JSONUtils.filterObject(this._content, 'src', null, null, true);
      for (m = 0, len1 = ref.length; m < len1; m++) {
        item = ref[m];
        if (item.loadWhen) {
          customValidations = true;
          ref1 = item.loadWhen;
          for (q = 0, len2 = ref1.length; q < len2; q++) {
            method = ref1[q];
            customValidations = LoadValidations.getInstance().validate(method, [true, item]);
            if (!customValidations) {
              break;
            }
          }
          if (!customValidations) {
            continue;
          }
        }
        if (item.loadWithView !== false && item.loadBackground !== false) {
          filtered.push(item);
        }
      }
    }
    return filtered;
  };

  GroupLoader.prototype._fileError = function(e) {};

  GroupLoader.prototype._fileLoaded = function(e) {
    return e.item.tag = e.result;
  };

  GroupLoader.prototype._loadComplete = function(e) {
    this.trigger(GroupLoader.COMPLETE, this._id);
    this._loader.off(AssetLoader.FILE_ERROR, this._fileError);
    this._loader.off(AssetLoader.COMPLETE_FILE, this._fileLoaded);
    this._loader.off(AssetLoader.COMPLETE_ALL, this._loadComplete);
    return this._loader.off(AssetLoader.PROGRESS_ALL, this._loadProgress);
  };

  GroupLoader.prototype._loadProgress = function(e) {
    return this.trigger(GroupLoader.PROGRESS, e.progress);
  };

  return GroupLoader;

})(EventDispatcher);

ViewController = (function() {
  function ViewController() {}

  ViewController.getInstance = function() {
    return ViewController._instance != null ? ViewController._instance : ViewController._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(ViewController, arguments, function(){});
  };

  ViewController.prototype.show = function(page) {
    this._current = page;
    page.on(BaseView.CREATE_START, this._onCreateStart);
    page.on(BaseView.CREATE, this._onCreate);
    page.on(BaseView.CREATE_COMPLETE, this._onCreateComplete);
    page.on(BaseView.SHOW_START, this._onShowStart);
    page.on(BaseView.SHOW, this._onShow);
    page.on(BaseView.SHOW_COMPLETE, this._onShowComplete);
    return page.createStart();
  };

  ViewController.prototype.hide = function(page) {
    this._current = page;
    page.on(BaseView.HIDE_START, this._onHideStart);
    page.on(BaseView.HIDE, this._onHide);
    page.on(BaseView.HIDE_COMPLETE, this._onHideComplete);
    return page.hideStart();
  };

  ViewController.prototype._onCreateStart = function(e) {
    return e.target.off(BaseView.CREATE_START);
  };

  ViewController.prototype._onCreate = function(e) {
    return e.target.off(BaseView.CREATE);
  };

  ViewController.prototype._onCreateComplete = function(e) {
    e.target.off(BaseView.CREATE_COMPLETE);
    return e.target.showStart();
  };

  ViewController.prototype._onShowStart = function(e) {
    e.target.off(BaseView.SHOW_START);
    return e.target.show();
  };

  ViewController.prototype._onShow = function(e) {
    e.target.off(BaseView.SHOW);
    return e.target.showComplete();
  };

  ViewController.prototype._onShowComplete = function(e) {
    return e.target.off(BaseView.SHOW_COMPLETE);
  };

  ViewController.prototype._onHideStart = function(e) {
    e.target.off(BaseView.HIDE_START);
    return e.target.hide();
  };

  ViewController.prototype._onHide = function(e) {
    e.target.off(BaseView.HIDE);
    return e.target.hideComplete();
  };

  ViewController.prototype._onHideComplete = function(e) {
    return e.target.off(BaseView.HIDE_COMPLETE);
  };

  return ViewController;

})();

(function () {
    var tag = document.createElement('script');
	tag.src = "http://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}());;

YoutubeController = (function(superClass) {
  extend(YoutubeController, superClass);

  YoutubeController.COMPLETE = 'onYoutubeComplete';

  YoutubeController.getInstance = function() {
    return YoutubeController.instance != null ? YoutubeController.instance : YoutubeController.instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(YoutubeController, arguments, function(){});
  };

  function YoutubeController() {
    this._createPlayersQueue = bind(this._createPlayersQueue, this);
    var listener;
    YoutubeController.__super__.constructor.apply(this, arguments);
    this._isReady = false;
    this._players = [];
    this._queueCreate = [];
    this.on(YoutubeController.COMPLETE, this._createPlayersQueue);
    listener = setInterval((function(_this) {
      return function() {
        if (typeof YT === 'object') {
          _this._isReady = true;
          _this.trigger(YoutubeController.COMPLETE);
          return clearInterval(listener);
        }
      };
    })(this), 100);
  }

  YoutubeController.prototype.createPlayer = function(wrapper, options, callback) {
    var player;
    player = false;
    if (!this._isReady) {
      return this._queueCreate.push({
        w: wrapper,
        o: options,
        c: callback
      });
    } else {
      return player = this._createPlayer(wrapper, options, callback);
    }
  };

  YoutubeController.prototype.pauseAll = function() {
    var len1, m, player, ref, results1;
    ref = this._players;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      player = ref[m];
      results1.push(player.pause());
    }
    return results1;
  };

  YoutubeController.prototype.stopAll = function() {
    var len1, m, player, ref, results1;
    ref = this._players;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      player = ref[m];
      results1.push(player.stop());
    }
    return results1;
  };

  YoutubeController.prototype.getCover = function(id, size) {
    if (size === 'max') {
      return 'http://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
    }
  };

  YoutubeController.prototype._createPlayer = function(wrapper, options, callback) {
    if (options == null) {
      options = {};
    }
    return this._players.push({
      wrapper: wrapper,
      player: new YoutubePlayer(wrapper, options, callback)
    });
  };

  YoutubeController.prototype._createPlayersQueue = function(event) {
    var item, len1, m, ref, results1;
    event.target.off(YoutubeController.COMPLETE);
    ref = this._queueCreate;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      results1.push(this._createPlayer(item.w, item.o, item.c));
    }
    return results1;
  };

  return YoutubeController;

})(EventDispatcher);

Resizer = (function(superClass) {
  extend(Resizer, superClass);

  Resizer.RESIZE = 'resizeResizer';

  Resizer.ORIENTATION_CHANGE = 'orientationChangeResizer';

  Resizer.getInstance = function() {
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Resizer, arguments, function(){});
  };

  function Resizer() {
    this._orientation = bind(this._orientation, this);
    this._resize = bind(this._resize, this);
    this._onOrientation = bind(this._onOrientation, this);
    this._onResize = bind(this._onResize, this);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('orientationchange', this._onOrientation);
    this._refElement = document.body;
    this._updateData();
  }

  Resizer.prototype._onResize = function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this._resTimeout != null) {
      clearTimeout(this._resTimeout);
    }
    this._resTimeout = setTimeout(this._resize, 50);
    return false;
  };

  Resizer.prototype._onOrientation = function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    if (this._oriTimeout != null) {
      clearTimeout(this._oriTimeout);
    }
    this._oriTimeout = setTimeout(this._orientation, 50);
    return false;
  };

  Resizer.prototype._resize = function() {
    this._updateData();
    this.trigger(Resizer.RESIZE, this._data);
    return false;
  };

  Resizer.prototype._orientation = function() {
    this._updateData();
    this.trigger(Resizer.RESIZE, this._data);
    return false;
  };

  Resizer.prototype._updateData = function() {
    var _breakpoint;
    _breakpoint = this._getBreakpoint();
    this._data = {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      breakpoint: _breakpoint
    };
    return false;
  };

  Resizer.prototype._getBreakpoint = function() {
    var _breakpoint, b, len1, m, ref;
    _breakpoint = 'mobile';
    this._refElement.className = this._refElement.className.split('mobile').join(" ");
    ref = app.container.content.breakpoints;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      b = ref[m];
      this._refElement.className = this._refElement.className.split(b['name']).join(" ");
      if (window.innerWidth >= b['size']) {
        _breakpoint = b['name'];
      }
    }
    this._refElement.className += _breakpoint;
    return _breakpoint;
  };

  Resizer.get({
    data: function() {
      return this._data;
    }
  });

  Resizer.get({
    breakpoint: function() {
      return this._data['breakpoint'];
    }
  });

  Resizer.get({
    width: function() {
      return this._data['width'];
    }
  });

  Resizer.get({
    height: function() {
      return this._data['height'];
    }
  });

  Resizer.get({
    orientation: function() {
      return this._data['orientation'];
    }
  });

  return Resizer;

})(EventDispatcher);

BaseScrollItem = (function(superClass) {
  extend(BaseScrollItem, superClass);

  function BaseScrollItem(data) {
    this.scroll = bind(this.scroll, this);
    BaseScrollItem.__super__.constructor.call(this, {
      className: 'scroll-item'
    });
    this._data = data;
    this._wrapperHeight = 0;
    this._ini = 0;
    this._end = 0;
    this._diff = 0;
  }

  BaseScrollItem.get({
    end: function() {
      return this._end;
    }
  });

  BaseScrollItem.prototype.create = function() {
    if (!app.dd.mobile) {
      return ScrollController.getInstance().addObserver(this.scroll);
    }
  };

  BaseScrollItem.prototype.resize = function() {
    this._wrapperHeight = window.innerHeight;
    this._offsetTop = this._getTop();
    this._ini = this._offsetTop - this._wrapperHeight;
    this._end = this._offsetTop - ((this._wrapperHeight - this.height) / 2);
    return this._diff = this._end - this._ini;
  };

  BaseScrollItem.prototype.scroll = function(top) {
    var percent;
    if (!this._offsetTop) {
      this.resize();
    }
    percent = (top - this._ini) / this._diff;
    if (percent < 0) {
      percent = 0;
    }
    if (percent > 2) {
      percent = 2;
    }
    return this.update(top, percent);
  };

  BaseScrollItem.prototype.update = function(top, percent) {};

  BaseScrollItem.prototype._getTop = function() {
    var current, distance;
    current = this.element;
    distance = current.offsetTop;
    while (current.offsetParent) {
      current = current.offsetParent;
      distance += current.offsetTop;
    }
    return distance;
  };

  return BaseScrollItem;

})(BaseDOM);

ScrollIcon = (function(superClass) {
  extend(ScrollIcon, superClass);

  function ScrollIcon(data) {
    var base1;
    if (data == null) {
      data = {};
    }
    ScrollIcon.__super__.constructor.call(this, {
      className: 'scroll-icon'
    });
    this._data = data;
    if ((base1 = this._data).label == null) {
      base1.label = 'scroll';
    }
  }

  ScrollIcon.prototype.create = function() {
    this.html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="18px" height="28px" viewBox="0 0 18 28" style="enable-background:new 0 0 18 28;" xml:space="preserve"> <path style="fill-rule:evenodd;clip-rule:evenodd;fill:#DAC27B;" class="scroll" d="M9.5,6.6c0.8,0,1.5,0.7,1.5,1.5v3c0,0.8-0.7,1.5-1.5,1.5S8,11.9,8,11.1v-3C8,7.3,8.7,6.6,9.5,6.6z"/> <path style="fill-rule:evenodd;clip-rule:evenodd;fill:none;stroke:#DAC27B;stroke-miterlimit:10;" d="M9,0.5c4.7,0,8.5,3.8,8.5,8.5v10c0,4.7-3.8,8.5-8.5,8.5c-4.7,0-8.5-3.8-8.5-8.5V9C0.5,4.3,4.3,0.5,9,0.5z"/> </svg>';
    this._svg = this.find('svg');
    this._scrollPath = this.find('.scroll');
    this._label = new BaseDOM({
      className: 'label'
    });
    this._label.html = this._data.label;
    this.appendChild(this._label);
    this._hit = new BaseDOM({
      className: 'hit'
    });
    this.appendChild(this._hit);
    return this.animateScroll();
  };

  ScrollIcon.prototype.animateScroll = function() {
    TweenMax.set(this._scrollPath, {
      transformOrigin: '50% 0'
    });
    return TweenMax.to(this._scrollPath, 0.5, {
      startAt: {
        scaleY: 0
      },
      scaleY: 1,
      onComplete: (function(_this) {
        return function() {
          TweenMax.set(_this._scrollPath, {
            transformOrigin: '50% 100%'
          });
          return TweenMax.to(_this._scrollPath, 0.5, {
            scaleY: 0,
            onComplete: function() {
              return _this.animateScroll();
            }
          });
        };
      })(this)
    });
  };

  ScrollIcon.prototype.destroy = function() {
    TweenMax.killTweensOf(this._scrollPath);
    this._data = null;
    this._svg = null;
    this._scrollPath = null;
    this._label = null;
    delete this._data;
    delete this._svg;
    delete this._scrollPath;
    return delete this._label;
  };

  return ScrollIcon;

})(BaseDOM);

Compare = (function(superClass) {
  extend(Compare, superClass);

  function Compare(data) {
    this._scroll = bind(this._scroll, this);
    this._resize = bind(this._resize, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    Compare.__super__.constructor.call(this, {
      className: 'banner-compare'
    });
    this._data = data;
    this._shown = false;
  }

  Compare.prototype.create = function() {
    this.css('background-image', 'url(' + this._data.background.src + ')');
    this._noise = new ComparePerlin();
    this.appendChild(this._noise);
    this._noise.create();
    this._center = new BaseDOM({
      className: 'banner-center'
    });
    this.appendChild(this._center);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._title.html = this._data.title;
    this._center.appendChild(this._title);
    this._titleLetters = new SplitText(this._title.element, {
      type: "lines"
    });
    this._compareButton = new SquareButton(this._data.button);
    this._center.appendChild(this._compareButton);
    this._compareButton.addClass('bt-compare');
    this._compareButton.create();
    this._car = new BaseDOM({
      className: 'car'
    });
    this._car.css('background-image', 'url(' + this._data.car.src + ')');
    this._center.appendChild(this._car);
    app.resizer.on(Resizer.RESIZE, this._resize);
    this._resize();
    this.showStart();
    return window.addEventListener('scroll', this._scroll);
  };

  Compare.prototype.showStart = function() {
    var _x, i, len1, line, m, ref, text;
    this.css('display', 'none');
    TweenMax.set(this._car.element, {
      x: -60,
      opacity: 0
    });
    ref = this._titleLetters.lines;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      line = ref[i];
      _x = i % 2 === 0 ? -50 : 50;
      TweenMax.set(line, {
        x: _x,
        opacity: 0
      });
      text = line.innerText || line.textContent;
      if (text[text.length - 1] === '.') {
        line.style.marginRight = '-4px';
      }
    }
    return TweenMax.set(this._compareButton.element, {
      right: -30,
      opacity: 0
    });
  };

  Compare.prototype.show = function(factor, delay) {
    var coHeight;
    if (factor == null) {
      factor = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    this._shown = true;
    this.css('display', 'block');
    coHeight = window.getComputedStyle(this.element).height;
    this.css('height', '0');
    TweenMax.to(this.element, 0.4, {
      height: coHeight,
      delay: delay,
      onComplete: (function(_this) {
        return function() {
          _this.css('height', '');
          return ScrollController.getInstance().resize();
        };
      })(this)
    });
    this._noise.show(2, delay + 0.1);
    TweenMax.to(this._car.element, 0.7, {
      x: 0,
      opacity: 1,
      delay: delay + 0.8,
      ease: Quart.easeOut
    });
    TweenMax.staggerTo(this._titleLetters.lines, 0.6, {
      x: 0,
      opacity: 1,
      delay: delay + 1,
      ease: Quart.easeOut
    }, 0.1);
    return TweenMax.to(this._compareButton.element, 0.8, {
      right: 0,
      opacity: 1,
      delay: delay + 1.2,
      ease: Quart.easeOut
    });
  };

  Compare.prototype._resize = function(e) {
    return this._distTop = this.top + (document.body.scrollTop || window.pageYOffset) - window.innerHeight;
  };

  Compare.prototype._scroll = function(e) {
    if ((document.body.scrollTop || window.pageYOffset) > this._distTop + 50) {
      if (!this._shown) {
        return this.show(null, 0.6);
      } else {
        return this._noise.activate();
      }
    } else {
      return this._noise.deactivate();
    }
  };

  return Compare;

})(BaseDOM);

ComparePerlin = (function(superClass) {
  extend(ComparePerlin, superClass);

  function ComparePerlin(data) {
    this._drawPerlin = bind(this._drawPerlin, this);
    this.resize = bind(this.resize, this);
    this.deactivate = bind(this.deactivate, this);
    this.activate = bind(this.activate, this);
    ComparePerlin.__super__.constructor.call(this, {
      element: 'canvas',
      className: 'compare-perlin'
    });
    this._data = data;
    this._index = 0;
    this._canvasWidth = 0;
    this._canvasHeight = 0;
    this._context = this.element.getContext('2d');
    this._offsetX = [];
    this._offsetY = 1;
    this._distFactor = 1;
    this._isActive = false;
    this._animationFrame = false;
  }

  ComparePerlin.prototype.create = function() {
    this.resize();
    return app.resizer.on(Resizer.RESIZE, this.resize);
  };

  ComparePerlin.prototype.show = function(time, delay) {
    var _df;
    if (time == null) {
      time = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    this.activate();
    _df = this._distFactor;
    this._distFactor = this._distFactor * 3;
    return TweenMax.to(this, time, {
      _offsetY: 0,
      _distFactor: _df,
      delay: delay,
      ease: Quart.easeOut
    });
  };

  ComparePerlin.prototype.activate = function() {
    if (this._isActive) {
      return;
    }
    this._isActive = true;
    return this._drawPerlin();
  };

  ComparePerlin.prototype.deactivate = function() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    return window.cancelAnimationFrame(this._animationFrame);
  };

  ComparePerlin.prototype.resize = function() {
    this._canvasWidth = window.innerWidth;
    this._canvasHeight = Math.max(this._canvasHeight, this.element.parentNode.offsetHeight);
    this._distFactor = Math.max(Math.min(this._canvasWidth / 1920, 1), 0.7);
    this.attr('width', this._canvasWidth);
    return this.attr('height', this._canvasHeight);
  };

  ComparePerlin.prototype._drawPerlin = function() {
    var a, p, px, x, y;
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    this._context.fillStyle = '#0e1316';
    y = -1;
    while (++y < 30) {
      x = -1;
      if (!this._offsetX[y]) {
        this._offsetX[y] = Math.random();
      }
      while (++x < Math.floor(this._canvasWidth / 10 / this._distFactor)) {
        px = x - (this._index % 1);
        p = Perlin.noise(px * 0.05 + this._index * 0.08, y * 0.06 + this._index * 0.05, 0.5);
        a = Perlin.noise(px * 0.1 + this._index * 0.05, y * 0.1 + this._index * 0.01, 0.2);
        this._context.globalAlpha = a * (1 - this._offsetY);
        this._context.fillRect((this._offsetX[y] * 10 + px * 12) * this._distFactor, ((this._offsetY * y) * 20 + (y * 5 + (p * 2 - 1) * 80) + 50) * this._distFactor, a * 1.5, a * 1.5);
      }
    }
    this._index += 0.3;
    if (!app.dd.mobile) {
      return this._animationFrame = window.requestAnimationFrame(this._drawPerlin);
    }
  };

  return ComparePerlin;

})(BaseDOM);

Button = (function(superClass) {
  extend(Button, superClass);

  Button.CLICK = 'onButtonClicked';

  function Button(data) {
    this.out = bind(this.out, this);
    this.over = bind(this.over, this);
    this.click = bind(this.click, this);
    Button.__super__.constructor.call(this, {
      element: 'a',
      className: 'button'
    });
    if (data.href) {
      this.attr('href', GTMController.getInstance().fixLink(data.href));
    } else if (data.action) {
      this.attr('href', GTMController.getInstance().fixLink(data.action));
    }
    if (data.target) {
      this.attr('target', data.target);
    }
    this._data = data;
  }

  Button.get({
    data: function() {
      return this._data;
    }
  });

  Button.prototype.create = function() {
    this._label = new BaseDOM({
      element: 'span',
      className: 'label'
    });
    this._label.text = this._data.label;
    this.appendChild(this._label);
    this.element.on(MouseEvent.CLICK, this.click);
    this.element.on(MouseEvent.OVER, this.over);
    return this.element.on(MouseEvent.OUT, this.out);
  };

  Button.prototype.click = function(e) {
    return this.trigger(Button.CLICK, this._data);
  };

  Button.prototype.over = function(e) {
    return TweenMax.to(this.element, 0.2, {
      opacity: 0.5,
      ease: Quad.easeOut
    });
  };

  Button.prototype.out = function(e) {
    return TweenMax.to(this.element, 0.2, {
      opacity: 1,
      ease: Quad.easeOut
    });
  };

  Button.prototype.destroy = function() {
    TweenMax.killTweensOf(this.element);
    this._data = null;
    this._label = null;
    delete this._data;
    delete this._label;
    this.element.off(MouseEvent.CLICK, this.click);
    this.element.off(MouseEvent.OVER, this.over);
    return this.element.off(MouseEvent.OUT, this.out);
  };

  return Button;

})(BaseDOM);

SquarePlay = (function(superClass) {
  extend(SquarePlay, superClass);

  function SquarePlay(data) {
    SquarePlay.__super__.constructor.call(this, {
      className: 'square-play'
    });
    this._data = data;
  }

  SquarePlay.prototype.create = function() {
    this._playIcon = new BaseDOM({
      className: 'play-icon'
    });
    this._playIcon.html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="11px" height="21px" viewBox="0 0 11 21" style="enable-background:new 0 0 11 21;" xml:space="preserve"><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M0,0l11,10.5L0,21V0z"/></svg>';
    return this.appendChild(this._playIcon);
  };

  return SquarePlay;

})(BaseDOM);

SquareButton = (function(superClass) {
  extend(SquareButton, superClass);

  function SquareButton(data) {
    this.out = bind(this.out, this);
    this.over = bind(this.over, this);
    SquareButton.__super__.constructor.call(this, data);
    this.addClass('square-button');
  }

  SquareButton.prototype.create = function() {
    var color, len1, m, ref, square;
    SquareButton.__super__.create.call(this);
    this._transition = new BaseDOM({
      className: 'transition'
    });
    this.appendChild(this._transition);
    this._squares = [];
    ref = ['#a79152', '#dac27c'];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      color = ref[m];
      square = new BaseDOM({
        element: 'span',
        className: 'square'
      });
      square.css('backgroundColor', color);
      this._squares.push(square);
      this._transition.appendChild(square);
    }
    return this.out(null, 0);
  };

  SquareButton.prototype.over = function(e, time) {
    var i, len1, m, ref, results1, square;
    if (time == null) {
      time = 0.2;
    }
    TweenMax.killTweensOf(this._label.element);
    TweenMax.to(this._label.element, time, {
      startAt: {
        y: 0,
        opacity: 1
      },
      y: -20,
      color: '#000',
      opacity: 0,
      delay: time,
      ease: Quad.easeOut
    });
    TweenMax.to(this._label.element, time, {
      startAt: {
        y: 20,
        opacity: 0
      },
      y: 0,
      opacity: 1,
      delay: time * 2,
      ease: Quad.easeOut
    });
    ref = this._squares;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      square = ref[i];
      square.css('display', 'block');
      TweenMax.killTweensOf(square.element);
      results1.push(TweenMax.to(square.element, time, {
        startAt: {
          top: '100%'
        },
        top: '0%',
        delay: time * i * 1.5
      }));
    }
    return results1;
  };

  SquareButton.prototype.out = function(e, time) {
    var i, len1, m, ref, square;
    if (time == null) {
      time = 0.2;
    }
    ref = this._squares;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      square = ref[i];
      TweenMax.killTweensOf(square.element);
      TweenMax.to(square.element, time, {
        top: '-100%'
      });
    }
    TweenMax.killTweensOf(this._label.element);
    return TweenMax.to(this._label.element, time, {
      y: 0,
      color: '#FFF',
      opacity: 1,
      ease: Quad.easeOut
    });
  };

  return SquareButton;

})(Button);

BorderButton = (function(superClass) {
  extend(BorderButton, superClass);

  function BorderButton(data) {
    this.out = bind(this.out, this);
    this.over = bind(this.over, this);
    BorderButton.__super__.constructor.call(this, data);
    this.addClass('border-button');
  }

  BorderButton.prototype.create = function() {
    var color, len1, m, ref, square;
    BorderButton.__super__.create.call(this);
    this._transition = new BaseDOM({
      className: 'transition'
    });
    this.appendChild(this._transition);
    this._squares = [];
    ref = ['#bba363', '#dac27c'];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      color = ref[m];
      square = new BaseDOM({
        element: 'span',
        className: 'square'
      });
      square.css('backgroundColor', color);
      this._squares.push(square);
      this._transition.appendChild(square);
    }
    return this.out(null, 0);
  };

  BorderButton.prototype.over = function(e, time) {
    var i, len1, m, ref, results1, square;
    if (time == null) {
      time = 0.2;
    }
    TweenMax.to(this._label.element, time, {
      startAt: {
        y: 0,
        opacity: 1
      },
      y: -20,
      color: '#000',
      opacity: 0,
      delay: time,
      ease: Quad.easeOut
    });
    TweenMax.to(this._label.element, time, {
      startAt: {
        y: 20,
        opacity: 0
      },
      y: 0,
      opacity: 1,
      delay: time * 2,
      ease: Quad.easeOut
    });
    ref = this._squares;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      square = ref[i];
      square.css('display', 'block');
      results1.push(TweenMax.to(square.element, time, {
        startAt: {
          top: '100%'
        },
        top: '0%',
        delay: time * i * 1.5
      }));
    }
    return results1;
  };

  BorderButton.prototype.out = function(e, time) {
    var i, len1, m, ref, square;
    if (time == null) {
      time = 0.2;
    }
    ref = this._squares;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      square = ref[i];
      TweenMax.to(square.element, time, {
        top: '-100%'
      });
    }
    return TweenMax.to(this._label.element, time, {
      color: '#FFF',
      ease: Quad.easeOut
    });
  };

  return BorderButton;

})(Button);

BarButton = (function(superClass) {
  extend(BarButton, superClass);

  function BarButton(data) {
    this._onComplete = bind(this._onComplete, this);
    this._onProgress = bind(this._onProgress, this);
    this.click = bind(this.click, this);
    this.out = bind(this.out, this);
    this.over = bind(this.over, this);
    this.select = bind(this.select, this);
    BarButton.__super__.constructor.call(this, data);
    this.addClass('bar-button');
    this.attr('href', app.root + data.action);
    this._barVisible = false;
    this._currentPercent = 0;
    this._isSelected = false;
  }

  BarButton.prototype.create = function() {
    BarButton.__super__.create.call(this);
    this._loader = LoadController.getInstance().getGroup(this.data.loader);
    if (!this._loader.loaded) {
      this._loader.on(GroupLoader.PROGRESS, this._onProgress);
      this._loader.on(GroupLoader.COMPLETE, this._onComplete);
    } else {
      this._onComplete();
    }
    this._label.text = this._removeLineBreaks(this.data.label);
    this._bar = new BaseDOM({
      className: 'bar'
    });
    this.appendChild(this._bar);
    this._progress = new BaseDOM({
      className: 'progress'
    });
    this._bar.appendChild(this._progress);
    this._line = new BaseDOM({
      className: 'line'
    });
    this.appendChild(this._line);
    this.hideBar(0, 0);
    return TweenMax.set(this._label.element, {
      x: '-100%'
    });
  };

  BarButton.prototype.select = function(time, delay) {
    if (time == null) {
      time = 0.3;
    }
    if (delay == null) {
      delay = 0;
    }
    return setTimeout((function(_this) {
      return function() {
        _this.over(null, time);
        return _this._isSelected = true;
      };
    })(this), delay * 1000);
  };

  BarButton.prototype.over = function(e, time, delay, force) {
    if (time == null) {
      time = 0.3;
    }
    if (delay == null) {
      delay = 0;
    }
    if (force == null) {
      force = false;
    }
    if ((this._isSelected || !this._shown) && !force) {
      return;
    }
    this._mOut = false;
    TweenMax.killTweensOf(this._label.element);
    TweenMax.to(this._label.element, 0.4, {
      color: '#dac27c',
      delay: delay,
      ease: Quad.easeIn,
      force3D: false
    });
    return this.showBar(time, delay + 0.1);
  };

  BarButton.prototype.out = function(e, time) {
    if (time == null) {
      time = 0.3;
    }
    if (this._isSelected || !this._shown) {
      return;
    }
    this._mOut = true;
    TweenMax.killTweensOf(this._label.element);
    this.hideBar(time, null, null);
    return TweenMax.to(this._label.element, 0.4, {
      color: '#ffffff',
      delay: 0.22,
      ease: Quad.easeOut,
      force3D: false
    });
  };

  BarButton.prototype.click = function(e) {
    e.preventDefault();
    return BarButton.__super__.click.apply(this, arguments);
  };

  BarButton.prototype.show = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.set(this._label.element, {
      x: '-100%'
    });
    return TweenMax.to(this._label.element, 0.5, {
      x: '0%',
      delay: p_delay,
      ease: Expo.easeOut,
      force3D: false,
      onComplete: (function(_this) {
        return function() {
          _this._shown = true;
          if (_this._isSelected) {
            return _this.over(null, null, null, true);
          }
        };
      })(this)
    });
  };

  BarButton.prototype.showBar = function(time, delay) {
    if (time == null) {
      time = 0.2;
    }
    if (delay == null) {
      delay = 0;
    }
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._bar.element);
    TweenMax.killTweensOf(this._progress.element);
    this._barVisible = true;
    TweenMax.set(this._bar.element, {
      opacity: 1
    });
    TweenMax.set(this._line.element, {
      opacity: 0
    });
    TweenMax.to(this._bar.element, 0.4, {
      width: '100%',
      delay: delay,
      ease: Quad.easeOut
    });
    this._progress.css({
      left: '0',
      right: 'auto'
    });
    return TweenMax.to(this._progress.element, 0.3, {
      width: this._currentPercent + '%',
      delay: delay + 0.2,
      ease: Quad.easeInOut,
      onComplete: (function(_this) {
        return function() {
          if (_this._currentPercent >= 100) {
            return _this.loadComplete();
          }
        };
      })(this)
    });
  };

  BarButton.prototype.hideBar = function(time, delay, callback) {
    if (time == null) {
      time = 0.2;
    }
    if (delay == null) {
      delay = 0;
    }
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._bar.element);
    TweenMax.killTweensOf(this._progress.element);
    this._barVisible = false;
    TweenMax.to(this._line.element, 0.2, {
      width: '0%',
      delay: delay,
      ease: Quad.easeInOut
    });
    TweenMax.to(this._progress.element, 0.2, {
      width: '0%',
      delay: delay + 0.1,
      ease: Quad.easeInOut
    });
    return TweenMax.to(this._bar.element, 0.2, {
      width: '0%',
      delay: delay + 0.2,
      ease: Quad.easeInOut,
      onComplete: callback
    });
  };

  BarButton.prototype.setPercent = function(percent, time) {
    if (time == null) {
      time = 0.1;
    }
    this._currentPercent = percent;
    if (this._barVisible) {
      return TweenMax.to(this._progress.element, time, {
        width: this._currentPercent + '%'
      });
    }
  };

  BarButton.prototype.loadComplete = function() {
    this._progress.css('left', 'auto');
    this._progress.css('right', '0');
    return TweenMax.to(this._progress.element, 0.3, {
      width: '0%',
      ease: Quad.easeOut
    });
  };

  BarButton.prototype.destroy = function() {
    TweenMax.killTweensOf(this._label.element);
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._bar.element);
    TweenMax.killTweensOf(this._progress.element);
    this._loader.off(GroupLoader.PROGRESS, this._onProgress);
    this._loader.off(GroupLoader.COMPLETE, this._onComplete);
    this._label = null;
    this._bar = null;
    this._progress = null;
    this._line = null;
    this._barVisible = null;
    this._currentPercent = null;
    this._isSelected = null;
    delete this._loader;
    delete this._label;
    delete this._bar;
    delete this._progress;
    delete this._line;
    delete this._barVisible;
    delete this._currentPercent;
    delete this._isSelected;
    return BarButton.__super__.destroy.apply(this, arguments);
  };

  BarButton.prototype._onProgress = function(e, percent) {
    return this.setPercent(percent * 100);
  };

  BarButton.prototype._onComplete = function(e) {
    this.setPercent(100);
    if (this._barVisible) {
      return this.loadComplete();
    }
  };

  BarButton.prototype._removeLineBreaks = function(text) {
    return text.replace(/<br[^>]*>/, ' ');
  };

  return BarButton;

})(Button);

RoundedButton = (function(superClass) {
  extend(RoundedButton, superClass);

  function RoundedButton(data) {
    this.out = bind(this.out, this);
    this.over = bind(this.over, this);
    RoundedButton.__super__.constructor.call(this, data);
    this.addClass('rounded');
  }

  RoundedButton.prototype.create = function() {
    this._arrow = new BaseDOM({
      className: 'arrow'
    });
    this._arrow.html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="5.7px" height="8.5px" viewBox="0 0 5.7 8.5" style="enable-background:new 0 0 5.7 8.5;" xml:space="preserve"><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M1.4,0l4.2,4.2L4.2,5.7L0,1.4L1.4,0z"/><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M0,7.1l4.2-4.2l1.4,1.4L1.4,8.5L0,7.1z"/></svg>';
    this.appendChild(this._arrow);
    this._svg = this._arrow.find('svg');
    return RoundedButton.__super__.create.apply(this, arguments);
  };

  RoundedButton.prototype.over = function(e, time) {
    if (time == null) {
      time = 0.2;
    }
    RoundedButton.__super__.over.apply(this, arguments);
    TweenMax.to(this._svg, time, {
      startAt: {
        y: 0,
        opacity: 1
      },
      y: -20,
      fill: '#000',
      opacity: 0,
      delay: time,
      ease: Quad.easeOut
    });
    return TweenMax.to(this._svg, time, {
      startAt: {
        y: 20,
        opacity: 0
      },
      y: 0,
      opacity: 1,
      delay: time * 1.5,
      ease: Quad.easeOut
    });
  };

  RoundedButton.prototype.out = function(e, time) {
    if (time == null) {
      time = 0.2;
    }
    RoundedButton.__super__.out.apply(this, arguments);
    return TweenMax.to(this._svg, time, {
      fill: '#FFF',
      ease: Quad.easeOut
    });
  };

  return RoundedButton;

})(BorderButton);

MainMenu = (function(superClass) {
  extend(MainMenu, superClass);

  function MainMenu(data) {
    this._clicked = bind(this._clicked, this);
    this.destroy = bind(this.destroy, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    MainMenu.__super__.constructor.call(this, {
      className: 'side-main-menu'
    });
    this._data = data;
    this._buttons = [];
    this._selected = null;
    this._route = app.navigation.currentView.route.replace(/(^\/)|(\/$)/gi, '');
  }

  MainMenu.prototype.create = function() {
    var button, data, len1, m, ref, results1, row;
    this._list = new BaseDOM({
      element: 'ul'
    });
    this.appendChild(this._list);
    this._shadow = new BaseDOM({
      className: 'shadow-blur'
    });
    this.appendChild(this._shadow);
    ref = this._data.list;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      data = ref[m];
      row = new BaseDOM({
        element: 'li'
      });
      this._list.appendChild(row);
      data.href = app.root.replace(/\/$/, '') + data.action;
      button = new BarButton(data);
      row.appendChild(button);
      button.create();
      if (this._route === data.action.replace(/(^\/)|(\/$)/gi, '')) {
        button.select(null, 3.2);
      }
      button.on(Button.CLICK, this._clicked);
      results1.push(this._buttons.push({
        row: row,
        button: button
      }));
    }
    return results1;
  };

  MainMenu.prototype.showStart = function() {
    return TweenMax.set(this._shadow.element, {
      alpha: 0
    });
  };

  MainMenu.prototype.show = function() {
    var i, item, len1, m, ref, results1;
    TweenMax.to(this._shadow.element, 1, {
      alpha: .75,
      ease: Sine.easeOut,
      force3D: false
    });
    ref = this._buttons;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      results1.push(item.button.show(i * 0.06 + 0.5));
    }
    return results1;
  };

  MainMenu.prototype.hideStart = function() {
    var i, item, len1, m, ref, results1;
    ref = this._buttons;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      results1.push(TweenMax.set(item.button.element, {
        x: 0,
        opacity: 1,
        force3D: false
      }));
    }
    return results1;
  };

  MainMenu.prototype.hide = function() {
    var i, item, len1, m, ref, results1;
    ref = this._buttons;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      results1.push(TweenMax.to(item.button.element, 0.5, {
        x: 10,
        opacity: 0,
        delay: i * 0.1,
        ease: Back.easeOut,
        force3D: false
      }));
    }
    return results1;
  };

  MainMenu.prototype.destroy = function() {
    var item, len1, len2, m, q, ref, ref1;
    if (!this._list) {
      return;
    }
    TweenMax.killTweensOf(this._shadow.element);
    ref = this._buttons;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      TweenMax.killTweensOf(item.button.element);
    }
    this._data = null;
    this._selected = null;
    this._route = null;
    this._list = null;
    this._shadow = null;
    ref1 = this._buttons;
    for (q = 0, len2 = ref1.length; q < len2; q++) {
      item = ref1[q];
      item.button.destroy();
      item.button.off(Button.CLICK, this._clicked);
      item = null;
    }
    this._buttons.length = 0;
    this._buttons = null;
    delete this._data;
    delete this._buttons;
    delete this._selected;
    delete this._route;
    delete this._list;
    delete this._shadow;
    return delete this._buttons;
  };

  MainMenu.prototype._clicked = function(e, data) {
    return app.navigation.gotoRoute(data.action, true);
  };

  return MainMenu;

})(BaseDOM);

FeaturesMenu = (function(superClass) {
  extend(FeaturesMenu, superClass);

  function FeaturesMenu(data) {
    this._checkSide = bind(this._checkSide, this);
    this._viewChanged = bind(this._viewChanged, this);
    this._resize = bind(this._resize, this);
    this._itemClicked = bind(this._itemClicked, this);
    this._deselectAll = bind(this._deselectAll, this);
    this._containerOut = bind(this._containerOut, this);
    this._itemOver = bind(this._itemOver, this);
    FeaturesMenu.__super__.constructor.call(this, {
      className: 'features-menu'
    });
    this._data = data;
    this._list = this._parseValidItens(this._data.list);
    this._expandedSize = (100 / this._list.length) * 1.75;
    this._selectedItem = false;
    this._clickedItem = false;
  }

  FeaturesMenu.prototype.create = function() {
    var data, i, item, len1, m, parsedLink, ref;
    this._itens = [];
    ref = this._list;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      data = ref[i];
      item = new FeatureItem(data, i, this._expandedSize);
      parsedLink = data.action.replace(/(^\/)|(\/$)/gi, '');
      this.appendChild(item);
      this._itens.push(item);
      item.create();
      item.on(FeatureItem.OVER, this._itemOver);
      item.on(FeatureItem.CLICK, this._itemClicked);
    }
    this.element.on(MouseEvent.OUT, this._containerOut);
    app.resizer.on(Resizer.RESIZE, this._resize);
    app.navigation.on(Navigation.CHANGE_VIEW, this._viewChanged);
    this._viewChanged({
      target: app.navigation
    });
    this._containerOut(null, 0);
    return this._resize();
  };

  FeaturesMenu.prototype.selectByRoute = function(route) {
    var item, itemAction, len1, m, match, ref;
    match = false;
    route = route.replace(/(^\/)|(\/$)/gi, '');
    ref = this._itens;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      itemAction = item.action.replace(/(^\/)|(\/$)/gi, '');
      if (itemAction === route) {
        match = true;
        this._clickedItem = item;
        this._itemOver({
          target: item
        }, 0);
        break;
      }
    }
    if (!match) {
      return this._deselectAll();
    }
  };

  FeaturesMenu.prototype._parseValidItens = function(array) {
    var item, len1, list, m;
    list = [];
    for (m = 0, len1 = array.length; m < len1; m++) {
      item = array[m];
      if (item.image) {
        list.push(item);
      }
    }
    return list;
  };

  FeaturesMenu.prototype._itemOver = function(e, time) {
    var direction, item, len1, m, ref, results1;
    if (time == null) {
      time = 0.3;
    }
    if (e.target === this._selectedItem) {
      return;
    }
    direction = 'top';
    if (this._selectedItem) {
      direction = this._checkSide(this._selectedItem, e.target);
      this._selectedItem.deselect(null, direction);
    }
    ref = this._itens;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      TweenMax.killTweensOf(item.element);
      if (item === e.target) {
        this._selectedItem = item;
        item.select(null, direction);
        results1.push(TweenMax.to(item.element, time, {
          width: this._expandedSize + 'vw',
          ease: Quad.easeOut
        }));
      } else {
        results1.push(TweenMax.to(item.element, time, {
          width: ((100 - this._expandedSize) / (this._itens.length - 1)) + 'vw',
          ease: Quad.easeOut
        }));
      }
    }
    return results1;
  };

  FeaturesMenu.prototype._containerOut = function(e, time) {
    var item, len1, m, ref, results1;
    if (time == null) {
      time = 0.3;
    }
    if (this._clickedItem) {
      if (this._selectedItem !== this._clickedItem) {
        return this._itemOver({
          target: this._clickedItem
        });
      }
    } else {
      if (this._selectedItem) {
        window.aa = this._selectedItem;
        this._selectedItem.deselect(null, (e.pageY < this._masterTop ? 'top' : 'bottom'));
        this._selectedItem = false;
      }
      ref = this._itens;
      results1 = [];
      for (m = 0, len1 = ref.length; m < len1; m++) {
        item = ref[m];
        TweenMax.killTweensOf(item.element);
        results1.push(TweenMax.to(item.element, time, {
          width: (100 / this._itens.length) + 'vw',
          delay: 0.3
        }));
      }
      return results1;
    }
  };

  FeaturesMenu.prototype._deselectAll = function() {
    this._selectedItem = this._clickedItem;
    this._clickedItem = false;
    return this._containerOut({
      pageY: 0
    });
  };

  FeaturesMenu.prototype._itemClicked = function(e) {
    return app.navigation.gotoRoute(e.target.action, true);
  };

  FeaturesMenu.prototype._resize = function() {
    return this._masterTop = this._getTop();
  };

  FeaturesMenu.prototype._viewChanged = function(e) {
    return this.selectByRoute(e.target.currentView.route);
  };

  FeaturesMenu.prototype._checkSide = function(old, current) {
    var d;
    if (current.top === old.top) {
      d = current.left > old.left ? 'right' : 'left';
    } else {
      d = current.top > old.top ? 'bottom' : 'top';
    }
    return d;
  };

  FeaturesMenu.prototype._getTop = function() {
    var current, distance;
    current = this.element;
    distance = current.offsetTop;
    while (current.offsetParent) {
      current = current.offsetParent;
      distance += current.offsetTop;
    }
    return distance;
  };

  return FeaturesMenu;

})(BaseDOM);

FeatureItem = (function(superClass) {
  extend(FeatureItem, superClass);

  FeatureItem.OVER = 'onFeatureItemOver';

  FeatureItem.CLICK = 'onFeatureItemClick';

  function FeatureItem(data, index, expandedPerc) {
    this._drawGrayBg = bind(this._drawGrayBg, this);
    this._clicked = bind(this._clicked, this);
    this._over = bind(this._over, this);
    this.deselect = bind(this.deselect, this);
    var base1;
    FeatureItem.__super__.constructor.call(this, {
      className: 'feature-item'
    });
    this._data = data;
    this._index = index;
    this._expandedPerc = expandedPerc;
    this._imgTagOverlay = this._data.image.tag;
    this._imgTagBlur = this._imgTagOverlay.cloneNode();
    this._blurFilterId = 'blur-feature-menu';
    if ((base1 = this._data.image).center == null) {
      base1.center = '50%';
    }
  }

  FeatureItem.get({
    index: function() {
      return this._index;
    }
  });

  FeatureItem.get({
    action: function() {
      return this._data.action;
    }
  });

  FeatureItem.get({
    viewId: function() {
      return this._data.viewId;
    }
  });

  FeatureItem.prototype.create = function() {
    if (!app.container.find('#' + this._blurFilterId)) {
      this._svgBlur = new BaseDOM({
        className: 'svg-blur'
      });
      this._svgBlur.html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><filter id="' + this._blurFilterId + '"><feGaussianBlur stdDeviation="3" /></filter></svg>';
      this._svgBlur.css('display', 'none');
      this.appendChild(this._svgBlur);
    }
    this._mainTitle = new BaseDOM({
      className: 'main-title'
    });
    this.appendChild(this._mainTitle);
    this._mainTitle.html = this._data.label;
    this._splitMainTitle = new SplitText(this._mainTitle.element, {
      type: 'lines'
    });
    this._expandedText = new BaseDOM({
      className: 'expanded-text'
    });
    this.appendChild(this._expandedText);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._expandedText.appendChild(this._title);
    this._title.text = this._removeLineBreaks(this._data.label);
    this._splitTitle = new SplitText(this._title.element, {
      type: 'chars'
    });
    this._description = new BaseDOM({
      className: 'description'
    });
    this._expandedText.appendChild(this._description);
    this._description.text = this._removeLineBreaks(this._data.description);
    this._splitDescription = new SplitText(this._description.element, {
      type: 'chars'
    });
    this._imageGray = new BaseDOM({
      className: 'image-gray'
    });
    this._imageGray.css('backgroundPosition', this._data.image.center + ' 50%');
    this.appendChild(this._imageGray);
    this._colorMap = new ColorMapImage();
    this._colorMap.on(ColorMapImage.READY, this._drawGrayBg);
    this._colorMap.create({
      image: this._data.image.id,
      colorStart: '#181818',
      colorEnd: '#5c5c5c'
    });
    this._imageBlur = new BaseDOM({
      className: 'image-blur'
    });
    this.appendChild(this._imageBlur);
    this._imageBlur.css('-webkit-filter', 'url(#' + this._blurFilterId + ')');
    this._imageBlur.css('filter', 'url(#' + this._blurFilterId + ')');
    this._imageBlur.css('backgroundImage', 'url(' + this._imgTagBlur.src + ')');
    this._imageBlur.css('backgroundPosition', this._data.image.center + ' 50%');
    this._overlay = new BaseDOM({
      className: 'overlay'
    });
    this.appendChild(this._overlay);
    this._frameOverlay = new BaseDOM({
      className: 'frame'
    });
    this._overlay.appendChild(this._frameOverlay);
    this._imageDivOverlay = new BaseDOM({
      className: 'image'
    });
    this._frameOverlay.appendChild(this._imageDivOverlay);
    this._imageDivOverlay.css('backgroundImage', 'url(' + this._imgTagOverlay.src + ')');
    this._imageDivOverlay.css('backgroundPosition', this._data.image.center + ' 50%');
    this.deselect(0);
    this.element.on(MouseEvent.OVER, this._over);
    return this.element.on(MouseEvent.CLICK, this._clicked);
  };

  FeatureItem.prototype.select = function(time, direction) {
    var i, len1, m, ref, titleLine;
    if (time == null) {
      time = .5;
    }
    if (direction == null) {
      direction = 'top';
    }
    TweenMax.killTweensOf(this._mainTitle.element);
    TweenMax.killTweensOf(this._title.element);
    TweenMax.killTweensOf(this._description.element);
    TweenMax.killTweensOf(this._imageBlur.element);
    TweenMax.killTweensOf(this._imageGray.element);
    TweenMax.killTweensOf(this._overlay.element);
    TweenMax.set(this._overlay.element, {
      x: 0,
      y: 0,
      scale: 1.1,
      padding: 0,
      opacity: 0,
      display: 'block'
    });
    ref = this._splitMainTitle.lines;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      titleLine = ref[i];
      TweenMax.killTweensOf(titleLine);
      TweenMax.to(titleLine, time / 2, {
        opacity: 0,
        delay: i * 0.1
      });
    }
    TweenMax.to(this._overlay.element, time / 2, {
      opacity: 1,
      delay: 0.25,
      ease: Quint.easeOut
    });
    TweenMax.to(this._overlay.element, time, {
      scale: 1,
      padding: 18,
      delay: 0.15,
      ease: Quad.easeOut
    });
    TweenMax.to(this._imageBlur.element, time * 2, {
      opacity: 0.3,
      delay: 0.4,
      ease: Linear.easeNone
    });
    TweenMax.to(this._imageGray.element, time * 2, {
      opacity: 0,
      delay: 0.4,
      ease: Linear.easeNone
    });
    TweenMax.to(this._title.element, time / 2, {
      startAt: {
        x: -15
      },
      x: 0,
      opacity: 1,
      delay: 0.5,
      ease: Quad.easeOut
    });
    return TweenMax.to(this._description.element, time / 2, {
      startAt: {
        x: 15
      },
      x: 0,
      opacity: 1,
      delay: 0.55,
      ease: Quad.easeOut
    });
  };

  FeatureItem.prototype.deselect = function(time, direction) {
    var i, len1, m, overlayDelay, overlayTime, pos, ref, titleLine;
    if (time == null) {
      time = .4;
    }
    if (direction == null) {
      direction = 'top';
    }
    TweenMax.killTweensOf(this._mainTitle.element);
    TweenMax.killTweensOf(this._title.element);
    TweenMax.killTweensOf(this._description.element);
    TweenMax.killTweensOf(this._imageBlur.element);
    TweenMax.killTweensOf(this._imageGray.element);
    TweenMax.killTweensOf(this._overlay.element);
    TweenMax.to(this._title.element, 0, {
      opacity: 0
    });
    TweenMax.to(this._description.element, 0, {
      opacity: 0
    });
    ref = this._splitMainTitle.lines;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      titleLine = ref[i];
      TweenMax.killTweensOf(titleLine);
      TweenMax.to(titleLine, time / 2, {
        startAt: {
          y: 20
        },
        y: 0,
        opacity: 1,
        delay: i * 0.1
      });
    }
    pos = this._getPosition(direction);
    overlayTime = time;
    overlayDelay = 0.2;
    if (direction === 'top' || direction === 'bottom' || window.innerWidth < 1280) {
      overlayTime = time;
      overlayDelay = 0.15;
      TweenMax.to(this._overlay.element, 0.2, {
        scale: 0.9,
        ease: Quad.easeInOut
      });
    }
    TweenMax.to(this._overlay.element, overlayTime, {
      x: pos.x,
      y: pos.y,
      ease: Quad.easeInOut,
      delay: overlayDelay,
      onComplete: (function(_this) {
        return function() {
          return _this._overlay.css('display', 'none');
        };
      })(this)
    });
    TweenMax.to(this._imageBlur.element, overlayTime, {
      opacity: 0,
      delay: overlayDelay
    });
    return TweenMax.to(this._imageGray.element, overlayTime, {
      opacity: 1,
      delay: overlayDelay
    });
  };

  FeatureItem.prototype._getTop = function() {
    var current, distance;
    current = this.element;
    distance = current.offsetTop;
    while (current.offsetParent) {
      current = current.offsetParent;
      distance += current.offsetTop;
    }
    return distance;
  };

  FeatureItem.prototype._getPosition = function(direction, animateIn) {
    var value;
    if (animateIn == null) {
      animateIn = false;
    }
    value = (function() {
      switch (direction) {
        case 'top':
          return {
            x: 0,
            y: -this._overlay.height
          };
        case 'right':
          return {
            x: this._overlay.width,
            y: 0
          };
        case 'bottom':
          return {
            x: 0,
            y: this._overlay.height
          };
        case 'left':
          return {
            x: -this._overlay.width,
            y: 0
          };
      }
    }).call(this);
    if (animateIn) {
      value.x *= -1;
    }
    return value;
  };

  FeatureItem.prototype._over = function(e) {
    return this.trigger(FeatureItem.OVER);
  };

  FeatureItem.prototype._clicked = function(e) {
    return this.trigger(FeatureItem.CLICK);
  };

  FeatureItem.prototype._removeLineBreaks = function(text) {
    return text.replace(/<br[^>]*>/, ' ');
  };

  FeatureItem.prototype._drawGrayBg = function() {
    return this._imageGray.css('backgroundImage', 'url(' + this._colorMap.src + ')');
  };

  return FeatureItem;

})(BaseDOM);

BaseMediaPlayer = (function(superClass) {
  extend(BaseMediaPlayer, superClass);

  function BaseMediaPlayer() {
    return BaseMediaPlayer.__super__.constructor.apply(this, arguments);
  }

  BaseMediaPlayer.PLAY = 'onPlayMediaPlayer';

  BaseMediaPlayer.PAUSE = 'onPauseMediaPlayer';

  BaseMediaPlayer.STOP = 'onStopMediaPlayer';

  BaseMediaPlayer.PROGRESS = 'onProgressMediaPlayer';

  BaseMediaPlayer.ENDED = 'onVideoEnded';

  BaseMediaPlayer.PLAYING = 'onVideoPlaying';

  BaseMediaPlayer.PAUSED = 'onVideoPaused';

  BaseMediaPlayer.BUFFERING = 'onVideoBuffering';

  BaseMediaPlayer.PROGRESS = 'onVideoProgress';

  BaseMediaPlayer.CUED = 'onVideoCued';

  BaseMediaPlayer.VOLUME_CHANGED = 'onVolumeChanged';

  BaseMediaPlayer.prototype.contructor = function() {
    BaseMediaPlayer.__super__.contructor.apply(this, arguments);
    return this._isPlaying = false;
  };

  BaseMediaPlayer.get({
    isPlaying: function() {
      return this._isPlaying;
    }
  });

  BaseMediaPlayer.set({
    isPlaying: function(value) {
      return this._isPlaying = value;
    }
  });

  BaseMediaPlayer.get({
    duration: function() {
      console.log('you must override');
      return 0;
    }
  });

  BaseMediaPlayer.get({
    currentTime: function() {
      console.log('you must override');
      return 0;
    }
  });

  BaseMediaPlayer.get({
    volume: function() {
      console.log('you must override');
      return 0;
    }
  });

  BaseMediaPlayer.set({
    volume: function(value) {
      return console.log('you must override');
    }
  });

  BaseMediaPlayer.prototype.setVideo = function(video) {
    return console.log('now playing', video);
  };

  BaseMediaPlayer.prototype.play = function() {
    this._isPlaying = true;
    return this.trigger(BaseMediaPlayer.PLAY);
  };

  BaseMediaPlayer.prototype.pause = function() {
    this._isPlaying = false;
    return this.trigger(BaseMediaPlayer.PAUSE);
  };

  BaseMediaPlayer.prototype.stop = function() {
    this.pause();
    this.seek(0);
    return this.trigger(BaseMediaPlayer.STOP);
  };

  BaseMediaPlayer.prototype.seek = function(time) {
    return console.log('seek to', time);
  };

  BaseMediaPlayer.prototype.volume = function(value) {
    return console.log('volume to', value);
  };

  BaseMediaPlayer.prototype.destroy = function() {
    return this.stop();
  };

  return BaseMediaPlayer;

})(EventDispatcher);

YoutubePlayer = (function(superClass) {
  extend(YoutubePlayer, superClass);

  function YoutubePlayer(wrapper, options, callback) {
    this._playerStateChange = bind(this._playerStateChange, this);
    this._playerReady = bind(this._playerReady, this);
    YoutubePlayer.__super__.constructor.call(this);
    this._wrapper = wrapper;
    this._options = options;
    this._callback = callback;
    this._currentVideoId = '';
    this._isReady = false;
    this._progressTimer = false;
    this._progressEnable = false;
    this._lastVolume = 0;
    this._defaults = {
      width: '100%',
      height: '100%',
      playerVars: {
        theme: 'light'
      },
      events: {}
    };
    this._currentVideoId = options.videoId;
    this._defaults.videoId = options.videoId;
    this._defaults.events.onReady = this._playerReady;
    this._defaults.events.onStateChange = this._playerStateChange;
    this._player = new YT.Player(wrapper, this._defaults);
  }

  YoutubePlayer.prototype.on = function(p_event, p_handler, p_useCapture) {
    if (p_useCapture == null) {
      p_useCapture = false;
    }
    YoutubePlayer.__super__.on.apply(this, arguments);
    if (p_event === BaseMediaPlayer.PROGRESS) {
      this._progressEnable = true;
      if (this._progressTimer) {
        return this._startVideoProgress();
      }
    }
  };

  YoutubePlayer.prototype.setVideo = function(videoId) {
    this._currentVideoId = videoId;
    this._player.cueVideoById(this._currentVideoId);
    return this._player.setPlaybackQuality('highres');
  };

  YoutubePlayer.prototype.stopVideo = function() {
    this._player.pauseVideo();
    this._player.seekTo(0);
    return this._player.stopVideo();
  };

  YoutubePlayer.prototype._playerReady = function(e) {
    this._isReady = true;
    return typeof this._callback === "function" ? this._callback(this) : void 0;
  };

  YoutubePlayer.prototype._playerStateChange = function(e) {
    console.log('yt event>', e.data);
    switch (e.data) {
      case YT.PlayerState.ENDED:
        this.isPlaying = false;
        this._stopVideoProgress();
        this.trigger(BaseMediaPlayer.ENDED);
        break;
      case YT.PlayerState.PLAYING:
        this.isPlaying = true;
        this._startVideoProgress();
        this.trigger(BaseMediaPlayer.PLAYING);
        break;
      case YT.PlayerState.PAUSED:
        this.isPlaying = false;
        this._stopVideoProgress();
        this.trigger(BaseMediaPlayer.PAUSED);
        break;
      case YT.PlayerState.BUFFERING:
        this.trigger(BaseMediaPlayer.BUFFERING);
        break;
      case YT.PlayerState.CUED:
        this.trigger(BaseMediaPlayer.CUED);
        break;
    }
  };

  YoutubePlayer.prototype._stopVideoProgress = function() {
    if (this._progressTimer) {
      clearInterval(this._progressTimer);
      return this._progressTimer = false;
    }
  };

  YoutubePlayer.prototype._startVideoProgress = function() {
    var duration;
    this._stopVideoProgress();
    duration = this._player.getDuration();
    if (this._progressEnable) {
      return this._progressTimer = setInterval((function(_this) {
        return function() {
          var time;
          time = _this._player.getCurrentTime();
          return _this.trigger(BaseMediaPlayer.PROGRESS, time / duration);
        };
      })(this), 100);
    } else {
      return this._progressTimer = true;
    }
  };

  return YoutubePlayer;

})(BaseMediaPlayer);

BaseLoaderView = (function(superClass) {
  extend(BaseLoaderView, superClass);

  function BaseLoaderView() {
    this._preloaderHided = bind(this._preloaderHided, this);
    this._onComplete = bind(this._onComplete, this);
    this._onProgress = bind(this._onProgress, this);
    this._triggerPageTracking = bind(this._triggerPageTracking, this);
    this.destroy = bind(this.destroy, this);
    this.hideStart = bind(this.hideStart, this);
    this.createStart = bind(this.createStart, this);
    return BaseLoaderView.__super__.constructor.apply(this, arguments);
  }

  BaseLoaderView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.on(BaseView.SHOW_START, this._triggerPageTracking);
    this._group = LoadController.getInstance().loadGroup(this.id);
    if (this._group.loaded) {
      return BaseLoaderView.__super__.createStart.apply(this, arguments);
    } else {
      this._preloader = new PreloaderView();
      this.appendChild(this._preloader);
      ViewController.getInstance().show(this._preloader);
      this._group.on(GroupLoader.PROGRESS, this._onProgress);
      return this._group.on(GroupLoader.COMPLETE, this._onComplete);
    }
  };

  BaseLoaderView.prototype.hideStart = function() {
    this._startHide = true;
    if (this._group) {
      this._group.off(GroupLoader.PROGRESS, this._onProgress);
      this._group.off(GroupLoader.COMPLETE, this._onComplete);
    }
    return BaseLoaderView.__super__.hideStart.apply(this, arguments);
  };

  BaseLoaderView.prototype.destroy = function() {
    if (this._preloader) {
      this._preloader.destroy();
      this._preloader = null;
      delete this._preloader;
    }
    this._group = null;
    if (this._scrollTimer) {
      clearInterval(this._scrollTimer);
    }
    delete this._group;
    return BaseLoaderView.__super__.destroy.apply(this, arguments);
  };

  BaseLoaderView.prototype._triggerPageTracking = function() {
    if (this.avoidTrackPushState) {
      return;
    }
    return GTMController.getInstance().trackPushState();
  };

  BaseLoaderView.prototype._onProgress = function(e, progress) {
    return this._preloader.progress = progress;
  };

  BaseLoaderView.prototype._onComplete = function(e) {
    if (this._startHide) {
      return;
    }
    this._group.off(GroupLoader.PROGRESS, this._onProgress);
    this._group.off(GroupLoader.COMPLETE, this._onComplete);
    this._preloader.progress = 1;
    this._preloader.on(BaseView.HIDE_COMPLETE, this._preloaderHided);
    return ViewController.getInstance().hide(this._preloader);
  };

  BaseLoaderView.prototype._preloaderHided = function() {
    this.removeChild(this._preloader);
    return this.createStart();
  };

  return BaseLoaderView;

})(BaseView);

HomeBannerMobile = (function(superClass) {
  extend(HomeBannerMobile, superClass);

  function HomeBannerMobile(data) {
    HomeBannerMobile.__super__.constructor.call(this, {
      className: 'banner-mobile'
    });
    this._data = data;
    this._logoTag = app.loader.getResult(this._data.mobile.logo.id);
    this._lineTag = app.loader.getResult(this._data.line.id);
    this._coverTag = app.loader.getResult(this._data.mobile.image.id);
  }

  HomeBannerMobile.prototype.create = function() {
    this.css('backgroundImage', 'url(' + this._coverTag.src + ')');
    this._logo = new BaseDOM({
      className: 'logo'
    });
    this._logo.appendChild(this._logoTag);
    this.appendChild(this._logo);
    this._line = new BaseDOM({
      className: 'line'
    });
    this._line.appendChild(this._lineTag);
    this.appendChild(this._line);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._description.html = this._data.description;
    return this.appendChild(this._description);
  };

  HomeBannerMobile.prototype.destroy = function() {
    this._data = null;
    this._logoTag = null;
    this._lineTag = null;
    this._coverTag = null;
    this._logo = null;
    this._line = null;
    this._description = null;
    delete this._data;
    delete this._logoTag;
    delete this._lineTag;
    delete this._coverTag;
    delete this._logo;
    delete this._line;
    return delete this._description;
  };

  return HomeBannerMobile;

})(BaseDOM);

HomeFeatureItem = (function(superClass) {
  extend(HomeFeatureItem, superClass);

  function HomeFeatureItem(data) {
    HomeFeatureItem.__super__.constructor.call(this, {
      className: 'home-feature'
    });
    this._data = data;
    this._coverTag = app.loader.getResult(this._data.image.id);
  }

  HomeFeatureItem.prototype.create = function() {
    this._image = new BaseDOM({
      className: 'image'
    });
    this._image.css('backgroundImage', 'url(' + this._coverTag.src + ')');
    this.appendChild(this._image);
    this._textContainer = new BaseDOM({
      className: 'text-container'
    });
    this.appendChild(this._textContainer);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._title.html = this._data.title;
    this._textContainer.appendChild(this._title);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._description.html = this._data.description;
    return this._textContainer.appendChild(this._description);
  };

  HomeFeatureItem.prototype.destroy = function() {
    this._data = null;
    this._coverTag = null;
    this._image = null;
    this._textContainer = null;
    this._title = null;
    this._description = null;
    delete this._data;
    delete this._coverTag;
    delete this._image;
    delete this._textContainer;
    delete this._title;
    return delete this._description;
  };

  return HomeFeatureItem;

})(BaseDOM);

HomeLogoFastBack = (function(superClass) {
  extend(HomeLogoFastBack, superClass);

  function HomeLogoFastBack(data) {
    this.destroy = bind(this.destroy, this);
    HomeLogoFastBack.__super__.constructor.call(this, {
      className: 'logo-fastback'
    });
  }

  HomeLogoFastBack.prototype.create = function(image) {
    this._focus = new BaseDOM({
      className: 'focus'
    });
    this._focus.html = '<svg class="label" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="117.6px" height="25.8px" viewBox="0 0 117.6 25.8" style="enable-background:new 0 0 117.6 25.8;" xml:space="preserve"> <path id="XMLID_24_" d="M5.3,0.4h14.8l-0.4,1.7h-13l-2.1,9.5h12.7L17,13.2H4.3L1.8,25.4H0L5.3,0.4z"/> <path id="XMLID_21_" d="M22.9,15.8c0-1.3,0.2-2.7,0.4-4.2C25.1,2.9,30,0,35.7,0c6.8,0,10.2,3.7,10.2,9.9c0,1.3-0.1,2.7-0.4,4.2 c-1.8,8.8-6.5,11.7-12.4,11.7C26.3,25.8,22.9,22.1,22.9,15.8z M43.9,13.9c0.2-1.3,0.4-2.6,0.4-3.8c0-5.2-2.7-8.5-8.5-8.5 c-5.3,0-9.3,3-10.7,10.2c-0.2,1.3-0.4,2.6-0.4,3.8c0,5.2,2.7,8.4,8.5,8.4C38.4,24.1,42.4,21.4,43.9,13.9z"/> <path id="XMLID_19_" d="M50.3,16c0-1.3,0.1-2.8,0.4-4.3C52.5,3,57.5,0,63.7,0c4.1,0,6.7,1.5,8.3,3.3l-1.4,1.1 c-1.5-1.7-3.7-2.8-7-2.8c-5.6,0-9.8,3-11.3,10.3c-0.3,1.3-0.4,2.7-0.4,3.9c0,5.1,2.7,8.2,8.3,8.2c3,0,5.1-0.7,6.8-2.1l1.1,1.3 c-2,1.6-4.4,2.5-8,2.5C53.6,25.8,50.3,22,50.3,16z"/> <path id="XMLID_17_" d="M73.8,18.9c0-1,0.2-2.1,0.4-3.1l3-15.4h1.6l-3.1,15.5c-0.2,1-0.3,2-0.3,2.8c0,3.2,1.6,5.4,7,5.4 c4.9,0,6.9-2.8,7.8-7.3l3.2-16.4h1.6l-3.3,16.8c-1,5-3.3,8.6-9.5,8.6C75.7,25.8,73.8,22.7,73.8,18.9z"/> <path id="XMLID_15_" d="M97.5,22.6l1-1.3c2.5,2,4.9,2.8,8.6,2.8c3.4,0,7.1-1.1,7.1-5.6c0-3.4-2.5-4-6.2-5.3 c-3.6-1.2-6.5-2.2-6.5-6.2c0-5.3,4-6.9,7.8-6.9c4.3,0,6.5,1.2,8.2,2.5l-1.1,1.3c-1.5-1.2-3.5-2.3-7.1-2.3c-3.1,0-6.1,1.2-6.1,5.2 c0,3,2.3,3.7,5.5,4.8c4.6,1.6,7.2,2.5,7.2,6.6c0,5.8-4.4,7.4-8.8,7.4C102.9,25.7,100.2,24.7,97.5,22.6z"/> </svg>';
    this.appendChild(this._focus);
    this._focusLetters = this._focus.findAll('path');
    this._maskFocus = new BaseDOM({
      className: 'mask'
    });
    this._maskFocus.html = '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 V 100 H 100 V 50 L0 0"/></svg>';
    this._focus.appendChild(this._maskFocus);
    this._fastback = new BaseDOM({
      className: 'fastback'
    });
    this._fastback.html = '<svg class="label" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="242px" height="29.3px" viewBox="0 0 242 29.3" style="enable-background:new 0 0 242 29.3;" xml:space="preserve"> <path id="XMLID_33_" d="M7,0.5h16.5L23,2.4H8.5L5.8,13.2h14.2l-0.4,1.9H5.3L1.9,28.9H0L7,0.5z"/> <path id="XMLID_30_" d="M39.4,0.3h2.9l3.6,28.7H43l-0.8-6.6H28.7l-4.1,6.6h-3.2L39.4,0.3z M41.9,19.6L40,4.2l-9.6,15.5H41.9z"/> <path id="XMLID_28_" d="M53.9,25.6l1.9-2.2c2.8,2.1,5.8,3.3,10.3,3.3c4,0,7.9-1.1,8.1-5.6c0.2-3.5-2.6-4.1-6.8-5.5 c-4.4-1.5-8-2.5-7.8-7.3C59.8,1.9,64.7,0,69.7,0c5.5,0,8.4,1.5,10.2,3l-2,2.3c-1.6-1.3-4.2-2.6-8.4-2.6c-3.6,0-6.8,1.2-7,5.2 c-0.1,3,2.5,3.8,6.1,5c5.3,1.7,8.7,2.8,8.5,7.6c-0.3,6.7-5.5,8.8-11.3,8.8C60.4,29.3,56.9,27.9,53.9,25.6z"/> <path id="XMLID_26_" d="M100.2,4.2h-9.9l0.9-3.7h23.6l-0.9,3.7H104l-6.4,24.7h-3.8L100.2,4.2z"/> <path id="XMLID_22_" d="M125.1,0.5h9.3c7.4,0,9.6,2.2,9.4,5.9c-0.2,4.8-2.3,7.3-5.2,7.9c1.8,0.7,2.7,2.7,2.5,5.3 c-0.4,7.4-4.3,9.3-10.8,9.3h-12.2L125.1,0.5z M131.4,24.8c3.3,0,5.3-1.3,5.5-5.1c0.1-2.1-1.2-3.1-4.8-3.1h-6.7l-2.1,8.2H131.4z M134.2,12.3c3.5,0,4.8-1.7,5-4.7c0.1-1.8-1-2.9-5.2-2.9h-5.7l-1.9,7.6H134.2z"/> <path id="XMLID_19_" d="M165.5,0.3h5.3l3,28.7h-5.3l-0.5-5.1h-11.9l-3.1,5.1h-5.7L165.5,0.3z M167.6,19.1l-1.2-11.8L159,19.1H167.6z"/> <path id="XMLID_17_" d="M184,18.2c0.1-1.5,0.3-3.2,0.7-5C187.3,2.8,193.2,0,199.4,0c6.3,0,8.9,2.3,10.4,4.5L205,8.6 c-1.1-1.7-3-2.8-6-2.8c-4.4,0-7.3,2.4-8.7,8.3c-0.3,1.2-0.5,2.3-0.5,3.3c-0.2,3.9,1.5,6.4,6.2,6.4c2.6,0,4.6-1,6.3-2.4l2.9,4.4 c-2.6,2.4-5.5,3.5-10,3.5C186.7,29.3,183.6,24.9,184,18.2z"/> <path id="XMLID_15_" d="M225.8,17.5l-3.5,3.8l-1.8,7.6h-6.8l6.8-28.5h6.8l-2.4,9.9l9-9.9h8.1l-10.5,11.3l4.7,17.2h-7.2L225.8,17.5z"/> </svg>';
    this.appendChild(this._fastback);
    this._fastbackLetters = this._fastback.findAll('path');
    this._maskFastback = new BaseDOM({
      className: 'mask'
    });
    this._maskFastback.html = '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 V 100 H 100 V 50 L0 0"/></svg>';
    this._fastback.appendChild(this._maskFastback);
    this._car = new BaseDOM({
      className: 'car'
    });
    this._car.html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="1963.1px" height="549.1px" viewBox="0 0 1963.1 549.1" style="enable-background:new 0 0 1963.1 549.1;" xml:space="preserve"> <g> <g> <path class="st0" d="M1536.9,229.8C1537,229.8,1537,229.8,1536.9,229.8L1536.9,229.8L1536.9,229.8C1537,229.8,1537,229.8,1536.9,229.8z"/> <path class="st0" d="M1493,256.3c0,0-344.1,0.5-365,0l-1.4,9.3c0,0,402.8,14.3,531.4,36.1c128.6,21.8,181.5,79.6,187.2,99.7c0,0,16.5-20.5,44.5-19.4c28,1.1,57.4,9.8,61.5,12.5l2.6-3c-43.7-27.9-84.3-23.6-112.4-39.1c-39.1-19.4-45.9-40.7-90.8-58c72.7-6.3,171.4,50,201.1,64c4.9,2.3,5.3,2.9,8.9-1.9c3.6-4.9,3.2-5.2-1.6-8.3c-16.5-10.7-60-31.9-82.4-40.2c-109.3-40.8-245.1-74.8-313.8-85.4C1476.3,209.2,1255.7,0,899.5,0c-322.7,0-540.9,204.5-833,204.5c-25.2,0-32.9,0-32.9,0l-3,20.1c-2.4,0.2,127.5,0,234,0c35.5,0,437.5,0,438.2,0l1.2-8.2l-346.4-5.8c0,0,283.3-189.9,564.6-189.9S1493,256.3,1493,256.3z"/> </g> <path class="st0" d="M381.9,382.8c-40.3,0-250.2-0.9-295,0c25.2-23.7,36.8-59,42.9-89c14-0.3,81.3,0,87.1,0 c2.4,0,7.2-37.1,48.7-37.1l0.2-2c-23.2-1.5-42,4.5-60.6,21.5c-5.2,4.8-13.2,4.8-19.9,4.6c-9.3-0.2-63.4,0-80.9,0 c-2.5,16.7-14.2,68.8-39.2,90.7c-17.4,15.2-45.1,31.3-50,63.4c-4.6,30.7-10.5,69.7-15,99.7C-2.2,551,10,549,30.9,549 c5.6-37.3,9.5-62.9,11.7-77.6c11.7-77.4,199.7-79.3,337.8-79.3C381.9,382.8,382.9,382.5,381.9,382.8 M208.5,287 C208.5,286.9,208.5,287,208.5,287L208.5,287z"/> <path class="st0" d="M107.3,261.3c12.3,0,6.4,0,76.6,0l2.6-17.1h-76.6C107.7,258.4,107.5,259.5,107.3,261.3z"/> <path class="st0" d="M1857.4,470.8c-56.6,0-55.9-137.7-231.8-137.7H1157l-1.8,12.2c0,0,322.1,0,468.6,0c146.5,0,165.3,116.7,152.5,202c15.6,0,167.8,0,168.2,0c0.1-0.5,1.7-11.1,1.7-11.6C1949.1,516.5,1934.3,470.8,1857.4,470.8z"/> </g> </svg>';
    this.appendChild(this._car);
    this._speedLines = new SpeedLines();
    this.appendChild(this._speedLines);
    this._speedLines.create({
      total: 8,
      width: this.width * 0.8,
      height: this.height,
      weight: 3,
      direction: -1
    });
    return this._speedLines.css({
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999999
    });
  };

  HomeLogoFastBack.prototype.showStart = function() {
    var len1, len2, letter, m, q, ref, ref1, results1;
    this._focus.css('width', '0');
    this._fastback.css('width', '0');
    TweenMax.set(this._car.element, {
      left: -150,
      opacity: 0
    });
    TweenMax.set(this._maskFocus.element, {
      y: 0
    });
    TweenMax.set(this._maskFastback.element, {
      y: 0
    });
    ref = this._focusLetters;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      letter = ref[m];
      TweenMax.set(letter, {
        x: 20,
        opacity: 0
      });
    }
    ref1 = this._fastbackLetters;
    results1 = [];
    for (q = 0, len2 = ref1.length; q < len2; q++) {
      letter = ref1[q];
      results1.push(TweenMax.set(letter, {
        x: 20,
        opacity: 0
      }));
    }
    return results1;
  };

  HomeLogoFastBack.prototype.show = function(factor, delay, callback) {
    if (factor == null) {
      factor = 0.8;
    }
    if (delay == null) {
      delay = 0;
    }
    TweenMax.to(this._car.element, 1 * factor, {
      left: 250,
      opacity: 1,
      ease: Quad.easeOut,
      onUpdate: (function(_this) {
        return function() {
          var value;
          value = _this._car.element.offsetLeft;
          if (value > 0) {
            _this._focus.css('width', value + 'px');
            return _this._fastback.css('width', value + 'px');
          }
        };
      })(this),
      onComplete: callback
    });
    TweenMax.to(this._maskFastback.element, 0.6 * factor, {
      y: '200%',
      delay: 0.3 * factor,
      ease: Quad.easeOut
    });
    TweenMax.staggerTo(this._fastbackLetters, 0.3 * factor, {
      x: 0,
      opacity: 1,
      delay: 0.3 * factor
    }, 0.08 * factor);
    TweenMax.to(this._maskFocus.element, 0.6 * factor, {
      y: '200%',
      delay: 0.4 * factor,
      ease: Quad.easeOut
    });
    TweenMax.staggerTo(this._focusLetters, 0.3 * factor, {
      x: 0,
      opacity: 1,
      delay: 0.4 * factor
    }, 0.08 * factor);
    return this._speedLines.play({
      delay: 0,
      stagger: 0.02
    });
  };

  HomeLogoFastBack.prototype.destroy = function() {
    TweenMax.killTweensOf(this._car.element);
    TweenMax.killTweensOf(this._maskFastback.element);
    TweenMax.killTweensOf(this._fastbackLetters);
    TweenMax.killTweensOf(this._maskFocus.element);
    TweenMax.killTweensOf(this._focusLetters);
    this._focus = null;
    this._focusLetters = null;
    this._maskFocus = null;
    this._fastback = null;
    this._fastbackLetters = null;
    this._maskFastback = null;
    this._car = null;
    this._speedLines = null;
    delete this._focus;
    delete this._focusLetters;
    delete this._maskFocus;
    delete this._fastback;
    delete this._fastbackLetters;
    delete this._maskFastback;
    delete this._car;
    return delete this._speedLines;
  };

  return HomeLogoFastBack;

})(BaseDOM);

HomeView = (function(superClass) {
  extend(HomeView, superClass);

  function HomeView() {
    this.resize = bind(this.resize, this);
    this.destroy = bind(this.destroy, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    this.create = bind(this.create, this);
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._buildMobile();
    this._cover = new BaseDOM({
      className: 'cover'
    });
    this._cover.css('backgroundImage', 'url(' + this.loader.getResult(this.content.cover.steps[0].image.id).src + ')');
    this.appendChild(this._cover);
    this._logo = new HomeLogoFastBack();
    this._cover.appendChild(this._logo);
    this._logo.create();
    this._logoWidth = this._logo.width;
    this._shadow = new BaseDOM({
      className: 'shadow'
    });
    this._shadow.css('backgroundImage', 'url(' + this.loader.getResult(this.content.cover.steps[0].shadowLogo.id).src + ')');
    this._cover.appendChild(this._shadow);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._description.html = this.content.cover.steps[0].description;
    this._cover.appendChild(this._description);
    this._descLines = new SplitText(this._description.element, {
      type: "lines"
    });
    this._mainMenu = new MainMenu(app.container.content.menu);
    this._cover.appendChild(this._mainMenu);
    this._mainMenu.create();
    this.resize(app.resizer.data);
    app.resizer.on(Resizer.RESIZE, this.resize);
    return HomeView.__super__.create.apply(this, arguments);
  };

  HomeView.prototype.showStart = function(evt) {
    var len1, line, m, ref;
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().hideStart();
    this._mainMenu.showStart();
    this._logo.showStart();
    ref = this._descLines.lines;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      line = ref[m];
      TweenMax.set(line, {
        y: 20,
        opacity: 0
      });
    }
    return HomeView.__super__.showStart.apply(this, arguments);
  };

  HomeView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().hide(null, (function(_this) {
      return function() {
        _this._logo.show(null, null, function() {
          TweenMax.staggerTo(_this._descLines.lines, 0.4, {
            y: 0,
            opacity: 1,
            ease: Quart.easeOut
          }, 0.07);
          return _this._mainMenu.show();
        });
        return HomeView.__super__.show.apply(_this, arguments);
      };
    })(this));
  };

  HomeView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().showStart();
    return HomeView.__super__.hideStart.apply(this, arguments);
  };

  HomeView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().show(null, (function(_this) {
      return function() {
        return HomeView.__super__.hide.apply(_this, arguments);
      };
    })(this));
  };

  HomeView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.created) {
      TweenMax.killTweensOf(this._descLines.lines);
      TweenMax.killTweensOf(this._logo.element);
      this._cover = null;
      this._logo.destroy();
      this._logo = null;
      this._logoWidth = null;
      this._shadow = null;
      this._description = null;
      this._descLines = null;
      this._mainMenu.destroy();
      this._mainMenu = null;
      this._mobile = null;
      this._bannerMobile.destroy();
      this._bannerMobile = null;
      this._featureMobile.destroy();
      this._featureMobile = null;
      delete this._cover;
      delete this._logo;
      delete this._logoWidth;
      delete this._shadow;
      delete this._description;
      delete this._descLines;
      delete this._mainMenu;
      delete this._mobile;
      delete this._bannerMobile;
      delete this._featureMobile;
      app.resizer.off(Resizer.RESIZE, this.resize);
    }
    return HomeView.__super__.destroy.apply(this, arguments);
  };

  HomeView.prototype.resize = function(data) {
    return TweenMax.set(this._logo.element, {
      scale: data.width / app.container.content.fullSize
    });
  };

  HomeView.prototype._buildMobile = function() {
    this._mobile = new BaseDOM({
      className: 'home-mobile'
    });
    this.appendChild(this._mobile);
    this._bannerMobile = new HomeBannerMobile(this.content.cover.steps[0]);
    this._mobile.appendChild(this._bannerMobile);
    this._bannerMobile.create();
    this._featureMobile = new HomeFeatureItem(this.content.origin);
    this._mobile.appendChild(this._featureMobile);
    return this._featureMobile.create();
  };

  return HomeView;

})(BaseLoaderView);

InternalFeatureItem = (function(superClass) {
  extend(InternalFeatureItem, superClass);

  function InternalFeatureItem(data, i, side, debug) {
    if (side == null) {
      side = 'left';
    }
    if (debug == null) {
      debug = false;
    }
    this.resize = bind(this.resize, this);
    this.hide = bind(this.hide, this);
    this.show = bind(this.show, this);
    InternalFeatureItem.__super__.constructor.call(this);
    this.addClass('feature-item ' + side);
    this._data = data;
    this._side = side;
    this._index = i;
    this._tagImg = app.loader.getResult(this._data.image.id);
    this._masterWidth = data.baseWidth || 1920;
    this._imageW = this._tagImg.width / this._masterWidth;
    this._imageH = (this._tagImg.height / this._tagImg.width) * this._imageW;
    this._gap = {
      w: 0,
      h: 50
    };
    this._opened = null;
    this._debug = debug;
  }

  InternalFeatureItem.prototype.create = function() {
    InternalFeatureItem.__super__.create.apply(this, arguments);
    if (this._data['class']) {
      this.addClass(this._data['class']);
    }
    this._image = new InternalFeatureImage(this._tagImg, this._gap);
    this.appendChild(this._image);
    this._image.create();
    this._text = new InternalFeatureText(this._data);
    this.appendChild(this._text);
    this._text.create();
    if (app.dd.mobile || app.dd.tablet) {
      return this.show(0.1);
    } else {
      return this.hide(0);
    }
  };

  InternalFeatureItem.prototype.update = function(top, percent) {
    if (percent > 0.6) {
      this.show();
    }
    this._image.update(percent);
    if (1 - (this._index % 2)) {
      TweenMax.to(this._image.element, 1, {
        y: 100 - (100 * percent),
        force3D: true
      });
    } else {
      TweenMax.to(this._image.element, 1, {
        y: 40 - (40 * percent),
        force3D: true
      });
    }
    if (this._side !== 'left') {
      TweenMax.to(this._text.title.element, 1, {
        y: 300 - (300 * percent)
      });
    } else {
      TweenMax.to(this._text.title.element, 1, {
        y: 300 - (300 * percent)
      });
    }
    return TweenMax.to(this._text.description.element, 1, {
      y: 250 - (250 * percent)
    });
  };

  InternalFeatureItem.prototype.show = function(factor) {
    if (factor == null) {
      factor = 0.75;
    }
    if (this._opened === true) {
      return;
    }
    this._opened = true;
    this._image.show(factor, this._side);
    return this._text.show(factor, 0.6);
  };

  InternalFeatureItem.prototype.hide = function(factor) {
    if (factor == null) {
      factor = 1;
    }
    if (this._opened === false) {
      return;
    }
    this._opened = false;
    this._image.hide(factor);
    return this._text.hide(factor, 1.5);
  };

  InternalFeatureItem.prototype.resize = function() {
    var height, width;
    width = Math.min(this._imageW * window.innerWidth, this._tagImg.width);
    height = Math.min(this._imageH * window.innerWidth, this._tagImg.height);
    this.css('width', (width - this._gap.w) + 'px');
    this.css('height', (height - this._gap.h) + 'px');
    this._image.resize();
    return InternalFeatureItem.__super__.resize.apply(this, arguments);
  };

  return InternalFeatureItem;

})(BaseScrollItem);

InternalFeatureImage = (function(superClass) {
  extend(InternalFeatureImage, superClass);

  function InternalFeatureImage(image, gap) {
    this.destroy = bind(this.destroy, this);
    this.resize = bind(this.resize, this);
    this.update = bind(this.update, this);
    this.hide = bind(this.hide, this);
    this.show = bind(this.show, this);
    InternalFeatureImage.__super__.constructor.call(this, {
      className: 'feature-image'
    });
    this._imageTag = image;
    this._isOpened = null;
    this._gap = gap;
  }

  InternalFeatureImage.prototype.create = function() {
    this._line = new BaseDOM({
      className: 'line'
    });
    this.appendChild(this._line);
    this._container = new BaseDOM({
      className: 'image-container'
    });
    this.appendChild(this._container);
    this._maskTop = new BaseDOM({
      className: 'mask top'
    });
    this._container.appendChild(this._maskTop);
    this._imageTop = new BaseDOM({
      className: 'image'
    });
    this._imageTop.css('backgroundImage', 'url(' + this._imageTag.src + ')');
    this._maskTop.appendChild(this._imageTop);
    this._maskBottom = new BaseDOM({
      className: 'mask bottom'
    });
    this._container.appendChild(this._maskBottom);
    this._imageBottom = new BaseDOM({
      className: 'image'
    });
    this._imageBottom.css('backgroundImage', 'url(' + this._imageTag.src + ')');
    return this._maskBottom.appendChild(this._imageBottom);
  };

  InternalFeatureImage.prototype.show = function(factor, side) {
    if (factor == null) {
      factor = 1;
    }
    if (side == null) {
      side = 'left';
    }
    if (this._isOpened === true) {
      return;
    }
    this._isOpened = true;
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._imageTop.element);
    TweenMax.killTweensOf(this._imageBottom.element);
    if (side === 'left') {
      this._line.css('left', '0');
      this._line.css('right', 'auto');
    } else {
      this._line.css('left', 'auto');
      this._line.css('right', '0');
    }
    TweenMax.to(this._line.element, 0.5 * factor, {
      width: '100%',
      ease: Quad.easeIn,
      onComplete: (function(_this) {
        return function() {
          if (side === 'left') {
            _this._line.css('left', 'auto');
            _this._line.css('right', '0');
          } else {
            _this._line.css('left', '0');
            _this._line.css('right', 'auto');
          }
          return TweenMax.to(_this._line.element, 0.3 * factor, {
            width: '0',
            ease: Quad.easeOut
          });
        };
      })(this)
    });
    TweenMax.to(this._imageTop.element, 0.9 * factor, {
      top: '0',
      ease: Expo.easeOut,
      delay: 0.45 * factor
    });
    return TweenMax.to(this._imageBottom.element, 0.9 * factor, {
      bottom: '0',
      ease: Expo.easeOut,
      delay: 0.48 * factor
    });
  };

  InternalFeatureImage.prototype.hide = function(factor) {
    if (factor == null) {
      factor = 1;
    }
    if (this._isOpened === false) {
      return;
    }
    this._isOpened = false;
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._imageTop.element);
    TweenMax.killTweensOf(this._imageBottom.element);
    this._line.css('left', '0');
    this._line.css('right', 'auto');
    return TweenMax.to(this._line.element, 0.4 * factor, {
      width: '100%',
      onComplete: (function(_this) {
        return function() {
          _this._line.css('left', 'auto');
          _this._line.css('right', '0');
          TweenMax.to(_this._line.element, 0.4 * factor, {
            width: '0%'
          });
          TweenMax.to(_this._imageTop.element, 0.4 * factor, {
            top: '105%',
            delay: 0.2 * factor
          });
          return TweenMax.to(_this._imageBottom.element, 0.4 * factor, {
            bottom: '105%',
            delay: 0.3 * factor
          });
        };
      })(this)
    });
  };

  InternalFeatureImage.prototype.update = function(percent) {
    return TweenMax.set(this._container.element, {
      y: -percent * this._gap.h / 2,
      force3D: true
    });
  };

  InternalFeatureImage.prototype.resize = function() {
    this._container.css('width', (this.width + this._gap.w) + 'px');
    return this._container.css('height', (this.height + this._gap.h) + 'px');
  };

  InternalFeatureImage.prototype.destroy = function() {
    var k, ref, results1, v;
    TweenMax.killTweensOf(this._line.element);
    TweenMax.killTweensOf(this._imageTop.element);
    TweenMax.killTweensOf(this._imageBottom.element);
    results1 = [];
    for (k in this) {
      v = this[k];
      if (v != null) {
        if (typeof v.destroy === "function") {
          v.destroy();
        }
      }
      if (v != null) {
        if (typeof v.off === "function") {
          v.off();
        }
      }
      if (v != null) {
        if ((ref = v.element) != null) {
          if (typeof ref.off === "function") {
            ref.off();
          }
        }
      }
      results1.push(v = null);
    }
    return results1;
  };

  return InternalFeatureImage;

})(BaseDOM);

InternalFeatureText = (function(superClass) {
  extend(InternalFeatureText, superClass);

  function InternalFeatureText(data) {
    this.hide = bind(this.hide, this);
    this.show = bind(this.show, this);
    InternalFeatureText.__super__.constructor.call(this, {
      className: 'feature-text'
    });
    this._data = data;
    this._isOpened = null;
  }

  InternalFeatureText.get({
    title: function() {
      return this._title;
    }
  });

  InternalFeatureText.get({
    description: function() {
      return this._description;
    }
  });

  InternalFeatureText.prototype.create = function() {
    this._title = new BaseDOM({
      className: 'title'
    });
    this._title.html = '<span class="hidden-text">' + this._data.title + '</span>';
    this.appendChild(this._title);
    this._labelTitle = new BaseDOM({
      className: 'label'
    });
    this._labelTitle.text = this._data.title;
    this._title.appendChild(this._labelTitle);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._description.html = '<span class="hidden-text">' + this._data.description + '</span>';
    this.appendChild(this._description);
    this._labelDescription = new BaseDOM({
      className: 'label'
    });
    this._labelDescription.text = this._data.description;
    return this._description.appendChild(this._labelDescription);
  };

  InternalFeatureText.prototype.show = function(factor, delay) {
    if (factor == null) {
      factor = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    if (this._isOpened === true) {
      return;
    }
    this._isOpened = true;
    TweenMax.to(this._labelTitle.element, 0.6 * factor, {
      top: '0%',
      delay: delay * factor,
      ease: Expo.easeOut
    });
    return TweenMax.to(this._labelDescription.element, 0.6 * factor, {
      top: '0%',
      delay: (delay + 0.1) * factor,
      ease: Expo.easeOut
    });
  };

  InternalFeatureText.prototype.hide = function(factor, delay) {
    if (factor == null) {
      factor = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    if (this._isOpened === false) {
      return;
    }
    this._isOpened = false;
    TweenMax.to(this._labelTitle.element, 0.6 * factor, {
      top: '105%',
      delay: delay * factor
    });
    return TweenMax.to(this._labelDescription.element, 0.6 * factor, {
      top: '-105%',
      delay: (delay + 0.1) * factor
    });
  };

  return InternalFeatureText;

})(BaseDOM);

InternalView = (function(superClass) {
  extend(InternalView, superClass);

  function InternalView() {
    this._onCoverClicked = bind(this._onCoverClicked, this);
    this._onProgress = bind(this._onProgress, this);
    this._onPaused = bind(this._onPaused, this);
    this._onPlay = bind(this._onPlay, this);
    this._ytVideoCreated = bind(this._ytVideoCreated, this);
    this._createYoutubeVideo = bind(this._createYoutubeVideo, this);
    this._snapToClosest = bind(this._snapToClosest, this);
    this._gotoFirstFeature = bind(this._gotoFirstFeature, this);
    this._scroll = bind(this._scroll, this);
    this._resize = bind(this._resize, this);
    this._onDOMChanged = bind(this._onDOMChanged, this);
    this.destroy = bind(this.destroy, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.showComplete = bind(this.showComplete, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    this.createComplete = bind(this.createComplete, this);
    this.create = bind(this.create, this);
    this.createStart = bind(this.createStart, this);
    return InternalView.__super__.constructor.apply(this, arguments);
  }

  InternalView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.addClass('internal-view');
    return InternalView.__super__.createStart.apply(this, arguments);
  };

  InternalView.prototype.create = function(evt) {
    var feature, i, imagePos, imageTag, item, len1, m, ref, side;
    if (evt == null) {
      evt = null;
    }
    this._lazyUpdate = null;
    this._lazyScroll = null;
    this._yt = YoutubeController.getInstance();
    this._scrollController = ScrollController.getInstance();
    imageTag = this.loader.getResult(this.content.cover.image.id);
    imagePos = {};
    this._wrapper = new BaseDOM({
      element: app.masterWrapper
    });
    this._header = new BaseDOM({
      className: 'header'
    });
    this.appendChild(this._header);
    this._image = new BaseDOM({
      className: 'carPhoto'
    });
    this._header.appendChild(this._image);
    if (!imageTag) {
      imageTag = this.loader.getResult(this.content.cover.imageMobile.id);
      imagePos = this.content.cover.imageMobile.position;
    } else {
      imageTag = this.loader.getResult(this.content.cover.image.id);
      imagePos = this.content.cover.image.position;
    }
    this._image.css('backgroundImage', 'url(' + imageTag.src + ')');
    if (imagePos) {
      this._image.css('backgroundPosition', imagePos);
    }
    this._textContent = new BaseDOM({
      className: 'text-content'
    });
    this._header.appendChild(this._textContent);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._title.text = this.content.cover.title;
    this._textContent.appendChild(this._title);
    this._titleLetters = new SplitText(this._title.element, {
      type: "chars"
    });
    this._titleBorder = new BaseDOM({
      className: 'border'
    });
    this._title.appendChild(this._titleBorder);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._description.text = this.content.cover.description;
    this._textContent.appendChild(this._description);
    this._descLines = new SplitText(this._description.element, {
      type: "lines"
    });
    this._mainMenu = new MainMenu(app.container.content.menu);
    this._header.appendChild(this._mainMenu);
    this._mainMenu.create();
    this._scrollIcon = new ScrollIcon(app.container.content.internal.scrollIcon);
    this._header.appendChild(this._scrollIcon);
    this._scrollIcon.create();
    this._scrollIcon.element.on('click', this._gotoFirstFeature);
    this._torso = new BaseDOM({
      className: 'torso'
    });
    this.appendChild(this._torso);
    this._features = [];
    ref = this.content.features;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      side = i % 2 === 0 ? 'left' : 'right';
      feature = new InternalFeatureItem(item, i, side, i === 0);
      this._torso.appendChild(feature);
      this._features.push(feature);
      feature.create();
    }
    if (this.content.youtube && this.content.youtube.videoId && true) {
      this._youtubeWrapper = new BaseDOM({
        className: 'youtube-wrapper'
      });
      this._youtubeWrapper.css('height', window.innerHeight + 'px');
      this.appendChild(this._youtubeWrapper);
      this._youtubeFrame = new BaseDOM({
        className: 'frame'
      });
      this._youtubeWrapper.appendChild(this._youtubeFrame);
      this._playIcon = new SquarePlay();
      this._youtubeWrapper.appendChild(this._playIcon);
      this._playIcon.create();
    }
    if (!app.dd.mobile && !app.dd.tablet) {
      this._scrollController.activate();
    }
    this._scrollController.addObserver(this._scroll);
    this._wrapper.element.on('DOMSubtreeModified', this._onDOMChanged);
    app.resizer.on(Resizer.RESIZE, this._resize);
    this._resize();
    return InternalView.__super__.create.apply(this, arguments);
  };

  InternalView.prototype.createComplete = function() {
    return InternalView.__super__.createComplete.apply(this, arguments);
  };

  InternalView.prototype.showStart = function(evt) {
    var i, len1, len2, line, m, q, ref, ref1, tLetter;
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().hideStart();
    this._mainMenu.showStart();
    this._titleBorder.removeClass('right');
    TweenMax.to(this._titleBorder.element, 0.5, {
      width: '0%'
    });
    ref = this._titleLetters.chars;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      tLetter = ref[i];
      TweenMax.set(tLetter, {
        x: 20,
        opacity: 0
      });
    }
    ref1 = this._descLines.lines;
    for (q = 0, len2 = ref1.length; q < len2; q++) {
      line = ref1[q];
      TweenMax.set(line, {
        y: 20,
        opacity: 0,
        force3D: false
      });
    }
    return InternalView.__super__.showStart.apply(this, arguments);
  };

  InternalView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().hide(1, (function(_this) {
      return function() {
        TweenMax.to(_this._titleBorder.element, 0.3, {
          width: '100%',
          ease: Quad.easeIn,
          onComplete: function() {
            _this._titleBorder.addClass('right');
            return TweenMax.to(_this._titleBorder.element, 0.3, {
              width: '0%',
              ease: Quad.easeOut
            });
          }
        });
        return TweenMax.staggerTo(_this._titleLetters.chars, 0.3, {
          x: 0,
          opacity: 1,
          ease: Quad.easeOut
        }, 0.05, function() {
          _this._mainMenu.show();
          return TweenMax.staggerTo(_this._descLines.lines, 0.3, {
            y: 0,
            opacity: 1,
            force3D: false
          }, 0.1, function() {
            _this._descLines.revert();
            return setTimeout(function() {
              return InternalView.__super__.show.call(_this);
            }, 500);
          });
        });
      };
    })(this));
  };

  InternalView.prototype.showComplete = function() {
    this._createYoutubeVideo();
    return InternalView.__super__.showComplete.apply(this, arguments);
  };

  InternalView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().showStart();
    return InternalView.__super__.hideStart.apply(this, arguments);
  };

  InternalView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    console.log('HIDE', this.id);
    return PageTransition.getInstance().show(null, (function(_this) {
      return function() {
        return InternalView.__super__.hide.apply(_this, arguments);
      };
    })(this));
  };

  InternalView.prototype.destroy = function(evt) {
    var item, len1, len2, len3, letter, line, m, q, ref, ref1, ref2, ref3, s;
    if (evt == null) {
      evt = null;
    }
    if (this.created) {
      if (this._lazyUpdate) {
        clearInterval(this._lazyUpdate);
      }
      if (this._lazyScroll) {
        clearInterval(this._lazyScroll);
      }
      this._scrollController.deactivate();
      this._scrollController.removeObserver(this._scroll);
      app.resizer.off(Resizer.RESIZE, this._resize);
      this._wrapper.element.off('DOMSubtreeModified', this._onDOMChanged);
      if (this._youtubePlayer) {
        this._youtubePlayer.off(BaseMediaPlayer.PLAYING, this._onPlay);
        this._youtubePlayer.off(BaseMediaPlayer.PAUSED, this._onPaused);
        this._youtubePlayer.off(BaseMediaPlayer.PROGRESS, this._onProgress);
      }
      ref = this._titleLetters.chars;
      for (m = 0, len1 = ref.length; m < len1; m++) {
        letter = ref[m];
        TweenMax.killTweensOf(letter);
      }
      ref1 = this._descLines.lines;
      for (q = 0, len2 = ref1.length; q < len2; q++) {
        line = ref1[q];
        TweenMax.killTweensOf(line);
      }
      TweenMax.killTweensOf(this._titleBorder.element);
      TweenMax.killTweensOf(this._titleLetters.chars);
      TweenMax.killTweensOf(this._descLines.lines);
      ref2 = this._features;
      for (s = 0, len3 = ref2.length; s < len3; s++) {
        item = ref2[s];
        item.destroy();
        item = null;
      }
      if (this._youtubeFrame) {
        this._youtubeFrame.element.off('click', this._onCoverClicked);
        this._youtubeFrame = null;
        delete this._youtubeFrame;
      }
      this._lazyUpdate = null;
      this._lazyScroll = null;
      this._yt = null;
      this._scrollController = null;
      this._wrapper = null;
      this._header = null;
      this._textContent = null;
      this._title = null;
      this._titleLetters = null;
      this._titleBorder = null;
      this._description = null;
      this._descLines = null;
      this._mainMenu.destroy();
      this._mainMenu = null;
      this._scrollIcon.destroy();
      this._scrollIcon = null;
      this._torso = null;
      this._youtubeWrapper = null;
      this._youtubeFrame = null;
      if ((ref3 = this._playIcon) != null) {
        ref3.destroy();
      }
      this._playIcon = null;
      delete this._lazyUpdate;
      delete this._lazyScroll;
      delete this._yt;
      delete this._scrollController;
      delete this._wrapper;
      delete this._header;
      delete this._textContent;
      delete this._title;
      delete this._titleLetters;
      delete this._titleBorder;
      delete this._description;
      delete this._descLines;
      delete this._mainMenu;
      delete this._scrollIcon;
      delete this._torso;
      delete this._youtubeWrapper;
      delete this._youtubeFrame;
      delete this._playIcon;
    }
    return InternalView.__super__.destroy.apply(this, arguments);
  };

  InternalView.prototype._onDOMChanged = function(e) {
    if (this._lazyUpdate) {
      clearInterval(this._lazyUpdate);
    }
    if (this._scrollController) {
      return this._lazyUpdate = setTimeout(this._scrollController.resize, 60);
    }
  };

  InternalView.prototype._resize = function(e) {
    var item, len1, m, ref, ref1;
    if ((ref = this._scrollController) != null) {
      ref.resize();
    }
    ref1 = this._features;
    for (m = 0, len1 = ref1.length; m < len1; m++) {
      item = ref1[m];
      item.resize();
    }
    return this._checkScrollIconTop();
  };

  InternalView.prototype._scroll = function(top) {
    var y;
    y = Math.max(0, Math.min(Math.abs(Math.min(0, this._image.top)) / this._image.height, 1)) * 10;
    TweenMax.set(this._image.element, {
      y: y + '%',
      force3D: true
    });
    this._checkScrollIconTop(top);
    if (this._lazyScroll) {
      clearInterval(this._lazyScroll);
    }
    return this._lazyScroll = setTimeout((function(_this) {
      return function() {
        return _this._snapToClosest(top);
      };
    })(this), 300);
  };

  InternalView.prototype._gotoFirstFeature = function(e) {
    return this._scrollController.scrollTo(this._features[0].end);
  };

  InternalView.prototype._snapToClosest = function(top) {
    var current, distance, end, feature, i, lastItem, len1, m, ref, value;
    current = {
      dist: window.innerHeight * 0.5,
      obj: false
    };
    lastItem = this._youtubeWrapper ? this._youtubeWrapper : this._features[this._features.length - 1];
    ref = this._features;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      feature = ref[i];
      value = feature.end - top;
      distance = Math.abs(value);
      if (value < current.dist) {
        if (i === 0 && value > 0) {
          return;
        }
        if (lastItem === feature && value < 0) {
          return;
        }
        current.dist = distance;
        current.obj = feature;
      }
    }
    if (this._youtubeWrapper) {
      end = this._youtubeWrapper.top + this._youtubeWrapper.height + top - window.innerHeight;
      value = end - top;
      distance = Math.abs(value);
      if (value < current.dist) {
        if (value < 0) {
          return;
        }
        current.dist = value;
        current.obj = {
          end: end
        };
      }
    }
    if (current.obj && current.dist > 10) {
      return this._scrollController.scrollTo(current.obj.end);
    }
  };

  InternalView.prototype._checkScrollIconTop = function() {
    var headerY, screenY;
    headerY = this._header.height;
    screenY = window.innerHeight - this._header.top;
    return this._scrollIcon.css('top', Math.min(headerY, screenY) + 'px');
  };

  InternalView.prototype._createYoutubeVideo = function() {
    if (this._youtubeWrapper) {
      if (!app.dd.mobile && !app.dd.tablet) {
        this._playIcon.css('display', 'none');
        return this._yt.createPlayer(this._youtubeFrame.element, {
          videoId: this.content.youtube.videoId
        }, this._ytVideoCreated);
      } else {
        this._youtubeFrame.css('background-image', 'url(' + this._yt.getCover(this.content.youtube.videoId, 'max') + ')');
        return this._youtubeFrame.element.on('click', this._onCoverClicked);
      }
    }
  };

  InternalView.prototype._ytVideoCreated = function(player) {
    this._youtubePlayer = player;
    this._youtubePlayer.on(BaseMediaPlayer.PLAYING, this._onPlay);
    this._youtubePlayer.on(BaseMediaPlayer.PAUSED, this._onPaused);
    return this._youtubePlayer.on(BaseMediaPlayer.PROGRESS, this._onProgress);
  };

  InternalView.prototype._onPlay = function(e) {
    return this._scrollController.scrollTo(this._youtubeWrapper.top + this._scrollController.getScrollTop(), 0);
  };

  InternalView.prototype._onPaused = function(e) {};

  InternalView.prototype._onProgress = function(e, progress) {};

  InternalView.prototype._onCoverClicked = function(e) {
    return window.open('https://www.youtube.com/watch?v=' + this.content.youtube.videoId);
  };

  return InternalView;

})(BaseLoaderView);

VersionsHeader = (function(superClass) {
  extend(VersionsHeader, superClass);

  function VersionsHeader(data) {
    this.destroy = bind(this.destroy, this);
    this.showStart = bind(this.showStart, this);
    VersionsHeader.__super__.constructor.call(this, {
      className: 'header-versions'
    });
    this._data = data;
  }

  VersionsHeader.prototype.create = function() {
    this.css('backgroundImage', 'url(' + app.loader.getResult(this._data.image.id).src + ')');
    this._textContainer = new BaseDOM({
      className: 'text-container'
    });
    this.appendChild(this._textContainer);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._textContainer.appendChild(this._title);
    this._titleLabel = new BaseDOM({
      className: 'label'
    });
    this._titleLabel.html = this._data.title;
    this._title.appendChild(this._titleLabel);
    this._titleLetters = new SplitText(this._titleLabel.element, {
      type: "chars"
    });
    this._titleBorder = new BaseDOM({
      className: 'border'
    });
    this._titleLabel.appendChild(this._titleBorder);
    this._car = new BaseDOM({
      className: 'car'
    });
    this._car.css('backgroundImage', 'url(' + app.loader.getResult(this._data.car.id).src + ')');
    return this.appendChild(this._car);
  };

  VersionsHeader.prototype.showStart = function() {
    var i, len1, m, ref, results1, tLetter;
    this._titleBorder.removeClass('right');
    TweenMax.set(this._titleBorder.element, {
      width: '0%'
    });
    ref = this._titleLetters.chars;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      tLetter = ref[i];
      results1.push(TweenMax.set(tLetter, {
        x: 20,
        opacity: 0
      }));
    }
    return results1;
  };

  VersionsHeader.prototype.show = function(factor, delay, callback) {
    if (factor == null) {
      factor = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    TweenMax.to(this._titleBorder.element, 0.4, {
      width: '100%',
      ease: Quad.easeIn,
      onComplete: (function(_this) {
        return function() {
          _this._titleBorder.addClass('right');
          return TweenMax.to(_this._titleBorder.element, 0.4, {
            width: '0%',
            ease: Quad.easeOut
          });
        };
      })(this)
    });
    TweenMax.staggerTo(this._titleLetters.chars, 0.4, {
      x: 0,
      opacity: 1,
      force3D: false,
      ease: Quad.easeOut
    }, 0.05);
    return typeof callback === "function" ? callback() : void 0;
  };

  VersionsHeader.prototype.destroy = function() {
    TweenMax.killTweensOf(this._titleBorder.element);
    TweenMax.killTweensOf(this._car.element);
    TweenMax.killTweensOf(this._titleLetters.chars);
    this._textContainer = null;
    this._title = null;
    this._titleLabel = null;
    this._titleLetters = null;
    this._titleBorder = null;
    this._car = null;
    delete this._textContainer;
    delete this._title;
    delete this._titleLabel;
    delete this._titleLetters;
    delete this._titleBorder;
    return delete this._car;
  };

  return VersionsHeader;

})(BaseDOM);

VersionsList = (function(superClass) {
  extend(VersionsList, superClass);

  function VersionsList(list) {
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    VersionsList.__super__.constructor.call(this, {
      className: 'list-versions'
    });
    this._list = list;
  }

  VersionsList.prototype.create = function() {
    var data, len1, m, ref, results1, version;
    this._itens = [];
    ref = this._list;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      data = ref[m];
      version = new VersionsListItem(data);
      this._itens.push(version);
      this.appendChild(version);
      results1.push(version.create());
    }
    return results1;
  };

  VersionsList.prototype.showStart = function() {
    var item, len1, m, ref, results1;
    ref = this._itens;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      results1.push(item.showStart());
    }
    return results1;
  };

  VersionsList.prototype.show = function() {
    var i, item, len1, m, ref, results1;
    ref = this._itens;
    results1 = [];
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      results1.push(item.show(null, i * 0.1));
    }
    return results1;
  };

  VersionsList.prototype.destroy = function() {
    var item, len1, m, ref;
    ref = this._itens;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      item.destroy();
    }
    this._list.length = 0;
    this._list = null;
    return delete this._list;
  };

  return VersionsList;

})(BaseDOM);

VersionsListItem = (function(superClass) {
  extend(VersionsListItem, superClass);

  function VersionsListItem(data) {
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    VersionsListItem.__super__.constructor.call(this, {
      className: 'version-item'
    });
    this._data = data;
  }

  VersionsListItem.prototype.create = function() {
    var detail, item, len1, m, ref, results1;
    this._carName = new BaseDOM({
      className: 'car'
    });
    this._carName.html = this._data.car;
    this.appendChild(this._carName);
    this._type = new BaseDOM({
      className: 'type'
    });
    this._type.html = this._data.type;
    this.appendChild(this._type);
    this._divider = new BaseDOM({
      className: 'divider'
    });
    this.appendChild(this._divider);
    this._list = new BaseDOM({
      element: 'ul',
      className: 'list-itens'
    });
    this.appendChild(this._list);
    this._details = [];
    ref = this._data.details;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      detail = ref[m];
      item = new BaseDOM({
        element: 'li'
      });
      item.html = this._removeLineBreaks(detail);
      this._list.appendChild(item);
      results1.push(this._details.push(item));
    }
    return results1;
  };

  VersionsListItem.prototype.showStart = function() {
    var item, len1, m, ref, results1;
    this._divider.css('width', 0);
    this._divider.css('left', 0);
    this._divider.css('right', 'auto');
    TweenMax.set(this._carName.element, {
      x: -40,
      opacity: 0
    });
    TweenMax.set(this._type.element, {
      x: -40,
      opacity: 0
    });
    ref = this._details;
    results1 = [];
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      results1.push(TweenMax.set(item.element, {
        x: -40,
        opacity: 0
      }));
    }
    return results1;
  };

  VersionsListItem.prototype.show = function(factor, delay) {
    if (factor == null) {
      factor = 1;
    }
    if (delay == null) {
      delay = 0;
    }
    return TweenMax.to(this._divider.element, 0.4, {
      width: '100%',
      ease: Quad.easeIn,
      delay: delay,
      onComplete: (function(_this) {
        return function() {
          var i, item, len1, m, ref, results1;
          _this._divider.css('left', 'auto');
          _this._divider.css('right', '0');
          TweenMax.to(_this._divider.element, 0.4, {
            width: '0%',
            ease: Quad.easeOut,
            delay: delay,
            onComplete: function() {
              _this._divider.css('left', '0');
              _this._divider.css('right', 'auto');
              return TweenMax.to(_this._divider.element, 0.2, {
                width: 12,
                delay: delay,
                ease: Quad.easeOut
              });
            }
          });
          TweenMax.to(_this._carName.element, 0.8, {
            x: 0,
            opacity: 1,
            delay: delay + 0.05,
            ease: Expo.easeOut
          });
          TweenMax.to(_this._type.element, 0.8, {
            x: 0,
            opacity: 1,
            delay: delay,
            ease: Expo.easeOut
          });
          ref = _this._details;
          results1 = [];
          for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
            item = ref[i];
            results1.push(TweenMax.to(item.element, 0.8, {
              x: 0,
              opacity: 1,
              delay: delay + (i * 0.05),
              ease: Expo.easeOut
            }));
          }
          return results1;
        };
      })(this)
    });
  };

  VersionsListItem.prototype.destroy = function() {
    var detail, item, len1, len2, m, q, ref, ref1;
    TweenMax.killTweensOf(this._divider.element);
    TweenMax.killTweensOf(this._carName.element);
    TweenMax.killTweensOf(this._type.element);
    ref = this._details;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      item = ref[m];
      TweenMax.killTweensOf(item.element);
    }
    this._carName.destroy();
    this._type.destroy();
    this._divider.destroy();
    this._list.destroy();
    ref1 = this._details;
    for (q = 0, len2 = ref1.length; q < len2; q++) {
      detail = ref1[q];
      detail.destroy();
    }
    this._details.length = 0;
    this._details = null;
    delete this._carName;
    delete this._type;
    delete this._divider;
    delete this._list;
    return delete this._details;
  };

  VersionsListItem.prototype._removeLineBreaks = function(text) {
    return text.replace(/<br[^>]*>/, ' ');
  };

  return VersionsListItem;

})(BaseDOM);

VersionsView = (function(superClass) {
  extend(VersionsView, superClass);

  function VersionsView() {
    this.destroy = bind(this.destroy, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    this.create = bind(this.create, this);
    return VersionsView.__super__.constructor.apply(this, arguments);
  }

  VersionsView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._menuWrapper = new BaseDOM({
      className: 'side-menu-wrapper'
    });
    this.appendChild(this._menuWrapper);
    this._mainMenu = new MainMenu(app.container.content.menu);
    this._menuWrapper.appendChild(this._mainMenu);
    this._mainMenu.create();
    this._header = new VersionsHeader(this.content.cover);
    this.appendChild(this._header);
    this._header.create();
    this._list = new VersionsList(this.content.versions);
    this.appendChild(this._list);
    this._list.create();
    return VersionsView.__super__.create.apply(this, arguments);
  };

  VersionsView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().hideStart();
    this._header.showStart();
    this._mainMenu.showStart();
    this._list.showStart();
    return VersionsView.__super__.showStart.apply(this, arguments);
  };

  VersionsView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().hide(null, (function(_this) {
      return function() {
        _this._header.show(null, null);
        _this._mainMenu.show();
        setTimeout(_this._list.show, 400);
        return VersionsView.__super__.show.apply(_this, arguments);
      };
    })(this));
  };

  VersionsView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().showStart();
    return VersionsView.__super__.hideStart.apply(this, arguments);
  };

  VersionsView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().show(null, (function(_this) {
      return function() {
        return VersionsView.__super__.hide.apply(_this, arguments);
      };
    })(this));
  };

  VersionsView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._menuWrapper.destroy();
    this._mainMenu.destroy();
    this._header.destroy();
    this._list.destroy();
    delete this._menuWrapper;
    delete this._mainMenu;
    delete this._header;
    delete this._list;
    return VersionsView.__super__.destroy.apply(this, arguments);
  };

  return VersionsView;

})(BaseLoaderView);

MapThumb = (function(superClass) {
  extend(MapThumb, superClass);

  MapThumb.SELECT = 'selectMapThumbs';

  function MapThumb() {
    this._onOut = bind(this._onOut, this);
    this._onOver = bind(this._onOver, this);
    this._onThumbSelect = bind(this._onThumbSelect, this);
    var data;
    data = {
      element: 'div',
      className: 'mapThumb'
    };
    MapThumb.__super__.constructor.call(this, data);
  }

  MapThumb.prototype.create = function() {
    this._line = new BaseDOM({
      className: 'mapThumbLine'
    });
    this.appendChild(this._line);
    TweenMax.set(this._line.element, {
      alpha: .2
    });
    this.element.on(MouseEvent.CLICK, this._onThumbSelect);
    this.element.on(MouseEvent.OVER, this._onOver);
    this.element.on(MouseEvent.OUT, this._onOut);
    return this._selected = false;
  };

  MapThumb.prototype._onThumbSelect = function(e) {
    this.trigger(MapThumb.SELECT, {
      index: this._index
    });
    return false;
  };

  MapThumb.prototype._selectionAnim = function() {
    TweenMax.killTweensOf(this._line.element);
    TweenMax.to(this._line.element, 0.4, {
      alpha: this._selected ? 1 : 0.2,
      scaleX: this._selected ? 0.6 : 1
    });
    return false;
  };

  MapThumb.prototype._onOver = function(e) {
    if (this._selected) {
      return;
    }
    TweenMax.killTweensOf(this._line.element);
    TweenMax.to(this._line.element, 0.4, {
      alpha: 1,
      scaleX: 0.8
    });
    return false;
  };

  MapThumb.prototype._onOut = function(e) {
    if (this._selected) {
      return;
    }
    TweenMax.killTweensOf(this._line.element);
    TweenMax.to(this._line.element, 0.5, {
      alpha: 0.2,
      scaleX: 1,
      ease: Back.easeOut
    });
    return false;
  };

  MapThumb.set({
    index: function(p_val) {
      return this._index = p_val;
    }
  });

  MapThumb.get({
    index: function() {
      return this._index;
    }
  });

  MapThumb.set({
    selected: function(p_val) {
      var _selected;
      _selected = this._selected;
      this._selected = p_val;
      if (this._selected !== _selected) {
        this._selectionAnim();
      }
      return this._selected;
    }
  });

  MapThumb.get({
    selected: function() {
      return this._selected;
    }
  });

  return MapThumb;

})(BaseDOM);

GalleryMap = (function(superClass) {
  extend(GalleryMap, superClass);

  GalleryMap.PREV = 'prevGalleryMap';

  GalleryMap.NEXT = 'nextGalleryMap';

  GalleryMap.SELECT = 'selectGalleryMap';

  function GalleryMap() {
    this._onThumbSelect = bind(this._onThumbSelect, this);
    this._clickNext = bind(this._clickNext, this);
    this._clickPrev = bind(this._clickPrev, this);
    var data;
    data = {
      element: 'div',
      className: 'galleryMap'
    };
    GalleryMap.__super__.constructor.call(this, data);
  }

  GalleryMap.prototype.create = function(p_n) {
    var i, m, ref, thumb;
    this._title = new BaseDOM({
      className: 'title'
    });
    this.appendChild(this._title);
    this._title.html = app.navigation.currentView.content['mapTitle'];
    this._mapThumbs = new BaseDOM({
      className: 'mapThumbs'
    });
    this.appendChild(this._mapThumbs);
    this._thumbs = [];
    for (i = m = 0, ref = p_n; 0 <= ref ? m < ref : m > ref; i = 0 <= ref ? ++m : --m) {
      thumb = new MapThumb;
      this._mapThumbs.appendChild(thumb);
      thumb.create();
      thumb.index = i;
      this._thumbs.push(thumb);
      thumb.on(MapThumb.SELECT, this._onThumbSelect);
    }
    this._prevArrow = new MapArrow();
    this.appendChild(this._prevArrow);
    this._prevArrow.create();
    this._prevArrow.addClass('prev');
    this._nextArrow = new MapArrow();
    this.appendChild(this._nextArrow);
    this._nextArrow.create();
    this._nextArrow.addClass('next');
    this._counter = new BaseDOM({
      className: 'counter'
    });
    this.appendChild(this._counter);
    this._prevArrow.element.on(MouseEvent.CLICK, this._clickPrev);
    this._nextArrow.element.on(MouseEvent.CLICK, this._clickNext);
    return false;
  };

  GalleryMap.prototype.setThumb = function(p_index) {
    var len1, m, ref, thumb;
    ref = this._thumbs;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      thumb = ref[m];
      thumb.selected = false;
    }
    this._thumbs[p_index].selected = true;
    return false;
  };

  GalleryMap.prototype._clickPrev = function(e) {
    this.trigger(GalleryMap.PREV);
    return false;
  };

  GalleryMap.prototype._clickNext = function(e) {
    this.trigger(GalleryMap.NEXT);
    return false;
  };

  GalleryMap.prototype._onThumbSelect = function(e, data) {
    this.trigger(GalleryMap.SELECT, {
      index: data.index
    });
    this.setThumb(data.index);
    return false;
  };

  return GalleryMap;

})(BaseDOM);

MapArrow = (function(superClass) {
  extend(MapArrow, superClass);

  function MapArrow() {
    var data;
    data = {
      element: 'span',
      className: 'mapArrow'
    };
    MapArrow.__super__.constructor.call(this, data);
  }

  MapArrow.prototype.create = function() {
    var iconSvg;
    iconSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" enable-background="new 0 0 14 14" xml:space="preserve"> <defs> </defs> <path id="topline" fill-rule="evenodd" clip-rule="evenodd" d="M3.926,2.108l1.179-1.18L11,6.829l-1.179,1.18L3.926,2.108z"/> <path id="bottomline" fill-rule="evenodd" clip-rule="evenodd" d="M9.821,5.648L11,6.829L5.105,12.73l-1.179-1.18L9.821,5.648z"/> </svg>';
    this._svg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._svg);
    this._svg.html = iconSvg;
    this._topline = this._svg.find('#topline');
    this._bottomline = this._svg.find('#bottomline');
    return false;
  };

  return MapArrow;

})(BaseDOM);

GalleryContent = (function(superClass) {
  extend(GalleryContent, superClass);

  GalleryContent.CLOSE = 'closeGalleryContent';

  function GalleryContent() {
    this._onClose = bind(this._onClose, this);
    var data;
    data = {
      element: 'div',
      className: 'galleryContent'
    };
    GalleryContent.__super__.constructor.call(this, data);
  }

  GalleryContent.prototype.create = function(p_n) {
    this._close = new CloseIcon;
    this._close.addClass('closeButton');
    this.appendChild(this._close);
    this._close.create();
    this._textContainer = new BaseDOM({
      className: 'textContainer'
    });
    this.appendChild(this._textContainer);
    this._title = new BaseDOM({
      className: 'title'
    });
    this._textContainer.appendChild(this._title);
    this._line = new BaseDOM({
      className: 'line'
    });
    this._textContainer.appendChild(this._line);
    this._description = new BaseDOM({
      className: 'description'
    });
    this._textContainer.appendChild(this._description);
    this._map = new GalleryMap();
    this.appendChild(this._map);
    this._map.create(p_n);
    this._close.element.on(MouseEvent.CLICK, this._onClose);
    return false;
  };

  GalleryContent.prototype.update = function(p_data) {
    var ref, ref1;
    if ((ref = this._titleSplit) != null) {
      ref.revert();
    }
    this._title.html = p_data['title'];
    if ((ref1 = this._descriptionSplit) != null) {
      ref1.revert();
    }
    this._description.html = p_data['description'];
    return false;
  };

  GalleryContent.prototype._onClose = function(e) {
    console.log('CLOOOOSE', e);
    app.trigger(GalleryContent.CLOSE);
    GTMController.getInstance().trackPushState();
    return false;
  };

  return GalleryContent;

})(BaseDOM);

CloseIcon = (function(superClass) {
  extend(CloseIcon, superClass);

  function CloseIcon() {
    this._out = bind(this._out, this);
    this._over = bind(this._over, this);
    var data;
    data = {
      element: 'span',
      className: 'closeIcon'
    };
    CloseIcon.__super__.constructor.call(this, data);
  }

  CloseIcon.prototype.create = function() {
    var iconSvg;
    iconSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" enable-background="new 0 0 14 14" xml:space="preserve"> <defs> </defs> <rect x="1" y="6.25" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -2.8995 7)" fill-rule="evenodd" clip-rule="evenodd" width="12" height="1.5"/> <rect x="1" y="6.25" transform="matrix(0.7071 0.7071 -0.7071 0.7071 7 -2.8995)" fill-rule="evenodd" clip-rule="evenodd" width="12" height="1.5"/> </svg>';
    this._svg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._svg);
    this._svg.html = iconSvg;
    this.element.on(MouseEvent.OVER, this._over);
    this.element.on(MouseEvent.OUT, this._out);
    return false;
  };

  CloseIcon.prototype._over = function(e) {
    this._killTweens();
    TweenMax.to(this._svg.element, 0.7, {
      transformOrigin: '50% 40%',
      scale: 0.8,
      rotation: 180,
      ease: Back.easeOut
    });
    return false;
  };

  CloseIcon.prototype._out = function(e) {
    this._killTweens();
    TweenMax.to(this._svg.element, 0.7, {
      transformOrigin: '50% 40%',
      scale: 1,
      rotation: 0,
      ease: Back.easeOut
    });
    return false;
  };

  CloseIcon.prototype._killTweens = function() {
    TweenMax.killTweensOf(this._svg.element);
    return false;
  };

  return CloseIcon;

})(BaseDOM);

GalleryOpenContent = (function(superClass) {
  extend(GalleryOpenContent, superClass);

  GalleryOpenContent.PREV = 'prevGalleryOpenContent';

  GalleryOpenContent.NEXT = 'nextGalleryOpenContent';

  GalleryOpenContent.SELECT = 'selectGalleryOpenContent';

  GalleryOpenContent.VIDEO_CREATED = 'galleryVideoCreated';

  function GalleryOpenContent() {
    this._select = bind(this._select, this);
    this._prev = bind(this._prev, this);
    this._next = bind(this._next, this);
    this._ytVideoCreated = bind(this._ytVideoCreated, this);
    var data;
    data = {
      element: 'div',
      className: 'galleryOpenContent'
    };
    GalleryOpenContent.__super__.constructor.call(this, data);
  }

  GalleryOpenContent.prototype.create = function(p_data) {
    this._data = p_data;
    this._image = new BaseDOM({
      className: 'fullImage'
    });
    this.appendChild(this._image);
    this._ytWrapper = new BaseDOM({
      className: 'youtubeWrapper'
    });
    this._image.appendChild(this._ytWrapper);
    this._ytContainer = new BaseDOM({
      className: 'youtubeContainer'
    });
    this._ytWrapper.appendChild(this._ytContainer);
    this._ytWrapper.css({
      display: 'none'
    });
    this._content = new GalleryContent();
    this.appendChild(this._content);
    this._content.create(this._data.length);
    this._content._map.on(GalleryMap.NEXT, this._next);
    this._content._map.on(GalleryMap.PREV, this._prev);
    this._content._map.on(GalleryMap.SELECT, this._select);
    console.log('create');
    YoutubeController.getInstance().createPlayer(this._ytContainer.element, {}, this._ytVideoCreated);
    return false;
  };

  GalleryOpenContent.prototype.setContent = function(p_index) {
    if (app.resizer.breakpoint !== 'mobile') {
      if (!this._data[p_index]['videoid']) {
        this._image.css({
          backgroundImage: "url(" + this._data[p_index]['full']['src'] + ")"
        });
        this._ytWrapper.css({
          display: 'none'
        });
      } else {
        this._image.css({
          backgroundImage: "none"
        });
        this._ytWrapper.css({
          display: 'block'
        });
        this._ytPlayer.setVideo(this._data[p_index]['videoid']);
      }
    }
    this._content.update(this._data[p_index]);
    this._content._map.setThumb(p_index);
    return false;
  };

  GalleryOpenContent.prototype.stopVideo = function() {
    var ref;
    if ((ref = this._ytPlayer) != null) {
      ref.stopVideo();
    }
    return false;
  };

  GalleryOpenContent.prototype._ytVideoCreated = function(p_player) {
    console.log('player created>>>>');
    this._ytPlayer = p_player;
    this.trigger(GalleryOpenContent.VIDEO_CREATED);
    return false;
  };

  GalleryOpenContent.prototype._next = function(e) {
    this.trigger(GalleryOpenContent.NEXT);
    return false;
  };

  GalleryOpenContent.prototype._prev = function(e) {
    this.trigger(GalleryOpenContent.PREV);
    return false;
  };

  GalleryOpenContent.prototype._select = function(e, data) {
    this.trigger(GalleryOpenContent.SELECT, {
      id: data.index
    });
    return false;
  };

  return GalleryOpenContent;

})(BaseDOM);

BaseCanvasDisplay = (function(superClass) {
  extend(BaseCanvasDisplay, superClass);

  function BaseCanvasDisplay() {
    this._render = bind(this._render, this);
    var data, rendererOptions;
    data = {
      element: 'div',
      className: 'canvasDisplay'
    };
    BaseCanvasDisplay.__super__.constructor.call(this, data);
    PIXI.AUTO_PREVENT_DEFAULT = false;
    this._stage = new PIXI.Stage();
    this._w = app.resizer.width;
    this._h = app.resizer.height;
    rendererOptions = {
      antialias: true,
      transparent: true,
      resolution: 1
    };
    this._renderer = new PIXI.CanvasRenderer(this._w, this._h, rendererOptions);
    this._context = this._renderer.context;
    this.appendChild(this._renderer.view);
    this._rendering = false;
  }

  BaseCanvasDisplay.prototype.start = function() {
    if (this._rendering) {
      return;
    }
    this._rendering = true;
    this.css({
      display: 'block'
    });
    this._renderLoop = window.requestAnimationFrame(this._render);
    return false;
  };

  BaseCanvasDisplay.prototype.stop = function() {
    if (!this._rendering) {
      return;
    }
    this._rendering = false;
    this.css({
      display: 'none'
    });
    return window.cancelAnimationFrame(this._renderLoop);
  };

  BaseCanvasDisplay.prototype._render = function() {
    if (!this._rendering) {
      return;
    }
    this._draw();
    this._renderer.render(this._stage);
    this._renderLoop = window.requestAnimationFrame(this._render);
    return false;
  };

  BaseCanvasDisplay.prototype._draw = function() {
    return false;
  };

  BaseCanvasDisplay.get({
    rendering: function() {
      return this._rendering;
    }
  });

  return BaseCanvasDisplay;

})(BaseDOM);

GalleryCanvasTransition = (function(superClass) {
  extend(GalleryCanvasTransition, superClass);

  GalleryCanvasTransition.SHOW_LOAD = 'showLoadGalleryCanvasTransition';

  GalleryCanvasTransition.HIDE_LOAD = 'hideLoadGalleryCanvasTransition';

  function GalleryCanvasTransition() {
    this._showLoadComplete = bind(this._showLoadComplete, this);
    GalleryCanvasTransition.__super__.constructor.apply(this, arguments);
    this.addClass('galleryCanvasTransition');
  }

  GalleryCanvasTransition.prototype.create = function(p_data) {
    var _rect, c, i, m;
    this._data = p_data;
    this._rects = [];
    this._container = new BaseDOM({
      className: 'containerLoader'
    });
    this.appendChild(this._container);
    this._label = new BaseDOM({
      className: 'labelLoader'
    });
    this._label.text = app.config.required.preloader[1].content.label;
    this._container.appendChild(this._label);
    TweenMax.set(this._container.element, {
      alpha: 0
    });
    for (i = m = 0; m <= 1; i = ++m) {
      c = i === 0 ? 0x151515 : 0x101823;
      _rect = new PIXI.Graphics();
      _rect.beginFill(c, 1);
      _rect.drawRect(0, 0, 100, 100);
      this._stage.addChild(_rect);
      this._rects.push(_rect);
    }
    this._speedLines = new SpeedLines();
    this.appendChild(this._speedLines);
    this._speedLines.create({
      total: 20,
      width: this._w,
      height: this._h,
      weight: 2
    });
    this._speedLines.css({
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999999
    });
    return false;
  };

  GalleryCanvasTransition.prototype.ready = function() {
    this.start();
    this._resetSquares();
    return false;
  };

  GalleryCanvasTransition.prototype.showLoad = function(p_n, p_direction) {
    var i, len1, m, px, rect, ref, tx;
    this._loading = true;
    if (p_direction === 1) {
      px = -this._w;
      tx = this._w;
    } else {
      px = this._w;
      tx = -this._w;
    }
    ref = this._rects;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      rect = ref[i];
      if (i === this._rects.length - 1) {
        tx = 0;
      }
      rect.position.x = px;
      TweenMax.to(rect.position, 2, {
        x: tx,
        delay: i * 0.05,
        ease: Expo.easeInOut
      });
    }
    TweenMax.to(this._container.element, 0.4, {
      alpha: 1,
      delay: i * 0.05 + 1
    });
    this._speedLines.direction = p_direction;
    this._speedLines.play({
      delay: 0.8,
      stagger: 0.02
    });
    TweenMax.delayedCall(2 + i * 0.05, this._showLoadComplete);
    return false;
  };

  GalleryCanvasTransition.prototype.hideLoad = function(p_direction) {
    var rect, tx;
    this._loading = false;
    rect = this._rects[this._rects.length - 1];
    tx = p_direction === 1 ? this._w : -this._w;
    TweenMax.to(rect.position, 1, {
      x: tx,
      ease: Expo.easeInOut,
      onComplete: (function(_this) {
        return function() {
          return _this.trigger(GalleryCanvasTransition.HIDE_LOAD);
        };
      })(this)
    });
    TweenMax.to(this._container.element, 0.4, {
      alpha: 0
    });
    return false;
  };

  GalleryCanvasTransition.prototype.progress = function(p_perc) {
    return false;
  };

  GalleryCanvasTransition.prototype.slideTo = function(p_n, p_direction) {
    var i, len1, m, px, rect, ref, tx;
    this._speedLines.direction = p_direction;
    if (p_direction === 1) {
      px = -this._w;
      tx = this._w;
    } else {
      px = this._w;
      tx = -this._w;
    }
    ref = this._rects;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      rect = ref[i];
      rect.position.x = px;
      TweenMax.to(rect.position, 2, {
        x: tx,
        delay: i * 0.05,
        ease: Expo.easeInOut
      });
    }
    this._speedLines.play({
      delay: 0.8,
      stagger: 0.02
    });
    return false;
  };

  GalleryCanvasTransition.prototype._showLoadComplete = function() {
    this.trigger(GalleryCanvasTransition.SHOW_LOAD);
    return false;
  };

  GalleryCanvasTransition.prototype._moveItem = function(p_from, p_to) {
    this._rects.splice(p_to, 0, this._rects.splice(p_from, 1)[0]);
    return false;
  };

  GalleryCanvasTransition.prototype._resetSquares = function() {
    var len1, m, rect, ref;
    ref = this._rects;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      rect = ref[m];
      rect.width = this._w;
      rect.height = this._h;
    }
    return false;
  };

  GalleryCanvasTransition.prototype.resize = function(p_w, p_h) {
    var i, len1, m, rect, ref;
    this._w = p_w;
    this._h = p_h;
    this._speedLines.resize(this._w, this._h);
    this._renderer.resize(this._w, this._h);
    ref = this._rects;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      rect = ref[i];
      TweenMax.killTweensOf(rect.position);
      rect.position.x = this._loading && i === this._rects.length - 1 ? 0 : this._w;
      rect.width = this._w;
      rect.height = this._h;
    }
    return false;
  };

  return GalleryCanvasTransition;

})(BaseCanvasDisplay);

ColorMapImage = (function(superClass) {
  extend(ColorMapImage, superClass);

  ColorMapImage.READY = 'readyColorMapImage';

  ColorMapImage.LOADED = 'imageLoadedColorMapImage';

  function ColorMapImage() {
    this._render = bind(this._render, this);
    this._checkLoad = bind(this._checkLoad, this);
    this.create = bind(this.create, this);
    var data;
    data = {
      element: 'div',
      className: 'coloredImage'
    };
    this._al = AssetLoader.getInstance();
    this._ready = false;
    ColorMapImage.__super__.constructor.call(this, data);
  }

  ColorMapImage.prototype.create = function(p_data) {
    var ref;
    this._data = p_data;
    this._src = this._data['image'];
    this._c1 = this._data['colorStart'];
    this._c2 = this._data['colorEnd'];
    if (((ref = this._al.getItem(this._data['image'])) != null ? ref['modColor'] : void 0) != null) {
      if (!this._al.getItem(this._data['image'])['modColor']['loaded']) {
        app.on(ColorMapImage.LOADED, this._checkLoad);
        return;
      } else {
        this._loadImage(this._data['image']);
      }
    } else {
      this._al.getItem(this._data['image'])['modColor'] = {
        loaded: false
      };
      this._createNew();
    }
    return false;
  };

  ColorMapImage.prototype._checkLoad = function(e, data) {
    if (data['id'] === this._data['image']) {
      this._loadImage(this._data['image']);
    }
    return false;
  };

  ColorMapImage.prototype._createNew = function() {
    var grd;
    this._src = this._al.getItem(this._data['image']);
    this._w = this._src['tag']['width'];
    this._h = this._src['tag']['height'];
    this._canvas = new BaseDOM({
      element: 'canvas'
    });
    this.appendChild(this._canvas);
    this._canvas.attr('width', this._w);
    this._canvas.attr('height', this._h);
    this._context = this._canvas.element.getContext('2d');
    grd = this._context.createLinearGradient(0, 0, this._w, 0);
    grd.addColorStop(0, this._c1);
    grd.addColorStop(1, this._c2);
    this._context.fillStyle = grd;
    this._context.fillRect(0, 0, this._w, 1);
    this._gradPixels = this._context.getImageData(0, 0, this._w, 1).data;
    this._context.clearRect(0, 0, this._w, this._h);
    this._img = new Image();
    this._img.onload = this._render;
    this._img.src = this._src['src'];
    return false;
  };

  ColorMapImage.prototype._render = function() {
    var _b, _g, _r, _src, a, b, g, gradIndex, grayscale, i, i4, iHex, imageData, len1, m, p, r, ref, t, x, y;
    this._context.drawImage(this._img, 0, 0, this._w, this._h);
    imageData = this._context.getImageData(0, 0, this._w, this._h);
    this._pixels = imageData.data;
    t = new Date().getTime();
    this._context.clearRect(0, 0, this._w, this._h);
    iHex = 1 / 255;
    i4 = 1 / 4;
    ref = this._pixels;
    for (i = m = 0, len1 = ref.length; m < len1; i = m += 4) {
      p = ref[i];
      r = this._pixels[i] * iHex;
      g = this._pixels[i + 1] * iHex;
      b = this._pixels[i + 2] * iHex;
      a = this._pixels[i + 3];
      grayscale = 0.213 * r + 0.715 * g + 0.072 * b;
      gradIndex = (grayscale * this._w >> 0) * 4;
      _r = this._gradPixels[gradIndex];
      _g = this._gradPixels[gradIndex + 1];
      _b = this._gradPixels[gradIndex + 2];
      x = (i * i4) % this._w;
      y = (i * i4) / this._w >> 0;
      this._pixels[i] = _r;
      this._pixels[i + 1] = _g;
      this._pixels[i + 2] = _b;
      this._pixels[i + 3] = a;
    }
    this._context.putImageData(imageData, 0, 0);
    _src = this._canvas.element.toDataURL("image/jpeg", 1);
    this._al.getItem(this._data['image'])['modColor'] = {
      src: _src,
      loaded: true
    };
    this.removeChild(this._canvas);
    this._canvas.destroy();
    this._loadImage(this._data['image']);
    return app.trigger(ColorMapImage.LOADED, {
      id: this._data['image']
    });
  };

  ColorMapImage.prototype._loadImage = function(p_id) {
    var img;
    img = this._al.getItem(this._data['image']);
    this._image = new Image();
    this._image.src = img.modColor.src;
    this.appendChild(this._image);
    this._ready = true;
    this.trigger(ColorMapImage.READY);
    return false;
  };

  ColorMapImage.get({
    src: function() {
      if (!this._ready) {
        throw new Error('ColorMapImage: image not ready, listen for event.');
      }
      return this._image.src;
    }
  });

  return ColorMapImage;

})(BaseDOM);

BlurImage = (function(superClass) {
  extend(BlurImage, superClass);

  BlurImage.READY = 'readyBlurImage';

  function BlurImage() {
    this._drawBlur = bind(this._drawBlur, this);
    this._render = bind(this._render, this);
    var data;
    data = {
      element: 'div',
      className: 'blurImage'
    };
    this._al = AssetLoader.getInstance();
    BlurImage.__super__.constructor.call(this, data);
  }

  BlurImage.prototype.create = function(p_data) {
    this._data = p_data;
    this._src = this._data['image'];
    this._radius = this._data['radius'] || 0;
    this._createNew();
    return false;
  };

  BlurImage.prototype._createNew = function() {
    this._src = this._al.getItem(this._data['image']);
    this._w = this._src['tag']['width'];
    this._h = this._src['tag']['height'];
    this._canvas = new BaseDOM({
      element: 'canvas'
    });
    this.appendChild(this._canvas);
    this._canvas.attr('width', this._w);
    this._canvas.attr('height', this._h);
    this._id = (Math.random() * 99999) * (Math.random() * 99999) * (Math.random() * 99999);
    this._canvas.attr('id', this._id);
    this._context = this._canvas.element.getContext('2d');
    this._img = new Image();
    this._img.onload = this._render;
    this._img.src = this._src['src'];
    return false;
  };

  BlurImage.prototype._render = function() {
    this._context.drawImage(this._img, 0, 0, this._w, this._h);
    this._drawBlur();
    this.trigger(BlurImage.READY);
    return false;
  };

  BlurImage.prototype._drawBlur = function() {
    console.log('draw blur:', this._radius);
    this._context.drawImage(this._img, 0, 0, this._w, this._h);
    window.stackBlurCanvasRGB(this._id, 0, 0, this._w, this._h, this._radius);
    return false;
  };

  BlurImage.set({
    blur: function(p_n) {
      this._radius = p_n;
      this._drawBlur();
      return false;
    }
  });

  BlurImage.get({
    blur: function() {
      return this._radius;
    }
  });

  return BlurImage;

})(BaseDOM);

ThumbItem = (function(superClass) {
  extend(ThumbItem, superClass);

  ThumbItem.READY = 'readyThumbItem';

  function ThumbItem() {
    this._drawBg = bind(this._drawBg, this);
    var data;
    data = {
      element: 'div',
      className: 'thumbItem'
    };
    ThumbItem.__super__.constructor.call(this, data);
  }

  ThumbItem.prototype.create = function(p_data) {
    this.data = p_data;
    this._imageColor = new ColorMapImage();
    this._imageColor.on(ColorMapImage.READY, this._drawBg);
    this._imgContainer = new BaseDOM({
      className: 'imgContainer'
    });
    this.appendChild(this._imgContainer);
    this._imageBottom = new BaseDOM({
      className: 'thumbImage'
    });
    this._imgContainer.appendChild(this._imageBottom);
    this._imageBottom.css({
      backgroundImage: "url(" + this.data['thumb']['src'] + ")",
      zIndex: 0
    });
    this._imageTop = new BaseDOM({
      className: 'thumbImage color'
    });
    this._imgContainer.appendChild(this._imageTop);
    setTimeout(this._imageColor.create, 0, {
      image: this.data['thumb']['id'],
      colorStart: '#151515',
      colorEnd: '#656565'
    });
    return false;
  };

  ThumbItem.prototype.reset = function() {
    TweenMax.killTweensOf(this._imgContainer.element);
    TweenMax.set(this._imgContainer.element, {
      x: '0%'
    });
    return false;
  };

  ThumbItem.prototype.show = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.killTweensOf(this._imgContainer.element);
    TweenMax.to(this._imgContainer.element, 0.75, {
      x: '0%',
      delay: p_delay,
      ease: Expo.easeOut
    });
    return false;
  };

  ThumbItem.prototype.hide = function(p_delay, p_mult) {
    if (p_delay == null) {
      p_delay = 0;
    }
    if (p_mult == null) {
      p_mult = 1;
    }
    TweenMax.killTweensOf(this._imgContainer.element);
    TweenMax.to(this._imgContainer.element, 0.75 * p_mult, {
      x: '100%',
      delay: p_delay,
      ease: Expo.easeOut
    });
    return false;
  };

  ThumbItem.prototype.over = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.killTweensOf(this._imageTop.element);
    TweenMax.to(this._imageTop.element, 1, {
      alpha: 0,
      delay: p_delay
    });
    return false;
  };

  ThumbItem.prototype.out = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.killTweensOf(this._imageTop.element);
    TweenMax.to(this._imageTop.element, 1, {
      alpha: 1,
      delay: p_delay
    });
    return false;
  };

  ThumbItem.prototype.slideUp = function(p_delay, p_mult) {
    if (p_delay == null) {
      p_delay = 0;
    }
    if (p_mult == null) {
      p_mult = 1;
    }
    TweenMax.killTweensOf(this._imgContainer.element);
    TweenMax.set(this._imgContainer.element, {
      y: '100%',
      x: 0
    });
    TweenMax.to(this._imgContainer.element, 0.7 * p_mult, {
      y: '0%',
      delay: p_delay,
      ease: Expo.easeOut
    });
    return false;
  };

  ThumbItem.prototype.slideDown = function(p_delay, p_mult) {
    if (p_delay == null) {
      p_delay = 0;
    }
    if (p_mult == null) {
      p_mult = 1;
    }
    TweenMax.killTweensOf(this._imgContainer.element);
    TweenMax.to(this._imgContainer.element, 0.7 * p_mult, {
      y: '100%',
      delay: p_delay,
      ease: Expo.easeIn
    });
    return false;
  };

  ThumbItem.prototype._drawBg = function(e, data) {
    this._imageTop.css({
      backgroundImage: "url(" + this._imageColor.src + ")",
      zIndex: 1
    });
    this.trigger(ThumbItem.READY);
    return false;
  };

  return ThumbItem;

})(BaseDOM);

LupeIcon = (function(superClass) {
  extend(LupeIcon, superClass);

  function LupeIcon() {
    var data;
    data = {
      element: 'span',
      className: 'lupeIcon'
    };
    LupeIcon.__super__.constructor.call(this, data);
    this._index = null;
  }

  LupeIcon.prototype.create = function() {
    var iconSvg, plusSvg;
    iconSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"> <defs> </defs> <path fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd" d="M17.249,38.084c0,0-2.613-0.635-3.968-2.005c-1.355-1.369-1.984-4.009-1.984-4.009 L6.42,41.31l-0.107-0.108L0,47.58L2.395,50l6.283-6.349L17.249,38.084z"/> <path fill="#ffffff" d="M29.153,40.086c-10.944,0-19.847-8.992-19.847-20.043S18.209,0,29.153,0S49,8.991,49,20.043S40.096,40.086,29.153,40.086z M29.153,2c-9.841,0-17.847,8.094-17.847,18.043c0,9.949,8.006,18.043,17.847,18.043S47,29.992,47,20.043 C47,10.094,38.993,2,29.153,2z"/> </svg>';
    plusSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve"> <defs> </defs> <polygon id="plusSign" fill="#ffffff" fill-rule="evenodd" clip-rule="evenodd" points="32.129,20.043 29.153,20.043 29.153,17.036 28.161,17.036 28.161,20.043 25.185,20.043 25.185,21.045 28.161,21.045 28.161,24.052 29.153,24.052 29.153,21.045 32.129,21.045 "/> </svg>';
    this._svg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._svg);
    this._svg.html = iconSvg;
    this._plusSvg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._plusSvg);
    this._plusSvg.html = plusSvg;
    this._plusSign = this._plusSvg.find('#plusSign');
    this._enabled = false;
    this._reset();
    this._position = {};
    return false;
  };

  LupeIcon.prototype.show = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    this._reset();
    TweenMax.killTweensOf(this.element);
    TweenMax.killTweensOf(this._plusSign);
    TweenMax.to(this.element, 0.5, {
      transformOrigin: '0% 100%',
      startAt: {
        transformOrigin: '0% 100%',
        scale: 0,
        rotation: -90
      },
      scale: 1,
      rotation: 0,
      delay: p_delay,
      ease: Back.easeOut
    });
    TweenMax.to(this._plusSign, 0.5, {
      transformOrigin: '50% 50%',
      startAt: {
        scale: 0,
        rotation: -180
      },
      scale: 1,
      rotation: 0,
      delay: p_delay + 0.3,
      ease: Back.easeOut,
      onComplete: (function(_this) {
        return function() {
          return _this._enabled = true;
        };
      })(this)
    });
    return false;
  };

  LupeIcon.prototype.hide = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.killTweensOf(this.element);
    TweenMax.killTweensOf(this._plusSign);
    this._enabled = false;
    TweenMax.to(this.element, 0.5, {
      transformOrigin: '0% 100%',
      scale: 0,
      rotation: -90,
      left: '50%',
      top: '50%',
      delay: p_delay,
      ease: Back.easeIn
    });
    TweenMax.to(this._plusSign, 0.5, {
      transformOrigin: '50% 50%',
      scale: 0,
      rotation: -180,
      delay: p_delay,
      ease: Quad.easeIn
    });
    return false;
  };

  LupeIcon.prototype.click = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.to(this._plusSign, 0.2, {
      scale: 2
    });
    TweenMax.to(this._plusSign, 0.2, {
      scale: 1,
      delay: 0.2,
      ease: Back.easeOut
    });
    return false;
  };

  LupeIcon.prototype._reset = function() {
    TweenMax.killTweensOf(this.element);
    TweenMax.killTweensOf(this._plusSign);
    TweenMax.set(this._plusSign, {
      transformOrigin: '50% 50%',
      scale: 0,
      rotation: -180
    });
    return TweenMax.set(this.element, {
      transformOrigin: '0% 100%',
      scale: 0,
      rotation: -90
    });
  };

  LupeIcon.set({
    enabled: function(p_val) {
      return this._enabled = p_val;
    }
  });

  LupeIcon.get({
    enabled: function() {
      return this._enabled;
    }
  });

  LupeIcon.set({
    position: function(p_val) {
      return this._position = p_val;
    }
  });

  LupeIcon.get({
    position: function() {
      return this._position;
    }
  });

  return LupeIcon;

})(BaseDOM);

ThumbLines = (function(superClass) {
  extend(ThumbLines, superClass);

  ThumbLines.CLICK = 'clickthumbLines';

  ThumbLines.OVER = 'overthumbLines';

  ThumbLines.OUT = 'outthumbLines';

  ThumbLines.LOAD_ANIMATION_COMPLETE = 'loadAnimatioNCompleteThumbsLines';

  function ThumbLines() {
    this._move = bind(this._move, this);
    this._render = bind(this._render, this);
    this._click = bind(this._click, this);
    this._out = bind(this._out, this);
    this._over = bind(this._over, this);
    this._loadComplete = bind(this._loadComplete, this);
    var data;
    data = {
      element: 'div',
      className: 'thumbLines'
    };
    ThumbLines.__super__.constructor.call(this, data);
  }

  ThumbLines.prototype.create = function() {
    var ix, iy;
    this._id = null;
    this._topLine = new BaseDOM({
      className: 'topLine'
    });
    this.appendChild(this._topLine);
    this._rightLine = new BaseDOM({
      className: 'rightLine'
    });
    this.appendChild(this._rightLine);
    this._bottomLine = new BaseDOM({
      className: 'bottomLine'
    });
    this.appendChild(this._bottomLine);
    this._leftLine = new BaseDOM({
      className: 'leftLine'
    });
    this.appendChild(this._leftLine);
    this._icon = new LupeIcon();
    this.appendChild(this._icon);
    this._icon.create();
    TweenMax.set(this._topLine.element, {
      transformOrigin: '0% 50%',
      scaleX: 0,
      x: -30,
      y: -30
    });
    TweenMax.set(this._leftLine.element, {
      transformOrigin: '50% 0%',
      scaleY: 0,
      x: -30,
      y: -30
    });
    TweenMax.set(this._bottomLine.element, {
      transformOrigin: '100% 50%',
      scaleX: 0,
      x: 30,
      y: 30
    });
    TweenMax.set(this._rightLine.element, {
      transformOrigin: '50% 100%',
      scaleY: 0,
      x: 30,
      y: 30
    });
    ix = this.width * 0.5;
    iy = this.height * 0.5;
    this._icon.position = {
      x: ix,
      y: iy
    };
    this.element.on(MouseEvent.OVER, this._over);
    this.element.on(MouseEvent.OUT, this._out);
    this.element.on(MouseEvent.CLICK, this._click);
    this.element.on(MouseEvent.MOVE, this._move);
    this._enabled = true;
    return false;
  };

  ThumbLines.prototype.show = function(p_delay) {
    var n, t;
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    t = 0.4;
    n = Math.random();
    TweenMax.to(this._topLine.element, t, {
      transformOrigin: '0% 50%',
      scaleX: 1,
      x: 0,
      y: 0
    });
    TweenMax.to(this._leftLine.element, t, {
      transformOrigin: '50% 0%',
      scaleY: 1,
      x: 0,
      y: 0
    });
    TweenMax.to(this._bottomLine.element, t, {
      transformOrigin: '100% 50%',
      scaleX: 1,
      x: 0,
      y: 0
    });
    TweenMax.to(this._rightLine.element, t, {
      transformOrigin: '50% 100%',
      scaleY: 1,
      x: 0,
      y: 0
    });
    this._icon.show(p_delay + 0.2);
    return false;
  };

  ThumbLines.prototype.hide = function(p_delay) {
    var t;
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    t = 0.5;
    this._icon.hide();
    this._resetIcon();
    TweenMax.to(this._topLine.element, t, {
      transformOrigin: '0% 50%',
      scaleX: 0,
      x: -30,
      y: -30
    });
    TweenMax.to(this._leftLine.element, t, {
      transformOrigin: '50% 0%',
      scaleY: 0,
      x: -30,
      y: -30
    });
    TweenMax.to(this._bottomLine.element, t, {
      transformOrigin: '100% 50%',
      scaleX: 0,
      x: 30,
      y: 30
    });
    TweenMax.to(this._rightLine.element, t, {
      transformOrigin: '50% 100%',
      scaleY: 0,
      x: 30,
      y: 30
    });
    return false;
  };

  ThumbLines.prototype.setLoadMode = function() {
    this.enabled = false;
    this._stop();
    this._icon.hide();
    TweenMax.set(this._topLine.element, {
      scaleX: 1,
      x: 0,
      y: 0
    });
    TweenMax.set(this._leftLine.element, {
      scaleY: 1,
      x: 0,
      y: 0
    });
    TweenMax.set(this._bottomLine.element, {
      scaleX: 1,
      x: 0,
      y: 0
    });
    TweenMax.set(this._rightLine.element, {
      scaleY: 1,
      x: 0,
      y: 0
    });
    this._progressTimeline = new TimelineMax({
      onComplete: this._loadComplete
    });
    this._progressTimeline.add(TweenMax.to(this._topLine.element, 0.25, {
      transformOrigin: '100% 50%',
      scaleX: 0
    }));
    this._progressTimeline.add(TweenMax.to(this._rightLine.element, 0.25, {
      transformOrigin: '50% 100%',
      scaleY: 0
    }));
    this._progressTimeline.add(TweenMax.to(this._bottomLine.element, 0.25, {
      transformOrigin: '0% 50%',
      scaleX: 0
    }));
    this._progressTimeline.add(TweenMax.to(this._leftLine.element, 0.25, {
      transformOrigin: '50% 0%',
      scaleY: 0
    }));
    this._progressTimeline.pause();
    return this._progressTimeline["false"];
  };

  ThumbLines.prototype.progress = function(p_val) {
    this._progressTimeline.tweenTo(p_val * this._progressTimeline.totalDuration());
    return false;
  };

  ThumbLines.prototype._loadComplete = function() {
    this.trigger(ThumbLines.LOAD_ANIMATION_COMPLETE);
    return false;
  };

  ThumbLines.prototype._killTweens = function() {
    TweenMax.killTweensOf(this._topLine.element);
    TweenMax.killTweensOf(this._bottomLine.element);
    TweenMax.killTweensOf(this._leftLine.element);
    TweenMax.killTweensOf(this._rightLine.element);
    return false;
  };

  ThumbLines.prototype._over = function(e) {
    if (!this.enabled) {
      return;
    }
    this.show();
    this.trigger(ThumbLines.OVER, {
      id: this.id
    });
    this._start();
    return false;
  };

  ThumbLines.prototype._out = function(e) {
    if (!this.enabled) {
      return;
    }
    this.hide();
    this.trigger(ThumbLines.OUT, {
      id: this.id
    });
    this._stop();
    return false;
  };

  ThumbLines.prototype._click = function(e) {
    this._icon.click();
    this.trigger(ThumbLines.CLICK, {
      id: this.id
    });
    return false;
  };

  ThumbLines.prototype._start = function() {
    this._frame = window.requestAnimationFrame(this._render);
    return false;
  };

  ThumbLines.prototype._stop = function() {
    window.cancelAnimationFrame(this._frame);
    this._resetIcon();
    return false;
  };

  ThumbLines.prototype._render = function() {
    if (this._icon.enabled) {
      this._moveIcon();
    }
    this._frame = window.requestAnimationFrame(this._render);
    return false;
  };

  ThumbLines.prototype._move = function(e) {
    this._mpos = MouseEvent.normalizeClick(e);
    this._mpos.x = this._mpos.x - this.x;
    this._mpos.y = this._mpos.y - this.y;
    return false;
  };

  ThumbLines.prototype._resetIcon = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    TweenMax.to(this._icon.element, 0.8, {
      left: '50%',
      top: '50%',
      delay: p_delay,
      ease: Back.easeOut
    });
    return false;
  };

  ThumbLines.prototype._moveIcon = function() {
    var _dist, _x, _y, ang, dist, iconx, icony, ix, iy;
    iconx = this._icon.x - this.x;
    icony = this._icon.y - this.y;
    ix = this.width * 0.5 + this._icon.width * 0.5;
    iy = this.height * 0.5 + this._icon.height * 0.5;
    _dist = this._dist(ix, iy, this._mpos.x, this._mpos.y);
    dist = Math.min(_dist, 60);
    ang = Math.atan2(this._mpos.y - iy, this._mpos.x - ix);
    iconx += dist * Math.cos(ang) + (ix - iconx) * 0.7;
    icony += dist * Math.sin(ang) + (iy - icony) * 0.7;
    _x = iconx;
    _y = icony;
    TweenMax.to(this._icon.element, 0.5, {
      left: _x,
      top: _y,
      ease: Quad.easeOut
    });
    return false;
  };

  ThumbLines.prototype._dist = function(p_x, p_y, p_xx, p_yy) {
    var dx, dy;
    dx = p_x - p_xx;
    dy = p_y - p_yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  ThumbLines.set({
    id: function(p_id) {
      return this._id = p_id;
    }
  });

  ThumbLines.get({
    id: function() {
      return this._id;
    }
  });

  ThumbLines.set({
    enabled: function(p_value) {
      return this._enabled = p_value;
    }
  });

  ThumbLines.get({
    enabled: function() {
      return this._enabled;
    }
  });

  return ThumbLines;

})(BaseDOM);

NavIcon = (function(superClass) {
  extend(NavIcon, superClass);

  NavIcon.SELECT = 'selectNavIcon';

  function NavIcon() {
    this._onOver = bind(this._onOver, this);
    this._triggerSelect = bind(this._triggerSelect, this);
    var data;
    data = {
      element: 'span',
      className: 'navIcon'
    };
    NavIcon.__super__.constructor.call(this, data);
    this._index = null;
  }

  NavIcon.prototype.create = function() {
    var iconSvg;
    iconSvg = '<svg version="1.1"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"> <defs> </defs> <path id="strokeClick" fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke="#DAC27C" stroke-width="3" stroke-miterlimit="10" d="M16,24.017 c-4.418,0-8-3.586-8-8.009C8,11.586,11.582,8,16,8c4.418,0,8,3.586,8,8.009C24,20.432,20.418,24.017,16,24.017z"/> <path id="circleClick" fill-rule="evenodd" clip-rule="evenodd" fill="#DAC27C" d="M16,21.071c-2.793,0-5.057-2.266-5.057-5.062 c0-2.796,2.264-5.062,5.057-5.062c2.793,0,5.057,2.266,5.057,5.062C21.057,18.805,18.793,21.071,16,21.071z"/> <path id="stroke" fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke="#DAC27C" stroke-width="3" stroke-miterlimit="10" d="M16,24.017 c-4.418,0-8-3.586-8-8.009C8,11.586,11.582,8,16,8c4.418,0,8,3.586,8,8.009C24,20.432,20.418,24.017,16,24.017z"/> <path id="circle" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M16,21.071c-2.793,0-5.057-2.266-5.057-5.062 c0-2.796,2.264-5.062,5.057-5.062c2.793,0,5.057,2.266,5.057,5.062C21.057,18.805,18.793,21.071,16,21.071z"/> </svg>';
    this._svg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._svg);
    this._svg.html = iconSvg;
    this._circleClick = this._svg.find('#circleClick');
    this._strokeClick = this._svg.find('#strokeClick');
    this._circle = this._svg.find('#circle');
    this._stroke = this._svg.find('#stroke');
    TweenMax.set([this._circleClick, this._strokeClick, this._circle, this._stroke], {
      transformOrigin: '50%, 50%',
      scale: 0
    });
    this.element.on(MouseEvent.CLICK, this._triggerSelect);
    this.element.on(MouseEvent.OVER, this._onOver);
    this._enabled = false;
    return false;
  };

  NavIcon.prototype.enable = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    this._enabled = true;
    TweenMax.to(this._circle, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 0.6,
      delay: p_delay,
      ease: Back.easeOut
    });
    TweenMax.set(this._stroke, {
      scale: 0,
      alpha: 1
    });
    TweenMax.to(this._stroke, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 1,
      delay: p_delay + 0.4
    });
    return false;
  };

  NavIcon.prototype.disable = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    this._enabled = false;
    TweenMax.to(this._circle, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 1,
      delay: p_delay + 0.2,
      ease: Back.easeOut
    });
    TweenMax.to(this._stroke, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 0,
      delay: p_delay
    });
    return false;
  };

  NavIcon.prototype.show = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    this.removeClass('hidden');
    TweenMax.to(this._circle, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 1,
      delay: p_delay
    });
    TweenMax.to(this._strokeClick, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 1.1,
      delay: p_delay + 0.2
    });
    TweenMax.to(this._strokeClick, 0.5, {
      alpha: 0,
      delay: p_delay + 0.4
    });
    return false;
  };

  NavIcon.prototype.hide = function(p_delay) {
    if (p_delay == null) {
      p_delay = 0;
    }
    this._killTweens();
    TweenMax.to(this._stroke, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 0,
      delay: p_delay
    });
    TweenMax.to(this._circle, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 0,
      delay: p_delay + 0.1,
      ease: Back.easeIn,
      onComplete: (function(_this) {
        return function() {
          return _this.addClass('hidden');
        };
      })(this)
    });
    return false;
  };

  NavIcon.prototype._triggerSelect = function(e) {
    if (this._enabled) {
      return;
    }
    this._clickAnim();
    this.trigger(NavIcon.SELECT, {
      index: this.index
    });
    return false;
  };

  NavIcon.prototype._clickAnim = function() {
    TweenMax.set(this._strokeClick, {
      scale: 0,
      alpha: 1
    });
    TweenMax.to(this._strokeClick, 0.3, {
      transformOrigin: '50%, 50%',
      scale: 1.2
    });
    TweenMax.to(this._strokeClick, 0.3, {
      alpha: 0,
      delay: 0.2
    });
    return false;
  };

  NavIcon.prototype._onOver = function(e) {
    if (this._enabled) {
      return;
    }
    TweenMax.set(this._circleClick, {
      scale: 1,
      alpha: 0.75
    });
    TweenMax.to(this._circleClick, 0.5, {
      transformOrigin: '50%, 50%',
      scale: 1.6
    });
    TweenMax.to(this._circleClick, 0.5, {
      alpha: 0,
      delay: 0.2
    });
    return false;
  };

  NavIcon.prototype._killTweens = function() {
    TweenMax.killTweensOf(this._circle);
    TweenMax.killTweensOf(this._stroke);
    return false;
  };

  NavIcon.set({
    index: function(p_value) {
      return this._index = p_value;
    }
  });

  NavIcon.get({
    index: function() {
      if (this._index === null) {
        throw new Error('NavIcon: no @index set!');
      }
      return this._index;
    }
  });

  return NavIcon;

})(BaseDOM);

PaginationIcons = (function(superClass) {
  extend(PaginationIcons, superClass);

  PaginationIcons.GOTO = 'gotoPaginationIcons';

  function PaginationIcons() {
    this._onSelect = bind(this._onSelect, this);
    var data;
    data = {
      element: 'div',
      className: 'paginationIcons'
    };
    PaginationIcons.__super__.constructor.call(this, data);
  }

  PaginationIcons.prototype.create = function() {
    var _icon, i, m;
    this._maxItens = 0;
    this._icons = [];
    for (i = m = 0; m < 20; i = ++m) {
      _icon = new NavIcon;
      this.appendChild(_icon);
      _icon.create();
      _icon.addClass('hidden');
      _icon.index = i;
      _icon.on(NavIcon.SELECT, this._onSelect);
      this._icons.push(_icon);
    }
    this._current = null;
    return false;
  };

  PaginationIcons.prototype.reset = function() {
    this.setCurrent(0);
    return false;
  };

  PaginationIcons.prototype.setCurrent = function(p_index) {
    var ref;
    if ((ref = this._current) != null) {
      ref.disable();
    }
    this._current = this._icons[p_index];
    this._current.enable(0.3);
    return false;
  };

  PaginationIcons.prototype.redraw = function(p_max) {
    if (p_max < this._maxItens) {
      this._hideExtra(p_max);
    } else if (p_max > this._maxItens) {
      this._showNew(p_max);
    }
    this._maxItens = p_max;
    return false;
  };

  PaginationIcons.prototype._onSelect = function(e, data) {
    this.trigger(PaginationIcons.GOTO, data);
    return false;
  };

  PaginationIcons.prototype._showNew = function(p_n) {
    var i, icon, m, ref, ref1;
    for (i = m = ref = this._maxItens, ref1 = p_n; ref <= ref1 ? m < ref1 : m > ref1; i = ref <= ref1 ? ++m : --m) {
      icon = this._icons[i];
      icon.show(i * 0.2);
    }
    return false;
  };

  PaginationIcons.prototype._hideExtra = function(p_n) {
    var i, icon, m, ref, ref1;
    i = 0;
    for (i = m = ref = p_n, ref1 = this._maxItens; ref <= ref1 ? m < ref1 : m > ref1; i = ref <= ref1 ? ++m : --m) {
      icon = this._icons[i];
      icon.hide(i * 0.1);
      ++i;
    }
    return false;
  };

  return PaginationIcons;

})(BaseDOM);

NavArrow = (function(superClass) {
  extend(NavArrow, superClass);

  function NavArrow() {
    var data;
    data = {
      element: 'span',
      className: 'navArrow'
    };
    NavArrow.__super__.constructor.call(this, data);
  }

  NavArrow.prototype.create = function() {
    var iconSvg;
    iconSvg = '<svg version="1.1"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve"> <defs> </defs> <rect id="bg" fill-rule="evenodd" clip-rule="evenodd" fill="#DAC06F" width="40" height="40"/> <rect id="topline" x="11.339" y="12.839" transform="matrix(0.7071 0.7071 -0.7071 0.7071 17.3033 -10.0962)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="19" height="6"/> <rect id="bottomline" x="11.339" y="22.039" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -11.6016 22.069)" fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" width="19" height="6"/> </svg>';
    this._svg = new BaseDOM({
      className: 'svgIcon',
      element: 'div'
    });
    this.appendChild(this._svg);
    this._svg.html = iconSvg;
    this._backgound = this._svg.find('#bg');
    this._topline = this._svg.find('#topline');
    this._bottomline = this._svg.find('#bottomline');
    return false;
  };

  return NavArrow;

})(BaseDOM);

PaginationArrows = (function(superClass) {
  extend(PaginationArrows, superClass);

  PaginationArrows.PREV = 'prevPaginationArrows';

  PaginationArrows.NEXT = 'nextPaginationArrows';

  function PaginationArrows() {
    this._triggerNext = bind(this._triggerNext, this);
    this._triggerPrev = bind(this._triggerPrev, this);
    var data;
    data = {
      element: 'div',
      className: 'paginationArrows'
    };
    PaginationArrows.__super__.constructor.call(this, data);
  }

  PaginationArrows.prototype.create = function() {
    this._prevArrow = new NavArrow();
    this.appendChild(this._prevArrow);
    this._prevArrow.create();
    this._prevArrow.addClass('prev');
    this._nextArrow = new NavArrow();
    this.appendChild(this._nextArrow);
    this._nextArrow.create();
    this._nextArrow.addClass('next');
    this._prevArrow.element.on(MouseEvent.CLICK, this._triggerPrev);
    this._nextArrow.element.on(MouseEvent.CLICK, this._triggerNext);
    return false;
  };

  PaginationArrows.prototype.update = function(p_type) {
    if (p_type == null) {
      p_type = 'all';
    }
    if (p_type === 'all') {
      this._prevArrow.css({
        display: 'block'
      });
      this._nextArrow.css({
        display: 'block'
      });
    } else if (p_type === 'first') {
      this._prevArrow.css({
        display: 'none'
      });
      this._nextArrow.css({
        display: 'block'
      });
    } else if (p_type === 'last') {
      this._prevArrow.css({
        display: 'block'
      });
      this._nextArrow.css({
        display: 'none'
      });
    }
    return false;
  };

  PaginationArrows.prototype._triggerPrev = function(e) {
    this.trigger(PaginationArrows.PREV);
    return false;
  };

  PaginationArrows.prototype._triggerNext = function(e) {
    this.trigger(PaginationArrows.NEXT);
    return false;
  };

  return PaginationArrows;

})(BaseDOM);

GalleryThumbs = (function(superClass) {
  extend(GalleryThumbs, superClass);

  GalleryThumbs.RESET = 'resetGalleryThumb';

  GalleryThumbs.READY = 'readyGalleryThumb';

  GalleryThumbs.SELECT = 'selectGalleryThumb';

  GalleryThumbs.MOBILE_SELECT = 'mobileselectGalleryThumb';

  GalleryThumbs.LOAD_ANIMATION_COMPLETE = 'loadAnimatioNCompleteGalleryThumbs';

  GalleryThumbs.MOBILE_CLICK = 'mobicleClickGalleryThumbs';

  function GalleryThumbs() {
    this._thumbReady = bind(this._thumbReady, this);
    this._loadDone = bind(this._loadDone, this);
    this._onThumbClick = bind(this._onThumbClick, this);
    this._thumbClick = bind(this._thumbClick, this);
    this._thumbFadeOut = bind(this._thumbFadeOut, this);
    this._thumbFadeOver = bind(this._thumbFadeOver, this);
    this._mobNext = bind(this._mobNext, this);
    this._mobPrev = bind(this._mobPrev, this);
    this._navigate = bind(this._navigate, this);
    this._handleTouch = bind(this._handleTouch, this);
    this._displayLines = bind(this._displayLines, this);
    this._hideContainer = bind(this._hideContainer, this);
    this._showContainer = bind(this._showContainer, this);
    var data;
    data = {
      element: 'div',
      className: 'galleryThumbs'
    };
    GalleryThumbs.__super__.constructor.call(this, data);
  }

  GalleryThumbs.prototype.create = function(p_data) {
    var _line, _thumb, i, len1, m, q, ref, ref1, thumb;
    this.data = p_data;
    this._shown = true;
    this._ready = false;
    this._bk = '';
    this._cols = 3;
    this._rows = 2;
    this._maxNav = this.data.length / this._cols / this._rows;
    this._maxNavMob = this.data.length - 1;
    this._current = 0;
    this._currentMob = 0;
    this._thumbs = [];
    this._loadedThumbs = 0;
    ref = this.data;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      thumb = ref[i];
      _thumb = new ThumbItem();
      _thumb.on(ThumbItem.READY, this._thumbReady);
      this.appendChild(_thumb);
      _thumb.create(thumb);
      _thumb.element.on(MouseEvent.CLICK, this._onThumbClick);
      _thumb.css({
        zIndex: this.data.length - i
      });
      this._thumbs.push(_thumb);
    }
    this._thumbLines = [];
    for (i = q = 0, ref1 = this._cols * this._rows; 0 <= ref1 ? q < ref1 : q > ref1; i = 0 <= ref1 ? ++q : --q) {
      _line = new ThumbLines();
      this.appendChild(_line);
      _line.create();
      _line.id = i;
      _line.on(ThumbLines.OVER, this._thumbFadeOver);
      _line.on(ThumbLines.OUT, this._thumbFadeOut);
      _line.on(ThumbLines.CLICK, this._thumbClick);
      this._thumbLines.push(_line);
    }
    this._pagination = new PaginationIcons();
    this.appendChild(this._pagination);
    this._pagination.create();
    this._pagination.on(PaginationIcons.GOTO, this._navigate);
    this._arrows = new PaginationArrows;
    this.appendChild(this._arrows);
    this._arrows.create();
    this._arrows.on(PaginationArrows.PREV, this._mobPrev);
    this._arrows.on(PaginationArrows.NEXT, this._mobNext);
    this._touchControl = new Touch(this.element);
    this._touchControl.on(Touch.SWIPE, this._handleTouch);
    this.resize();
    return false;
  };

  GalleryThumbs.prototype.resize = function() {
    this._reorderThumbs();
    this._setNavType();
    if (this._bk === 'mobile' && !this._shown) {
      this.trigger(GalleryThumbs.MOBILE_SELECT, {
        index: this._currentMob
      });
      this.show();
    }
    return false;
  };

  GalleryThumbs.prototype.triggerOpen = function(p_n) {
    var _lineIndex, _maxItens, _navIndex;
    if (this._bk === 'mobile') {
      return;
    }
    _maxItens = this._cols * this._rows;
    _navIndex = Math.floor(p_n / _maxItens);
    _lineIndex = p_n % _maxItens;
    this._current = _navIndex;
    this._pagination.setCurrent(this._current);
    this._thumbClick({
      target: this._thumbLines[_lineIndex]
    }, {
      id: _lineIndex
    });
    return false;
  };

  GalleryThumbs.prototype.setThumbMobile = function(p_n) {
    var i, len1, m, ref, thumb;
    this._currentMob = p_n;
    ref = this._thumbs;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      thumb = ref[i];
      console.log(i, this._currentMob, 'hide');
      if (i >= this._currentMob) {
        break;
      }
      thumb.hide(0, 0);
    }
    this.trigger(GalleryThumbs.MOBILE_SELECT, {
      index: this._currentMob
    });
    return false;
  };

  GalleryThumbs.prototype.prepareLoading = function() {
    var ref, ref1;
    if ((ref = this._currentLine) != null) {
      ref.setLoadMode();
    }
    if ((ref1 = this._currentLine) != null) {
      ref1.on(ThumbLines.LOAD_ANIMATION_COMPLETE, this._loadDone);
    }
    return false;
  };

  GalleryThumbs.prototype.loadProgress = function(p_val) {
    if (this._currentLine == null) {
      return;
    }
    return this._currentLine.progress(p_val);
  };

  GalleryThumbs.prototype.resetThumb = function() {
    var index;
    if (this._currentLine != null) {
      index = this._bk === 'mobile' ? this._currentMob : this._currentLine.id + (this._current * this._cols * this._rows);
      this._thumbs[index].out();
      this._currentLine.hide();
    }
    return false;
  };

  GalleryThumbs.prototype.show = function(p_delay) {
    var len1, m, ref, thumb;
    if (p_delay == null) {
      p_delay = 0;
    }
    this._shown = true;
    this._showContainer();
    TweenMax.killDelayedCallsTo(this._hideContainer);
    TweenMax.killDelayedCallsTo(this._displayLines);
    this.resize();
    ref = this.thumbs;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      thumb = ref[m];
      thumb.slideUp(Math.random() * 0.3 + p_delay);
    }
    TweenMax.delayedCall(p_delay + 0.7, this._displayLines);
    return false;
  };

  GalleryThumbs.prototype.hide = function(p_delay, p_mult) {
    var d, len1, len2, line, m, maxD, q, ref, ref1, thumb;
    if (p_delay == null) {
      p_delay = 0;
    }
    if (p_mult == null) {
      p_mult = 1;
    }
    this._shown = false;
    TweenMax.killDelayedCallsTo(this._hideContainer);
    TweenMax.killDelayedCallsTo(this._displayLines);
    maxD = 0;
    ref = this.thumbs;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      thumb = ref[m];
      d = Math.random() * 0.4 + p_delay;
      thumb.slideDown(d * p_mult);
      maxD = Math.max(d, maxD);
    }
    ref1 = this._thumbLines;
    for (q = 0, len2 = ref1.length; q < len2; q++) {
      line = ref1[q];
      line.enabled = true;
      line.addClass('hidden');
    }
    TweenMax.delayedCall((maxD + 0.7) * p_mult, this._hideContainer);
    return false;
  };

  GalleryThumbs.prototype._showContainer = function() {
    this.removeClass('hidden');
    return false;
  };

  GalleryThumbs.prototype._hideContainer = function() {
    this.addClass('hidden');
    return false;
  };

  GalleryThumbs.prototype._displayLines = function() {
    var len1, line, m, ref;
    ref = this._thumbLines;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      line = ref[m];
      line.removeClass('hidden');
    }
    return false;
  };

  GalleryThumbs.prototype._reorderThumbs = function() {
    var _bk, i, len1, len2, line, m, q, r, ref, ref1, thumb;
    _bk = this._bk;
    this._bk = app.resizer.breakpoint;
    this._cols = 3;
    if (this._bk === 'mobile') {
      this._cols = 1;
    }
    this._rows = this._bk === 'mobile' ? 1 : 2;
    this._maxNav = Math.ceil(this.thumbs.length / this._cols / this._rows);
    this._maxNavMob = this.thumbs.length - 1;
    if (this._bk !== 'mobile' && this._bk !== _bk) {
      this._pagination.redraw(this._maxNav);
    }
    if (this._bk !== _bk) {
      this._resetNav();
    }
    if ((_bk !== 'mobile' && this._bk === 'mobile') || (_bk === 'mobile' && this._bk !== 'mobile')) {
      this.trigger(GalleryThumbs.RESET);
    }
    ref = this.thumbs;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      thumb = ref[i];
      r = ~~((i / this._cols) % this._rows);
      thumb.removeClass(thumb.className);
      thumb.addClass("thumbItem c" + (i % this._cols) + " r" + r);
    }
    ref1 = this._thumbLines;
    for (i = q = 0, len2 = ref1.length; q < len2; i = ++q) {
      line = ref1[i];
      r = ~~((i / this._cols) % this._rows);
      line.removeClass(line.className);
      if (i >= this._cols * this._rows) {
        line.addClass('hidden');
      }
      line.addClass("thumbLines c" + (i % this._cols) + " r" + r);
    }
    return false;
  };

  GalleryThumbs.prototype._setNavType = function() {
    if (this._bk === 'mobile') {
      this._pagination.addClass('hidden');
      this._arrows.removeClass('hidden');
    } else {
      this._pagination.removeClass('hidden');
      this._pagination.setCurrent(this._current);
      this._arrows.addClass('hidden');
    }
    return false;
  };

  GalleryThumbs.prototype._resetNav = function() {
    var len1, m, ref, thumb;
    this._current = 0;
    this._currentMob = 0;
    this._pagination.reset();
    this._arrows.update('first');
    ref = this.thumbs;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      thumb = ref[m];
      thumb.reset();
    }
    return false;
  };

  GalleryThumbs.prototype._handleTouch = function(e, data) {
    var _index;
    if (data.direction === 'left') {
      if (this._bk === 'mobile') {
        this._mobNavigate(1);
      } else {
        _index = this._current + 1 >= this._maxNav - 1 ? this._maxNav - 1 : this._current + 1;
        this._navigate(null, {
          index: _index
        });
      }
    }
    if (data.direction === 'right') {
      if (this._bk === 'mobile') {
        this._mobNavigate(-1);
      } else {
        _index = this._current - 1 <= 0 ? 0 : this._current - 1;
        this._navigate(null, {
          index: _index
        });
      }
    }
    return false;
  };

  GalleryThumbs.prototype._navigate = function(e, data) {
    var _old, d, direction, end, endNew, i, len1, m, ref, ref1, start, startNew, thumb, visItems;
    if (data.index === this._current) {
      return;
    }
    _old = this._current;
    this._current = data.index;
    this._pagination.setCurrent(this._current);
    visItems = this._cols * this._rows;
    end = visItems * (_old + 1);
    start = end - visItems;
    endNew = visItems * (this._current + 1);
    startNew = endNew - visItems;
    direction = end < endNew ? 1 : -1;
    ref1 = this.thumbs;
    ref = direction;
    for ((ref > 0 ? (i = m = 0, len1 = ref1.length) : i = m = ref1.length - 1); ref > 0 ? m < len1 : m >= 0; i = m += ref) {
      thumb = ref1[i];
      if (direction === 1) {
        if (i >= startNew) {
          break;
        }
        if ((i - start) < 0) {
          continue;
        }
        d = (i - start) * 0.07;
        thumb.hide(d);
      } else {
        if (i < startNew) {
          break;
        }
        if (start - i < 0) {
          continue;
        }
        d = (start - i) * 0.07;
        thumb.show(d);
      }
    }
    return false;
  };

  GalleryThumbs.prototype._mobPrev = function(e) {
    this._mobNavigate(-1);
    return false;
  };

  GalleryThumbs.prototype._mobNext = function(e) {
    this._mobNavigate(1);
    return false;
  };

  GalleryThumbs.prototype._mobNavigate = function(p_dir) {
    var _old, direction;
    _old = this._currentMob;
    this._currentMob += p_dir;
    this._currentMob = this._currentMob <= 0 ? 0 : this._currentMob;
    this._currentMob = this._currentMob > this.thumbs.length - 1 ? this.thumbs.length - 1 : this._currentMob;
    this._arrows.update();
    if (this._currentMob <= 0) {
      this._arrows.update('first');
    }
    if (this._currentMob >= this.thumbs.length - 1) {
      this._arrows.update('last');
    }
    direction = p_dir;
    if (direction === 1) {
      this.thumbs[this._currentMob - 1].hide();
    } else {
      this.thumbs[this._currentMob].show();
    }
    this.trigger(GalleryThumbs.MOBILE_SELECT, {
      index: this._currentMob
    });
    return false;
  };

  GalleryThumbs.prototype._thumbFadeOver = function(e, data) {
    var index;
    index = this._bk === 'mobile' ? this._currentMob : data.id + (this._current * this._cols * this._rows);
    this._thumbs[index].over();
    return false;
  };

  GalleryThumbs.prototype._thumbFadeOut = function(e, data) {
    var index;
    index = this._bk === 'mobile' ? this._currentMob : data.id + (this._current * this._cols * this._rows);
    this._thumbs[index].out();
    return false;
  };

  GalleryThumbs.prototype._thumbClick = function(e, data) {
    var index;
    index = this._bk === 'mobile' ? this._currentMob : data.id + (this._current * this._cols * this._rows);
    console.log(index, ' index');
    this._thumbs[index].out();
    this._currentLine = e.target;
    this.trigger(GalleryThumbs.SELECT, {
      id: index
    });
    return false;
  };

  GalleryThumbs.prototype._onThumbClick = function(e) {
    if (this._bk !== 'mobile') {
      return;
    }
    this.trigger(GalleryThumbs.MOBILE_CLICK, {
      id: this._currentMob
    });
    return false;
  };

  GalleryThumbs.prototype._loadDone = function(e, data) {
    console.log('_loaddone');
    this.trigger(GalleryThumbs.LOAD_ANIMATION_COMPLETE);
    return false;
  };

  GalleryThumbs.prototype._thumbReady = function(e, data) {
    ++this._loadedThumbs;
    if (this._loadedThumbs === this._thumbs.length) {
      this._ready = true;
      this.trigger(GalleryThumbs.READY);
    }
    return false;
  };

  GalleryThumbs.get({
    thumbs: function() {
      return this._thumbs;
    }
  });

  GalleryThumbs.get({
    ready: function() {
      return this._ready;
    }
  });

  GalleryThumbs.get({
    shown: function() {
      return this._shown;
    }
  });

  return GalleryThumbs;

})(BaseDOM);

NumberUtils = (function() {
  function NumberUtils() {}

  NumberUtils.isEven = function(p_value) {
    if (p_value % 2 === 0) {
      return true;
    } else {
      return false;
    }
  };

  NumberUtils.isZero = function(p_value) {
    return Math.abs(p_value) < 0.00001;
  };

  NumberUtils.toPercent = function(p_value, p_min, p_max) {
    return ((p_value - p_min) / (p_max - p_min)) * 100;
  };

  NumberUtils.percentToValue = function(p_percent, p_min, p_max) {
    return ((p_max - p_min) * p_percent) + p_min;
  };

  NumberUtils.getBytesAsMegabytes = function(p_bytes) {
    return (Math.floor((p_bytes / 1024 / 1024) * 100) / 100) + " MB";
  };

  NumberUtils.bytesTo = function(p_bytes) {
    if (p_bytes >= 1000000000) {
      return (p_bytes / 1000000000).toFixed(2) + ' GB';
    } else if (p_bytes >= 1000000) {
      return (p_bytes / 1000000).toFixed(2) + ' MB';
    } else if (p_bytes >= 1000) {
      return (p_bytes / 1000).toFixed(2) + ' KB';
    } else if (p_bytes > 1) {
      return p_bytes + ' bytes';
    } else if (p_bytes === 1) {
      return p_bytes + ' byte';
    } else {
      return '0 byte';
    }
  };

  NumberUtils.rangeRandom = function(p_low, p_high, p_rounded) {
    if (p_rounded == null) {
      p_rounded = false;
    }
    if (!p_rounded) {
      return (Math.random() * (p_high - p_low)) + p_low;
    } else {
      return Math.round(Math.round(Math.random() * (p_high - p_low)) + p_low);
    }
  };

  NumberUtils.distanceBetweenCoordinates = function(p_from, p_to, p_units) {
    var a, c, dLatitude, dLongitude, radius;
    if (p_units == null) {
      p_units = "km";
    }
    radius;
    switch (p_units) {
      case "km":
        radius = 6371;
        break;
      case "meters":
        radius = 6378000;
        break;
      case "feet":
        radius = 20925525;
        break;
      case "miles":
        radius = 3963;
    }
    dLatitude = (p_to.x - p_from.x) * Math.PI / 180;
    dLongitude = (p_to.y - p_from.y) * Math.PI / 180;
    a = Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) + Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(p_from.x * Math.PI / 180) * Math.cos(p_to.x * Math.PI / 180);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };

  return NumberUtils;

})();

ArrayUtils = (function() {
  function ArrayUtils() {}

  ArrayUtils.removeItem = function(p_array, p_item, p_clone) {
    var k, len1, m, result, v;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (v = m = 0, len1 = result.length; m < len1; v = ++m) {
      k = result[v];
      if (k === p_item) {
        result.splice(v, 1);
      }
    }
    return result;
  };

  ArrayUtils.removeItemByIndex = function(p_index, p_array, p_clone) {
    var result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    result.splice(p_index, 1);
    return result;
  };

  ArrayUtils.removeDuplicateStrings = function(p_array, p_clone) {
    if (p_clone == null) {
      p_clone = false;
    }
    return p_array.filter(function(el, pos, self) {
      return self.indexOf(el) === pos;
    });
  };

  ArrayUtils.hasItem = function(p_value, p_array) {
    return p_array.indexOf(p_value) > -1;
  };

  ArrayUtils.merge = function(p_arrayA, p_arrayB) {
    var i, j, result;
    result = [];
    i = 0;
    j = 0;
    while ((i < p_arrayA.length) || (j < p_arrayB.length)) {
      if (i < p_arrayA.length) {
        result.push(p_arrayA[i]);
        i++;
      }
      if (j < p_arrayB.length) {
        result.push(p_arrayB[j]);
        j++;
      }
    }
    return result;
  };

  ArrayUtils.randomIndex = function(p_array) {
    return NumberUtils.rangeRandom(0, p_array.length - 1, true);
  };

  ArrayUtils.randomItem = function(p_array) {
    return p_array[ArrayUtils.randomIndex(p_array)];
  };

  ArrayUtils.shuffle = function(p_array, p_clone) {
    var i, item, len1, m, random, result, temp;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (i = m = 0, len1 = result.length; m < len1; i = ++m) {
      item = result[i];
      random = Math.floor(Math.random() * result.length);
      temp = result[i];
      result[i] = result[random];
      result[random] = temp;
    }
    return result;
  };

  ArrayUtils.move = function(p_array, p_oldIndex, p_newIndex, p_clone) {
    var k, result;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    if (p_newIndex >= result.length) {
      k = new_index - result.length;
      while ((k--) + 1) {
        result.push(void 0);
      }
    }
    result.splice(p_newIndex, 0, result.splice(p_oldIndex, 1)[0]);
    return result;
  };

  ArrayUtils.fromMiddleToEnd = function(p_array) {
    var first, last, len, merged, midLen;
    len = p_array.length;
    midLen = Math.floor(len * 0.5);
    first = p_array.slice(midLen, len);
    last = p_array.slice(0, midLen).reverse();
    merged = this.merge(first, last);
    return merged;
  };

  ArrayUtils.fromEndToMiddle = function(p_array) {
    var newArray;
    newArray = this.fromMiddleToEnd(p_array);
    return newArray.reverse();
  };

  ArrayUtils.lastIndexOf = function(p_array, p_value) {
    var i, index, total;
    i = 0;
    total = p_array.length;
    index = -1;
    while (i !== total) {
      if (p_array[i] === p_value) {
        index = i;
      }
      i++;
    }
    return index;
  };

  return ArrayUtils;

})();

SpeedLines = (function(superClass) {
  extend(SpeedLines, superClass);

  function SpeedLines() {
    SpeedLines.__super__.constructor.apply(this, arguments);
    this.addClass('speedLines');
  }

  SpeedLines.prototype.create = function(p_data) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6;
    if (p_data == null) {
      p_data = null;
    }
    this._data = p_data;
    this._total = ((ref = this._data) != null ? ref['total'] : void 0) || ~~(Math.random() * 5) + 5;
    this._w = ((ref1 = this._data) != null ? ref1['width'] : void 0) || 100;
    this._h = ((ref2 = this._data) != null ? ref2['height'] : void 0) || 100;
    this._mode = ((ref3 = this._data) != null ? ref3['mode'] : void 0) || 'horizontal';
    this._direction = ((ref4 = this._data) != null ? ref4['direction'] : void 0) || 1;
    this._color = ((ref5 = this._data) != null ? ref5['color'] : void 0) || 0xffffff;
    this._weight = ((ref6 = this._data) != null ? ref6['weight'] : void 0) || 1;
    this._lines = [];
    this._container = new PIXI.Container();
    this._stage.addChild(this._container);
    this.resize(this._w, this._h);
    return this._drawLines();
  };

  SpeedLines.prototype.play = function(p_data) {
    var callback, ct, dcx, dcy, delay, dx, dy, i, l, len1, line, m, ref, size, stagger, time;
    if (p_data == null) {
      p_data = null;
    }
    this.start();
    time = (p_data != null ? p_data['time'] : void 0) || 0.3;
    delay = (p_data != null ? p_data['delay'] : void 0) || 0;
    stagger = (p_data != null ? p_data['stagger'] : void 0) || 0.07;
    callback = (p_data != null ? p_data['callback'] : void 0) || null;
    l = this._lines.length;
    ct = time * 2 + (stagger * l);
    if (this._mode === 'horizontal') {
      dcx = this._container.defaults.position.x + (this._direction === 1 ? this._w * 0.2 : -this._w * 0.2);
      dcy = 0;
    } else {
      dcx = 0;
      dcy = this._container.defaults.position.y + (this._direction === 1 ? this._h * 0.2 : -this._h * 0.2);
    }
    TweenMax.killTweensOf(this._container.position);
    TweenMax.set(this._container.position, {
      x: this._container.defaults.position.x,
      y: this._container.defaults.position.y
    });
    TweenMax.to(this._container.position, ct, {
      x: dcx,
      y: dcy,
      ease: Expo.easeInOut,
      delay: delay
    });
    ref = this._lines;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      line = ref[i];
      TweenMax.killTweensOf(line.scale);
      TweenMax.killTweensOf(line.position);
      dx = line.defaults.position.x;
      dy = line.defaults.position.y;
      size = line.defaults.size;
      TweenMax.set(line.position, {
        x: dx,
        y: dy
      });
      TweenMax.set(line.scale, {
        x: this._mode === 'horizontal' ? 0 : 1,
        y: this._mode === 'horizontal' ? 1 : 0
      });
      TweenMax.to(line.scale, time, {
        x: 1,
        y: 1,
        ease: Expo.easeInOut,
        delay: delay + i * stagger,
        onCompleteParams: [i === this._lines.length - 1]
      });
      TweenMax.to(line.position, time, {
        x: this._mode === 'horizontal' ? dx + size + Math.random() * (size * 0.2) : dx,
        y: this._mode === 'horizontal' ? dy : dy + size + Math.random() * (size * 0.2),
        ease: Expo.easeInOut,
        delay: delay + i * stagger + time
      });
      TweenMax.to(line.scale, time, {
        x: this._mode === 'horizontal' ? 0 : 1,
        y: this._mode === 'horizontal' ? 1 : 0,
        ease: Expo.easeInOut,
        delay: delay + i * stagger + time,
        onCompleteParams: [i === this._lines.length - 1],
        onComplete: (function(_this) {
          return function(p_last) {
            if (p_last) {
              TweenMax.killTweensOf(_this._container);
              if (typeof callback === "function") {
                callback();
              }
              return _this.stop();
            }
          };
        })(this)
      });
    }
    return false;
  };

  SpeedLines.prototype.resize = function(p_w, p_h) {
    this._w = p_w;
    this._h = p_h;
    this._renderer.resize(this._w, this._h);
    this._drawLines;
    return false;
  };

  SpeedLines.prototype._drawLines = function() {
    var _h, _line, _px, _py, i, len1, line, m, px, py, q, ref, ref1, size;
    ref = this._lines;
    for (m = 0, len1 = ref.length; m < len1; m++) {
      line = ref[m];
      TweenMax.killTweensOf(line);
      this._container.removeChild(line);
      line = null;
    }
    TweenMax.killTweensOf(this._container.position);
    this._lines = [];
    for (i = q = 0, ref1 = this._total; 0 <= ref1 ? q < ref1 : q > ref1; i = 0 <= ref1 ? ++q : --q) {
      size = this._mode === 'horizontal' ? this._w * 0.3 + Math.random() * (this._w * 0.1) : this._h * 0.3 + Math.random() * (this._h * 0.1);
      _px = 0;
      _py = 0;
      px = this._mode === 'horizontal' ? size : 0;
      py = this._mode === 'horizontal' ? 0 : size;
      _line = new PIXI.Graphics();
      _line.colorData = this._color;
      _line.lineStyle(this._weight, this._color, 1);
      _line.moveTo(_px, _py);
      _line.lineTo(px, py);
      this._container.addChild(_line);
      this._lines.push(_line);
      if (this._mode === 'horizontal') {
        _line.position.x = Math.random() * (this._w - size);
        _h = this._h / this._total;
        _line.position.y = i * _h + Math.random() * (_h * 0.5) - (_h * 0.25);
      } else {
        _line.position.x = Math.random() * this._w;
        _line.position.y = Math.random() * (this._h - size);
      }
      _line.defaults = {
        position: {
          x: _line.position.x,
          y: _line.position.y
        },
        size: size
      };
      _line.scale.x = this._mode === 'horizontal' ? 0 : 1;
      _line.scale.y = this._mode === 'horizontal' ? 1 : 0;
    }
    this._lines = ArrayUtils.shuffle(this._lines);
    if (this._mode === 'horizontal') {
      this._container.position.x = this._direction === 1 ? 0 : this._w;
      this._container.scale.x = this._direction;
    } else {
      this._container.position.y = this._direction === 1 ? 0 : this._h;
      this._container.scale.y = this._direction;
    }
    this._container.defaults = {
      position: {
        x: this._container.position.x,
        y: this._container.position.y
      }
    };
    return false;
  };

  SpeedLines.set({
    direction: function(p_value) {
      this._direction = p_value;
      return this._drawLines();
    }
  });

  SpeedLines.set({
    color: function(p_value) {
      this._color = p_value;
      return this._drawLines();
    }
  });

  SpeedLines.set({
    weight: function(p_value) {
      this._weight = p_value;
      return this._drawLines();
    }
  });

  SpeedLines.set({
    total: function(p_value) {
      this._total = p_value;
      return this._drawLines();
    }
  });

  return SpeedLines;

})(BaseCanvasDisplay);

GalleryView = (function(superClass) {
  extend(GalleryView, superClass);

  function GalleryView() {
    this._resize = bind(this._resize, this);
    this._onResetThumbs = bind(this._onResetThumbs, this);
    this._showBlock = bind(this._showBlock, this);
    this._hideBlock = bind(this._hideBlock, this);
    this._setContent = bind(this._setContent, this);
    this._photoLoadedOpen = bind(this._photoLoadedOpen, this);
    this._photoProgressOpen = bind(this._photoProgressOpen, this);
    this._loadAnimDoneThumb = bind(this._loadAnimDoneThumb, this);
    this._photoLoadedThumb = bind(this._photoLoadedThumb, this);
    this._photoProgressThumb = bind(this._photoProgressThumb, this);
    this._onOpenLoadShow = bind(this._onOpenLoadShow, this);
    this._onMobileSelect = bind(this._onMobileSelect, this);
    this._onMobileClickThumbs = bind(this._onMobileClickThumbs, this);
    this._onThumbSelect = bind(this._onThumbSelect, this);
    this._onSelect = bind(this._onSelect, this);
    this._onPrev = bind(this._onPrev, this);
    this._onNext = bind(this._onNext, this);
    this._onBack = bind(this._onBack, this);
    this._videoCreated = bind(this._videoCreated, this);
    this._onThumbsReady = bind(this._onThumbsReady, this);
    this._onChangeRoute = bind(this._onChangeRoute, this);
    this.destroy = bind(this.destroy, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    this.create = bind(this.create, this);
    this.createStart = bind(this.createStart, this);
    return GalleryView.__super__.constructor.apply(this, arguments);
  }

  GalleryView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryView.__super__.createStart.apply(this, arguments);
  };

  GalleryView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._routeData = null;
    this._current = null;
    this._galContent = this.content['gallery'];
    this.avoidTrackPushState = this._checkRoute();
    this._blocker = new BaseDOM({
      className: 'blocker'
    });
    this._openContent = new GalleryOpenContent();
    this._canvasTransition = new GalleryCanvasTransition();
    this._thumbs = new GalleryThumbs();
    this.appendChild(this._blocker);
    this.appendChild(this._canvasTransition);
    this.appendChild(this._thumbs);
    this.appendChild(this._openContent);
    this._openContent.create(this._galContent);
    this._canvasTransition.create(this._galContent);
    this._thumbs.create(this._galContent);
    app.on(GalleryContent.CLOSE, this._onBack);
    this._openContent.on(GalleryOpenContent.NEXT, this._onNext);
    this._openContent.on(GalleryOpenContent.PREV, this._onPrev);
    this._openContent.on(GalleryOpenContent.SELECT, this._onSelect);
    this._thumbs.on(GalleryThumbs.SELECT, this._onThumbSelect);
    this._thumbs.on(GalleryThumbs.MOBILE_SELECT, this._onMobileSelect);
    this._thumbs.on(GalleryThumbs.RESET, this._onResetThumbs);
    this._thumbs.on(GalleryThumbs.MOBILE_CLICK, this._onMobileClickThumbs);
    app.resizer.on(Resizer.RESIZE, this._resize);
    app.navigation.on(Navigation.CHANGE_ROUTE, this._onChangeRoute);
    this._resize(null, null);
    return GalleryView.__super__.create.apply(this, arguments);
  };

  GalleryView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._routeData = app.navigation.routeData;
    PageTransition.getInstance().hideStart();
    if (app.resizer.breakpoint === 'mobile') {
      this._routeData = null;
    }
    if (this._thumbs.ready && this._ytReady) {
      return GalleryView.__super__.showStart.apply(this, arguments);
    } else {
      this._thumbs.on(GalleryThumbs.READY, this._onThumbsReady);
      return this._openContent.on(GalleryOpenContent.VIDEO_CREATED, this._videoCreated);
    }
  };

  GalleryView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this._checkRoute() !== null) {
      if (app.resizer.breakpoint !== 'mobile') {
        this._thumbs.triggerOpen(this._checkRoute());
      } else {
        this._thumbs.setThumbMobile(this._checkRoute());
      }
    }
    this._routeData = null;
    return PageTransition.getInstance().hide(null, (function(_this) {
      return function() {
        return GalleryView.__super__.show.apply(_this, arguments);
      };
    })(this));
  };

  GalleryView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    PageTransition.getInstance().showStart();
    return GalleryView.__super__.hideStart.apply(this, arguments);
  };

  GalleryView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return PageTransition.getInstance().show(null, (function(_this) {
      return function() {
        return GalleryView.__super__.hide.apply(_this, arguments);
      };
    })(this));
  };

  GalleryView.prototype.destroy = function(evt) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    if (evt == null) {
      evt = null;
    }
    app.off(GalleryContent.CLOSE, this._onBack);
    app.resizer.off(Resizer.RESIZE, this._resize);
    app.navigation.off(Navigation.CHANGE_ROUTE, this._onChangeRoute);
    this._canvasTransition.off(GalleryCanvasTransition.SHOW_LOAD, this._onOpenLoadShow);
    this._openContent.off(GalleryOpenContent.NEXT, this._onNext);
    this._openContent.off(GalleryOpenContent.PREV, this._onPrev);
    this._openContent.off(GalleryOpenContent.SELECT, this._onSelect);
    this._openContent.off(GalleryOpenContent.VIDEO_CREATED, this._videoCreated);
    this._thumbs.off(GalleryThumbs.SELECT, this._onThumbSelect);
    this._thumbs.off(GalleryThumbs.MOBILE_SELECT, this._onMobileSelect);
    this._thumbs.off(GalleryThumbs.RESET, this._onResetThumbs);
    this._thumbs.off(GalleryThumbs.MOBILE_CLICK, this._onMobileClickThumbs);
    this._thumbs.off(GalleryThumbs.READY, this._onThumbsReady);
    this._thumbs.off(GalleryThumbs.LOAD_ANIMATION_COMPLETE, this._loadAnimDoneThumb);
    if ((ref = this._picLoader) != null) {
      ref.off('fileload', this._photoLoadedThumb);
    }
    if ((ref1 = this._picLoader) != null) {
      ref1.off('fileprogress', this._photoProgressThumb);
    }
    if ((ref2 = this._picLoader) != null) {
      ref2.off('fileload', this._photoLoadedOpen);
    }
    if ((ref3 = this._picLoader) != null) {
      ref3.off('fileprogress', this._photoProgressOpen);
    }
    if ((ref4 = this._picLoader) != null) {
      ref4.off('fileload', this._photoLoadedOpen);
    }
    if ((ref5 = this._picLoader) != null) {
      ref5.off('fileprogress', this._photoProgressOpen);
    }
    TweenMax.killDelayedCallsTo(this._hideBlock);
    TweenMax.killDelayedCallsTo(this._setContent);
    return GalleryView.__super__.destroy.apply(this, arguments);
  };

  GalleryView.prototype._onChangeRoute = function(e, data) {
    var _route, index, ref, ref1;
    if ((data != null ? (ref = data['data']) != null ? (ref1 = ref[1]) != null ? ref1['id'] : void 0 : void 0 : void 0) != null) {
      _route = data['data'][1]['id'];
      index = this._getIndex(_route.split('/')[1]);
      if (!this._thumbs.shown) {
        this._onSelect(null, {
          id: index
        });
      } else {
        this._thumbs.triggerOpen(this._checkRoute());
      }
    } else {
      this._onBack(null);
    }
    return false;
  };

  GalleryView.prototype._onThumbsReady = function(e, data) {
    this._checkReady();
    return false;
  };

  GalleryView.prototype._videoCreated = function(e) {
    this._ytReady = true;
    this._checkReady();
    return false;
  };

  GalleryView.prototype._checkReady = function() {
    console.log('@_thumbs.ready && @_ytReady:', this._thumbs.ready, this._ytReady);
    if (this._thumbs.ready && this._ytReady) {
      this.trigger(BaseView.SHOW_START, this);
      this.show();
    }
    return false;
  };

  GalleryView.prototype._onBack = function(e) {
    this._openContent.stopVideo();
    this._thumbs.show();
    this._setRoute(true);
    return false;
  };

  GalleryView.prototype._onNext = function(e, data) {
    var next;
    next = this.current + 1 >= this._galContent.length - 1 ? this._galContent.length - 1 : this.current + 1;
    if (next === this.current) {
      return;
    }
    this._onSelect(null, {
      id: next
    });
    return false;
  };

  GalleryView.prototype._onPrev = function(e, data) {
    var prev;
    prev = this.current - 1 <= 0 ? 0 : this.current - 1;
    if (prev === this.current) {
      return;
    }
    this._onSelect(null, {
      id: prev
    });
    return false;
  };

  GalleryView.prototype._onSelect = function(e, data) {
    var _current, pic, picId;
    this._showBlock();
    _current = this.current;
    this.current = data.id;
    this._direction = this.current > _current ? -1 : 1;
    picId = this._galContent[this.current]['full']['id'];
    this._picLoader = app.loader.getGroup(picId + 'group');
    pic = this._picLoader.getItem(picId);
    this._setRoute();
    if (pic != null) {
      this._transition();
    } else {
      this._preloadPhoto();
    }
    return false;
  };

  GalleryView.prototype._onThumbSelect = function(e, data) {
    var pic, pic2, picId;
    this._showBlock();
    this.current = data.id;
    picId = this._galContent[this.current]['full']['id'];
    this._picLoader = app.loader.getGroup(picId + 'group');
    pic = this._picLoader.getItem(picId);
    pic2 = app.loader.getItem(picId);
    this._setRoute();
    if ((pic != null) || (pic2 != null)) {
      this._showContent();
    } else {
      this._preloadPhoto(true);
    }
    return false;
  };

  GalleryView.prototype._onMobileClickThumbs = function(e, data) {
    var ref;
    if (((ref = this._galContent[data.id]) != null ? ref['videoid'] : void 0) != null) {
      window.open(this._galContent[data.id]['videourl'], '_blank');
    }
    return false;
  };

  GalleryView.prototype._onMobileSelect = function(e, data) {
    this._current = data.index;
    this._setRoute();
    this._setContent();
    return false;
  };

  GalleryView.prototype._preloadPhoto = function(p_fromThumb) {
    var picId, picSrc;
    if (p_fromThumb == null) {
      p_fromThumb = false;
    }
    picId = this._galContent[this.current]['full']['id'];
    picSrc = this._galContent[this.current]['full']['src'];
    if (p_fromThumb) {
      this._thumbs.prepareLoading();
      this._thumbs.on(GalleryThumbs.LOAD_ANIMATION_COMPLETE, this._loadAnimDoneThumb);
      this._picLoader.on('fileload', this._photoLoadedThumb);
      this._picLoader.on('fileprogress', this._photoProgressThumb);
      this._picLoader.loadFile({
        id: picId,
        src: picSrc
      });
    } else {
      this._canvasTransition.ready();
      this._canvasTransition.on(GalleryCanvasTransition.SHOW_LOAD, this._onOpenLoadShow);
      this._canvasTransition.showLoad(this.current, this._direction);
    }
    return false;
  };

  GalleryView.prototype._onOpenLoadShow = function(e) {
    var picId, picSrc;
    this._canvasTransition.off(GalleryCanvasTransition.SHOW_LOAD, this._onOpenLoadShow);
    picId = this._galContent[this.current]['full']['id'];
    picSrc = this._galContent[this.current]['full']['src'];
    this._picLoader.on('fileload', this._photoLoadedOpen);
    this._picLoader.on('fileprogress', this._photoProgressOpen);
    this._picLoader.loadFile({
      id: picId,
      src: picSrc
    });
    return false;
  };

  GalleryView.prototype._photoProgressThumb = function(e) {
    this._thumbs.loadProgress(e.progress);
    return false;
  };

  GalleryView.prototype._photoLoadedThumb = function(e) {
    var pic, picId;
    this._picLoader.off('fileload', this._photoLoadedThumb);
    this._picLoader.off('fileprogress', this._photoProgressThumb);
    this._thumbs.loadProgress(1);
    picId = this._galContent[this.current]['full']['id'];
    pic = this._picLoader.getItem(picId);
    return false;
  };

  GalleryView.prototype._loadAnimDoneThumb = function(e, data) {
    this._thumbs.off(GalleryThumbs.LOAD_ANIMATION_COMPLETE, this._loadAnimDoneThumb);
    this._showContent();
    return false;
  };

  GalleryView.prototype._photoProgressOpen = function(e) {
    this._canvasTransition.progress(e.progress);
    return false;
  };

  GalleryView.prototype._photoLoadedOpen = function(e) {
    this._picLoader.on('fileload', this._photoLoadedOpen);
    this._picLoader.on('fileprogress', this._photoProgressOpen);
    this._canvasTransition.hideLoad(this._direction);
    TweenMax.killDelayedCallsTo(this._hideBlock);
    TweenMax.delayedCall(1, this._hideBlock);
    this._openContent.setContent(this.current);
    return false;
  };

  GalleryView.prototype._transition = function() {
    TweenMax.killDelayedCallsTo(this._setContent);
    TweenMax.delayedCall(1, this._setContent);
    this._canvasTransition.ready();
    this._canvasTransition.slideTo(this._current, this._direction);
    TweenMax.killDelayedCallsTo(this._hideBlock);
    TweenMax.delayedCall(1, this._hideBlock);
    return false;
  };

  GalleryView.prototype._setContent = function() {
    this._openContent.setContent(this.current);
    return false;
  };

  GalleryView.prototype._showContent = function() {
    var mult;
    this._setContent();
    mult = this._routeData != null ? 0 : 1;
    this._thumbs.hide(0, mult);
    TweenMax.killDelayedCallsTo(this._hideBlock);
    TweenMax.delayedCall(1, this._hideBlock);
    return false;
  };

  GalleryView.prototype._hideBlock = function() {
    this._blocker.css({
      display: 'none'
    });
    return false;
  };

  GalleryView.prototype._showBlock = function() {
    this._blocker.css({
      display: 'block'
    });
    return false;
  };

  GalleryView.prototype._checkRoute = function() {
    var _route, index;
    _route = app.navigation.routeData.parsed.id;
    if (_route == null) {
      return null;
    }
    index = this._getIndex(_route.split('/')[1]);
    return index;
  };

  GalleryView.prototype._getIndex = function(p_routeId) {
    var i, index, item, len1, m, ref;
    index = null;
    ref = this._galContent;
    for (i = m = 0, len1 = ref.length; m < len1; i = ++m) {
      item = ref[i];
      if (item.route === p_routeId) {
        index = i;
        break;
      }
    }
    return index;
  };

  GalleryView.prototype._setRoute = function(p_base) {
    var base, r, rootURL;
    if (p_base == null) {
      p_base = false;
    }
    rootURL = app.root.replace(/\/$/gi, '');
    base = app.navigation.routeData.raw.replace(rootURL, '');
    base = base.split('/')[0];
    r = p_base ? '/' + base : '/' + base + '/' + this._galContent[this.current]['route'];
    app.navigation.gotoRoute(r);
    return false;
  };

  GalleryView.prototype._onResetThumbs = function(e, data) {
    if (app.resizer.breakpoint === 'mobile') {
      this.current = 0;
      this._setRoute();
    } else {
      this._setRoute(true);
    }
    return false;
  };

  GalleryView.prototype._resize = function(e, data) {
    this._thumbs.resize();
    this._canvasTransition.resize(this.width, this.height);
    return false;
  };

  GalleryView.set({
    current: function(p_val) {
      return this._current = p_val;
    }
  });

  GalleryView.get({
    current: function() {
      return this._current;
    }
  });

  return GalleryView;

})(BaseLoaderView);

GalleryInternalView = (function(superClass) {
  extend(GalleryInternalView, superClass);

  function GalleryInternalView() {
    this.destroyComplete = bind(this.destroyComplete, this);
    this.destroy = bind(this.destroy, this);
    this.hideComplete = bind(this.hideComplete, this);
    this.hide = bind(this.hide, this);
    this.hideStart = bind(this.hideStart, this);
    this.showComplete = bind(this.showComplete, this);
    this.show = bind(this.show, this);
    this.showStart = bind(this.showStart, this);
    this.createComplete = bind(this.createComplete, this);
    this.create = bind(this.create, this);
    this.createStart = bind(this.createStart, this);
    return GalleryInternalView.__super__.constructor.apply(this, arguments);
  }

  GalleryInternalView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    console.log('CREATE START INTERNAL');
    return GalleryInternalView.__super__.createStart.apply(this, arguments);
  };

  GalleryInternalView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.html = "GALLERY INTERNAL<br />";
    this.html += JSON.stringify(this.content);
    return GalleryInternalView.__super__.create.apply(this, arguments);
  };

  GalleryInternalView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.createComplete.apply(this, arguments);
  };

  GalleryInternalView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.showStart.apply(this, arguments);
  };

  GalleryInternalView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.show.apply(this, arguments);
  };

  GalleryInternalView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.showComplete.apply(this, arguments);
  };

  GalleryInternalView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.hideStart.apply(this, arguments);
  };

  GalleryInternalView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.hide.apply(this, arguments);
  };

  GalleryInternalView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.hideComplete.apply(this, arguments);
  };

  GalleryInternalView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.destroy.apply(this, arguments);
  };

  GalleryInternalView.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return GalleryInternalView.__super__.destroyComplete.apply(this, arguments);
  };

  return GalleryInternalView;

})(BaseView);

Main = (function(superClass) {
  extend(Main, superClass);

  function Main() {
    this._onItemClicked = bind(this._onItemClicked, this);
    this._buttonClicked = bind(this._buttonClicked, this);
    this.create = bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }

  Main.prototype.appendChild = function(child) {
    var fs, ref;
    if (app.resizer == null) {
      app.resizer = Resizer.getInstance();
    }
    fs = (ref = this.element.childNodes) != null ? ref[0] : void 0;
    if (child instanceof BaseView && fs) {
      this.element.insertBefore(child.element, fs);
      return;
    }
    return Main.__super__.appendChild.apply(this, arguments);
  };

  Main.prototype.create = function(evt) {
    var button, len1, m, ref;
    if (evt == null) {
      evt = null;
    }
    MouseEvent.getInstance(app.dd);
    LoadController.getInstance();
    Resizer.getInstance();
    this._banner = new Compare(this.content.compare);
    this.appendChild(this._banner);
    this._banner.create();
    this._menu = new FeaturesMenu(this.content.menu);
    this.appendChild(this._menu);
    this._menu.create();
    ref = document.querySelectorAll('a');
    for (m = 0, len1 = ref.length; m < len1; m++) {
      button = ref[m];
      button.addEventListener('click', this._buttonClicked);
    }
    return Main.__super__.create.apply(this, arguments);
  };

  Main.prototype._buttonClicked = function(e) {
    var current, rootPath;
    current = e.target;
    while (current.nodeName !== 'A') {
      current = current.parentNode;
    }
    rootPath = app.root.replace(/\/$/gi, '');
    if ((new RegExp(rootPath, 'gi')).test(current.href)) {
      e.preventDefault();
      return app.navigation.gotoRoute(current.href.replace(rootPath, '') || '/', true);
    }
  };

  Main.prototype._onItemClicked = function(e) {
    return app.navigation.gotoRoute(current.getAttribute('href'), true);
  };

  return Main;

})(NavigationContainer);

return new Main();
