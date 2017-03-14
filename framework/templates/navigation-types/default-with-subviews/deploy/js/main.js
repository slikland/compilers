(function() {
var __bind=function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
__hasProp={}.hasOwnProperty,
__indexOf=[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
__extends=function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key)); } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
/**
ViewsData Class
@class ViewsData
@extends EventDispatcher
@final
 */
var ViewsData;
ViewsData = (function(_super) {
  __extends(ViewsData, _super);
  /**
  	Triggered after parsing data of view. 
  	@event VIEW_CREATED
  	@static
   */
  ViewsData.VIEW_CREATED = 'view_created';
  /**
  	Triggered after parsing data of all views of config file. 
  	@event ALL_VIEWS_CREATED
  	@static
   */
  ViewsData.ALL_VIEWS_CREATED = 'all_views_created';
  /**
  	@class ViewsData
  	@constructor
  	@param {Object} p_data
   */
  function ViewsData(p_data) {
    if (p_data == null) {
      throw new Error('The param p_data is null');
    }
    this._data = [];
    this._views = p_data.views;
    ViewsData.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method getData
  	@param {String} p_id
  	@return {Object}
   */
  ViewsData.prototype.getData = function(p_id) {
    if (this._views[p_id] == null) {
      throw new Error('The view with id "' + p_id + '" does not exists in config file');
    }
    return this._views[p_id];
  };
  /**
  	@method get
  	@param {String} p_id
  	@return {Object}
   */
  ViewsData.prototype.get = function(p_id) {
    if (this._data[p_id] != null) {
      return this._data[p_id];
    } else {
      return null;
    }
  };
  /**
  	@method set
  	@param {String} p_view
   */
  ViewsData.prototype.set = function(p_view) {
    if (!this.get(p_view.id)) {
      this._data[p_view.id] = p_view;
    }
    return false;
  };
  /**
  	@method createAll
   */
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
  /**
  	@method create
  	@param {String} p_id
  	@return {Object}
   */
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
  /**
  	@method remove
  	@param {String} p_id
   */
  ViewsData.prototype.remove = function(p_id) {
    this._data[p_id] = null;
    delete this._data[p_id];
    return false;
  };
  /**
  	@method normalize
  	@param {String} p_id
  	@return {String}
   */
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
/**
BaseNavigationController is a base class for any type of navigation controller.<br>
Please do not instantiate this class. Use the extended classes.
@class BaseNavigationController
@extends EventDispatcher
 */
var BaseNavigationController;
BaseNavigationController = (function(_super) {
  __extends(BaseNavigationController, _super);
  /**
  	@event CHANGE
  	@static
   */
  BaseNavigationController.CHANGE = 'base_navigation_controller_change';
  /**
  	@event CHANGE_VIEW
  	@static
   */
  BaseNavigationController.CHANGE_VIEW = 'base_navigation_controller_change_view';
  /**
  	@event CHANGE_SUBVIEW
  	@static
   */
  BaseNavigationController.CHANGE_SUBVIEW = 'base_navigation_controller_change_subview';
  /**
  	@class BaseNavigationController
  	@constructor
   */
  function BaseNavigationController() {
    this._removeFromWrapper = __bind(this._removeFromWrapper, this);
    this._appendToWrapper = __bind(this._appendToWrapper, this);
    this.change = __bind(this.change, this);
    BaseNavigationController.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {Object} p_data
  	@protected
   */
  BaseNavigationController.prototype.setup = function(p_data) {
    var _ref, _ref1;
    this._views = new ViewsData(p_data);
    if (((_ref = app.navigation) != null ? _ref.instantiateViews : void 0) || ((_ref1 = app.navigation) != null ? _ref1.instantiateViews : void 0) === void 0) {
      this._views.createAll();
    }
    return false;
  };
  /**
  	@method start
  	@param {String} [p_id=null]
   */
  BaseNavigationController.prototype.start = function(p_id) {
    var view, _ref;
    if (p_id == null) {
      p_id = null;
    }
    if (this._started) {
      throw new Error('The instance of BaseNavigationController already started');
    }
    this._started = true;
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) == null) {
      throw new Error('The property "defaultView" in config file is null or undefined.');
    }
    if (!p_id) {
      view = app.config.navigation.defaultView;
    } else {
      view = p_id;
    }
    this.goto(view);
    return false;
  };
  /**
  	@method goto
  	@param {String} p_id
   */
  BaseNavigationController.prototype.goto = function(p_id) {
    if (!this._started) {
      throw new Error('The instance of BaseNavigationController is not started');
    }
    this.change(p_id);
    return false;
  };
  /**
  	__This getter must be overridden with a type of navigation controller it will be a extended.__<br>
  	Returns the type of navigation controller.
  	@attribute type
  	@type {String}
  	@readOnly
   */
  BaseNavigationController.get({
    type: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.type + ' class');
    }
  });
  /**
  	__This getter must be overridden with a current visible views of navigation controller it will be a extended.__<br>
  	Returns the current visible views in DOM.
  	@attribute visibleViews
  	@type {Array}
  	@readOnly
   */
  BaseNavigationController.get({
    visibleViews: function() {
      throw new Error('Override the visibleViews getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a current view of navigation controller it will be a extended.__<br>
  	Returns the current view.
  	@attribute currentView
  	@type {BaseView}
  	@readOnly
   */
  BaseNavigationController.get({
    currentView: function() {
      throw new Error('Override the currentView getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a previous view of navigation controller it will be a extended.__<br>
  	Returns the previous view.
  	@attribute previousView
  	@type {BaseView}
  	@readOnly
   */
  BaseNavigationController.get({
    previousView: function() {
      throw new Error('Override the previousView getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a data object of navigation controller it will be a extended.__<br>
  	Returns the data.
  	@attribute data
  	@type {Object}
  	@readOnly
   */
  BaseNavigationController.get({
    data: function() {
      throw new Error('Override the data getter in ' + this.constructor.name + ' class');
    }
  });
  /**
  	__This getter must be overridden with a change method of navigation controller it will be a extended.__<br>
  	This method trigger the event {{#crossLink "BaseNavigationController/CHANGE_VIEW:event"}}{{/crossLink}} after complete.
  	@method data
  	@param {String} p_id
  	@protected
   */
  BaseNavigationController.prototype.change = function(p_id) {
    this.trigger(BaseNavigationController.CHANGE_VIEW, {
      data: this.data
    });
    return false;
  };
  /**
  	@method _appendToWrapper
  	@param {BaseView} p_view
  	@private
   */
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
      wrapper.appendChild(p_view);
    }
    return false;
  };
  /**
  	@method _removeFromWrapper
  	@param {BaseView} p_view
  	@private
   */
  BaseNavigationController.prototype._removeFromWrapper = function(p_view) {
    var err, wrapper;
    wrapper = (p_view != null ? p_view.parent : void 0) || (p_view != null ? p_view.parentView : void 0);
    try {
      if (wrapper != null) {
        wrapper.removeChild(p_view);
      }
    } catch (_error) {
      err = _error;
      console.log(err.stack);
    }
    return false;
  };
  return BaseNavigationController;
})(EventDispatcher);
var DefaultNavigationController;
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
/**
@class NavigationRouter
@extends EventDispatcher
@final
 */
var NavigationRouter;
NavigationRouter = (function(_super) {
  __extends(NavigationRouter, _super);
  /**
  	@event CHANGE
  	@static
   */
  NavigationRouter.CHANGE = 'route_path_change';
  /**
  	@event CHANGE_ROUTE
  	@static
   */
  NavigationRouter.CHANGE_ROUTE = 'route_match';
  /**
  	@class NavigationRouter
  	@constructor
   */
  function NavigationRouter() {
    this._onPathChange = __bind(this._onPathChange, this);
    this._routes = [];
    this._numRoutes = 0;
    this._trigger = true;
    NavigationRouter.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {String} [p_rootPath = null] Use root path if not set in base tag
  	@param {Boolean} [p_forceHashBang = false] Force hash bang for old browsers
  	@return {NavigationRouter}
   */
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
  /**
  	@method _getPath
  	@return {String}
  	@private
   */
  NavigationRouter.prototype._getPath = function() {
    var rawPath;
    rawPath = window.location.href.replace(/\/*$/g, '');
    if (rawPath.indexOf(this._rootPath.replace(/\/*$/g, '')) === 0) {
      rawPath = rawPath.substr(this._rootPath.length);
    }
    rawPath = rawPath.replace(/^(?:#?!?\/*)([^?]*\??.*?)$/, '$1');
    return rawPath;
  };
  /**
  	@method _parsePath
  	@param {String} p_rawPath
  	@return {Object}
  	@private
   */
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
  /**
  	@method _parseParams
  	@param {String} p_path
  	@return {Object}
  	@private
   */
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
  /**
  	@method _onPathChange
  	@param {Event} [evt = null]
  	@private
   */
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
      this._replaceData = null;
    } else {
      this.trigger(NavigationRouter.CHANGE, this._parsePath(this._currentPath));
    }
    return false;
  };
  /**
  	@method _triggerPath
  	@param {String} p_path
  	@private
   */
  NavigationRouter.prototype._triggerPath = function(p_path) {
    var i, pathData, route, routeData, routes, _ref;
    pathData = this._parsePath(p_path);
    _ref = this._checkRoutes(pathData.path), routes = _ref[0], routeData = _ref[1];
    if (routes) {
      i = routes.length;
      while (i-- > 0) {
        route = routes[i];
        this.trigger(NavigationRouter.CHANGE_ROUTE, {
          route: route.route,
          routeData: routeData,
          path: p_path,
          pathData: pathData,
          data: route.data
        });
      }
    }
    return false;
  };
  /**
  	@method getCurrentPath
  	@return {String}
   */
  NavigationRouter.prototype.getCurrentPath = function() {
    return this._currentPath;
  };
  /**
  	@method getParsedPath
  	@return {Object}
   */
  NavigationRouter.prototype.getParsedPath = function() {
    return this._parsePath(this._currentPath);
  };
  /**
  	@method goto
  	@param {String} p_path
  	@param {Boolean} [p_trigger = true]
   */
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
      this._trigger = true;
    } else {
      window.location.hash = '!' + '/' + p_path;
    }
    return false;
  };
  /**
  	@method replace
  	@param {String} p_path
  	@param {Boolean} [p_trigger = false]
   */
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
      this.triggerPath(p_path);
    }
    return false;
  };
  /**
  	@method triggerPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerPath = function(p_path) {
    this._triggerPath(p_path);
    return false;
  };
  /**
  	@method triggerCurrentPath
  	@param {String} p_path
   */
  NavigationRouter.prototype.triggerCurrentPath = function() {
    this._triggerPath(this._getPath());
    return false;
  };
  /**
  	Add a route
  	@method addRoute
  	@param {String} p_route
  	@param {Object} [p_data = null]
   */
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
    this._routes.sort(this._sortRoutes);
    return false;
  };
  /**
  	Remove a route
  	@method removeRoute
  	@param {String} p_route
   */
  NavigationRouter.prototype.removeRoute = function(p_route) {
    var i, route;
    i = this._numRoutes;
    while (i-- > 0) {
      route = this._routes[i];
      if (route.route === p_route) {
        this._routes.splice(i, 1);
      }
    }
    this._numRoutes = this._routes.length;
    return false;
  };
  /**
  	Remove all routes
  	@method removeAllRoutes
   */
  NavigationRouter.prototype.removeAllRoutes = function() {
    this._routes.length = 0;
    return this._numRoutes = this._routes.length;
  };
  /**
  	@method _checkRoutes
  	@param {String} p_path
  	@private
  	@return {Array}
   */
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
  /**
  	@method _sortRoutes
  	@param {String} p_a
  	@param {String} p_b
  	@private
  	@return {Number}
   */
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
  NavigationRouter.prototype._getParams = function() {
    var decoded, k, params, pathData, v;
    pathData = this._parsePath(this._currentPath);
    params = pathData['params'];
    for (k in params) {
      v = params[k];
      v = decodeURIComponent(v);
      try {
        decoded = JSON.parse(v);
        if (typeof decoded !== 'string') {
          v = decoded;
        }
      } catch (_error) {}
      params[k] = v;
    }
    return params;
  };
  NavigationRouter.prototype._setParams = function(params) {
    var k, pArr, path, pathData, v;
    pathData = this._parsePath(this._currentPath);
    pArr = [];
    for (k in params) {
      v = params[k];
      try {
        if (typeof v !== 'string') {
          v = JSON.stringify(v);
        }
      } catch (_error) {}
      pArr.push(k + '=' + encodeURIComponent(v));
      params[k] = v;
    }
    path = pathData.path;
    if (pArr.length > 0) {
      path = path + '?' + pArr.join('&');
    }
    return this.replace(path);
  };
  NavigationRouter.prototype.getParam = function(name) {
    var params;
    params = this._getParams();
    return params[name];
  };
  NavigationRouter.prototype.setParam = function(name, value) {
    var params;
    params = this._getParams();
    params[name] = value;
    return this._setParams(params);
  };
  NavigationRouter.prototype.removeParam = function(name) {
    var params;
    params = this._getParams();
    params[name] = null;
    delete params[name];
    return this._setParams(params);
  };
  return NavigationRouter;
})(EventDispatcher);
/**
Navigation Class
The instance of this class can be accessed by `app.navigation` wrapper
@class Navigation
@extends EventDispatcher
@uses NavigationRouter
@uses BaseNavigationController
@final
 */
var Navigation;
Navigation = (function(_super) {
  var _controller, _router;
  __extends(Navigation, _super);
  /**
  	@event CHANGE_ROUTE
  	@static
   */
  Navigation.CHANGE_ROUTE = 'navigation_change_route';
  /**
  	@event CHANGE_VIEW
  	@static
   */
  Navigation.CHANGE_VIEW = 'navigation_change_view';
  /**
  	@event CHANGE_INTERNAL_VIEW
  	@static
   */
  Navigation.CHANGE_INTERNAL_VIEW = 'navigation_change_internal_view';
  _controller = null;
  _router = null;
  /**
  	@class Navigation
  	@constructor
  	@param {BaseNavigationController} p_controller
   */
  function Navigation(p_controller) {
    if (p_controller == null) {
      p_controller = null;
    }
    this._change = __bind(this._change, this);
    this.getRouteByView = __bind(this.getRouteByView, this);
    this.getViewByRoute = __bind(this.getViewByRoute, this);
    this.gotoView = __bind(this.gotoView, this);
    this.gotoDefault = __bind(this.gotoDefault, this);
    this.replaceRoute = __bind(this.replaceRoute, this);
    this.gotoRoute = __bind(this.gotoRoute, this);
    this.setRoute = __bind(this.setRoute, this);
    this.goto = __bind(this.goto, this);
    this.start = __bind(this.start, this);
    this.setup = __bind(this.setup, this);
    if (!(p_controller instanceof BaseNavigationController)) {
      throw new Error('The instance of ' + p_controller + ' class is not either BaseNavigationController class');
    }
    _controller = p_controller;
    _router = new NavigationRouter();
    app.navigation = this;
    Navigation.__super__.constructor.apply(this, arguments);
  }
  /**
  	@method setup
  	@param {Object} p_data
   */
  Navigation.prototype.setup = function(p_data) {
    var k, v, _ref, _ref1, _ref2, _ref3;
    _controller.on(BaseNavigationController.CHANGE, this._change);
    _controller.on(BaseNavigationController.CHANGE_VIEW, this._change);
    _controller.setup(p_data);
    _router.on(NavigationRouter.CHANGE, this._change);
    _router.on(NavigationRouter.CHANGE_ROUTE, this._change);
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
  /**
  	@method start
  	@param {Event} [evt=null]
   */
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
      viewID = this.getViewByRoute(current);
    } else {
      viewID = null;
    }
    _controller.start(viewID);
    return false;
  };
  /**
  	Returns the visible views in DOM
  	@attribute visibleViews
  	@type {Array}
  	@readOnly
   */
  Navigation.get({
    visibleViews: function() {
      return this._visibleViews || _controller.visibleViews;
    }
  });
  /**
  	Returns the current view
  	@attribute currentView
  	@type {BaseView}
  	@readOnly
   */
  Navigation.get({
    currentView: function() {
      var view;
      view = this._currentView || _controller.currentView;
      view.routeData = this.routeData;
      return view;
    }
  });
  /**
  	Returns the previous view
  	@attribute previousView
  	@type {BaseView}
  	@readOnly
   */
  Navigation.get({
    previousView: function() {
      return this._previousView || _controller.previousView;
    }
  });
  /**
  	Returns the route data
  	@attribute routeData
  	@type {Object}
  	@readOnly
   */
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
  /**
  	Returns the instance of router controller
  	@attribute router
  	@type {NavigationRouter}
  	@readOnly
   */
  Navigation.get({
    router: function() {
      return _router;
    }
  });
  /**
  	Returns the instance of navigation controller
  	@attribute navigation
  	@type {BaseNavigationController}
  	@readOnly
   */
  Navigation.get({
    controller: function() {
      return _controller;
    }
  });
  /**
  	@method goto
  	@param {String|Object} p_value
  	@deprecated Uses the {{#crossLink "Navigation/gotoRoute:method"}}{{/crossLink}} or {{#crossLink "Navigation/gotoView:method"}}{{/crossLink}}
   */
  Navigation.prototype.goto = function(p_value) {
    throw new Error('This method is already deprecated.');
    return false;
  };
  /**
  	@method setRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
  Navigation.prototype.setRoute = function(p_value, p_trigger) {
    if (p_trigger == null) {
      p_trigger = false;
    }
    this.gotoRoute(p_value, p_trigger);
    return false;
  };
  /**
  	@method gotoRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
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
  /**
  	@method replaceRoute
  	@param {String} p_value
  	@param {Boolean} [p_trigger=false]
   */
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
  /**
  	@method gotoDefault
   */
  Navigation.prototype.gotoDefault = function(p_trigger) {
    var view, _ref;
    if (p_trigger == null) {
      p_trigger = false;
    }
    if (((_ref = app.config.navigation) != null ? _ref.defaultView : void 0) != null) {
      view = app.config.navigation.defaultView;
      this.gotoRoute(this.getRouteByView(view), p_trigger);
    }
    return false;
  };
  /**
  	@method gotoView
  	@param {String} p_value
   */
  Navigation.prototype.gotoView = function(p_value) {
    if (p_value.indexOf('/') === 0) {
      throw new Error('The value "' + p_value + '" is not a valid format to viewID ("areaID")');
    } else {
      _controller.goto(p_value);
    }
    return false;
  };
  /**
  	@method getViewByRoute
  	@param {String} p_value
  	@return {String}
  	@default null
   */
  Navigation.prototype.getViewByRoute = function(p_value) {
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
  /**
  	@method getRouteByView
  	@param {String} p_value
  	@return {String}
  	@default null
   */
  Navigation.prototype.getRouteByView = function(p_value) {
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
  /**
  	@method _change
  	@param {Event} [evt=null]
  	@private
   */
  Navigation.prototype._change = function(evt) {
    if (evt == null) {
      evt = null;
    }
    switch (evt.type) {
      case BaseNavigationController.CHANGE_VIEW:
        this._currentView = evt.data.currentView;
        this._previousView = evt.data.previousView;
        this._visibleViews = evt.data.visibleViews;
        return this.trigger(Navigation.CHANGE_VIEW, {
          data: evt.data
        });
      case BaseNavigationController.CHANGE:
        return this.trigger(Navigation.CHANGE_INTERNAL_VIEW, {
          view: evt.view,
          transition: evt.transition
        });
      case NavigationRouter.CHANGE_ROUTE:
        this.trigger(Navigation.CHANGE_ROUTE, {
          data: this.routeData
        });
        if (this.routeData.route != null) {
          return this.gotoView(this.getViewByRoute(this.routeData.route));
        }
    }
  };
  return Navigation;
})(EventDispatcher);
/**
This is actually not a Class. It's a bunch of helper methods adding prototype methods to native classes.
@class Prototypes
 */
var NetworkError, isIE, __scopeIE8;
isIE = function() {
  var nav;
  nav = navigator.userAgent.toLowerCase();
  if (nav.indexOf('msie') !== -1) {
    return parseInt(nav.split('msie')[1]);
  } else {
    return false;
  }
};
if (isIE() === 8) {
  __scopeIE8 = document.createElement("IE8_" + Math.random());
}
/**
This method is a decorator to create constant variable to a class.  
A extending class cannot override this constant either can't be reassigned.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @const
@example
	class A
		\@const PI: 3.14
	console.log(A.PI) // 3.14
	class B extends A
		\@const PI: 3.14159 // Will throw error
	console.log(B.PI) // Already thrown error before, but will be 3.14
 */
Function.prototype["const"] = function(p_prop) {
  var name, o, value, __scope;
  __scope = __scopeIE8 ? __scopeIE8 : this;
  for (name in p_prop) {
    value = p_prop[name];
    o = {};
    o.get = function() {
      return value;
    };
    o.set = function() {
      throw new Error("Can't set const " + name);
    };
    o.configurable = true;
    o.enumerable = true;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
/**
EXPERIMENTAL
This method is a decorator to protect a property of a class instance removing the property name from enumerable list.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @protectProperties
@example
	class A
		\@protectProperties ["_a", "_b"]
		constructor:()->
			@_a = 1
	console.log(new A()) // Will not list _a either _b as enumerable
 */
Function.prototype.protectProperties = function(p_props) {
  var name, o, __scope, _base, _i, _len;
  console.warn('@protectProperties is an experimental feature. Use with caution.');
  p_props = [].concat(p_props);
  if ((_base = this.prototype)['___'] == null) {
    _base['___'] = {};
  }
  __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  for (_i = 0, _len = p_props.length; _i < _len; _i++) {
    name = p_props[_i];
    o = {};
    o['get'] = function() {
      return this.___[name];
    };
    o['set'] = function(value) {
      return this.___[name] = value;
    };
    o.enumerable = false;
    Object.defineProperty(__scope, name, o);
  }
  return null;
};
/**
Getter decorator for a class instance.  
With this decorator you're able to assign a getter method to a variable.  
Also for a special case, you can assign a scope to the getter so you can create static getter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @get
@example
	// Instance getter
	class A
		\@get test:()->
			return 'Hello world!'
	a = new A()
	console.log(a.test) // Hello world!
	// Static getter
	class A
		\@get \@, TEST:()->
			return 'Hello world!'
	console.log(A.TEST) // Hello world!
 */
Function.prototype.get = function(scope, p_prop) {
  var enumerable, getter, name, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    getter = p_prop[name];
    Object.defineProperty(__scope, name, {
      get: getter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
/**
Setter decorator for a class instance.  
With this decorator you're able to assign a setter method to a variable.  
Also for a special case, you can assign a scope to the setter so you can create static setter to a class.  
* Please ignore de backslash on \\\@ as the code formatter doesn't escape atmarks.
@method @set
@example
	// Instance getter / stter
	class A
		\@get test:()->
			return \@_test
		\@set test:(value)->
			\@_test = value
	a = new A()
	a.test = 'Hello setter'
	console.log(a.test) // Hello setter
	// Static getter / setter
	class A
		\@get \@, TEST:()->
			return @_TEST
		\@set \@, TEST:(value)->
			\@_TEST = value
	A.TEST = 'Hello setter'
	console.log(A.TEST) // Hello setter
 */
Function.prototype.set = function(scope, p_prop) {
  var enumerable, name, setter, __scope;
  enumerable = false;
  if (!p_prop) {
    p_prop = scope;
    __scope = __scopeIE8 ? __scopeIE8 : this.prototype;
  } else {
    enumerable = true;
    __scope = scope;
  }
  for (name in p_prop) {
    setter = p_prop[name];
    Object.defineProperty(__scope, name, {
      set: setter,
      configurable: true,
      enumerable: enumerable
    });
  }
  return null;
};
if (!("bind" in Function.prototype)) {
  Function.prototype.bind = function(owner) {
    var args, that;
    that = this;
    if (arguments_.length <= 1) {
      return function() {
        return that.apply(owner, arguments_);
      };
    } else {
      args = Array.prototype.slice.call(arguments_, 1);
      return function() {
        return that.apply(owner, (arguments_.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments_))));
      };
    }
  };
}
if (!("trim" in String.prototype)) {
  String.prototype.trim = function(char) {
    if (char == null) {
      char = null;
    }
    return this.ltrim(char).rtrim(char);
  };
}
String.prototype.ltrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp('^' + char + '*');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.rtrim = function(char) {
  var re;
  if (char == null) {
    char = null;
  }
  if (!char) {
    char = '\\s';
  }
  re = new RegExp(char + '*$');
  re.global = true;
  re.multiline = true;
  return this.replace(re, '');
};
String.prototype.padLeft = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text = char + text;
  }
  return text;
};
String.prototype.padRight = function(length, char) {
  var text;
  if (char == null) {
    char = ' ';
  }
  if (char.length === 0) {
    char = ' ';
  }
  text = this;
  while (text.length < length) {
    text += char;
  }
  return text;
};
if (!("isArray" in Array.prototype)) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
if (!("indexOf" in Array.prototype)) {
  Array.prototype.indexOf = function(find, i) {
    var n;
    if (i === void 0) {
      i = 0;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i < 0) {
      i = 0;
    }
    n = this.length;
    while (i < n) {
      if (i in this && this[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  };
}
if (!("lastIndexOf" in Array.prototype)) {
  Array.prototype.lastIndexOf = function(find, i) {
    if (i === void 0) {
      i = this.length - 1;
    }
    if (i < 0) {
      i += this.length;
    }
    if (i > this.length - 1) {
      i = this.length - 1;
    }
    i++;
    while (i-- > 0) {
      if (i in this && this[i] === find) {
        return i;
      }
    }
    return -1;
  };
}
if (!("forEach" in Array.prototype)) {
  Array.prototype.forEach = function(action, that) {
    var i, n, _results;
    i = 0;
    n = this.length;
    _results = [];
    while (i < n) {
      if (i in this) {
        action.call(that, this[i], i, this);
      }
      _results.push(i++);
    }
    return _results;
  };
}
if (!("map" in Array.prototype)) {
  Array.prototype.map = function(mapper, that) {
    var i, n, other;
    other = new Array(this.length);
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this) {
        other[i] = mapper.call(that, this[i], i, this);
      }
      i++;
    }
    return other;
  };
}
if (!("filter" in Array.prototype)) {
  Array.prototype.filter = function(filter, that) {
    var i, n, other, v;
    other = [];
    v = void 0;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && filter.call(that, v = this[i], i, this)) {
        other.push(v);
      }
      i++;
    }
    return other;
  };
}
if (!("every" in Array.prototype)) {
  Array.prototype.every = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && !tester.call(that, this[i], i, this)) {
        return false;
      }
      i++;
    }
    return true;
  };
}
if (!("some" in Array.prototype)) {
  Array.prototype.some = function(tester, that) {
    var i, n;
    i = 0;
    n = this.length;
    while (i < n) {
      if (i in this && tester.call(that, this[i], i, this)) {
        return true;
      }
      i++;
    }
    return false;
  };
}
Node.prototype.on = Node.prototype.addEventListener;
Node.prototype.off = Node.prototype.removeEventListener;
if (navigator.mediaDevices == null) {
  navigator.mediaDevices = {};
}
navigator.getUserMedia = navigator.mediaDevices.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
if (typeof Cache !== "undefined" && Cache !== null) {
  if (!("add" in Cache.prototype)) {
    Cache.prototype.add = function(request) {
      return this.addAll([request]);
    };
  }
  if (!("addAll" in Cache.prototype)) {
    Cache.prototype.addAll = function(requests) {
      var cache;
      return cache = this;
    };
    NetworkError = function(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    };
    NetworkError.prototype = Object.create(Error.prototype);
    Promise.resolve().then(function() {
      var requests, sequence;
      if (arguments.length < 1) {
        throw new TypeError;
      }
      sequence = [];
      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        } else {
          return String(request);
        }
      });
      return Promise.all(requests.map(function(request) {
        var scheme;
        if (typeof request === 'string') {
          request = new Request(request);
        }
        scheme = new URL(request.url).protocol;
        if (scheme !== 'http:' && scheme !== 'https:') {
          throw new NetworkError('Invalid scheme');
        }
        return fetch(request.clone());
      }));
    }).then(function(responses) {
      return Promise.all(responses.map(function(response, i) {
        return cache.put(requests[i], response);
      }));
    }).then(function() {
      return void 0;
    });
  }
}
if (typeof CacheStorage !== "undefined" && CacheStorage !== null) {
  if (!("match" in CacheStorage.prototype)) {
    CacheStorage.prototype.match = function(request, opts) {
      var caches;
      caches = this;
      return this.keys().then(function(cacheNames) {
        var match;
        match = void 0;
        return cacheNames.reduce((function(chain, cacheName) {}, chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        })), Promise.resolve());
      });
    };
  }
}
var BaseDOM,
  __slice = [].slice;
