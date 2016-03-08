(function() {
var ViewsData,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ViewsData = (function(_super) {
  __extends(ViewsData, _super);

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
    var data, k, klass, subview, v, view, _base, _ref;
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
      if ((_base = app.container).subviews == null) {
        _base.subviews = {};
      }
      app.container.subviews[view.id] = view;
    } else {
      if (typeof view.parentView === 'string') {
        view.parentView = this.get(view.parentView);
      }
    }
    if (view.subviews != null) {
      _ref = view.subviews;
      for (k in _ref) {
        v = _ref[k];
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

var BaseNavigationController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseNavigationController = (function(_super) {
  __extends(BaseNavigationController, _super);

  BaseNavigationController.CHANGE = 'base_navigation_controller_change';

  BaseNavigationController.CHANGE_VIEW = 'base_navigation_controller_change_view';

  BaseNavigationController.CHANGE_SUBVIEW = 'base_navigation_controller_change_subview';

  function BaseNavigationController() {
    this._removeFromWrapper = __bind(this._removeFromWrapper, this);
    this._appendToWrapper = __bind(this._appendToWrapper, this);
    this.change = __bind(this.change, this);
    BaseNavigationController.__super__.constructor.apply(this, arguments);
  }

  BaseNavigationController.prototype.setup = function(p_data) {
    var _ref, _ref1;
    this._views = new ViewsData(p_data);
    if (((_ref = app.navigation) != null ? _ref.instantiateViews : void 0) || ((_ref1 = app.navigation) != null ? _ref1.instantiateViews : void 0) === void 0) {
      this._views.createAll();
    }
    return false;
  };

  BaseNavigationController.prototype.start = function(p_id) {
    var view;
    if (p_id == null) {
      p_id = null;
    }
    if (this._started) {
      throw new Error('The instance of BaseNavigationController already started');
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

  BaseNavigationController.prototype.goto = function(p_id) {
    if (!this._started) {
      throw new Error('The instance of BaseNavigationController is not started');
    }
    this.change(p_id);
    return false;
  };

  BaseNavigationController.get({
    visibleViews: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.name + ' class');
    }
  });

  BaseNavigationController.get({
    currentView: function() {
      throw new Error('Override the currentView getter in ' + this.constructor.name + ' class');
    }
  });

  BaseNavigationController.get({
    previousView: function() {
      throw new Error('Override the previousView getter in ' + this.constructor.name + ' class');
    }
  });

  BaseNavigationController.get({
    data: function() {
      throw new Error('Override the data getter in ' + this.constructor.name + ' class');
    }
  });

  BaseNavigationController.prototype.change = function(p_id) {
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    return false;
  };

  BaseNavigationController.prototype._appendToWrapper = function(p_view) {
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

  BaseNavigationController.prototype._removeFromWrapper = function(p_view) {
    var err, wrapper;
    wrapper = (p_view != null ? p_view.parent : void 0) || (p_view != null ? p_view.parentView : void 0);
    try {
      return wrapper != null ? wrapper.removeChild(p_view) : void 0;
    } catch (_error) {
      err = _error;
      return console.log(err.stack);
    }
  };

  return BaseNavigationController;

})(EventDispatcher);

var DefaultNavigationController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DefaultNavigationController = (function(_super) {
  __extends(DefaultNavigationController, _super);

  DefaultNavigationController.HIDE_ALL_SUBVIEWS = 'navigation_controller_hide_all_subviews';

  DefaultNavigationController.SHOW_ALL_SUBVIEWS = 'navigation_controller_show_all_subviews';

  function DefaultNavigationController() {
    this._destroyComplete = __bind(this._destroyComplete, this);
    this._hideNext = __bind(this._hideNext, this);
    this._hideComplete = __bind(this._hideComplete, this);
    this._hide = __bind(this._hide, this);
    this._hideAllCallback = __bind(this._hideAllCallback, this);
    this._showNext = __bind(this._showNext, this);
    this._showComplete = __bind(this._showComplete, this);
    this._show = __bind(this._show, this);
    this._create = __bind(this._create, this);
    this.change = __bind(this.change, this);
    DefaultNavigationController.__super__.constructor.apply(this, arguments);
  }

  DefaultNavigationController.get({
    visibleViews: function() {
      return [this._currentView];
    }
  });

  DefaultNavigationController.get({
    currentView: function() {
      return this._currentView;
    }
  });

  DefaultNavigationController.get({
    previousView: function() {
      return this._previousView;
    }
  });

  DefaultNavigationController.get({
    data: function() {
      return {
        currentView: this.currentView,
        previousView: this.previousView,
        visibleViews: this.visiblesViews
      };
    }
  });

  DefaultNavigationController.prototype.change = function(p_id) {
    var _ref;
    if (((_ref = this._currentView) != null ? _ref.id : void 0) === p_id) {
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
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else if (this._previousView.parentPath.indexOf(this._currentView.parentView.id) !== -1) {
        this.indexView = 0;
        this.maxIndexView = (this._previousView.parentPath.length - 1) - (this._previousView.parentPath.indexOf(this._currentView.parentView.id) + 1);
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      } else {
        this.indexView = 0;
        this.maxIndexView = this._previousView.parentPath.length - 1;
        this.on(DefaultNavigationController.HIDE_ALL_SUBVIEWS, this._hideAllCallback);
        this._hide();
      }
    } else {
      this._currentView = this._views.create(p_id);
      this.indexView = 0;
      this.maxIndexView = this._currentView.parentPath.length - 1;
      this._create();
    }
    return DefaultNavigationController.__super__.change.apply(this, arguments);
  };

  DefaultNavigationController.prototype._create = function(evt) {
    var view, _ref;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._create);
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

  DefaultNavigationController.prototype._show = function(evt) {
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

  DefaultNavigationController.prototype._showComplete = function(evt) {
    var view;
    if (evt == null) {
      evt = null;
    }
    view = evt.currentTarget == null ? evt : evt.currentTarget;
    view.off(BaseView.SHOW_COMPLETE, this._showComplete);
    this._showNext(view);
    return false;
  };

  DefaultNavigationController.prototype._showNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._create();
    } else {
      this.trigger(DefaultNavigationController.SHOW_ALL_SUBVIEWS);
    }
    this.trigger(BaseNavigationController.CHANGE, {
      view: p_view,
      transition: 'show'
    });
    return false;
  };

  DefaultNavigationController.prototype._hideAllCallback = function(evt) {
    var _ref;
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._hideAllCallback);
        }
      }
    }
    this.indexView = 0;
    this.maxIndexView = this._currentView.parentPath.length - 1;
    this._create();
    return false;
  };

  DefaultNavigationController.prototype._hide = function(evt) {
    var view, _ref;
    if (evt == null) {
      evt = null;
    }
    if (evt != null) {
      if ((_ref = evt.currentTarget) != null) {
        if (typeof _ref.off === "function") {
          _ref.off(evt != null ? evt.type : void 0, this._hide);
        }
      }
    }
    view = this._views.create(this._previousView.reverseParentPath[this.indexView]);
    view.on(BaseView.HIDE_COMPLETE, this._hideComplete);
    view.hideStart();
    return false;
  };

  DefaultNavigationController.prototype._hideComplete = function(evt) {
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

  DefaultNavigationController.prototype._hideNext = function(p_view) {
    if (this.indexView < this.maxIndexView) {
      this.indexView++;
      this._hide();
    } else {
      this.trigger(DefaultNavigationController.HIDE_ALL_SUBVIEWS);
    }
    this.trigger(BaseNavigationController.CHANGE, {
      view: p_view,
      transition: 'hide'
    });
    return false;
  };

  DefaultNavigationController.prototype._destroyComplete = function(evt) {
    var view;
    view = evt.currentTarget;
    view.off(BaseView.DESTROY_COMPLETE, this._destroyComplete);
    this._removeFromWrapper(view);
    this._views.remove(view.id);
    this._hideNext(view);
    return false;
  };

  return DefaultNavigationController;

})(BaseNavigationController);

var NavigationRouter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NavigationRouter = (function(_super) {
  __extends(NavigationRouter, _super);

  NavigationRouter.CHANGE = 'route_path_change';

  NavigationRouter.CHANGE_ROUTE = 'route_match';

  function NavigationRouter() {
    this._onPathChange = __bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
  }

  NavigationRouter.prototype.setup = function(p_rootPath, p_forceHashBang) {
    var base, err, path, _ref;
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
      } catch (_error) {
        err = _error;
        console.log(err.stack);
      }
    }
    this._rootPath = p_rootPath.replace(/^(.*?)\/*$/, '$1/');
    this._rawPath = '';
    if (p_forceHashBang) {
      this._usePushState = false;
    } else {
      this._usePushState = (typeof window !== "undefined" && window !== null ? (_ref = window.history) != null ? _ref.pushState : void 0 : void 0) != null;
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
    }
    this._onPathChange();
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
    var i, pathData, route, routeData, routes, _ref, _results;
    pathData = this._parsePath(p_path);
    _ref = this._checkRoutes(pathData.path), routes = _ref[0], routeData = _ref[1];
    if (routes) {
      i = routes.length;
      _results = [];
      while (i-- > 0) {
        route = routes[i];
        _results.push(this.trigger(NavigationRouter.CHANGE_ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        }));
      }
      return _results;
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

  NavigationRouter.prototype.addRoute = function(p_route, p_data) {
    var err, i, labels, o, p, r, routeRE;
    if (p_data == null) {
      p_data = null;
    }
    if (typeof p_route !== 'string') {
      i = p_route.length;
      while (i-- > 0) {
        this.addRoute(p_route[i], p_data);
      }
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
      err = _error;
      console.log(err.stack);
      return;
    }
    this._routes[this._numRoutes++] = {
      data: p_data,
      route: p_route,
      routeRE: routeRE,
      labels: labels,
      numLabels: labels.length,
      numSlashes: p_route.split('/').length
    };
    return this._routes.sort(this._sortRoutes);
  };

  NavigationRouter.prototype.removeRoute = function(p_route) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        this._routes.splice(i, 1);
      }
    }
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };

  NavigationRouter.prototype._checkRoutes = function(p_path) {
    var data, foundRoute, i, j, label, o, re, route, routes, routesIndex, v, _i, _len, _ref;
    i = this._numRoutes;
    foundRoute = null;
    data = null;
    routes = [];
    routesIndex = 0;
    p_path = '/' + p_path;
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
      _ref = route.labels;
      for (j = _i = 0, _len = _ref.length; _i < _len; j = ++_i) {
        label = _ref[j];
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

var MetaController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MetaController = (function(_super) {
  __extends(MetaController, _super);

  function MetaController() {
    MetaController.__super__.constructor.apply(this, arguments);
  }

  MetaController.prototype.change = function(p_data) {
    this.title = p_data != null ? p_data.title : void 0;
    this.description = p_data != null ? p_data.description : void 0;
    return this.favicon = p_data != null ? p_data.favicon : void 0;
  };

  MetaController.get({
    head: function() {
      return document.head || document.getElementsByTagName('head')[0];
    }
  });

  MetaController.set({
    title: function(p_value) {
      if (p_value != null) {
        return document.title = p_value;
      }
    }
  });

  MetaController.set({
    description: function(p_value) {
      var meta;
      if (p_value != null) {
        if (document.querySelector('meta[name=description]') != null) {
          return document.querySelector('meta[name=description]').content = p_value;
        } else {
          meta = document.createElement('meta');
          this.head.appendChild(meta);
          meta.name = 'description';
          return meta.content = p_value;
        }
      }
    }
  });

  MetaController.set({
    favicon: function(p_value) {
      var link;
      if (p_value != null) {
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
    }
  });

  return MetaController;

})(EventDispatcher);

var Navigation,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Navigation = (function(_super) {
  var _controller, _meta, _router;

  __extends(Navigation, _super);

  Navigation.CHANGE_ROUTE = 'navigation_change_route';

  Navigation.CHANGE_VIEW = 'navigation_change_view';

  Navigation.CHANGE_INTERNAL_VIEW = 'navigation_change_internal_view';

  _controller = null;

  _router = null;

  _meta = null;

  function Navigation(p_controller) {
    if (p_controller == null) {
      p_controller = null;
    }
    this._routeChange = __bind(this._routeChange, this);
    this._navigationChange = __bind(this._navigationChange, this);
    this._getRouteByView = __bind(this._getRouteByView, this);
    this._getViewByRoute = __bind(this._getViewByRoute, this);
    this.gotoView = __bind(this.gotoView, this);
    this.goto = __bind(this.goto, this);
    this.gotoRoute = __bind(this.gotoRoute, this);
    this.setRoute = __bind(this.setRoute, this);
    this.gotoDefault = __bind(this.gotoDefault, this);
    this.start = __bind(this.start, this);
    this.setup = __bind(this.setup, this);
    if (!(p_controller instanceof BaseNavigationController)) {
      throw new Error('The instance of ' + p_controller + ' class is not either BaseNavigationController class');
    }
    _controller = p_controller;
    _router = new NavigationRouter();
    _meta = new MetaController();
    app.navigation = this;
    Navigation.__super__.constructor.apply(this, arguments);
  }

  Navigation.prototype.setup = function(p_data) {
    var k, v, _ref, _ref1, _ref2, _ref3;
    _controller.on(BaseNavigationController.CHANGE, this._navigationChange);
    _controller.on(BaseNavigationController.CHANGE_VIEW, this._navigationChange);
    _controller.setup(p_data);
    _router.on(NavigationRouter.CHANGE, this._routeChange);
    _router.on(NavigationRouter.CHANGE_ROUTE, this._routeChange);
    _router.setup(app.root, (_ref = app.config.navigation) != null ? _ref.forceHashBang : void 0);
    _ref1 = p_data.views;
    for (k in _ref1) {
      v = _ref1[k];
      if (v.route != null) {
        _router.addRoute(v.route);
      }
    }
    if (((_ref2 = app.config.navigation) != null ? _ref2.autoStart : void 0) || ((_ref3 = app.config.navigation) != null ? _ref3.autoStart : void 0) === void 0) {
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
    var _ref, _ref1;
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) != null) {
      this.goto((_ref1 = app.config.navigation) != null ? _ref1.defaultView : void 0);
    }
    return false;
  };

  Navigation.get({
    visibleViews: function() {
      return this._visibleViews || _controller.visibleViews;
    }
  });

  Navigation.get({
    currentView: function() {
      return this._currentView || _controller.currentView;
    }
  });

  Navigation.get({
    previousView: function() {
      return this._previousView || _controller.previousView;
    }
  });

  Navigation.get({
    routeData: function() {
      var pathData, results, routeData, _ref, _ref1;
      pathData = _router._parsePath(_router.getCurrentPath());
      routeData = _router._checkRoutes(pathData.path);
      results = {};
      if (routeData != null) {
        results.raw = pathData.rawPath;
        results.params = pathData.params;
        results.route = (_ref = routeData[0]) != null ? (_ref1 = _ref[0]) != null ? _ref1.route : void 0 : void 0;
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
    if (p_value == null) {
      return;
    }
    if (p_value.indexOf('/') === 0) {
      _router.goto(p_value, p_trigger);
    } else {
      throw new Error('The value "' + p_value + '" is not a valid format to route ("/example")');
    }
    return false;
  };

  Navigation.prototype.goto = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      this.gotoRoute(p_value);
    } else {
      this.gotoView(p_value);
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
    var k, view, _ref;
    _ref = app.config.views;
    for (k in _ref) {
      view = _ref[k];
      if ((view.route != null) && view.route === p_value) {
        return view.id;
      }
    }
    return null;
  };

  Navigation.prototype._getRouteByView = function(p_value) {
    var k, view, _ref;
    _ref = app.config.views;
    for (k in _ref) {
      view = _ref[k];
      if ((view.route != null) && view.id === p_value) {
        return view.route;
      }
    }
    return null;
  };

  Navigation.prototype._navigationChange = function(evt) {
    switch (evt.type) {
      case BaseNavigationController.CHANGE_VIEW:
        this._currentView = evt.data.currentView;
        this._previousView = evt.data.previousView;
        this._visibleViews = evt.data.visibleViews;
        this.trigger(Navigation.CHANGE_VIEW, {
          data: evt.data
        });
        _meta.change(this.currentView.meta);
        break;
      case BaseNavigationController.CHANGE:
        this.trigger(Navigation.CHANGE_INTERNAL_VIEW, {
          view: evt.view,
          transition: evt.transition
        });
    }
    return false;
  };

  Navigation.prototype._routeChange = function(evt) {
    if (evt == null) {
      evt = null;
    }
    switch (evt.type) {
      case NavigationRouter.CHANGE_ROUTE:
        this.trigger(Navigation.CHANGE_ROUTE, {
          data: this.routeData
        });
        if (this.routeData.route != null) {
          this.goto(this._getViewByRoute(this.routeData.route));
        }
    }
    return null;
  };

  return Navigation;

})(EventDispatcher);

var NumberUtils;

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


/**
Bunch of utilities methods for {Array}
@class ArrayUtils
 */
var ArrayUtils;

ArrayUtils = (function() {
  function ArrayUtils() {}

  ArrayUtils.removeItem = function(p_array, p_item, p_clone) {
    var k, result, v, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (v = _i = 0, _len = result.length; _i < _len; v = ++_i) {
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
    var i, item, random, result, temp, _i, _len;
    if (p_clone == null) {
      p_clone = false;
    }
    result = p_clone ? p_array.slice(0) : p_array;
    for (i = _i = 0, _len = result.length; _i < _len; i = ++_i) {
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

var ScrollNavigationController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScrollNavigationController = (function(_super) {
  __extends(ScrollNavigationController, _super);

  function ScrollNavigationController() {
    this._onAutoKill = __bind(this._onAutoKill, this);
    this._onCompleteAutoScroll = __bind(this._onCompleteAutoScroll, this);
    this._onStartAutoScroll = __bind(this._onStartAutoScroll, this);
    this._scrollToView = __bind(this._scrollToView, this);
    this._show = __bind(this._show, this);
    this._snapping = __bind(this._snapping, this);
    this._isVisible = __bind(this._isVisible, this);
    this._onScroll = __bind(this._onScroll, this);
    this.change = __bind(this.change, this);
    ScrollNavigationController.__super__.constructor.apply(this, arguments);
  }

  ScrollNavigationController.get({
    visibleViews: function() {
      return this._visibleViews;
    }
  });

  ScrollNavigationController.get({
    currentView: function() {
      return this._currentView;
    }
  });

  ScrollNavigationController.get({
    previousView: function() {
      return this._previousView;
    }
  });

  ScrollNavigationController.get({
    data: function() {
      return {
        currentView: this.currentView,
        previousView: this.previousView,
        visibleViews: this._visibleViews
      };
    }
  });

  ScrollNavigationController.prototype.start = function(p_id) {
    var k, v, view, _ref, _ref1;
    if (p_id == null) {
      p_id = null;
    }
    if (app.config.navigation.options != null) {
      this._options = app.config.navigation.options;
    } else {
      throw new Error('The options object in config.json file must be created to use this navigation, see a example in source code.');

      /*
      			"navigation":{
      				"type":"scroll",
      				"options":{
      					"orientation":"vertical",
      					"scrollToTime":0,
      					"showViewPercent":0.5,
      					"snap":{
      						"delay":0
      					}
      				}
      			}
       */
    }
    this._visibleViews = this._visibleViews || [];
    this._autoScrolling = false;
    this._orientation = (this._options.orientation != null) && (this._options.orientation === 'vertical' || this._options.orientation === 'horizontal') ? this._options.orientation : 'vertical';
    this._snapDelay = (((_ref = this._options.snap) != null ? _ref.delay : void 0) != null) && this._options.snap.delay > 0 ? this._options.snap.delay : 0;
    this._scrollToTime = this._options.scrollToTime >= 0 ? this._options.scrollToTime : .5;
    this._showViewPercent = this._options.showViewPercent >= 0 || this._options.showViewPercent <= 1 ? this._options.showViewPercent : .5;
    _ref1 = app.config.views;
    for (k in _ref1) {
      v = _ref1[k];
      view = this._views.create(k);
      this._appendToWrapper(view);
      view.createStart();
    }
    window.addEventListener("scroll", this._onScroll);
    this._onScroll(null);
    return ScrollNavigationController.__super__.start.call(this, p_id);
  };

  ScrollNavigationController.prototype.change = function(p_id) {
    var _ref;
    if (((_ref = this._currentView) != null ? _ref.id : void 0) === p_id) {
      return;
    }
    if (this._currentView != null) {
      this._previousView = this._currentView;
    }
    this._currentView = this._views.create(p_id);
    return this._scrollToView(p_id);
  };

  ScrollNavigationController.prototype._onScroll = function(evt) {
    var currentView, index, k, v, view, view_bounds, _ref, _ref1, _results;
    this._visibleViews = this._visibleViews || [];
    currentView = null;
    _ref = app.config.views;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      view = this._views.create(k);
      view_bounds = (this._orientation === 'vertical' ? view.height + view.element.offsetTop : view.width + view.element.offsetLeft) - this._getScrollValue;
      if (this._isVisible(view)) {
        if (this._visibleViews.indexOf(view) < 0) {
          this._visibleViews.push(view);
        }
      } else {
        index = this._visibleViews.indexOf(view);
        if (index >= 0) {
          ArrayUtils.removeItemByIndex(index, this._visibleViews);
        }
      }
      if (view_bounds > ((this._orientation === 'vertical' ? window.innerHeight : window.innerWidth) * this._showViewPercent) && currentView === null) {
        currentView = view;
        this._snapping(view);
        if (((_ref1 = this._currentView) != null ? _ref1.id : void 0) === view.id) {
          continue;
        }
        if (this._currentView != null) {
          this._previousView = this._currentView;
        }
        this._currentView = this._views.create(view.id);
        _results.push(this._show(view));
      } else {
        _results.push(view.pause());
      }
    }
    return _results;
  };

  ScrollNavigationController.prototype._isVisible = function(p_view) {
    var elementBottom, elementLeft, elementRight, elementTop;
    if (this._orientation === 'vertical') {
      elementTop = p_view.element.offsetTop;
      elementBottom = elementTop + p_view.height;
      return (this._getScrollValue + window.innerHeight) > elementTop && this._getScrollValue + window.innerHeight < (elementBottom + window.innerHeight);
    } else {
      elementLeft = p_view.element.offsetLeft;
      elementRight = elementLeft + p_view.width;
      return (this._getScrollValue + window.innerWidth) > elementLeft && this._getScrollValue + window.innerWidth < (elementRight + window.innerWidth);
    }
  };

  ScrollNavigationController.prototype._snapping = function(p_view) {
    if (!this._autoScrolling && this._snapDelay > 0) {
      TweenMax.killDelayedCallsTo(this._scrollToView);
      return TweenMax.delayedCall(this._snapDelay, this._scrollToView, [p_view.id]);
    }
  };

  ScrollNavigationController.prototype._show = function(p_view) {
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    if (p_view.showed) {
      return p_view.resume();
    } else {
      return p_view.showStart();
    }
  };

  ScrollNavigationController.prototype._scrollToView = function(p_id) {
    var view;
    view = this._views.create(p_id);
    TweenMax.killTweensOf(window);
    if (this._orientation === 'vertical') {
      TweenMax.to(window, this._scrollToTime, {
        scrollTo: {
          y: view.element.offsetTop,
          onAutoKill: this._onAutoKill
        },
        ease: Quad.easeOut,
        onStart: this._onStartAutoScroll,
        onComplete: this._onCompleteAutoScroll
      });
    } else {
      TweenMax.to(window, this._scrollToTime, {
        scrollTo: {
          x: view.element.offsetLeft,
          onAutoKill: this._onAutoKill
        },
        ease: Quad.easeOut,
        onStart: this._onStartAutoScroll,
        onComplete: this._onCompleteAutoScroll
      });
    }
    TweenMax.killDelayedCallsTo(this._show);
    return TweenMax.delayedCall(this._scrollToTime, this._show, [view]);
  };

  ScrollNavigationController.prototype._onStartAutoScroll = function() {
    return this._autoScrolling = true;
  };

  ScrollNavigationController.prototype._onCompleteAutoScroll = function() {
    return this._autoScrolling = false;
  };

  ScrollNavigationController.prototype._onAutoKill = function(event) {
    return this._autoScrolling = false;
  };

  ScrollNavigationController.get({
    _getScrollValue: function() {
      var B, D;
      if (this._orientation === 'vertical') {
        if (typeof pageYOffset !== 'undefined') {
          return pageYOffset;
        } else {
          B = document.body;
          D = document.documentElement;
          D = D.clientHeight ? D : B;
          return D.scrollTop;
        }
      } else {
        if (typeof pageXOffset !== 'undefined') {
          return pageXOffset;
        } else {
          B = document.body;
          D = document.documentElement;
          D = D.clientWidth ? D : B;
          return D.scrollLeft;
        }
      }
    }
  });

  return ScrollNavigationController;

})(BaseNavigationController);

var NavigationContainer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NavigationContainer = (function(_super) {
  __extends(NavigationContainer, _super);

  NavigationContainer.DEFAULT_NAVIGATION = "default";

  NavigationContainer.SCROLL_NAVIGATION = "scroll";

  NavigationContainer.controller = null;

  function NavigationContainer() {
    this.setupNavigation = __bind(this.setupNavigation, this);
    NavigationContainer.__super__.constructor.call(this, null, 'nav-container');
  }

  NavigationContainer.prototype.setupNavigation = function(p_data) {
    this._navigation = new Navigation(this.controller);
    return this._navigation.setup(p_data);
  };

  NavigationContainer.get({
    navigation: function() {
      return this._navigation;
    }
  });

  NavigationContainer.get({
    controller: function() {
      if (!NavigationContainer.controller) {
        switch (app.config.navigation.type) {
          case NavigationContainer.SCROLL_NAVIGATION:
            NavigationContainer.controller = new ScrollNavigationController();
            break;
          case NavigationContainer.DEFAULT_NAVIGATION:
            break;
          default:
            NavigationContainer.controller = new DefaultNavigationController();
        }
      }
      return NavigationContainer.controller;
    }
  });

  return NavigationContainer;

})(BaseView);

var HomeVideo,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HomeVideo = (function(_super) {
  __extends(HomeVideo, _super);

  HomeVideo.CAN_PLAY = 'canplaytroughHomeVideo';

  HomeVideo.PLAY = 'playHomeVideo';

  HomeVideo.PAUSE = 'pauseHomeVideo';

  HomeVideo.COMPLETE = 'completeHomeVideo';

  function HomeVideo(data) {
    this._playAgain = __bind(this._playAgain, this);
    this._handler = __bind(this._handler, this);
    this._data = data;
    HomeVideo.__super__.constructor.call(this, {
      className: 'home-video'
    });
  }

  HomeVideo.prototype.create = function() {
    return false;
  };

  HomeVideo.prototype.setVideo = function(p_video) {
    var _ref, _ref1, _ref2;
    if ((_ref = this._video) != null) {
      _ref.off('play', this._handler);
    }
    if ((_ref1 = this._video) != null) {
      _ref1.off('pause', this._handler);
    }
    if ((_ref2 = this._video) != null) {
      _ref2.off('ended', this._handler);
    }
    this._video = p_video;
    this.appendChild(this._video);
    this._video.on('play', this._handler);
    this._video.on('pause', this._handler);
    this._video.on('ended', this._handler);
    this._video.setAttribute("autoplay", "true");
    this._video.setAttribute("preload", "auto");
    return false;
  };

  HomeVideo.prototype.play = function() {
    var _ref, _ref1;
    if ((_ref = this._video) != null) {
      _ref.currentTime = 0;
    }
    if ((_ref1 = this._video) != null) {
      _ref1.play();
    }
    return false;
  };

  HomeVideo.prototype.pause = function() {
    this._video.pause();
    return false;
  };

  HomeVideo.prototype._handler = function(evt) {
    switch (evt.type) {
      case 'canplaytrough':
        this.trigger(HomeVideo.CAN_PLAY);
        break;
      case 'play':
        this.trigger(HomeVideo.PLAY);
        break;
      case 'pause':
        this.trigger(HomeVideo.PAUSE);
        break;
      case 'ended':
        this.trigger(HomeVideo.COMPLETE);
    }
    return false;
  };

  HomeVideo.prototype._playAgain = function(e) {
    this.play();
    return false;
  };

  return HomeVideo;

})(BaseDOM);

var HomeView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HomeView = (function(_super) {
  __extends(HomeView, _super);

  function HomeView() {
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this._handler = __bind(this._handler, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.createStart.apply(this, arguments);
  };

  HomeView.prototype.create = function(evt) {
    var color, i, splitText;
    if (evt == null) {
      evt = null;
    }
    color = Math.floor(Math.random() * 16777215).toString(16);
    this.test = new BaseDOM('div');
    this.appendChild(this.test);
    this.test.text = "Lorem <b>ipsum</b> <a href='http://google.com.br'>google</a></b> dolor";
    this.test.css({
      'width': '1550px',
      'height': '550px',
      'display': 'table-cell',
      'background-color': '#' + color
    });
    splitText = SplitTextUtils.splitHTMLWords(this.test);
    i = splitText.length;
    while (i-- > 0) {
      TweenMax.to(splitText[i], 1, {
        opacity: 0,
        delay: Math.random() * 2
      });
    }
    return HomeView.__super__.create.apply(this, arguments);
  };

  HomeView.prototype._handler = function(evt) {
    return false;
  };

  HomeView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.set(this.test.element, {
      opacity: 0
    });
    return HomeView.__super__.createComplete.apply(this, arguments);
  };

  HomeView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.showStart.apply(this, arguments);
  };

  HomeView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .5, {
      opacity: 1,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return HomeView.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  HomeView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.showComplete.apply(this, arguments);
  };

  HomeView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.hideStart.apply(this, arguments);
  };

  HomeView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .5, {
      opacity: 0,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return HomeView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  HomeView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.hideComplete.apply(this, arguments);
  };

  HomeView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off('click', this.go);
    if (this.test) {
      TweenMax.killTweensOf(this.test);
      this.test.destroy();
      this.removeChild(this.test);
      this.test = null;
    }
    if (this.a) {
      this.a.destroy();
      this.removeChild(this.a);
      this.a = null;
    }
    if (this.b) {
      this.b.destroy();
      this.removeChild(this.b);
      this.b = null;
    }
    return HomeView.__super__.destroy.apply(this, arguments);
  };

  HomeView.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return HomeView.__super__.destroyComplete.apply(this, arguments);
  };

  return HomeView;

})(BaseView);

var Test1View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Test1View = (function(_super) {
  __extends(Test1View, _super);

  function Test1View() {
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.changeSubview = __bind(this.changeSubview, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return Test1View.__super__.constructor.apply(this, arguments);
  }

  Test1View.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.createStart.apply(this, arguments);
  };

  Test1View.prototype.create = function(evt) {
    var color;
    if (evt == null) {
      evt = null;
    }
    color = Math.floor(Math.random() * 16777215).toString(16);
    this.test = new BaseDOM('div');
    this.appendChild(this.test);
    this.test.text = "BLAH BLHA BLHA BLHA";
    this.test.css({
      'width': '1100px',
      'height': '800px',
      'display': 'table-cell',
      'background-color': '#' + color
    });
    return Test1View.__super__.create.apply(this, arguments);
  };

  Test1View.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.set(this.test.element, {
      opacity: 0
    });
    return Test1View.__super__.createComplete.apply(this, arguments);
  };

  Test1View.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.showStart.apply(this, arguments);
  };

  Test1View.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .5, {
      opacity: 1,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Test1View.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  Test1View.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.showComplete.apply(this, arguments);
  };

  Test1View.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.hideStart.apply(this, arguments);
  };

  Test1View.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .5, {
      opacity: 0,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Test1View.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  Test1View.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.hideComplete.apply(this, arguments);
  };

  Test1View.prototype.changeSubview = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.changeSubview.apply(this, arguments);
  };

  Test1View.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off();
    TweenMax.killTweensOf(this.test);
    this.removeChild(this.test);
    this.test = null;
    return Test1View.__super__.destroy.apply(this, arguments);
  };

  Test1View.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Test1View.__super__.destroyComplete.apply(this, arguments);
  };

  return Test1View;

})(BaseView);

