import {Utils} from '../utils'
import chemicalStyle from './themes/chemical';
import materialUiStyle from './themes/material-ui';

function buildStyle (opts) {
  opts = opts || {};
  opts = {
    theme: opts.theme || "base",
    skin: opts.skin || "default",
    headerHeight: opts.headerHeight || 50,
    headerFontSize: opts.headerFontSize || 14,
    borderRadius: opts.borderRadius || 3,
    maxTitleWidth: opts.maxTitleWidth || 130,
    useAvailableHeight: opts.useAvailableHeight || false,
    renderPanelBorder: (typeof opts.renderPanelBorder === "boolean") ? opts.renderPanelBorder : true,
    activeTabHeaderBorder: (typeof opts.activeTabHeaderBorder === "boolean") ? opts.activeTabHeaderBorder : true
  };
  var isSafari = /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor);

  var styles = {
    base: {
      PanelWrapper: {
        style: {
        },
        config: {
          autocompact: true
        }
      },
      Panel: {
        style: {
          height: (opts.useAvailableHeight) ? "100%" : "inherit"
        },
        header: {
          style: {
            display: "block",
            fontSize: Utils.pixelsOf(opts.headerFontSize),
            height: opts.headerHeight
          }
        },
        tabsStart: {
          style: {
            width: 20,
            height: "100%"
          }
        },
        tabsEnd: {
          style: {
            width: 20,
            height: "100%"
          }
        },
        tabs: {
          style: {
            height: opts.headerHeight,
            float: "right",
            display: "inline-block",
            margin: 0,
            minWidth: Utils.pixelsOf(opts.headerHeight),
            padding: 0
          }
        },
        icon: {
          style: {
            display: "block",
            float: "left",
            fontSize: "125%",
            height: opts.headerHeight,
            lineHeight: Utils.pixelsOf(opts.headerHeight - 4),
            marginRight: -6,
            textAlign: "center",
            width: opts.headerHeight - 2
          }
        },
        box: {
          style: {
            marginLeft: 10,
            height: "100%",
            display: "inline-block",
            position: "relative",
            maxWidth: Utils.pixelsOf(opts.maxTitleWidth)
          }
        },
        title: {
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0,
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            width: "auto"
          }
        },
        group: {
          style: {
            padding: "0 5px",
            backgroundColor: "transparent"
          }
        },
        body: {
          style: {
            height: (opts.useAvailableHeight) ? "calc(100% - " + opts.headerHeight + "px)" : "inherit"
          }
        }
      },
      TabButton: {
        style: {
          position: "relative",
          float: "left",
          display: "block",
          listStyle: "none",
          padding: "0 4px",
          fontSize: "0.95em",
          cursor: "pointer",
          textAlign: "center"
        },
        mods: {
          untitled: {
            box: {
              style: {
                marginLeft: 0
              }
            }
          },
          active: {
            style: {
              cursor: "default"
            }
          }
        },
        icon: {
          style: {
            display: "block",
            float: "left",
            fontSize: "125%",
            height: opts.headerHeight,
            textAlign: "center",
            width: opts.headerHeight - 2,
            lineHeight: Utils.pixelsOf(opts.headerHeight - 2),
            marginRight: -9,
            marginLeft: -3,
            opacity: 0.85
          }
        },
        box: {
          style: {
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            opacity: 0.85,
            height: "100%",
            display: "inline-block",
            position: "relative",
            maxWidth: Utils.pixelsOf(opts.maxTitleWidth)
          }
        },
        title: {
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: 0,
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            width: "auto"
          }
        }
      },
      Tab: {
        style: {
          display: "none"
        },
        mods: {
          active: {
            style: {
              display: (opts.useAvailableHeight) ? (isSafari ? "-webkit-flex" : "flex") : "block",
              minHeight: (opts.useAvailableHeight) ? "100%" : "inherit",
              WebkitFlexDirection: (opts.useAvailableHeight) ? "column" : "inherit",
              flexDirection: (opts.useAvailableHeight) ? "column" : "inherit",
              height: "100%"
            },
            content: {
              style: (opts.useAvailableHeight) ? {
                WebkitFlex: 1,
                flex: 1,
                position: "relative"
              } : {},
              children: {
                style: (opts.useAvailableHeight) ? {
                  padding: "10px",
                  position: "absolute",
                  height: "100%",
                  width: "100%"
                } : { }
              }
            }
          },
          withToolbar: {
            toolbar: {
              style: { }
            }
          }
        },
        toolbar: {
          style: {
            minHeight: Utils.pixelsOf(opts.headerHeight),
            lineHeight: Utils.pixelsOf(opts.headerHeight)
          },
          children: {
            style: {
              padding: 0
            }
          }
        },
        content: {
          style: { },
          children: {
            style: {
              padding: 0
            }
          }
        },
        footer: {
          style: {
            minHeight: Utils.pixelsOf(opts.headerHeight),
            lineHeight: Utils.pixelsOf(opts.headerHeight),
          },
          children: {
            style: {}
          }
        }
      },
      Button: {
        style: {
          float: "right",
          height: Utils.pixelsOf(opts.headerHeight),
          minWidth: Utils.pixelsOf(opts.headerHeight),
          display: "inline-block",
          lineHeight: Utils.pixelsOf(opts.headerHeight),
          margin: 0,
          padding: 0,
          textAlign: "center",
          cursor: "pointer",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          userSelect: "none"
        },
        mods: {
          disabled: {
            style: {
              cursor: "default",
              pointerEvents: "none",
              opacity: 0.5
            }
          },
          hidden: {
            style: {
              display: "none"
            }
          },
          highlighted: {
            style: {}
          }
        },
        children: {
          style: {}
        }
      }
    },
    /* THEME: Chemical */
    chemical: chemicalStyle,
    "material-ui": materialUiStyle,
  };

  var theme = (opts.theme != "base") ? styles[opts.theme](opts) : {};

  return Utils.merge(styles.base, theme);
};

export default function createSheet(opts) {
  var _sheet = buildStyle(opts),
    _skin = {};

  return function (target, mods, alter) {
    var using = _sheet;

    mods = mods || [];
    alter = alter || {}
    if (alter.skin || false) {
      if (!(_skin[alter.skin] || false)) {
        _skin[alter.skin] = buildStyle(Object.assign({}, opts, {skin: alter.skin}));
      }
      using = _skin[alter.skin];
    }
    if (!mods.length) return using[target];
    var sheet = Object.assign({}, using[target]),
      i;
    for (i = 0; i < mods.length; ++i) {
      if ((sheet.mods || false) && (sheet.mods[mods[i]] || false)) {
        sheet = Utils.merge(sheet, sheet.mods[mods[i]]);
      }
    }
    return sheet;
  }
};