Node.prototype.__appendChild__ = Node.prototype.appendChild;
Node.prototype.appendChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  return Node.prototype.__appendChild__.call(this, el);
};
Node.prototype.__removeChild__ = Node.prototype.removeChild;
Node.prototype.removeChild = function(node) {
  var el;
  el = node;
  if (node instanceof BaseDOM) {
    el = node.element;
    node.parent = this;
  }
  return Node.prototype.__removeChild__.call(this, el);
};
Element.prototype.matches = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector;
Node.prototype.findParents = function(query) {
  if (this.parentNode != null) {
    if (this.parentNode.matches(query)) {
      return this.parentNode;
    } else {
      return this.parentNode.findParents(query);
    }
  }
  return null;
};
/**
Base DOM manipulation class
@class BaseDOM
 */
BaseDOM = (function(_super) {
  __extends(BaseDOM, _super);
  function BaseDOM() {
    var className, element, i, namespace, option, p_options;
    p_options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    BaseDOM.__super__.constructor.apply(this, arguments);
    element = 'div';
    className = null;
    namespace = null;
    if (typeof p_options[0] === 'string' || p_options[0] instanceof HTMLElement) {
      element = p_options[0];
    } else {
      i = p_options.length;
      while (i--) {
        option = p_options[i];
        if (option.element != null) {
          element = option.element;
        }
        if (option.className != null) {
          className = option.className;
        }
        if (option.namespace != null) {
          namespace = option.namespace;
        }
      }
    }
    if (typeof element === 'string') {
      if (namespace) {
        this._namespace = namespace;
        this._element = document.createElementNS(this._namespace, element);
      } else {
        this._element = document.createElement(element);
      }
    } else if (element instanceof HTMLElement) {
      this._element = element;
    }
    if (className) {
      this.addClass(className);
    }
    this._element.__instance__ = this;
  }
  BaseDOM.get({
    element: function() {
      return this._element;
    }
  });
  BaseDOM.get({
    namespace: function() {
      return this._namespace;
    }
  });
  BaseDOM.get({
    childNodes: function() {
      return this.element.childNodes;
    }
  });
  BaseDOM.get({
    width: function() {
      return this.getBounds().width;
    }
  });
  BaseDOM.get({
    height: function() {
      return this.getBounds().height;
    }
  });
  BaseDOM.get({
    left: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    top: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    x: function() {
      return this.getBounds().left;
    }
  });
  BaseDOM.get({
    y: function() {
      return this.getBounds().top;
    }
  });
  BaseDOM.get({
    parent: function() {
      return this._parent;
    }
  });
  BaseDOM.set({
    parent: function(value) {
      if (!(value instanceof BaseDOM) && !(value instanceof Node)) {
        throw new Error('Parent instance is not either Node or BaseDOM');
      }
      return this._parent = value;
    }
  });
  BaseDOM.get({
    className: function() {
      return this.element.className;
    }
  });
  BaseDOM.set({
    className: function(value) {
      return this.element.className = value.trim();
    }
  });
  BaseDOM.get({
    text: function() {
      return this.html;
    }
  });
  BaseDOM.set({
    text: function(value) {
      return this.html = value;
    }
  });
  BaseDOM.get({
    html: function() {
      return this.element.innerHTML;
    }
  });
  BaseDOM.set({
    html: function(value) {
      return this.element.innerHTML = value;
    }
  });
  BaseDOM.get({
    isAttached: function() {
      return (typeof document.contains === "function" ? document.contains(this.element) : void 0) || document.body.contains(this.element);
    }
  });
  BaseDOM.get({
    attributes: function() {
      return this.element.attributes;
    }
  });
  BaseDOM.prototype.appendChild = function(child) {
    return this.appendChildAt(child);
  };
  BaseDOM.prototype.appendChildAt = function(child, index) {
    var el;
    if (index == null) {
      index = -1;
    }
    el = child;
    if (child instanceof BaseDOM) {
      el = child.element;
    }
    if (index === -1 || index >= this.childNodes.length) {
      this.element.appendChild(el);
    } else {
      this.element.insertBefore(el, this.childNodes[index]);
    }
    if (child instanceof BaseDOM) {
      child.parent = this;
    }
    return child;
  };
  BaseDOM.prototype.remove = function() {
    var _ref;
    return (_ref = this.parent) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(this) : void 0 : void 0;
  };
  BaseDOM.prototype.removeChild = function(child) {
    var el, _ref;
    el = child;
    if (child instanceof BaseDOM) {
      el = child != null ? child.element : void 0;
    }
    try {
      return (_ref = this.element) != null ? typeof _ref.removeChild === "function" ? _ref.removeChild(el) : void 0 : void 0;
    } catch (_error) {}
  };
  BaseDOM.prototype.removeChildAt = function(index) {
    if (index == null) {
      index = -1;
    }
    if (index < this.childNodes.length) {
      return typeof this.removeChild === "function" ? this.removeChild(this.childNodes[i]) : void 0;
    }
  };
  BaseDOM.prototype.removeAll = function() {
    var childs, i, _results;
    childs = this.childNodes;
    i = childs.length;
    _results = [];
    while (i-- > 0) {
      _results.push(this.removeChild(childs[i]));
    }
    return _results;
  };
  BaseDOM.prototype.matches = function(query) {
    return this.element.matches(query);
  };
  BaseDOM.prototype.findParents = function(query) {
    return this.element.findParents(query);
  };
  BaseDOM.prototype.find = function(query, onlyInstances) {
    var element;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    element = this.element.querySelector(query);
    if (onlyInstances) {
      return element != null ? element.__instance__ : void 0;
    } else {
      return element;
    }
  };
  BaseDOM.prototype.findAll = function(query, onlyInstances) {
    var elements, els, i, l, p;
    if (onlyInstances == null) {
      onlyInstances = false;
    }
    elements = this.element.querySelectorAll(query);
    if (onlyInstances) {
      els = [];
      i = -1;
      l = elements.length;
      p = 0;
      while (++i < l) {
        if (elements[i].__instance__) {
          els[p++] = elements[i].__instance__;
        }
      }
      elements = els;
    }
    return elements;
  };
  BaseDOM.prototype.attr = function(name, value, namespace) {
    var k, v, _results;
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (typeof name === 'string') {
      return this._attr(name, value, namespace);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._attr(k, v, namespace));
      }
      return _results;
    }
  };
  BaseDOM.prototype._attr = function(name, value, namespace) {
    if (value == null) {
      value = 'nonenonenone';
    }
    if (namespace == null) {
      namespace = false;
    }
    if (namespace === false) {
      namespace = this.namespace;
    }
    if (value !== 'nonenonenone') {
      if (namespace) {
        this.element.setAttributeNS(namespace, name, value);
      } else {
        this.element.setAttribute(name, value);
      }
    }
    if (namespace) {
      return this.element.getAttributeNS(namespace, name);
    } else {
      return this.element.getAttribute(name);
    }
  };
  BaseDOM.prototype._css = function(name, value) {
    if (value == null) {
      value = null;
    }
    if (value !== null) {
      this.element.style[name] = value;
    }
    return this.element.style[name];
  };
  BaseDOM.prototype.css = function(name, value) {
    var k, v, _results;
    if (value == null) {
      value = null;
    }
    if (typeof name === 'string') {
      return this._css(name, value);
    } else if (typeof name === 'object') {
      _results = [];
      for (k in name) {
        v = name[k];
        _results.push(this._css(k, v));
      }
      return _results;
    }
  };
  BaseDOM.prototype.addClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    p = classNames.length;
    i = className.length;
    while (i-- > 0) {
      if (classNames.indexOf(className[i]) >= 0) {
        continue;
      }
      classNames[p++] = className[i];
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.removeClass = function(className) {
    var classNames, i, p;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    while (i-- > 0) {
      if ((p = classNames.indexOf(className[i])) >= 0) {
        classNames.splice(p, 1);
      }
    }
    return this.className = classNames.join(' ');
  };
  BaseDOM.prototype.toggleClass = function(className, toggle) {
    var i, _results;
    if (toggle == null) {
      toggle = null;
    }
    if (toggle !== null) {
      if (toggle) {
        this.addClass(className);
      } else {
        this.removeClass(className);
      }
      return;
    }
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    i = className.length;
    _results = [];
    while (i-- > 0) {
      if (this.hasClass(className[i])) {
        _results.push(this.removeClass(className[i]));
      } else {
        _results.push(this.addClass(className[i]));
      }
    }
    return _results;
  };
  BaseDOM.prototype.hasClass = function(className) {
    var classNames, hasClass, i;
    if (typeof className === 'string') {
      className = className.replace(/\s+/ig, ' ').split(' ');
    } else if (typeof className !== 'Array') {
      return;
    }
    classNames = this.className.replace(/\s+/ig, ' ').split(' ');
    i = className.length;
    hasClass = true;
    while (i-- > 0) {
      hasClass &= classNames.indexOf(className[i]) >= 0;
    }
    return hasClass;
  };
  BaseDOM.prototype.getBounds = function(target) {
    var bounds, boundsObj, k, tbounds, v;
    if (target == null) {
      target = null;
    }
    boundsObj = {};
    bounds = this.element.getBoundingClientRect();
    for (k in bounds) {
      v = bounds[k];
      boundsObj[k] = v;
    }
    if (target) {
      if (target instanceof BaseDOM) {
        tbounds = target.getBounds();
      } else if (target instanceof HTMLElement) {
        tbounds = target.getBoundingClientRect();
      }
    }
    if (tbounds) {
      boundsObj.top -= tbounds.top;
      boundsObj.left -= tbounds.left;
      boundsObj.bottom -= tbounds.top;
      boundsObj.right -= tbounds.left;
    }
    boundsObj.width = boundsObj.right - boundsObj.left;
    boundsObj.height = boundsObj.bottom - boundsObj.top;
    return boundsObj;
  };
  BaseDOM.prototype.destroy = function() {
    if (typeof this.off === "function") {
      this.off();
    }
    return typeof this.remove === "function" ? this.remove() : void 0;
  };
  return BaseDOM;
})(EventDispatcher);
/**
@class MetaController
@extends EventDispatcher
@final
 */
