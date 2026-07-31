<script setup lang="ts">
// #region Props
interface Props {
	src: string;
	id: string;
}

const props = defineProps<Props>();
// #endregion
</script>

<template>
  <div class="player">
    <audio :id="props.id" class="player__src" :src="props.src" controls />
  </div>
</template>

<style scoped lang="scss">
.player {
	&__src {
		width: 100%;
	}
}
</style>
