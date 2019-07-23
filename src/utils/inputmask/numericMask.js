const aliases = (Inputmask) => {
  return {
    meter: {
      alias: 'numeric',
      radixPoint: ',',
      groupSeparator: '.',
      autoGroup: true,
      digits: 2,
      digitsOptional: false,
      placeholder: '0',
      autoUnmask: true,
      suffix: ' m',
      onUnMask: function (maskedValue, unmaskedValue, opts) {
        if (unmaskedValue === '' && opts.nullable === true) {
          return unmaskedValue;
        }
        let processValue = maskedValue.replace(opts.prefix, '');
        processValue = processValue.replace(opts.suffix, '');

        let regex = new RegExp(Inputmask.escapeRegex(opts.groupSeparator), 'g');
        processValue = processValue.replace(regex, '');
        if (opts.radixPoint !== '' && processValue.indexOf(opts.radixPoint) !== -1)
          processValue = processValue.replace(Inputmask.escapeRegex.call(this, opts.radixPoint), '.');

        return parseFloat(processValue);
      }
    }
  };
};

export default (() => {
  if (process.client) {
    const Inputmask = require('inputmask/dist/inputmask/inputmask.numeric.extensions');
    Inputmask.extendAliases(aliases(Inputmask));
    return Inputmask;
  } else {
    return null;
  }
})();