var MetaController;
MetaController = (function(_super) {
  __extends(MetaController, _super);
  /**
  	Runtime controls some meta tags of current view.<br>
  	For add/edit these tags or values, put the meta object in content file, like explained below:
  	@class MetaController
  	@constructor
  	@example
  	```
  	"meta":
  	{
  		"title": "Default Template - title",
  		"description":"description",
  		"webAppCapable":"true",
  		"color":"#ff00ff",
  		"manifest":"{base}data/manifest.json",
  		"favicon":"{images}icons/favicon-default.ico",
  		"icons":[
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"57x57",
  				"href":"{images}icons/apple-touch-icon-57x57.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"60x60",
  				"href":"{images}icons/apple-touch-icon-60x60.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"72x72",
  				"href":"{images}icons/apple-touch-icon-72x72.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"76x76",
  				"href":"{images}icons/apple-touch-icon-76x76.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"114x114",
  				"href":"{images}icons/apple-touch-icon-114x114.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"120x120",
  				"href":"{images}icons/apple-touch-icon-120x120.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"144x144",
  				"href":"{images}icons/apple-touch-icon-144x144.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"152x152",
  				"href":"{images}icons/apple-touch-icon-152x152.png"
  			},
  			{
  				"rel":"apple-touch-icon", 
  				"sizes":"180x180",
  				"href":"{images}icons/apple-touch-icon-180x180.png"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-16x16.png", 
  				"sizes":"16x16"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-32x32.png", 
  				"sizes":"32x32"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/favicon-96x96.png", 
  				"sizes":"96x96"
  			},
  			{
  				"rel":"icon",
  				"href":"{images}icons/android-chrome-192x192.png", 
  				"sizes":"192x192"
  			}
  		]
  	}
  	```
   */
  function MetaController() {
    MetaController.__super__.constructor.apply(this, arguments);
  }
  MetaController.getInstance = function() {
    return MetaController._instance != null ? MetaController._instance : MetaController._instance = new MetaController();
  };
  /**
  	@method change
  	@param {Object} p_data
   */
  MetaController.prototype.change = function(p_data) {
    var e, k, v;
    if (p_data != null) {
      for (k in p_data) {
        v = p_data[k];
        try {
          this[k] = v;
        } catch (_error) {
          e = _error;
        }
      }
    }
    return false;
  };
  /**
  	@method applyMeta
  	@param {String} p_name
  	@param {String} p_value
  	@protected
   */
  MetaController.prototype.applyMeta = function(p_name, p_value) {
    var meta;
    if (p_value != null) {
      if (document.querySelector('meta[name=' + p_name + ']') != null) {
        document.querySelector('meta[name=' + p_name + ']').content = p_value;
      } else {
        meta = document.createElement('meta');
        meta.name = p_name;
        meta.content = p_value;
        this.head.appendChild(meta);
      }
    }
    return false;
  };
  /**
  	@method applyLink
  	@param {String} p_rel
  	@param {String} p_value
  	@protected
   */
  MetaController.prototype.applyLink = function(p_rel, p_href, p_others) {
    var k, link, v;
    if (p_others == null) {
      p_others = null;
    }
    link = document.createElement('link');
    link.rel = p_rel;
    link.href = p_href;
    if ((p_others != null) && typeof p_others === "object") {
      for (k in p_others) {
        v = p_others[k];
        link[k] = v;
      }
    }
    this.head.appendChild(link);
    return false;
  };
  /**
  	@attribute head
  	@type {HTMLElement}
  	@readOnly
   */
  MetaController.get({
    head: function() {
      return document.head || document.getElementsByTagName('head')[0];
    }
  });
  /**
  	@attribute viewport
  	@type {String}
   */
  MetaController.set({
    viewport: function(p_value) {
      return this.applyMeta('viewport', p_value);
    }
  });
  /**
  	@attribute title
  	@type {String}
   */
  MetaController.set({
    title: function(p_value) {
      if (p_value != null) {
        document.title = p_value;
        return this.applyMeta('apple-mobile-web-app-title', p_value);
      }
    }
  });
  /**
  	@attribute description
  	@type {String}
   */
  MetaController.set({
    description: function(p_value) {
      return this.applyMeta('description', p_value);
    }
  });
  /**
  	@attribute favicon
  	@type {String}
   */
  MetaController.set({
    favicon: function(p_value) {
      if (this._favicon == null) {
        this._favicon = p_value;
        this.applyLink('icon', p_value, {
          "type": "image/x-icon"
        });
      }
      return false;
    }
  });
  /**
  	@attribute icons
  	@type {String}
   */
  MetaController.set({
    icons: function(p_value) {
      var k, v;
      for (k in p_value) {
        v = p_value[k];
        this.applyLink(v['rel'], v['href'], {
          "sizes": v["sizes"]
        });
      }
      return false;
    }
  });
  /**
  	*Only for iOS
  	@attribute splash
  	@type {String}
   */
  MetaController.set({
    splash: function(p_value) {
      this.applyLink('apple-touch-startup-image', p_value);
      return false;
    }
  });
  /**
  	@attribute webAppCapable
  	@type {String}
   */
  MetaController.set({
    webAppCapable: function(p_value) {
      var value;
      value = p_value === true || p_value === "true" ? 'yes' : 'no';
      this.applyMeta('mobile-web-app-capable', value);
      this.applyMeta('apple-mobile-web-app-capable', value);
      return false;
    }
  });
  /**
  	@attribute color
  	@type {String}
   */
  MetaController.set({
    color: function(p_color) {
      this.webAppCapable = true;
      this.applyMeta('theme-color', p_color);
      this.applyMeta('msapplication-navbutton-color', p_color);
      this.applyMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
      return false;
    }
  });
  /**
  	*Only for Android
  	@attribute manifest
  	@type {String}
  	@example
  	```
  	{
  	  "lang": "en",
  	  "scope": "/scope/",	  
  	  "name": "Web Application Manifest Sample",
  	  "short_name": "Application",
  	  "display": "standalone",
  	  "orientation": "landscape",
  	  "start_url": "index.html",
  	  "theme_color": "aliceblue",
  	  "background_color": "blue",
  	  "icons": [
  	    {
  	      "src": "launcher-icon-0-75x.png",
  	      "sizes": "36x36",
  	      "type": "image/png",
  	      "density": 0.75
  	    },
  	    {
  	      "src": "launcher-icon-1x.png",
  	      "sizes": "48x48",
  	      "type": "image/png",
  	      "density": 1.0
  	    },
  	    {
  	      "src": "launcher-icon-1-5x.png",
  	      "sizes": "72x72",
  	      "type": "image/png",
  	      "density": 1.5
  	    },
  	    {
  	      "src": "launcher-icon-2x.png",
  	      "sizes": "96x96",
  	      "type": "image/png",
  	      "density": 2.0
  	    },
  	    {
  	      "src": "launcher-icon-3x.png",
  	      "sizes": "144x144",
  	      "type": "image/png",
  	      "density": 3.0
  	    },
  	    {
  	      "src": "launcher-icon-4x.png",
  	      "sizes": "192x192",
  	      "type": "image/png",
  	      "density": 4.0
  	    }
  	  ]
  	}	
  	```
   */
  MetaController.set({
    manifest: function(p_value) {
      this.applyLink('manifest', p_value);
      return false;
    }
  });
  return MetaController;
})(EventDispatcher);
/**
Base View
@class BaseView
@extends BaseDOM
@uses MetaController
 */