var Sub1View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Sub1View = (function(_super) {
  __extends(Sub1View, _super);

  function Sub1View() {
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.changeSubview = __bind(this.changeSubview, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return Sub1View.__super__.constructor.apply(this, arguments);
  }

  Sub1View.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.createStart.apply(this, arguments);
  };

  Sub1View.prototype.create = function(evt) {
    var color;
    if (evt == null) {
      evt = null;
    }
    color = Math.floor(Math.random() * 16777215).toString(16);
    this.test = new BaseDOM('div');
    this.appendChild(this.test);
    this.test.text = "SUB 1";
    this.test.css({
      'width': '1350px',
      'height': '350px',
      'display': 'table-cell',
      'background-color': '#' + color
    });
    return Sub1View.__super__.create.apply(this, arguments);
  };

  Sub1View.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.set(this.test.element, {
      opacity: 0
    });
    return Sub1View.__super__.createComplete.apply(this, arguments);
  };

  Sub1View.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.showStart.apply(this, arguments);
  };

  Sub1View.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .3, {
      opacity: 1,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Sub1View.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  Sub1View.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.showComplete.apply(this, arguments);
  };

  Sub1View.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.hideStart.apply(this, arguments);
  };

  Sub1View.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .3, {
      opacity: 0,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Sub1View.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  Sub1View.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.hideComplete.apply(this, arguments);
  };

  Sub1View.prototype.changeSubview = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.changeSubview.apply(this, arguments);
  };

  Sub1View.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off();
    if (this.test) {
      TweenMax.killTweensOf(this.test);
      this.test.destroy();
      this.removeChild(this.test);
      this.test = null;
    }
    return Sub1View.__super__.destroy.apply(this, arguments);
  };

  Sub1View.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub1View.__super__.destroyComplete.apply(this, arguments);
  };

  return Sub1View;

})(BaseView);

