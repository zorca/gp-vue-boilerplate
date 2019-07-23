<template>
  <atom-label
    :text="label"
    :message="message"
  >
    <template #input>
      <atom-input
        type="checkbox"
        :model="model"
        :required="required"
        :validate="validate"
      />
      <slot name="gui">
        <span class="toggle">
          <span class="wrapper">
            <span class="handle" />
          </span>
        </span>
      </slot>
    </template>
  </atom-label>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';
import AtomInput from '@/components/atoms/Input';

export default {
  components: {
    AtomLabel,
    AtomInput
  },

  props: {
    label: {
      type: String,
      default () {
        return 'Toggle';
      }
    },
    model: {
      type: Object,
      default () {
        return {};
      }
    },
    required: {
      type: Boolean,
      default () {
        return false;
      }
    }
  },

  data () {
    return {
      message: ''
    };
  },

  methods: {
    validate (e) {
      if (e.target.validity.valueMissing) {
        this.message = 'value missing';
        return false;
      }
      this.message = '';
      return true;
    }
  }
};
</script>

<style lang="postcss" scoped>
input {
  display: none;
}

.toggle {
  box-sizing: border-box;
  display: inline-block;
  width: 2em;
  height: 1em;
  border: 1px solid black;
  border-radius: 0.5em;

  & .wrapper {
    display: inline-block;
    width: 100%;
    height: 100%;
    transition-duration: 350ms;
    transition-property: transform;
    transform: translateX(0%);

    & .handle {
      box-sizing: border-box;
      display: inline-block;
      width: 1em;
      height: 1em;
      margin-top: -1px;
      margin-left: -1px;
      background: red;
      border: 1px solid black;
      border-radius: 0.5em;
      transition-duration: 350ms;
      transition-property: transform, background, margin-left;
      transform: translateX(0%);
    }
  }
}

input:checked + .toggle > .wrapper {
  transform: translateX(100%);

  & .handle {
    margin-left: 1px;
    background: green;
    transform: translateX(-100%);
  }
}
</style>
