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
        <lazy-hydrate
          class="unchecked"
          ssr-only
        >
          <svg-inline src="form/baseline-check_box_outline_blank-24px.svg" />
        </lazy-hydrate>

        <lazy-hydrate
          class="checked"
          ssr-only
        >
          <svg-inline src="form/baseline-check_box-24px.svg" />
        </lazy-hydrate>
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
    AtomInput,
    SvgInline: () => import('@/components/atoms/SvgInline')
  },

  props: {
    label: {
      type: String,
      default () {
        return 'Checkbox';
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
