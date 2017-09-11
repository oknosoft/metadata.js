
export const Utils = {
  pixelsOf: function (value) {
    var val = parseInt(value) || 0
    return (val) ? String(val) + "px" : "0";
  },
  /* Copyright (c) 2012 Nicholas Fisher (MIT License) https://github.com/KyleAMathews/deepmerge */
  merge: function (target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function(e, i) {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = Utils.merge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      if (target && typeof target === 'object') {
        Object.keys(target).forEach(function (key) {
          dst[key] = target[key];
        })
      }
      Object.keys(src).forEach(function (key) {
        if (typeof src[key] !== 'object' || !src[key]) {
          dst[key] = src[key];
        }
        else {
          if (!target[key]) {
            dst[key] = src[key];
          } else {
            dst[key] = Utils.merge(target[key], src[key]);
          }
        }
      });
    }

    return dst;
  }
};


export function DragAndDropHandler (opts, callback) {
  var self = this;
  if (!(self instanceof DragAndDropHandler)) return new DragAndDropHandler(opts, callback);

  /** Not yet implemented. */
  this.opt = Utils.merge({
    detachOnLeave: true,
    /** If true, the tab button being dragged will be rendered by
     *  cloning an existing tab of the target panel. */
    cloakInGroup: false,
    onDragStart: false,
    onDragEnd: false
  }, opts || {});

  this.ctx = {
    sortable: true,
    dragging: false,
    parentId: false
  };

  this._member = [];
  this._callback = callback || function () {};
};

DragAndDropHandler.prototype.trigger = function (event, data) {
  switch (event) {
    case 'onDragEnd':
      return this._callback(data);
    default:
      throw new Error("Not implemented");
  }
};

DragAndDropHandler.prototype.addMember = function (component) {
  return this._member.push(component) - 1;
};

DragAndDropHandler.prototype.setParentOfToken = function (memberId) {
  if (this.ctx.parentId !== false) {
    this._member[this.ctx.parentId].releaseToken();
  }

  this.ctx.parentId = memberId;
};
