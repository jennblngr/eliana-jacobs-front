<script setup lang="ts">
import { computed } from "vue";

// #region Props
interface Props {
	src: string;
	isPreviewing: boolean;
}

const props = defineProps<Props>();
// #endregion

// #region Emits
interface Emits {
	(e: "update:is-previewing", newIsPreviewing: boolean): void;
}

const emit = defineEmits<Emits>();
// #endregion

// #region Computed
const isPreviewingModel = computed<boolean>({
	get() {
		return props.isPreviewing;
	},
	set(newIsPreviewing) {
		emit("update:is-previewing", newIsPreviewing)
	}
})
// #endregion

// #region Functions
function undisplayedImageOnPreview() {
	isPreviewingModel.value = false;
};
// #endregion
</script>

<template>
  <div v-if="props.isPreviewing" class="preview" @click="undisplayedImageOnPreview">
    <img class="preview__image" :src="props.src" alt="Preview of the selected image.">
  </div>
</template>

<style scoped lang="scss">
.preview {
	cursor: pointer;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(17, 15, 16, 0.8);

	&__image {
		max-width: 80%;
		max-height: 80%;
		padding: 5px;
		border: 1px solid var(--color-white);
	}
}
</style>
