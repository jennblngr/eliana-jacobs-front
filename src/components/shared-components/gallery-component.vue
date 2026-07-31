<script setup lang="ts">
import { useMainStore } from "@/store";

import { IMAGE_MIMES } from "@/common/constants";
import type { Media } from "@/common/types";

// #region Props
interface Props {
	images: Media[];
	onClick: ({ index }: { index: number }) => void;
}

const props = defineProps<Props>();
// #endregion

// #region Dependencies
const mainStore = useMainStore();
// #endregion
</script>

<template>
	<div class="gallery">
		<div
			v-for="(image, index) of props.images"
			:key="image.id"
			class="gallery__image"
		>
			<img
				v-if="IMAGE_MIMES.test(image.src.data.attributes.mime)"
				:src="image.src.data.attributes.formats?.thumbnail ? image.src.data.attributes.formats.thumbnail.url : image.src.data.attributes.url"
				:alt="image.src.data.attributes.alternativeText ?? undefined"
				@click.stop="() => props.onClick({ index })"
			/>

			<!-- Audio file -->
			<div
				v-else
				class="gallery__audio"
				@click.stop="() => props.onClick({ index })"
			>
				<font-awesome-icon
					:class="mainStore.app.colorTheme === 'dark' ? 'gallery__audio-icon' : 'gallery__audio-icon gallery__audio-icon--light'"
					class="gallery__audio-icon"
					:icon="['fas', 'volume-high']"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.gallery {
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	overflow-y: visible;
	div {
		cursor: pointer;
		flex: auto;
		height: 100px;
		min-width: 50px;
		margin: 0 8px 8px 0;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			transform: scale(1);
			transition: all 0.3s ease-in-out;
		}
	}
	&__audio {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-main);
		&-icon {
			font-size: 30px;
			margin-bottom: 5px;
			margin-right: 10px;
			color: var(--color-white);
		}
	}
}
</style>