var BaseView;
BaseView = (function(_super) {
  /**
  	Triggered before the create routine view starts. Triggered when {{#crossLink "BaseView/createStart:method"}}{{/crossLink}} is called.
  	@event CREATE_START
  	@static
   */
  var _meta;
  __extends(BaseView, _super);
  BaseView["const"]({
    CREATE_START: 'create_start'
  });
  /**
  	Triggered when the create routine view starts. Triggered when {{#crossLink "BaseView/create:method"}}{{/crossLink}} is called.
  	@event CREATE
  	@static
   */
  BaseView["const"]({
    CREATE: 'create'
  });
  /**
  	Triggered when the create routine view is finished. Triggered when {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} is called.
  	@event CREATE_COMPLETE
  	@static
   */
  BaseView["const"]({
    CREATE_COMPLETE: 'create_complete'
  });
  /**
  	Triggered before the showing routine view starts. Triggered when {{#crossLink "BaseView/showStart:method"}}{{/crossLink}} is called.
  	@event SHOW_START
  	@static
   */
  BaseView["const"]({
    SHOW_START: 'show_start'
  });
  /**
  	Triggered when the showing routine view starts. Triggered when {{#crossLink "BaseView/show:method"}}{{/crossLink}} is called.
  	@event SHOW
  	@static
   */
  BaseView["const"]({
    SHOW: 'show'
  });
  /**
  	Triggered when the showing routine view is finished. Triggered when {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} is called.
  	@event SHOW_COMPLETE
  	@static
   */
  BaseView["const"]({
    SHOW_COMPLETE: 'show_complete'
  });
  /**
  	Triggered before the hiding routine view starts. Triggered when {{#crossLink "BaseView/hideStart:method"}}{{/crossLink}} is called.
  	@event HIDE_START
  	@static
   */
  BaseView["const"]({
    HIDE_START: 'hide_start'
  });
  /**
  	Triggered when the hiding routine view starts. Triggered when {{#crossLink "BaseView/hide:method"}}{{/crossLink}} is called.
  	@event HIDE
  	@static
   */
  BaseView["const"]({
    HIDE: 'hide'
  });
  /**
  	Triggered when the hiding routine view is finished. Triggered when {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} is called.
  	@event HIDE_COMPLETE
  	@static
   */
  BaseView["const"]({
    HIDE_COMPLETE: 'hide_complete'
  });
  /**
  	Triggered when the destroy routine view starts. Triggered when {{#crossLink "BaseView/destroy:method"}}{{/crossLink}} is called.
  	@event DESTROY
  	@static
   */
  BaseView["const"]({
    DESTROY: 'destroy'
  });
  /**
  	Triggered when the destroy routine view is finished. Triggered when {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} is called.
  	@event DESTROY_COMPLETE
  	@static
   */
  BaseView["const"]({
    DESTROY_COMPLETE: 'destroy_complete'
  });
  /**
  	Triggered when the view pauses. Usually when {{#crossLink "BaseView/pause:method"}}{{/crossLink}} is called.
  	@event PAUSE
  	@static
   */
  BaseView["const"]({
    PAUSE: 'pause'
  });
  /**
  	Triggered when the view resumes. Usually when {{#crossLink "BaseView/resume:method"}}{{/crossLink}} is called.
  	@event RESUME
  	@static
   */
  BaseView["const"]({
    RESUME: 'resume'
  });
  /**
  	@class BaseView
  	@constructor	
  	@param {Object} [p_data=null] 
  	Data object sets the default and/or custom values of properties of view for navigation controller.<br>
  	If this object it's not null, some default properties are not required explained below:
  	Default Key|Type|Required
  	-|-|-
  	id|{{#crossLink "String"}}{{/crossLink}}|__Yes__
  	class|{{#crossLink "String"}}{{/crossLink}}|__Yes__
  	route|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "RegExp"}}{{/crossLink}}|__No__
  	content|{{#crossLink "String"}}{{/crossLink}} / {{#crossLink "JSON"}}{{/crossLink}}|__No__
  	cache|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	parentView|{{#crossLink "String"}}{{/crossLink}}|__No__
  	destroyable|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	loadContent|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	snap *(only for scroll navigation type)*|{{#crossLink "Boolean"}}{{/crossLink}}|__No__
  	subviewsWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
  	attachToParentWrapper|<a href="//developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_Started/Selectors" target="_blank" class="crosslink">Selectors</a>|__No__
  	@example
  	```
  	{
  		"id":"home",
  		"class":"template-home-view", //the valid formats are "ClassName", "class-name", "class name" or "class_name"
  		"route":"/", //valid formats are String or RegExp
  		"content":"data/home.json",
  		"cache":true,
  		"parentView":"someViewID", //the unique ID of parent view
  		"destroyable":true,
  		"loadContent":true,
  		"snap":true, //only for scroll navigation type
  		"subviewsWrapper":"CSSSelector", //like #ID or .className etc
  		"attachToParentWrapper":"CSSSelector" //like #ID or .className etc
  	}
  	```
  	@param {String} [p_CSSClassName=null]
   */
  _meta = null;
  function BaseView(p_data, p_CSSClassName) {
    if (p_data == null) {
      p_data = null;
    }
    if (p_CSSClassName == null) {
      p_CSSClassName = null;
    }
    this.destroyComplete = __bind(this.destroyComplete, this);
    this.destroy = __bind(this.destroy, this);
    this.resume = __bind(this.resume, this);
    this.pause = __bind(this.pause, this);
    this.hideComplete = __bind(this.hideComplete, this);
    this.hide = __bind(this.hide, this);
    this.hideStart = __bind(this.hideStart, this);
    this.showComplete = __bind(this.showComplete, this);
    this.show = __bind(this.show, this);
    this.showStart = __bind(this.showStart, this);
    this.createComplete = __bind(this.createComplete, this);
    this.create = __bind(this.create, this);
    this.createStart = __bind(this.createStart, this);
    this.getReverseParentList = __bind(this.getReverseParentList, this);
    this._created = false;
    this._showed = false;
    this.data = p_data ? p_data : {};
    this.id = this._data.id != null ? this._data.id : void 0;
    this.content = this._data.content != null ? this._data.content : void 0;
    this.route = this._data.route != null ? this._data.route : void 0;
    this.routeData = !this._routeData ? null : void 0;
    this.parentView = this._data.parentView != null ? this._data.parentView : void 0;
    this.subviews = this._data.subviews != null ? this._data.subviews : void 0;
    this.destroyable = this._data.destroyable != null ? this._data.destroyable : void 0;
    _meta = MetaController.getInstance();
    BaseView.__super__.constructor.call(this, {
      element: 'div',
      className: p_CSSClassName
    });
  }
  /**
  	Returns the loader queue of this specific view.
  	@attribute loader
  	@type {createjs.LoadQueue}
  	@default null
  	@readOnly
   */
  BaseView.get({
    loader: function() {
      var _ref;
      if (this._id != null) {
        return typeof app !== "undefined" && app !== null ? (_ref = app.loader) != null ? _ref.getGroup(this._id) : void 0 : void 0;
      } else {
        return null;
      }
    }
  });
  /**
  	Returns true if the view was created.
  	@attribute created
  	@type {Boolean}
  	@default false
  	@protected
  	@readOnly
   */
  BaseView.get({
    created: function() {
      return this._created;
    }
  });
  /**
  	Returns true if the view was shown.
  	@attribute showed
  	@type {Boolean}
  	@default false
  	@protected
  	@readOnly
   */
  BaseView.get({
    showed: function() {
      return this._showed;
    }
  });
  /**
  	Sets/gets a clone of data object with default and/or custom values of properties of view.
  	@attribute data
  	@type {Object}
  	@default {}
   */
  BaseView.get({
    data: function() {
      return this._data;
    }
  });
  BaseView.set({
    data: function(p_value) {
      return this._data = p_value;
    }
  });
  /**
  	Sets/gets the unique ID of view.
  	@attribute id
  	@type {String}
  	@default null
   */
  BaseView.get({
    id: function() {
      return this._id;
    }
  });
  BaseView.set({
    id: function(p_value) {
      return this._id = p_value;
    }
  });
  /**
  	Sets/gets the content of view.
  	@attribute content
  	@type {String|Object|JSON}
  	@default null
   */
  BaseView.get({
    content: function() {
      return this._content;
    }
  });
  BaseView.set({
    content: function(p_value) {
      return this._content = p_value;
    }
  });
  /**
  	Sets/gets the route of view.
  	@attribute route
  	@type {String|RegExp}
  	@default null
   */
  BaseView.get({
    route: function() {
      return this._route;
    }
  });
  BaseView.set({
    route: function(p_value) {
      return this._route = p_value;
    }
  });
  /**
  	Sets/gets the actual route data.
  	@attribute routeData
  	@type {Object}
  	@protected
  	@default null
   */
  BaseView.get({
    routeData: function() {
      return this._routeData;
    }
  });
  BaseView.set({
    routeData: function(p_value) {
      return this._routeData = p_value;
    }
  });
  /**
  	Sets/gets the parent view of this view.
  	@attribute parentView
  	@type {BaseView}
  	@default null
   */
  BaseView.get({
    parentView: function() {
      return this._parentView;
    }
  });
  BaseView.set({
    parentView: function(p_value) {
      return this._parentView = p_value;
    }
  });
  /**
  	Sets/gets a array of {{#crossLink "BaseView"}}{{/crossLink}} instances of subviews of this view.
  	@attribute subviews
  	@type {Array}
  	@default null
   */
  BaseView.get({
    subviews: function() {
      return this._subviews;
    }
  });
  BaseView.set({
    subviews: function(p_value) {
      return this._subviews = p_value;
    }
  });
  /**
  	Sets/gets if this views is destroyable.
  	@attribute destroyable
  	@type {Boolean}
  	@default false
   */
  BaseView.get({
    destroyable: function() {
      return this._destroyable;
    }
  });
  BaseView.set({
    destroyable: function(p_value) {
      return this._destroyable = p_value;
    }
  });
  /**
  	Sets/gets the type is a 'view' or a 'sub-view'.
  	@attribute type
  	@type {String}
  	@protected
  	@default null
   */
  BaseView.get({
    type: function() {
      return this._type;
    }
  });
  BaseView.set({
    type: function(p_value) {
      return this._type = p_value;
    }
  });
  /**
  	Returns the meta object of his content.
  	@attribute meta
  	@type {Object}
  	@default null
  	@readOnly
   */
  BaseView.get({
    meta: function() {
      var _ref, _ref1;
      if (((_ref = this._content) != null ? _ref.meta : void 0) != null) {
        return (_ref1 = this._content) != null ? _ref1.meta : void 0;
      }
    }
  });
  /**
  	Sets/gets the loading progress of this view.
  	@attribute progress
  	@type {Number}
  	@protected
   */
  BaseView.get({
    progress: function() {
      if (this._progress != null) {
        return this._progress;
      } else {
        return this.loader.progress;
      }
    }
  });
  BaseView.set({
    progress: function(p_value) {
      return this._progress = p_value;
    }
  });
  /**
  	Returns the reverse path of his parent view.
  	@attribute reverseParentPath
  	@type {Array}
  	@protected
  	@readOnly
   */
  BaseView.get({
    reverseParentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath.reverse();
    }
  });
  /**
  	Returns the path of his parent view.
  	@attribute parentPath
  	@type {Array}
  	@protected
  	@readOnly
   */
  BaseView.get({
    parentPath: function() {
      this.getReverseParentList(this);
      return this._parentPath;
    }
  });
  /**
  	Returns the wrapper container for the sub-views of this view.
  	@attribute subviewsWrapper
  	@type {HTMLElement}
  	@default null
  	@readOnly
   */
  BaseView.get({
    subviewsWrapper: function() {
      var _ref;
      if (((_ref = this._data) != null ? _ref.subviewsWrapper : void 0) != null) {
        return this.find(this._data.subviewsWrapper);
      }
    }
  });
  /**
  	Returns the CSS Selector of the wrapper container for attach this view.
  	@attribute attachToParentWrapper
  	@type {String}
  	@default null
  	@readOnly
   */
  BaseView.get({
    attachToParentWrapper: function() {
      var _ref;
      if (((_ref = this._data) != null ? _ref.attachToParentWrapper : void 0) != null) {
        return this._data.attachToParentWrapper;
      }
    }
  });
  /**
  	Returns a reverse list of the parent path of this view.
  	@method getReverseParentList
  	@param {Object|JSON} [p_subview=null]
  	@private
  	@readOnly
   */
  BaseView.prototype.getReverseParentList = function(p_subview) {
    if (p_subview == null) {
      p_subview = null;
    }
    this._parentPath = [];
    if ((p_subview != null ? p_subview.parentView : void 0) != null) {
      this.getReverseParentList(p_subview.parentView);
      this._parentPath.push(p_subview.id);
    }
    return false;
  };
  /**
  	Usually starts before the creation routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/create:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE_START:event"}}{{/crossLink}} after complete.
  	@method createStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE_START, this);
    this.create();
    return false;
  };
  /**
  	Usually starts when the creation routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/createComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/CREATE:event"}}{{/crossLink}} after complete.
  	@method create
  	@param {Event} [evt=null]
   */
  BaseView.prototype.create = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.CREATE, this);
    this.createComplete();
    return false;
  };
  /**
  	Usually starts when finished the creation routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/CREATE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method createComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.createComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._created = true;
    this.trigger(BaseView.CREATE_COMPLETE, this);
    return false;
  };
  /**
  	Usually starts before the showing routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/show:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW_START:event"}}{{/crossLink}} after complete.
  	@method showStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.showStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW_START, this);
    _meta.change(this.meta);
    this.show();
    return false;
  };
  /**
  	Usually starts when the showing routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/showComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/SHOW:event"}}{{/crossLink}} after complete.
  	@method show
  	@param {Event} [evt=null]
   */
  BaseView.prototype.show = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.SHOW, this);
    this.showComplete();
    return false;
  };
  /**
  	Usually when finished the showing routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/SHOW_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method showComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.showComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._showed = true;
    this.trigger(BaseView.SHOW_COMPLETE, this);
    return false;
  };
  /**
  	Usually starts before the hiding routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/hide:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE_START:event"}}{{/crossLink}} after complete.
  	@method hideStart
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hideStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_START, this);
    this.hide();
    return false;
  };
  /**
  	Usually starts when the hiding routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/hideComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/HIDE:event"}}{{/crossLink}} after complete.
  	@method hide
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hide = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this._showed = false;
    this.trigger(BaseView.HIDE, this);
    this.hideComplete();
    return false;
  };
  /**
  	Usually when finished the hiding routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/HIDE_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method hideComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.hideComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.HIDE_COMPLETE, this);
    return false;
  };
  /**
  	Usually used to pauses animations or something else in looping in view.
  	Trigger the event {{#crossLink "BaseView/PAUSE:event"}}{{/crossLink}} after complete.
  	@method pause
   */
  BaseView.prototype.pause = function() {
    this.trigger(BaseView.PAUSE, this);
    return false;
  };
  /**
  	Usually used to resumes animations or something else in view.
  	Trigger the event {{#crossLink "BaseView/RESUME:event"}}{{/crossLink}} after complete.
  	@method pause
   */
  BaseView.prototype.resume = function() {
    this.trigger(BaseView.RESUME, this);
    return false;
  };
  /**
  	Usually starts when the destroying routine of view calling by the navigation controller.<br>
  	Callback the method {{#crossLink "BaseView/destroyComplete:method"}}{{/crossLink}} and trigger the event {{#crossLink "BaseView/DESTROY:event"}}{{/crossLink}} after complete.
  	@method destroy
  	@param {Event} [evt=null]
   */
  BaseView.prototype.destroy = function(evt) {
    var _ref;
    if (evt == null) {
      evt = null;
    }
    this._created = false;
    this.removeAll();
    if ((_ref = this._parentPath) != null) {
      _ref.length = 0;
    }
    this._parentPath = null;
    this._routeData = null;
    this._data = null;
    this.trigger(BaseView.DESTROY, this);
    this.destroyComplete();
    return false;
  };
  /**
  	Usually when finished the destroying routine of view calling by the navigation controller and trigger the event {{#crossLink "BaseView/DESTROY_COMPLETE:event"}}{{/crossLink}} after complete the routine.
  	@method destroyComplete
  	@param {Event} [evt=null]
   */
  BaseView.prototype.destroyComplete = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.trigger(BaseView.DESTROY_COMPLETE, this);
    this.off();
    return false;
  };
  return BaseView;
})(BaseDOM);
/**
NavigationContainer Class
@class NavigationContainer
@extends BaseView
 */
