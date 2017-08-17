import {Utils} from '../../utils';

export default function materialUiStyle(opts) {
  var isSafari = /Safari/.test(window.navigator.userAgent) && /Apple Computer/.test(window.navigator.vendor);
  var colors = {
    activeButtonBackgroundColor: '#00bcd4',
    activeButtonColor: '#f72121',
    activeTabBackgroundColor: '#00bcd4',
    activeTabColor: '#ffffff',
    activeTabTextShadow: 'initial',
    activeTabUnderlineColor: '#ff5722',
    buttonBackgroundColor: '#00bcd4',
    buttonColor: '#eaeaea',
    buttonTextShadow: 'initial',
    contentBackgroundColor: '#ffffff',
    footerBackgroundColor: '#ffffff',
    hoverButtonBackgroundColor: '#00bcd4',
    hoverButtonColor: '#ffffff',
    hoverTabBackgroundColor: '#00bcd4',
    panelBackgroundColor: '#00bcd4',
    iconColor: '#ffffff',
    iconTextShadow: 'initial',
    tabBackgroundColor: '#00bcd4',
    tabColor: '#ffffff',
    tabIconColor: '#616161',
    tabTextShadow: 'initial',
    tabUnderlineColor: '#00bcd4',
    titleColor: '#ffffff',
    titleTextShadow: 'initial',
    toolbarBackgroundColor: '#00bcd4',
  };

  return {
    PanelWrapper: {
      config: {
        autocompact: false
      }
    },
    Panel: {
      style: {
        backgroundColor: colors.panelBackgroundColor,
        border: '4px solid ' + colors.panelBackgroundColor,
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 14px 45px, rgba(0, 0, 0, 0.2) 0px 10px 18px',
        position: 'relative',
        boxSizing: 'border-box'
      },
      header: {
        style: {
          backgroundColor: colors.panelBackgroundColor,
          display: isSafari ? '-webkit-flex' : 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
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
          float: 'none',
          WebkitFlex: '1',
          flex: 1,
          display: isSafari ? '-webkit-flex' : 'flex',
          overflow: 'hidden',
          minWidth: 'initial'
        }
      },
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: '2px 2px 2px ' + colors.iconTextShadow,
          float: 'left'
        }
      },
      box: {
        style: {
          float: 'left'
        }
      },
      title: {
        style: {
          color: colors.titleColor,
          textShadow: '1px 1px 1px ' + colors.titleTextShadow
        }
      },
      group: {
        style: {
          padding: 0,
          margin: 0,
          display: isSafari ? '-webkit-flex' : 'flex',
          flexDirection: 'flex-end',
          overflow: 'visible',
          height: '100%',
          zIndex: 1000,
        }
      },
      body: {
        style: {
          marginLeft: 0,
          height: '100%',
        }
      }
    },
    TabButton: {
      style: {
        backgroundColor: colors.tabBackgroundColor,
        borderColor: colors.tabUnderlineColor,
        borderStyle: 'solid',
        borderWidth: '0 0 2px 0',
        flex: '1 0 0',
        flexShrink: 0,
        float: 'none',
        height: 'auto',
        margin: 0,
        overflow: 'hidden',
        position: 'inherit',
        textTransform: 'uppercase',
        WebkitFlex: 1,
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
            borderColor: colors.activeTabUnderlineColor,
            backgroundColor: colors.activeTabBackgroundColor
          },
          state: {
            hover: {
              style: {
                backgroundColor: colors.activeTabBackgroundColor
              },
              icon: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: '1px 1px 1px ' + colors.tabTextShadow
                }
              },
              title: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: '1px 1px 1px ' + colors.activeTabTextShadow,
                }
              }
            }
          },
          icon: {
            style: {
              color: colors.activeTabColor,
              textShadow: '1px 1px 1px ' + colors.tabTextShadow
            }
          },
          title: {
            style: {
              color: colors.activeTabColor,
              textShadow: '1px 1px 1px ' + colors.activeTabTextShadow
            }
          }
        }
      },
      icon: {
        style: {
          color: colors.tabIconColor,
          textShadow: '1px 1px 1px ' + colors.tabTextShadow
        }
      },
      title: {
        style: {
          textTransform: 'uppercase',
          color: colors.tabColor,
          textShadow: '1px 1px 1px ' + colors.tabTextShadow
        }
      },

      box: {
        style: {}
      }
    },
    Tab: {
      toolbar: {
        style: {
          minHeight: 0,
          lineHeight: 'inherit',
          padding: '0',
          display: 'block',
          position: 'relative',
          top: '-1px'
        },

        children: {
          style: {
            padding: '10px',
            position: 'relative',
            marginTop: '1px',
            backgroundColor: colors.toolbarBackgroundColor
          }
        }
      },

      content: {
        style: {
          backgroundColor: colors.contentBackgroundColor,
          paddingTop: opts.headerHeight,
          height: '100%',
          boxSizing: 'border-box',
        },

        children: {
          style: {
            width: '100%',
            height: '100%',
          }
        }
      },

      footer: {
        style: {
          minHeight: 'initial',
          lineHeight: 'initial',
          backgroundColor: colors.footerBackgroundColor,
          padding: '0 15px',
          height: '50px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginTop: '-50px',
          borderTop: '1px solid ' + colors.panelBackgroundColor,
          position: 'relative',
        },

        footerHeight: Utils.pixelsOf(opts.headerHeight)
      },
      Button: {
        style: {
          backgroundColor: colors.buttonBackgroundColor,
          marginLeft: '1px',
          float: 'none',
          flexShrink: 0,
        },

        children: {
          style: {
            color: colors.buttonColor,
            textShadow: '1px 1px 1px ' + colors.buttonTextShadow
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
          }
        }
      }
    }
  };
};
