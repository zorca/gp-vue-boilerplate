<template>
  <molecule-form :data="form">
    <molecule-form-checkbox v-bind="form.checkbox" />
    <molecule-form-toggle v-bind="form.toggle" />
    <molecule-form-radiobox v-bind="form.radiobox" />
    <molecule-form-selectbox v-bind="form.selectbox" />
    <molecule-form-numeric v-bind="form.numericA" />
    <molecule-form-numeric v-bind="form.numericB" />
    <molecule-form-text v-bind="form.text">
      <template v-slot:label="{label}">
        <h1>{{ label }}</h1>
      </template>
    </molecule-form-text>
    <molecule-form-color-picker />
    <molecule-form-radial-slider v-bind="form.radialSlider" />
  </molecule-form>
</template>

<script>
import MoleculeForm from '@/components/molecules/Form';
import MoleculeFormCheckbox from '@/components/molecules/form/Checkbox';
import MoleculeFormColorPicker from '@/components/molecules/form/ColorPicker';
import MoleculeFormToggle from '@/components/molecules/form/Toggle';
import MoleculeFormRadiobox from '@/components/molecules/form/Radiobox';
import MoleculeFormSelectbox from '@/components/molecules/form/Selectbox';
import MoleculeFormNumeric from '@/components/molecules/form/Numeric';
import MoleculeFormRadialSlider from '@/components/molecules/form/RadialSlider';
import MoleculeFormText from '@/components/molecules/form/Text';

export default {
  components: {
    MoleculeForm,
    MoleculeFormCheckbox,
    MoleculeFormColorPicker,
    MoleculeFormToggle,
    MoleculeFormRadiobox,
    MoleculeFormSelectbox,
    MoleculeFormNumeric,
    MoleculeFormRadialSlider,
    MoleculeFormText
  },

  data () {
    return {
      form: {
        checkbox: {
          label: 'CHECKBOX A',
          required: true,
          model: {
            name: 'checkbox',
            value: true
          }
        },
        toggle: {
          label: 'TOGGLE A',
          required: true,
          model: {
            name: 'toggle',
            value: false
          }
        },
        radiobox: {
          label: 'RADIOBOX',
          options: [
            { value: 'A', label: 'RADIO OPTION A' },
            { value: 'B', label: 'RADIO OPTION B' },
            { value: 'C', label: 'RADIO OPTION C' }
          ],
          model: {
            name: 'radiobox',
            value: 'B'
          }
        },
        selectbox: {
          label: 'SELECTBOX',
          options: [
            { value: 'A', label: 'SELECT OPTION A' },
            { value: 'B', label: 'SELECT OPTION B' },
            { value: 'C', label: 'SELECT OPTION C' }
          ],
          model: {
            name: 'selectbox',
            value: 'C'
          }
        },
        numericA: {
          label: 'NUMERIC A',
          mask: { alias: 'meter', clearMaskOnLostFocus: false, positionCaretOnClick: 'select' },
          model: {

            value: 200
          }
        },
        numericB: {
          label: 'NUMERIC B',
          mask: { alias: 'meter', clearMaskOnLostFocus: false },
          model: {
            name: 'number',
            value: 200
          }
        },
        text: {
          label: 'TEXT',
          mask: { alias: 'email' },
          model: {
            name: 'text',
            value: ''
          }
        },
        radialSlider: {
          label: 'RADIAL SLIDER',
          mask: { alias: 'meter', clearMaskOnLostFocus: false, min: 0, max: 100 },
          model: {
            name: 'number',
            value: 0
          }
        },
      }
    };
  }
};
</script>

<style lang="postcss">
</style>