var Sub2View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Sub2View = (function(_super) {
  __extends(Sub2View, _super);

  function Sub2View() {
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.changeSubview = __bind(this.changeSubview, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return Sub2View.__super__.constructor.apply(this, arguments);
  }

  Sub2View.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.createStart.apply(this, arguments);
  };

  Sub2View.prototype.create = function(evt) {
    var color;
    if (evt == null) {
      evt = null;
    }
    color = Math.floor(Math.random() * 16777215).toString(16);
    this.test = new BaseDOM('div');
    this.appendChild(this.test);
    this.test.text = "SUB 2";
    this.test.css({
      'width': '1450px',
      'height': '550px',
      'display': 'table-cell',
      'background-color': '#' + color
    });
    return Sub2View.__super__.create.apply(this, arguments);
  };

  Sub2View.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.set(this.test.element, {
      opacity: 0
    });
    return Sub2View.__super__.createComplete.apply(this, arguments);
  };

  Sub2View.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.showStart.apply(this, arguments);
  };

  Sub2View.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .3, {
      opacity: 1,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Sub2View.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  Sub2View.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.showComplete.apply(this, arguments);
  };

  Sub2View.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.hideStart.apply(this, arguments);
  };

  Sub2View.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.test != null) {
      return TweenMax.to(this.test.element, .3, {
        opacity: 0,
        ease: Quad.easeOut,
        onComplete: (function(_this) {
          return function() {
            return Sub2View.__super__.hide.apply(_this, arguments);
          };
        })(this)
      });
    }
  };

  Sub2View.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.hideComplete.apply(this, arguments);
  };

  Sub2View.prototype.changeSubview = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.changeSubview.apply(this, arguments);
  };

  Sub2View.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off();
    if (this.test) {
      TweenMax.killTweensOf(this.test);
      this.test.destroy();
      this.removeChild(this.test);
      this.test = null;
    }
    return Sub2View.__super__.destroy.apply(this, arguments);
  };

  Sub2View.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub2View.__super__.destroyComplete.apply(this, arguments);
  };

  return Sub2View;

})(BaseView);

