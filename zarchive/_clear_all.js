function _clear_all(){
  $p.iface.docs.__define({
    clear_all: {
      value: function () {
        this.detachToolbar();
        this.detachStatusBar();
        this.detachObject(true);
      },
      enumerable: false
    },
    "Очистить": {
      get: function () {
        return this.clear_all;
      },
      enumerable: false
    },
    "Контейнер": {
      get: function () {
        return this.cell.querySelector(".dhx_cell_cont_layout");
      },
      enumerable: false
    }
  });
}
