<script setup lang="ts">
// #region Props
interface Props {
	/**
	 * Class used to display the icon with `FontAwesomeIcon`.
	 */
	icon: string[];

	/** 
	 * Link used to redirect the social network.
	 */
	link: string;
}

const props = defineProps<Props>();
// #endregion
</script>

<template>
  <div class="icon-social">
    <a :href="props.link" target="_blank">
      <font-awesome-icon :icon="props.icon" />
    </a>
  </div>
</template>

<style scoped lang="scss">
.icon-social {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.1vh;
  background-color: var(--color-background-button);
  border: 1px solid var(--color-border-button);
  border-radius: 50%;
  min-width: 32px;
  min-height: 32px;
  transition: 0.2s ease-in all;

  &:hover {
    background-color: var(--color-background-button-hovered);
    border: 1px solid var(--color-border-button-hovered);
  }
}
</style>