var NavigationContainer;
NavigationContainer = (function(_super) {
  __extends(NavigationContainer, _super);
  /**
  	@class NavigationContainer
  	@constructor
   */
  function NavigationContainer() {
    this.setupNavigation = __bind(this.setupNavigation, this);
    NavigationContainer.__super__.constructor.call(this, null, 'nav-container');
    this._id = 'main';
  }
  /**
  	@method setupNavigation
  	@param {Object} p_data
   */
  NavigationContainer.prototype.setupNavigation = function(p_data) {
    this._navigation = new Navigation(this.controller);
    this._navigation.setup(p_data);
    return false;
  };
  /**
  	Returns the current instance of {{#crossLink "Navigation"}}{{/crossLink}}
  	@attribute navigation
  	@type {Navigation}
  	@readOnly
   */
  NavigationContainer.get({
    navigation: function() {
      return this._navigation;
    }
  });
  /**
  	__This getter must be overridden with a instance of {{#crossLink "BaseNavigationController"}}{{/crossLink}}.__<br>
  	Returns the current navigation controller instance.
  	@attribute controller
  	@type {BaseNavigationController}
  	@readOnly
   */
  NavigationContainer.get({
    controller: function() {
      throw new Error('Override this method with a instance of BaseNavigationController.');
    }
  });
  return NavigationContainer;
})(BaseView);
var Resizer;
Resizer = (function(_super) {
  var _body, _bounds;
  __extends(Resizer, _super);
  Resizer.RESIZE = 'resize_resizer';
  Resizer.ORIENTATION_CHANGE = 'orientation_change_resizer';
  Resizer.BREAKPOINT_CHANGE = 'breakpoint_changed_resizer';
  _bounds = null;
  _body = null;
  Resizer.getInstance = function(p_start) {
    if (p_start == null) {
      p_start = true;
    }
    return Resizer._instance != null ? Resizer._instance : Resizer._instance = new Resizer(p_start);
  };
  function Resizer(p_start) {
    if (p_start == null) {
      p_start = true;
    }
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
    if (p_start != null) {
      this.start();
    }
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
    orientation: function() {
      if (window.innerWidth > window.innerHeight) {
        return 'landscape';
      } else {
        return 'portrait';
      }
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
    var k, v, _data, _ref, _ref1, _results;
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
        }
      }
      _ref1 = app.conditions.list;
      _results = [];
      for (k in _ref1) {
        v = _ref1[k];
        if ((v['size'] != null) || (v['orientation'] != null)) {
          if (app.conditions.test(k)) {
            _data['breakpoint'] = {
              key: k,
              values: v
            };
            if (this.latestKey !== k) {
              this.latestKey = k;
              this.trigger(Resizer.BREAKPOINT_CHANGE, _data);
            }
            break;
          } else {
            _results.push(void 0);
          }
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
var TemplateHomeView;
TemplateHomeView = (function(_super) {
  __extends(TemplateHomeView, _super);
  function TemplateHomeView() {
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
    return TemplateHomeView.__super__.constructor.apply(this, arguments);
  }
  TemplateHomeView.prototype.createStart = function(evt) {
    if (evt == null) {
      evt = null;
    }
    this.wrapperTest = new BaseDOM('div');
    this.appendChild(this.wrapperTest);
    this.wrapperTest.className = 'wrapperTest';
    this.wrapperTest.id = 'wrapperTest';
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
    return TweenMax.to(this.background.element, .3, {
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
    return TweenMax.to(this.background.element, .3, {
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
var TemplateSubView;
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
    this.createStart = __bind(this.createStart, this);
    TemplateSubView.__super__.constructor.call(this, p_data, 'sub-views');
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
    return TweenMax.to(this.background.element, .3, {
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
    return TweenMax.to(this.background.element, .3, {
      opacity: 0,
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
var Main;
Main = (function(_super) {
  var re, _controller;
  __extends(Main, _super);
  function Main() {
    this.create = __bind(this.create, this);
    return Main.__super__.constructor.apply(this, arguments);
  }
  _controller = new DefaultNavigationController();
  re = Resizer.getInstance();
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
    re.on(Resizer.BREAKPOINT_CHANGE, this.change);
    return Main.__super__.create.apply(this, arguments);
  };
  Main.prototype.change = function(evt) {
    return console.log(evt);
  };
  Main.prototype.click = function(evt) {
    var route;
    if (evt.srcElement.id === "sub2") {
      route = "/sub-view-02/test-dynamic-route";
    } else {
      route = app.config.views[evt.srcElement.id].route;
    }
    return app.navigation.gotoView(route);
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