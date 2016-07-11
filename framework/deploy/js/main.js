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
    type: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.type + ' class');
    }
  });

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
    type: function() {
      return 'default';
    }
  });

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
      var view;
      view = this._currentView || _controller.currentView;
      view.routeData = this.routeData;
      return view;
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

var NavigationContainer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

NavigationContainer = (function(_super) {
  __extends(NavigationContainer, _super);

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
      throw new Error('Override this method with a instance of BaseNavigationController.');
    }
  });

  return NavigationContainer;

})(BaseView);

var Resizer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Resizer = (function(_super) {
  var _body, _bounds;

  __extends(Resizer, _super);

  Resizer.RESIZE = 'resize_resizer';

  Resizer.ORIENTATION_CHANGE = 'orientation_change_resizer';

  Resizer.BREAKPOINT_CHANGE = 'breakpoint_changed_resizer';

  _bounds = null;

  _body = null;

  Resizer.getInstance = function() {
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = new Resizer();
  };

  function Resizer() {
    this.change = __bind(this.change, this);
    this.stop = __bind(this.stop, this);
    this.start = __bind(this.start, this);
    _body = document.querySelector("body");
    _bounds = {
      "top": 0,
      "bottom": 0,
      "left": 0,
      "right": 0
    };
    this.start();
  }

  Resizer.get({
    width: function() {
      return window.innerWidth;
    }
  });

  Resizer.get({
    height: function() {
      return window.innerHeight;
    }
  });

  Resizer.get({
    bounds: function() {
      return _bounds;
    }
  });

  Resizer.set({
    bounds: function(p_value) {
      return _bounds = p_value;
    }
  });

  Resizer.get({
    orientation: function() {
      if (window.innerWidth > window.innerHeight) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  });

  Resizer.prototype.start = function() {
    window.addEventListener('resize', this.change);
    window.addEventListener('orientationchange', this.change);
    return this.change();
  };

  Resizer.prototype.stop = function() {
    window.removeEventListener('resize', this.change);
    return window.removeEventListener('orientationchange', this.change);
  };

  Resizer.prototype.change = function(evt) {
    var k, v, _data, _ref, _results;
    if (evt != null) {
      evt.preventDefault();
    }
    if (evt != null) {
      evt.stopImmediatePropagation();
    }
    _data = {
      "width": this.width,
      "height": this.height,
      "bounds": this.bounds,
      "orientation": this.orientation
    };
    if ((evt != null ? evt.type : void 0) === "resize") {
      this.trigger(Resizer.RESIZE, _data);
    }
    if ((evt != null ? evt.type : void 0) === "orientationchange") {
      this.trigger(Resizer.ORIENTATION_CHANGE, _data);
    }
    if (app.conditions != null) {
      _ref = app.conditions.list;
      _results = [];
      for (k in _ref) {
        v = _ref[k];
        if ((v['size'] != null) || (v['orientation'] != null)) {
          if (app.conditions.test(k)) {
            if (!this.hasClass(k)) {
              this.addClass(k);
            }
          } else {
            if (this.hasClass(k)) {
              this.removeClass(k);
            }
          }
          _data['breakpoint'] = {
            key: k,
            values: v
          };
          _results.push(this.trigger(Resizer.BREAKPOINT_CHANGE, _data));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  Resizer.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    _body.className = classNames.join(' ');
    return false;
  };

  Resizer.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    _body.className = classNames.join(' ');
    return false;
  };

  Resizer.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = _body.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };

  return Resizer;

})(EventDispatcher);

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


/**
Class to controll animation. It calls a callback method every requestAnimation frame.<br>
In case of Internet Explorer 9, it uses a setTimeout with 16 ms.
@class AnimationTicker
@static
 */
var AnimationTicker;

AnimationTicker = (function() {
  function AnimationTicker() {}

  AnimationTicker._callbacks = [];

  AnimationTicker._init = function() {
    if (!window.requestAnimationFrame) {
      if (window.mozRequestAnimationFrame) {
        window.requestAnimationFrame = window.mozRequestAnimationFrame;
        window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame;
      } else if (window.webkitRequestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
      } else {
        window.requestAnimationFrame = function(callback, element) {
          return setTimeout(callback, 16);
        };
        window.cancelAnimationFrame = function(id) {
          return clearTimeout(id);
        };
      }
    }
    return this._update();
  };


  /**
  	Add a callback method that will be called every requestAnimation.
  	@method add
  	@static
  	@param {function} callback
  	Callback function to be called on every browser update.<br>
  	The callback method will be called passing a `data` parameter which will contain the `data` passed in this method and the `frame` number if the `fps` value is set in the `data`.<br>
  	If the callback function already exists, it'll only update the `data`.
  	@param {Object} [data={}] All values in this object are optional.
  	```
  	{
  		"fps": 0 // Number. Frame rate to update.
  		"initFrame": 0 // Number. Use value when adding a animation that doesn't start at frame 0. Ex: starting a animation from a middle.
  		"delay": 0 // Number. Delay in seconds to start triggering the callback.
  	}
  	```
   */

  AnimationTicker.add = function(callback, data) {
    var callbackData;
    if (data == null) {
      data = {};
    }
    if (!callback) {
      throw new Error('callback is not defined.');
    }
    this.remove(callback);
    data.initTime = this._currentTime;
    if (data.fps) {
      if (!data.initFrame) {
        data.initFrame = 0;
      }
      data.fpms = data.fps * 0.001;
      if (data.frame == null) {
        data.frame = data.initFrame;
      }
    }
    if (data.delay == null) {
      data.delay = 0;
    }
    data.delayMs = data.delay * 1000;
    callbackData = {
      func: callback,
      data: data
    };
    callbackData.func(data);
    return this._callbacks.push(callbackData);
  };


  /**
  	Remove a callback method added by {{#crossLink "AnimationTicker/add:method"}}{{/crossLink}}
  	@method remove
  	@static
  	@param {function} callback Callback function to be removed.
   */

  AnimationTicker.remove = function(callback) {
    var i, _results;
    i = this._callbacks.length;
    _results = [];
    while (i-- > 0) {
      if (this._callbacks[i].func === callback) {
        _results.push(this._callbacks.splice(i, 1));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  AnimationTicker._update = function(items) {
    var data, dt, f, i, item, l, t, _ref;
    if (items == null) {
      items = null;
    }
    if (!Array.isArray(items)) {
      items = AnimationTicker._callbacks;
    }
    t = Date.now();
    window.requestAnimationFrame(AnimationTicker._update);
    l = items.length;
    i = -1;
    while (++i < l) {
      item = items[i];
      data = item.data;
      dt = t - data.initTime - data.delayMs;
      if (dt <= 0) {
        continue;
      }
      data.time = dt;
      if (data.fps != null) {
        f = (dt * data.fpms + data.initFrame) >> 0;
        if (f === data.frame) {
          continue;
        }
        data.frame = f;
      }
      if ((_ref = items[i]) != null) {
        if (typeof _ref.func === "function") {
          _ref.func(data);
        }
      }
    }
    return AnimationTicker._currentTime = t;
  };

  AnimationTicker._init();

  return AnimationTicker;

})();


/**
BaseAnimation interface class for most frame / time based animation.<br>
Please do not instantiate this class. Use the extended classes.
@class BaseAnimation
@extends BaseDOM
 */
var BaseAnimation,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseAnimation = (function(_super) {
  __extends(BaseAnimation, _super);


  /**
  	Triggered when animation starts. Usually when {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} is called.
  	@event PLAY
   */

  BaseAnimation.PLAY = 'animation_play';


  /**
  	Triggered when animation stops. Usually when {{#crossLink "BaseAnimation/stop:method"}}{{/crossLink}} is called.
  	@event STOP
   */

  BaseAnimation.STOP = 'animation_stop';


  /**
  	Triggered when animation resumes. Usually when {{#crossLink "BaseAnimation/resume:method"}}{{/crossLink}} is called.
  	@event RESUME
   */

  BaseAnimation.RESUME = 'animation_resume';


  /**
  	Triggered when animation pauses. Usually when {{#crossLink "BaseAnimation/pause:method"}}{{/crossLink}} is called.
  	@event PAUSE
   */

  BaseAnimation.PAUSE = 'animation_pause';


  /**
  	Triggered when animation finishes.
  	@event COMPLETE
   */

  BaseAnimation.COMPLETE = 'animation_complete';


  /**
  	Triggered when animation reached the end and repeats.
  	@event REPEAT
   */

  BaseAnimation.REPEAT = 'animation_repeat';


  /**
  	Triggered when animation changes it's frame.
  	@event UPDATE
   */

  BaseAnimation.UPDATE = 'animation_update';

  BaseAnimation.prototype._repeat = false;

  BaseAnimation.prototype._fps = 15;

  BaseAnimation.prototype._iFps = 0;

  BaseAnimation.prototype._currentTime = 0;

  BaseAnimation.prototype._totalTime = 0;

  BaseAnimation.prototype._durationTime = 0;

  BaseAnimation.prototype._currentFrame = 0;

  BaseAnimation.prototype._totalFrames = 0;

  BaseAnimation.prototype._durationFrames = 0;

  BaseAnimation.prototype._currentLabel = null;

  BaseAnimation.prototype._animData = null;

  BaseAnimation.prototype._currentAnimData = null;

  BaseAnimation.prototype._labels = [];

  function BaseAnimation() {
    this._redraw = __bind(this._redraw, this);
    this._update = __bind(this._update, this);
    this._sortLabels = __bind(this._sortLabels, this);
    this._updateLabels = __bind(this._updateLabels, this);
    if (this.constructor.name === 'BaseAnimation') {
      throw new Error('Please extend me.');
    }
    BaseAnimation.__super__.constructor.call(this, {
      element: 'div',
      className: 'animation'
    });
  }


  /**
  	Return true if the animation was paused
  
  	@attribute paused
  	@type Boolean
  	@readOnly
   */

  BaseAnimation.get({
    paused: function() {
      return this._paused;
    }
  });


  /**
  	Define if the animation will repeat or not.<br>
  	By default it's set to false.<br>
  	If the value is set to true, it will repeat infinitely.<br>
  	This value can also be changed when calling the {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} method.
  
  	@attribute repeat
  	@default false
  	@type Boolean | Number
   */

  BaseAnimation.get({
    repeat: function() {
      return this._repeat;
    }
  });

  BaseAnimation.set({
    repeat: function(value) {
      return this._repeat = value;
    }
  });


  /**
  	Frame rate of animation.
  	@attribute fps
  	@type Number
   */

  BaseAnimation.get({
    fps: function() {
      return this._fps;
    }
  });

  BaseAnimation.set({
    fps: function(value) {
      if (isNaN(value)) {
        throw new Error('fps isNaN');
      }
      this._fps = value;
      this._iFps = 1 / this._fps;
      return this._dirty = true;
    }
  });


  /**
  	Current time of the animation in seconds.
  	If it's playing a specific label, it refers to the portion of the label.
  	
  	@attribute currentTime
  	@type Number
   */

  BaseAnimation.get({
    currentTime: function() {
      return this._currentTime;
    }
  });

  BaseAnimation.set({
    currentTime: function(value) {
      if (isNaN(value)) {
        throw new Error('currentTime isNaN');
      }
      this._currentTime = value;
      return this._dirty = true;
    }
  });


  /**
  	Total time of the animation in seconds.
  	If it's playing a specific label, it refers to the portion of the label.
  	
  	@attribute totalTime
  	@type Number
  	@readOnly
   */

  BaseAnimation.get({
    totalTime: function() {
      return this._totalTime;
    }
  });


  /**
  	Current frame number of the animation.
  	If it's playing a specific label, it refers to the portion of the label.
  	
  	@attribute currentFrame
  	@type Number
   */

  BaseAnimation.get({
    currentFrame: function() {
      return this._currentFrame;
    }
  });

  BaseAnimation.set({
    currentFrame: function(value) {
      if (isNaN(value)) {
        throw new Error('currentFrame isNaN');
      }
      this._currentFrame = value;
      return this._dirty = true;
    }
  });


  /**
  	Duration in frames of the animation.
  	If it's playing a specific label, it refers to the portion of the label.
  	
  	@attribute durationFrames
  	@type Number
  	@readOnly
   */

  BaseAnimation.get({
    durationFrames: function() {
      return this._durationFrames;
    }
  });


  /**
  	Total number of frames of the animation.
  	
  	@attribute totalFrames
  	@type Number
  	@readOnly
   */

  BaseAnimation.get({
    totalFrames: function() {
      return this._totalFrames;
    }
  });


  /**
  	The name of label currently playing.
  	
  	@attribute currentLabel
  	@type String
  	@readOnly
   */

  BaseAnimation.get({
    currentLabel: function() {
      return this._currentLabel;
    }
  });

  BaseAnimation.set({
    _dirty: function(value) {
      if (!value) {
        return;
      }
      clearTimeout(this._dirtyTimeout);
      return this._dirtyTimeout = setTimeout(this._redraw, 0);
    }
  });

  BaseAnimation.set({
    _labelsDirty: function(value) {
      if (!value) {
        return;
      }
      clearTimeout(this._labelsDirtyTimeout);
      return this._labelsDirtyTimeout = setTimeout(this._updateLabels, 0);
    }
  });


  /**
  	Add a section of frames with a label name.
  	@method addLabel
  	@param {String} name Name of the label
  	@param {Number} start Number of frame that the animation should start
  	@param {Number} [end] Last frame of the section. If this parameter is not set, will get the next label's `start` or the last frame of entire animation.
   */

  BaseAnimation.prototype.addLabel = function(name, start, end) {
    if (end == null) {
      end = null;
    }
    this.removeLabel(name);
    this._labels.push({
      name: name,
      start: start,
      end: end
    });
    return this._labelsDirty = true;
  };


  /**
  	Remove a label
  	@method removeLabel
  	@param {String} name Name of the label
   */

  BaseAnimation.prototype.removeLabel = function(name) {
    var i;
    i = this._labels.length;
    while (i-- > 0) {
      if (this._labels[i].name === name) {
        this._labels.splice(i, 1);
      }
    }
    return this._labelsDirty = true;
  };

  BaseAnimation.prototype._updateLabels = function() {
    var f0, f1, i, labelData;
    this._labels.sort(this._sortLabels);
    f0 = f1 = this._totalFrames - 1;
    i = this._labels.length;
    while (i-- > 0) {
      labelData = this._labels[i];
      if (labelData.end === null) {
        labelData.duration = f0 - labelData.start;
      } else {
        labelData.duration = labelData.end - labelData.start;
      }
      if (labelData.start !== f1) {
        f0 = f1;
        f1 = labelData.start;
      }
    }
    return this._numLabels = this._labels.length;
  };

  BaseAnimation.prototype._sortLabels = function(a, b) {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    if (a.end > b.end) {
      return -1;
    }
    if (a.end < b.end) {
      return 1;
    }
    return 0;
  };


  /**
  	Play the animation.<br>
  	It receives a `data` object which is optional with some settings.
  	@method play
  	@param {Object} [data={}] Data with values explained below:
  	Name |Type|Default|Description
  	-----|----|:------|-----------
  	delay|Number|0|Delay in seconds to start the animation
  	{{#crossLink "BaseAnimation/repeat:attribute"}}{{/crossLink}}|Boolean&nbsp;\|&nbsp;Number|false|If the animation should repeat. If number is passed, will repeat the amount of number defined.
  	label|String|null|The label of the animation to play. If nothing is passed, will play the entire animation.
   */

  BaseAnimation.prototype.play = function(data) {
    if (data == null) {
      data = {};
    }
    this._paused = false;
    this._repeat = data.repeat || false;
    this._animData = this._getLabelData(data.label);
    this._durationFrames = this._animData.duration;
    this._durationTime = this._durationFrames * this._iFps;
    this._currentFrame = 0;
    this._currentTime = 0;
    AnimationTicker.add(this._update, {
      fps: this._fps,
      delay: data.delay || 0
    });
    return this.trigger(this.constructor.PLAY);
  };


  /**
  	Resume the animation. If the {{#crossLink "BaseAnimation/play:method"}}{{/crossLink}} method was called with a label, it will resume the portion of the specified label
  	@method resume
   */

  BaseAnimation.prototype.resume = function() {
    if (!this._animData) {
      throw new Error('Resume can only be called after a pause.');
    }
    this._paused = false;
    AnimationTicker.add(this._update, {
      fps: this._fps,
      initFrame: this._currentFrame
    });
    return this.trigger(this.constructor.RESUME);
  };


  /**
  	Pause the animation.
  	@method pause
   */

  BaseAnimation.prototype.pause = function() {
    if (!this._animData) {
      throw new Error('Can\'t pause an animation that is not playing.');
    }
    this._paused = true;
    AnimationTicker.remove(this._update);
    return this.trigger(this.constructor.PAUSE);
  };


  /**
  	Stop the animation and goes to last frame.
  	@method stop
   */

  BaseAnimation.prototype.stop = function() {
    if (!this._animData) {
      throw new Error('Can\'t stop an animation that is not playing.');
    }
    this._paused = false;
    AnimationTicker.remove(this._update);
    return this.trigger(this.constructor.STOP);
  };

  BaseAnimation.prototype._getLabelData = function(label) {
    var data, i;
    if (label == null) {
      label = null;
    }
    data = {
      start: 0,
      end: this._totalFrames - 1,
      duration: this._totalFrames
    };
    if (this._numLabels == null) {
      this._updateLabels();
    }
    if (label) {
      i = this._numLabels;
      while (i-- > 0) {
        if (this._labels[i].name === label) {
          data = this._labels[i];
          break;
        }
      }
    }
    return data;
  };

  BaseAnimation.prototype._update = function(data) {
    var f, nf;
    if (!this._animData) {
      throw new Error('Can\'t update without _animData');
    }
    f = data.frame;
    nf = ((f % this._durationFrames) + this._durationFrames) % this._durationFrames;
    if (nf === this._currentFrame) {
      return;
    }
    this.stackTrigger(this.constructor.UPDATE);
    if (f >= this._durationFrames) {
      if (this._repeat) {
        this.stackTrigger(this.constructor.REPEAT);
      } else {
        this.stackTrigger(this.constructor.COMPLETE);
        this.stop();
        f = this._durationFrames - 1;
      }
    }
    this._currentFrame = ((f % this._durationFrames) + this._durationFrames) % this._durationFrames;
    this._currentTime = this._currentFrame * this._iFps;
    return this._dirty = true;
  };


  /**
  	Update the 
  	@method redraw
   */

  BaseAnimation.prototype.redraw = function() {};

  BaseAnimation.prototype._redraw = function() {
    throw new Error('Method _redraw not overwritten.');
  };

  return BaseAnimation;

})(BaseDOM);

var SpriteSheetAnimation,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SpriteSheetAnimation = (function(_super) {
  __extends(SpriteSheetAnimation, _super);

  SpriteSheetAnimation._init = function() {
    var css, e, head, si, style;
    head = document.querySelector("head") || document.getElementsByTagName("head")[0];
    css = '.animation.spritesheet{display: inline-block;position: relative;font-size:0px;}';
    style = document.createElement('style');
    style.type = "text/css";
    head.appendChild(style);
    si = head.querySelectorAll('style').length;
    try {
      return style.appendChild(document.createTextNode(css));
    } catch (_error) {
      e = _error;
      if (document.all) {
        return document.styleSheets[si].cssText = css;
      }
    }
  };

  SpriteSheetAnimation._init();


  /**
  	Spritesheet Animation class
  	@class SpriteSheetAnimation
  	@constructor
  	@extends BaseAnimation
  	@param {Object} data Object defining spritesheet.
   */

  function SpriteSheetAnimation(data) {
    this._redrawBackground = __bind(this._redrawBackground, this);
    this._redrawImage = __bind(this._redrawImage, this);
    var image, json, _ref;
    if (data.image == null) {
      throw new Error('data.image is not set');
    }
    if (!data.json) {
      throw new Error('data.json is not set');
    }
    image = data.image.tag || data.image;
    json = data.json.tag || data.json;
    if (!(image instanceof Image || ((_ref = image.tagName) != null ? _ref.toLowerCase() : void 0) === 'img')) {
      throw new Error('data.image is not Type of Image');
    }
    SpriteSheetAnimation.__super__.constructor.apply(this, arguments);
    this.addClass('spritesheet');
    this._frames = this._parseJson(json);
    this._totalFrames = this._frames.length;
    this._useBackground = data.background || false;
    this._holder = new BaseDOM({
      element: 'div'
    });
    this._holder.css({
      display: 'inline-block',
      width: this._size.w + 'px',
      height: this._size.h + 'px'
    });
    this.appendChild(this._holder);
    this._container = new BaseDOM({
      element: 'div'
    });
    this._container.css({
      display: 'inline-block',
      position: 'absolute',
      overflow: 'hidden'
    });
    this.appendChild(this._container);
    if (this._useBackground) {
      this._setupBackground(image);
      this._redraw = this._redrawBackground;
    } else {
      this._setupImage(image);
      this._redraw = this._redrawImage;
    }
  }

  SpriteSheetAnimation.prototype._parseJson = function(data) {
    var f, fo, frames, i, ish, isw, maxHeight, maxWidth, sh, sw, trimmed, _i, _len, _ref;
    frames = [];
    this._imageSize = data.meta.size;
    trimmed = false;
    maxWidth = Number.MIN_VALUE;
    maxHeight = Number.MIN_VALUE;
    i = 0;
    _ref = data.frames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      sw = f.sourceSize.w;
      sh = f.sourceSize.h;
      isw = 1 / sw;
      ish = 1 / sh;
      fo = {};
      fo.source = f.frame;
      fo.proportionalSource = {
        x: (-(f.frame.x / f.frame.w) * 100).toString() + '%',
        y: (-(f.frame.y / f.frame.h) * 100).toString() + '%',
        w: ((this._imageSize.w / f.frame.w) * 100).toString() + '%',
        h: ((this._imageSize.h / f.frame.h) * 100).toString() + '%'
      };
      fo.output = {
        x: f.spriteSourceSize.x,
        y: f.spriteSourceSize.y,
        w: f.frame.w,
        h: f.frame.h
      };
      fo.proportionalOutput = {
        x: f.spriteSourceSize.x * isw,
        y: f.spriteSourceSize.y * ish,
        w: f.frame.w * isw,
        h: f.frame.h * ish
      };
      if (maxWidth < sw) {
        maxWidth = sw;
      }
      if (maxHeight < sh) {
        maxHeight = sh;
      }
      frames[i++] = fo;
    }
    this._size = {
      w: maxWidth,
      h: maxHeight
    };
    i = frames.length;
    while (i-- > 0) {
      fo = frames[i];
      fo.output.x = ((fo.output.x / maxWidth) * 100).toString() + '%';
      fo.output.y = ((fo.output.y / maxHeight) * 100).toString() + '%';
      fo.output.w = ((fo.output.w / maxWidth) * 100).toString() + '%';
      fo.output.h = ((fo.output.h / maxHeight) * 100).toString() + '%';
    }
    return frames;
  };

  SpriteSheetAnimation.prototype._setupImage = function(image) {
    this._image = image.cloneNode();
    this._image.style.position = 'absolute';
    this._image.style.display = 'inline-block';
    this._image.style.width = (this._imageSize.w / this._size.w) * 100 + '%';
    this._image.style.height = (this._imageSize.h / this._size.h) * 100 + '%';
    return this._container.appendChild(this._image);
  };

  SpriteSheetAnimation.prototype._setupBackground = function() {};

  SpriteSheetAnimation.prototype._redrawImage = function() {
    var b, fd;
    fd = this._frames[this._currentFrame];
    if (!fd) {
      return;
    }
    this._container.css({
      left: fd.output.x,
      top: fd.output.y,
      width: fd.output.w,
      height: fd.output.h
    });
    b = this._container.getBounds();
    this._image.style['left'] = fd.proportionalSource.x;
    this._image.style['top'] = fd.proportionalSource.y;
    this._image.style['width'] = fd.proportionalSource.w;
    return this._image.style['height'] = fd.proportionalSource.h;
  };

  SpriteSheetAnimation.prototype._redrawBackground = function() {
    console.log(2);
    this.html = this._currentFrame;
    return console.log(this._currentFrame);
  };

  return SpriteSheetAnimation;

})(BaseAnimation);

var ImageSequenceAnimation,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ImageSequenceAnimation = (function(_super) {
  __extends(ImageSequenceAnimation, _super);

  function ImageSequenceAnimation() {
    return ImageSequenceAnimation.__super__.constructor.apply(this, arguments);
  }

  return ImageSequenceAnimation;

})(BaseAnimation);

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
    this._mouseDown = __bind(this._mouseDown, this);
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
    var ba, color, i, splitText;
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
    ba = new SpriteSheetAnimation(this.content.spritesheets[0]);
    ba.addLabel('test', 0, 10);
    ba.addLabel('test1', 10, 20);
    ba.addLabel('test2', 10);
    ba.addLabel('test3', 20, 30);
    ba.fps = 15;
    this.appendChild(ba);
    ba.play({
      repeat: true,
      label: "test"
    });
    this._ba = ba;
    window.addEventListener('mousedown', this._mouseDown);
    return HomeView.__super__.create.apply(this, arguments);
  };

  HomeView.prototype._mouseDown = function() {
    if (this._ba.paused) {
      return this._ba.resume();
    } else {
      return this._ba.pause();
    }
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

var Main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Main = (function(_super) {
  __extends(Main, _super);

  function Main() {
    this.resize = __bind(this.resize, this);
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
    app.resizer = Resizer.getInstance();
    app.resizer.bounds = {
      "top": 10,
      "bottom": 10,
      "left": 10,
      "right": 10
    };
    app.resizer.on(Resizer.RESIZE, this.resize);
    return Main.__super__.create.apply(this, arguments);
  };

  Main.prototype.test = function(evt) {
    return console.log(">>>", evt.data);
  };

  Main.prototype.go = function(evt) {
    return app.navigation.gotoView(evt.srcElement.innerText);
  };

  Main.prototype.resize = function(evt) {};

  Main.get({
    controller: function() {
      return new DefaultNavigationController();
    }
  });

  return Main;

})(NavigationContainer);

return new Main();

}).call(this);