var Sub3View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Sub3View = (function(_super) {
  __extends(Sub3View, _super);

  function Sub3View() {
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.changeSubview = __bind(this.changeSubview, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    return Sub3View.__super__.constructor.apply(this, arguments);
  }

  Sub3View.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.createStart.apply(this, arguments);
  };

  Sub3View.prototype.create = function(evt) {
    var color;
    if (evt == null) {
      evt = null;
    }
    color = Math.floor(Math.random() * 16777215).toString(16);
    this.test = new BaseDOM('div');
    this.appendChild(this.test);
    this.test.text = "SUB 3";
    this.test.css({
      'width': '1000px',
      'height': '550px',
      'display': 'table-cell',
      'background-color': '#' + color
    });
    return Sub3View.__super__.create.apply(this, arguments);
  };

  Sub3View.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.set(this.test.element, {
      opacity: 0
    });
    return Sub3View.__super__.createComplete.apply(this, arguments);
  };

  Sub3View.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.showStart.apply(this, arguments);
  };

  Sub3View.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .3, {
      opacity: 1,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Sub3View.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  Sub3View.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.showComplete.apply(this, arguments);
  };

  Sub3View.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.hideStart.apply(this, arguments);
  };

  Sub3View.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.test.element, .3, {
      opacity: 0,
      ease: Quad.easeOut,
      onComplete: (function(_this) {
        return function() {
          return Sub3View.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  Sub3View.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.hideComplete.apply(this, arguments);
  };

  Sub3View.prototype.changeSubview = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.changeSubview.apply(this, arguments);
  };

  Sub3View.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.element.off();
    if (this.test) {
      TweenMax.killTweensOf(this.test);
      this.test.destroy();
      this.removeChild(this.test);
      this.test = null;
    }
    return Sub3View.__super__.destroy.apply(this, arguments);
  };

  Sub3View.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return Sub3View.__super__.destroyComplete.apply(this, arguments);
  };

  return Sub3View;

})(BaseView);

