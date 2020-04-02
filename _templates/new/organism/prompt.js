const _ = require('lodash');

module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate (value) {
      if (!value.length) {
        return 'Organisms must have a name.';
      }
      const fileName = _.kebabCase(value);
      if (!fileName.includes('-')) {
        return 'Organisms names should contain at least two words to avoid conflicts with existing and future HTML elements.';
      }
      return true;
    }
  },
  {
    type: 'multiselect',
    name: 'blocks',
    message: 'Blocks:',
    initial: [
      'script', 'template', 'style'
    ],
    choices: [
      {
        name: 'script',
        message: '<script>'
      },
      {
        name: 'template',
        message: '<template>'
      },
      {
        name: 'style',
        message: '<style>'
      }
    ],
    validate (value) {
      if (!value.includes('script') && !value.includes('template')) {
        return 'Organisms require at least a <script> or <template> tag.';
      }
      return true;
    }
  }
];
