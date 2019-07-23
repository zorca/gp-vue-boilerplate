const aliases = {

};

export default (() => {
  if (process.client) {
    const Inputmask = require('inputmask/dist/inputmask/inputmask.extensions');
    Inputmask.extendAliases(aliases);
    return Inputmask;
  } else {
    return null;
  }
})();

