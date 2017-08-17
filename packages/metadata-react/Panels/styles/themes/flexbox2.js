import {Utils} from '../../utils';

var flexbox2Skin = function (skin) {
  switch (skin || "") {
    default:
      return {
        tabColor: "#b0b0b0",
        tabIconColor: "#b0b0b0",
        activeTabColor: "#daaf64",
        tabTextShadow: "#000000",
        activeTabTextShadow: "#000000",
        titleTextShadow: "#a6a6a6",
        iconTextShadow: "#000000",
        iconColor: "#daaf64",
        titleColor: "#daaf64",
        buttonBackgroundColor: "rgba(104, 226, 207, 0.15)",
        hoverButtonBackgroundColor: "rgba(104, 226, 207, 0.3)",
        activeButtonBackgroundColor: "rgba(131, 247, 220, 0.33)",
        buttonColor: "#eaeaea",
        hoverButtonColor: "#ffffff",
        activeButtonColor: "#daaf64",
        buttonTextShadow: "#7F7F7F",
        highlightedButtonBoxShadow: "rgba(255, 255, 255, 0.6)",
        tabBackgroundColor: "rgba(104, 226, 207, 0.15)",
        activeTabBackgroundColor: "rgba(131, 247, 220, 0.33)",
        hoverTabBackgroundColor: "rgba(104, 226, 207, 0.3)",
        toolbarBackgroundColor: "rgba(171, 255, 220, 0.2)",
        contentBackgroundColor: "rgba(171, 255, 220, 0.34)",
        footerBackgroundColor: "rgba(171, 255, 220, 0.2)",
        borderColor: "#000000"
      };
  }
}

var flexbox2Style = function (_opts, skin) {
  var colors,
    opts = update({
      skin: "default",
      renderPanelBorder: true,
      activeTabHeaderBorder: true
    }, {$merge: _opts}),
    isSafari = /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor);

  skin = skin || opts.skin;

  if (typeof skin === "object") {
    colors = update(flexbox2Skin(), {$merge: skin});
  } else {
    colors = flexbox2Skin(skin);
  }

  return {
    PanelWrapper: {
      config: {
        autocompact: false
      }
    },
    Panel: {
      style: {
        borderTop: (opts.renderPanelBorder) ? "1px solid " + colors.borderColor : "0 none",
        borderRight: (opts.renderPanelBorder) ? "1px solid " + colors.borderColor : "0 none"
      },
      header: {
        style: {
          backgroundColor: "transparent",
          display: isSafari ? "-webkit-flex" : "flex",
          minWidth: "100%",
          marginBottom: "-2px"
        }
      },
      tabsStart: {
        style: {
          width: 0
        }
      },
      tabsEnd: {
        style: {
          width: 0
        }
      },
      tabs: {
        style: {
          float: "none",
          WebkitFlex: "1",
          flex: 1,
          display: isSafari ? "-webkit-flex" : "flex",
          overflow: "hidden"
        }
      },
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: "2px 2px 2px " + colors.iconTextShadow,
          float: "left"
        }
      },
      box: {
        style: {
          float: "left"
        }
      },
      title: {
        style: {
          color: colors.titleColor,
          textShadow: "1px 1px 1px " + colors.titleTextShadow
        }
      },
      group: {
        style: {
          padding: 0,
          display: "inline-block",
          height: "100%",
          margin: 0
        }
      },
      body: {
        style: {
          borderLeft: (opts.renderPanelBorder) ? "1px solid " + colors.borderColor : "0 none",
          height: "calc(100% - " + Utils.pixelsOf(opts.headerHeight - 2) + ")"
        }
      }
    },
    TabButton: {
      style: {
        borderBottom: "1px solid " +  colors.borderColor,
        borderRight: "1px solid " + colors.borderColor,
        backgroundColor: colors.tabBackgroundColor,
        height: opts.headerHeight - 1,
        margin: "0",
        position: "inherit",
        float: "none",
        overflow: "hidden",
        WebkitFlex: "1",
        flex: "1 0 0px",
        opacity: 1
      },
      state: {
        hover: {
          style: {
            backgroundColor: colors.hoverTabBackgroundColor
          }
        }
      },
      mods: {
        active: {
          style: {
            borderBottom: "1px solid " + (opts.activeTabHeaderBorder ? colors.borderColor : colors.activeTabBackgroundColor),
            backgroundColor: colors.activeTabBackgroundColor
          },
          state: {
            hover: {
              style: {
                borderBottom: "1px solid " + (opts.activeTabHeaderBorder ? colors.borderColor : colors.activeTabBackgroundColor),
                backgroundColor: colors.activeTabBackgroundColor
              },
              icon: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.tabTextShadow
                }
              },
              title: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow
                }
              }
            }
          },
          icon: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.tabTextShadow
            }
          },
          title: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          }
        },
        last: {
          style: {
            borderRight: "0 none"
          }
        }
      },
      icon: {
        style: {
          color: colors.tabIconColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow,
          opacity: 1
        }
      },
      title: {
        style: {
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      },
      box: {
        style: {
          marginRight: 0,
          maxWidth: "calc(100% - " + Utils.pixelsOf(opts.headerHeight) + ")",
          opacity: 1
        }
      }
    },
    Tab: {
      toolbar: {
        style: {
          minHeight: 0,
          lineHeight: "inherit",
          padding: "0",
          display: "block",
          position: "relative",
          marginTop: "1px"
        },
        children: {
          style: {
            padding: "10px",
            lineHeight: Utils.pixelsOf(opts.headerHeight),
            position: "relative",
            backgroundColor: colors.toolbarBackgroundColor
          }
        }
      },
      content: {
        style: {
          backgroundColor: colors.contentBackgroundColor,
          boxShadow: "0px 0px 29px rgba(0, 0, 0, 0.7) inset",
          borderTop: "1px solid " +  colors.borderColor,
          position: "relative"
        },
        children: {
          style: {
            position: "relative"
          }
        }
      },
      footer: {
        style: {
          backgroundColor: colors.footerBackgroundColor,
          borderTop: "1px solid " +  colors.borderColor,
          position: "relative"
        },
        children: {
          style: {
            position: "relative"
          }
        }
      }
    },
    Button: {
      style: {
        height: Utils.pixelsOf(opts.headerHeight - 1),
        backgroundColor: colors.buttonBackgroundColor,
        borderBottom: "1px solid " +  colors.borderColor,
        borderLeft: "1px solid " +  colors.borderColor
      },
      children: {
        style: {
          color: colors.buttonColor,
          textShadow: "1px 1px 1px " + colors.buttonTextShadow
        }
      },
      state: {
        hover: {
          style: {
            backgroundColor: colors.hoverButtonBackgroundColor
          },
          children: {
            style: {
              color: colors.hoverButtonColor
            }
          }
        }
      },
      mods: {
        active: {
          style: {
            backgroundColor: colors.activeButtonBackgroundColor
          },
          children: {
            style: {
              color: colors.activeButtonColor
            }
          }
        },
        highlighted: {
          style: {
            boxShadow: "0 0 9px " + colors.highlightedButtonBoxShadow + " inset"
          }
        },
        disabled: {
          style: {
            pointerEvents: "none",
            opacity: 0.5
          }
        }
      }
    }
  };
};