var SplitTextUtils;

SplitTextUtils = (function() {
  function SplitTextUtils() {}

  SplitTextUtils.splitHTMLChars = function(target, opt, className) {
    if (opt == null) {
      opt = {};
    }
    if (className == null) {
      className = 'split-chunk';
    }
    return this._splitHTML(target, className, opt, this._replaceChars);
  };

  SplitTextUtils.splitHTMLWords = function(target, opt, className) {
    if (opt == null) {
      opt = {};
    }
    if (className == null) {
      className = 'split-chunk';
    }
    return this._splitHTML(target, className, opt, this._replaceWords);
  };

  SplitTextUtils._splitHTML = function(target, className, opt, type) {
    var html, replacedHTML;
    if (target instanceof BaseDOM) {
      target = target.element;
    }
    html = target.innerHTML;
    this._currentClassName = className;
    replacedHTML = html.replace(/([^\<\>]*)?(\<[^\>]*\>)?/ig, type);
    target.innerHTML = replacedHTML;
    return target.querySelectorAll('.' + className);
  };

  SplitTextUtils._replaceChars = function(match, text, tag) {
    var ret;
    ret = '';
    if (text) {
      ret = text.replace(/(.)/g, '<span class="' + SplitTextUtils._currentClassName + '">$1</span>');
    }
    if (tag) {
      ret += tag;
    }
    return ret;
  };

  SplitTextUtils._replaceWords = function(match, text, tag) {
    var ret;
    ret = '';
    if (text) {
      ret = text.replace(/([^\s]+)/g, '<span class="' + SplitTextUtils._currentClassName + '">$1</span>');
    }
    if (tag) {
      ret += tag;
    }
    return ret;
  };

  return SplitTextUtils;

})();

var Main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Main = (function(_super) {
  __extends(Main, _super);

  function Main() {
    this.create = __bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }

  Main.prototype.create = function(evt) {
    var color, k, menu, v, _ref;
    if (evt == null) {
      evt = null;
    }
    menu = new BaseDOM();
    this.appendChildAt(menu, 0);
    app.navigation.on(Navigation.CHANGE_VIEW, this.test);
    _ref = app.config.views;
    for (k in _ref) {
      v = _ref[k];
      color = Math.floor(Math.random() * 16777215).toString(16);
      this.test = new BaseDOM();
      menu.appendChild(this.test);
      this.test.text = v.id;
      this.test.css({
        'width': '50px',
        'height': '25px',
        'display': 'inline-block',
        'cursor': 'pointer',
        'background-color': '#' + color
      });
      this.test.element.on('click', this.go);
    }
    return Main.__super__.create.apply(this, arguments);
  };

  Main.prototype.test = function(evt) {
    return console.log(">>>", evt.data);
  };

  Main.prototype.go = function(evt) {
    return app.navigation.gotoView(evt.srcElement.innerText);
  };

  return Main;

})(NavigationContainer);

return new Main();

}).call(this);