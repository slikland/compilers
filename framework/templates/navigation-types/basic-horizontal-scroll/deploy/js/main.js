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

var ScrollNavigationController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ScrollNavigationController = (function(_super) {
  var viewScrollPercent;

  __extends(ScrollNavigationController, _super);

  ScrollNavigationController.SCROLL = 'navigation_controller_scroll';

  viewScrollPercent = 0;

  function ScrollNavigationController() {
    this._onAutoKill = __bind(this._onAutoKill, this);
    this._onCompleteAutoScroll = __bind(this._onCompleteAutoScroll, this);
    this._onStartAutoScroll = __bind(this._onStartAutoScroll, this);
    this._scrollToView = __bind(this._scrollToView, this);
    this._hide = __bind(this._hide, this);
    this._show = __bind(this._show, this);
    this._snapping = __bind(this._snapping, this);
    this._isVisible = __bind(this._isVisible, this);
    this._onScroll = __bind(this._onScroll, this);
    this.change = __bind(this.change, this);
    ScrollNavigationController.__super__.constructor.apply(this, arguments);
  }

  ScrollNavigationController.get({
    type: function() {
      return 'scroll';
    }
  });

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
    var k, v, view, _base, _ref, _ref1;
    if (p_id == null) {
      p_id = null;
    }
    if (app.config.navigation.options != null) {
      this._options = app.config.navigation.options;
    } else {
      throw new Error('The options object in config.json file must be created to use this navigation type, see a example in source code.');

      /*
      			"navigation":{
      				"type":"scroll",
      				"options":{
      					"orientation":"vertical",
      					"scrollToTime":0,
      					"pauseInvisibleViews":true,
      					"percentToShow":0.5,
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
    this._percentToShow = this._options.percentToShow >= 0 || this._options.percentToShow <= 1 ? this._options.percentToShow : .5;
    this._pauseInvisibleViews = this._options.pauseInvisibleViews != null ? this._options.pauseInvisibleViews : true;
    _ref1 = app.config.views;
    for (k in _ref1) {
      v = _ref1[k];
      view = this._views.create(k);
      if ((_base = view.data).snap == null) {
        _base.snap = true;
      }
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
    var currentView, index, k, percentToShow, v, view, viewBounds, viewOffset, _ref, _ref1;
    this._visibleViews = this._visibleViews || [];
    currentView = null;
    _ref = app.config.views;
    for (k in _ref) {
      v = _ref[k];
      view = this._views.create(k);
      if (this._orientation === 'vertical') {
        viewOffset = view.height + view.element.offsetTop;
      } else {
        viewOffset = view.width + view.element.offsetLeft;
      }
      viewBounds = viewOffset - this.scrollValue;
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
      percentToShow = view.percentToShow != null ? view.percentToShow : this._percentToShow;
      if (viewBounds > (this.windowValue * percentToShow) && currentView === null) {
        currentView = view;
        this._snapping(view);
        if (((_ref1 = this._currentView) != null ? _ref1.id : void 0) === view.id) {
          continue;
        }
        if (this._currentView != null) {
          this._previousView = this._currentView;
        }
        this._currentView = this._views.create(view.id);
        this._show(view);
      } else {
        this._hide(view);
      }
    }
    return this.trigger(ScrollNavigationController.SCROLL, {
      percent: this.scrollPercent,
      value: this.scrollValue
    });
  };

  ScrollNavigationController.prototype._isVisible = function(p_view) {
    var elementBottom, elementLeft, elementRight, elementTop;
    if (this._orientation === 'vertical') {
      elementTop = p_view.element.offsetTop;
      elementBottom = elementTop + p_view.height;
      return (this.scrollValue + window.innerHeight) > elementTop && this.scrollValue + window.innerHeight < (elementBottom + window.innerHeight);
    } else {
      elementLeft = p_view.element.offsetLeft;
      elementRight = elementLeft + p_view.width;
      return (this.scrollValue + window.innerWidth) > elementLeft && this.scrollValue + window.innerWidth < (elementRight + window.innerWidth);
    }
  };

  ScrollNavigationController.prototype._snapping = function(p_view) {
    if (!this._autoScrolling && this._snapDelay > 0) {
      TweenMax.killDelayedCallsTo(this._scrollToView);
      if (p_view.data.snap || p_view.snap) {
        return TweenMax.delayedCall(this._snapDelay, this._scrollToView, [p_view.id]);
      }
    }
  };

  ScrollNavigationController.prototype._show = function(p_view) {
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    if (!p_view.showed) {
      return p_view.showStart();
    } else {
      if (this._pauseInvisibleViews) {
        return p_view.resume();
      }
    }
  };

  ScrollNavigationController.prototype._hide = function(p_view) {
    if (!this._isVisible(p_view)) {
      if (this._pauseInvisibleViews) {
        p_view.pause();
      }
    }
    if (p_view.id !== this._currentView.id) {
      if (p_view.showed) {
        return p_view.hideStart();
      }
    }
  };

  ScrollNavigationController.prototype._scrollToView = function(p_id) {
    var orientation, view;
    view = this._views.create(p_id);
    TweenMax.killDelayedCallsTo(this._scrollToView);
    TweenMax.killTweensOf(window);
    if (this._orientation === 'vertical') {
      orientation = {
        y: view.element.offsetTop,
        onAutoKill: this._onAutoKill
      };
    } else {
      orientation = {
        x: view.element.offsetLeft,
        onAutoKill: this._onAutoKill
      };
    }
    return TweenMax.to(window, this._scrollToTime, {
      scrollTo: orientation,
      ease: Quad.easeOut,
      onStart: this._onStartAutoScroll,
      onComplete: this._onCompleteAutoScroll,
      onCompleteParams: [view]
    });
  };

  ScrollNavigationController.prototype._onStartAutoScroll = function() {
    return this._autoScrolling = true;
  };

  ScrollNavigationController.prototype._onCompleteAutoScroll = function(p_view) {
    this._autoScrolling = false;
    return this._show(p_view);
  };

  ScrollNavigationController.prototype._onAutoKill = function(evt) {
    return this._autoScrolling = false;
  };

  ScrollNavigationController.get({
    scrollPercent: function() {
      var body, doc;
      body = document.body;
      doc = document.documentElement;
      if (this._orientation === 'vertical') {
        return (doc.scrollTop + body.scrollTop) / (doc.scrollHeight - doc.clientHeight);
      } else {
        return (doc.scrollLeft + body.scrollLeft) / (doc.scrollWidth - doc.clientWidth);
      }
    }
  });

  ScrollNavigationController.get({
    scrollValue: function() {
      var body, doc;
      body = document.body;
      doc = document.documentElement;
      if (this._orientation === 'vertical') {
        if (typeof pageYOffset !== 'undefined') {
          return pageYOffset;
        } else {
          doc = doc.clientHeight ? doc : body;
          return doc.scrollTop;
        }
      } else {
        if (typeof pageXOffset !== 'undefined') {
          return pageXOffset;
        } else {
          doc = doc.clientWidth ? doc : body;
          return doc.scrollLeft;
        }
      }
    }
  });

  ScrollNavigationController.get({
    windowValue: function() {
      if (this._orientation === 'vertical') {
        return window.innerHeight;
      } else {
        return window.innerWidth;
      }
    }
  });

  return ScrollNavigationController;

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
    this.replaceRoute = __bind(this.replaceRoute, this);
    this.gotoRoute = __bind(this.gotoRoute, this);
    this.setRoute = __bind(this.setRoute, this);
    this.goto = __bind(this.goto, this);
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

  Navigation.prototype.goto = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      this.gotoRoute(p_value);
    } else {
      this.gotoView(p_value);
    }
    return false;
  };

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

  Navigation.prototype.replaceRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (p_value == null) {
      return;
    }
    if (p_value.indexOf('/') === 0) {
      _router.replace(p_value, p_trigger);
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

var TemplateHomeView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateHomeView = (function(_super) {
  __extends(TemplateHomeView, _super);

  function TemplateHomeView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    TemplateHomeView.__super__.constructor.call(this, p_data, 'views');
  }

  TemplateHomeView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.background = new BaseDOM('div');
    this.appendChild(this.background);
    this.background.className = 'background';
    this.background.css({
      'opacity': 0,
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.image = new BaseDOM({
      element: this.loader.getResult('image')
    });
    this.background.appendChild(this.image);
    return TemplateHomeView.__super__.createStart.apply(this, arguments);
  };

  TemplateHomeView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.create.apply(this, arguments);
  };

  TemplateHomeView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.createComplete.apply(this, arguments);
  };

  TemplateHomeView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.showStart.apply(this, arguments);
  };

  TemplateHomeView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.background.element, 1, {
      css: {
        opacity: 1
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateHomeView.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  TemplateHomeView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.showComplete.apply(this, arguments);
  };

  TemplateHomeView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.hideStart.apply(this, arguments);
  };

  TemplateHomeView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TweenMax.to(this.background.element, .5, {
      opacity: 0,
      onComplete: (function(_this) {
        return function() {
          return TemplateHomeView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  TemplateHomeView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateHomeView.__super__.hideComplete.apply(this, arguments);
  };

  TemplateHomeView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.image.destroy();
    this.background.removeChild(this.image);
    this.image = null;
    TweenMax.killTweensOf(this.background.element);
    this.background.destroy();
    this.removeChild(this.background);
    this.background = null;
    return TemplateHomeView.__super__.destroy.apply(this, arguments);
  };

  return TemplateHomeView;

})(BaseView);

var TemplateSubView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

TemplateSubView = (function(_super) {
  __extends(TemplateSubView, _super);

  function TemplateSubView(p_data, p_className) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_className == null) {
      p_className = null;
    }
    this.destroy = __bind(this.destroy, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.render = __bind(this.render, this);
    this.createStart = __bind(this.createStart, this);
    TemplateSubView.__super__.constructor.call(this, p_data, 'views');
  }

  TemplateSubView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.background = new BaseDOM('div');
    this.appendChild(this.background);
    this.background.className = 'background';
    this.background.css({
      'opacity': 0,
      'height': '100%',
      'background-color': '#' + Math.floor(Math.random() * 16777215).toString(16)
    });
    this.image = new BaseDOM({
      element: this.loader.getResult('image')
    });
    this.background.appendChild(this.image);
    return TemplateSubView.__super__.createStart.apply(this, arguments);
  };

  TemplateSubView.prototype.render = function(evt) {
    if (evt == null) {
      evt = null;
    }
    if (this.i == null) {
      this.i = 0;
    }
    return console.log("render", this.id, this.i++);
  };

  TemplateSubView.prototype.pause = function() {
    clearInterval(this.timeout);
    return TemplateSubView.__super__.pause.apply(this, arguments);
  };

  TemplateSubView.prototype.resume = function() {
    clearInterval(this.timeout);
    this.timeout = setInterval(this.render, 1000);
    return TemplateSubView.__super__.resume.apply(this, arguments);
  };

  TemplateSubView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.create.apply(this, arguments);
  };

  TemplateSubView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.createComplete.apply(this, arguments);
  };

  TemplateSubView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.showStart.apply(this, arguments);
  };

  TemplateSubView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.resume();
    TweenMax.killTweensOf(this.background.element);
    return TweenMax.to(this.background.element, .5, {
      css: {
        opacity: 1
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateSubView.__super__.show.apply(_this, arguments);
        };
      })(this)
    });
  };

  TemplateSubView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.showComplete.apply(this, arguments);
  };

  TemplateSubView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.hideStart.apply(this, arguments);
  };

  TemplateSubView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    TweenMax.killTweensOf(this.background.element);
    return TweenMax.to(this.background.element, .3, {
      css: {
        opacity: 0
      },
      onComplete: (function(_this) {
        return function() {
          return TemplateSubView.__super__.hide.apply(_this, arguments);
        };
      })(this)
    });
  };

  TemplateSubView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    return TemplateSubView.__super__.hideComplete.apply(this, arguments);
  };

  TemplateSubView.prototype.destroy = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.image.destroy();
    this.background.removeChild(this.image);
    this.image = null;
    TweenMax.killTweensOf(this.background.element);
    this.background.destroy();
    this.removeChild(this.background);
    this.background = null;
    return TemplateSubView.__super__.destroy.apply(this, arguments);
  };

  return TemplateSubView;

})(BaseView);

var Main,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Main = (function(_super) {
  var time, _controller;

  __extends(Main, _super);

  function Main() {
    this.click = __bind(this.click, this);
    this.scroll = __bind(this.scroll, this);
    this.changeNav = __bind(this.changeNav, this);
    this.removeListener = __bind(this.removeListener, this);
    this.addListener = __bind(this.addListener, this);
    this.create = __bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }

  time = 0;

  _controller = new ScrollNavigationController();

  Main.prototype.create = function(evt) {
    var k, menu, v, _ref;
    if (evt == null) {
      evt = null;
    }
    menu = new BaseDOM();
    menu.className = 'menu';
    this.appendChildAt(menu, 0);
    _ref = app.config.views;
    for (k in _ref) {
      v = _ref[k];
      this.button = new BaseDOM();
      menu.appendChild(this.button);
      this.button.className = 'menu-button';
      this.button.attr({
        'id': v.id
      });
      this.button.text = v.id;
      this.button.element.on('click', this.click);
    }
    this.bar = new BaseDOM();
    menu.appendChildAt(this.bar, 0);
    this.bar.className = 'bar';
    this.bar.css({
      width: "0%"
    });
    _controller.on(ScrollNavigationController.SCROLL, this.scroll);
    time = app.config.navigation.options.scrollToTime * 1000;
    this.timeout = setTimeout(this.addListener, time);
    return Main.__super__.create.apply(this, arguments);
  };

  Main.prototype.addListener = function() {
    return app.navigation.on(Navigation.CHANGE_VIEW, this.changeNav);
  };

  Main.prototype.removeListener = function() {
    return app.navigation.off(Navigation.CHANGE_VIEW, this.changeNav);
  };

  Main.prototype.changeNav = function(evt) {
    var route;
    route = evt.data.currentView.route;
    return app.navigation.gotoRoute(route, false);
  };

  Main.prototype.scroll = function(evt) {
    return this.bar.css({
      width: String((evt.percent * 100) + "%")
    });
  };

  Main.prototype.click = function(evt) {
    var route;
    this.removeListener();
    route = app.config.views[evt.srcElement.id].route;
    app.navigation.gotoRoute(route, true);
    clearTimeout(this.timeout);
    return this.timeout = setTimeout(this.addListener, time);
  };

  Main.get({
    controller: function() {
      return _controller;
    }
  });

  return Main;

})(NavigationContainer);

return new Main();

}).call(this);