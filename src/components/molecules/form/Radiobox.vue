<template>
  <ul>
    <li
      v-for="(option, index) in options"
      :key="index"
    >
      <atom-label :text="option.label">
        <template #input>
          <atom-input
            type="radio"
            :model="model"
            :validate="validate"
            v-bind="option"
          />
          <slot name="gui">
            <lazy-hydrate
              ssr-only
              class="unchecked"
            >
              <svg-inline src="form/baseline-radio_button_unchecked-24px.svg" />
            </lazy-hydrate>

            <lazy-hydrate
              ssr-only
              class="checked"
            >
              <svg-inline src="form/baseline-radio_button_checked-24px.svg" />
            </lazy-hydrate>
          </slot>
        </template>
      </atom-label>
    </li>
  </ul>
</template>

<script>
import AtomLabel from '@/components/atoms/Label';
import AtomInput from '@/components/atoms/Input';

export default {
  components: {
    SvgInline: () => import('@/components/atoms/SvgInline'),
    AtomLabel,
    AtomInput
  },

  props: {
    model: {
      type: Object,
      default () {
        return [];
      }
    },
    options: {
      type: Array,
      default () {
        return [];
      }
    }
  },

  methods: {
    validate () {
      return true;
    }
  }
};
</script>

<style lang="postcss" scoped>
input {
  display: none;
}

.unchecked {
  display: inline-block;
}

.checked {
  display: none;
}

input:checked + .unchecked {
  display: none;
}

input:checked + .unchecked + .checked {
  display: inline-block;
}
</style>
