export default {
  get face() {
    return require('./withIface');
  },
  get meta() {
    return require('./withMeta');
  },
  get navigateAndMeta() {
    return require('./withNavigateAndMeta');
  },
  get obj() {
    return require('./withObj');
  },
  get prm() {
    return require('./withPrm');
  }
};
