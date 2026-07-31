<script setup lang="ts">
// #region Props
interface Props {
	/**
	 * Text inside the button.
	 */
	text: string;

	/**
	 * Link used when the user clicks on the button.
	 */
	link?: string;

	/**
	 * Specify if <router-link> or <a> tag is needed.
	 */
	external?: boolean;

	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	link: "",
	external: false,
	class: undefined,
});
// #endregion
</script>

<template>
  <!-- External link -->
	<button v-if="props.link && props.external" :class="props.class" class="button">
		<a :href="props.link" class="button__content" target="_blank">
      {{ props.text }}
		</a>
	</button>

  <!-- Internal link -->
	<button v-if="props.link && !props.external" class="button" :class="props.class">
		<router-link :to="props.link" class="button__content">
      {{ props.text }}
		</router-link>
	</button>

  <!-- Form button -->
  <button v-if="!props.link" class="button button--submit" :class="props.class" type="submit">
    <span class="button__content">
      {{ props.text }}
    </span>
  </button>
</template>

<style scoped lang="scss">
.button {
  display: table-cell;
  vertical-align: middle;
  height: 32px;
  padding: 0.1vh 1vw 0 1vw;
  font-family: var(--font-primary);
  text-transform: uppercase;
  white-space: nowrap;
  background-color: var(--color-background-button);
  border: 1px solid var(--color-border-button);
  transition: 0.2s ease-in all;

  &:hover {
    background-color: var(--color-background-button-hovered);
    border: 1px solid var(--color-border-button-hovered);
  }

  &__content {
    line-height: 32px;
  }
}
</style>
