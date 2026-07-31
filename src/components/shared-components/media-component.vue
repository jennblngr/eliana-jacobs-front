<script setup lang="ts">
import { computed, ref } from "vue";

import PreviewComponent from "@/components/preview-component.vue";
import AudioPlayerComponent from "@/components/project-components/audio-player-component.vue";

import { IMAGE_MIMES } from "@/common/constants";
import type { Media } from "@/common/types";

// #region Props
interface Props {
	media: Media;

	/**
	 * Can be opened in a preview window.
	 */
	hasPreview?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	hasPreview: false,
});
// #endregion

// #region Constants
const YOUTUBE_LINK: Readonly<string> = "https://www.youtube.com/embed/";
const AUDIO_MIMES: Readonly<RegExp> = /audio\/mp3|audio\/wav|audio\/ogg/;
// #endregion

// #region Data
const isPreviewing = ref<boolean>(false);
// #endregion

// #region Computed
const mediaIsImage = computed<boolean>(() => IMAGE_MIMES.test(props.media.src.data.attributes.mime));
const mediaIsAudio = computed<boolean>(() => AUDIO_MIMES.test(props.media.src.data.attributes.mime));
const mediaIsVideo = computed<boolean>(() => Boolean(props.media.link));

const mediaSrc = computed<string>(() => (mediaIsImage.value ? props.media.src.data.attributes.url : ""));
const imageAlt = computed<string | null>(() => (mediaIsImage.value ? props.media.src.data.attributes.alternativeText : ""));
const mediaLink = computed<string | null>(() => props.media.link);

const youTubeVideoLink = computed<string>(() => {
	if (!props.media.link) {
		return "";
	}

	return YOUTUBE_LINK + props.media.link.split("=")[1];
});

// #region Functions
function displayImageOnPreview() {
	isPreviewing.value = true;
}
// #endregion
</script>

<template>
	<div class="media">
		<!-- IMAGE MEDIA -->
		<div
			v-if="!props.media.link && mediaIsImage"
			class="image"
		>
			<img
				class="image__src"
				:src="mediaSrc"
				:alt="imageAlt ?? undefined"
				@click="displayImageOnPreview"
			/>

			<div
				v-if="props.media.copyright"
				class="image__copyright"
			>
				{{ props.media.copyright }}
			</div>

			<div
				v-if="props.hasPreview"
				class="image__preview"
			>
				<font-awesome-icon
					class="image__icon"
					:icon="['fas', 'expand']"
				/>
			</div>

			<preview-component
				v-if="props.hasPreview"
				v-model:is-previewing="isPreviewing"
				:src="mediaSrc"
			/>
		</div>

		<!-- VIDEO MEDIA -->
		<div
			v-else-if="mediaIsVideo"
			class="video"
		>
			<iframe
				v-if="mediaLink"
				class="video__src"
				width="560"
				height="315"
				:src="youTubeVideoLink"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			/>
		</div>

		<!-- AUDIO MEDIA -->
		<div
			v-else-if="mediaIsAudio"
			class="video"
		>
			<audio-player-component
				:src="mediaSrc"
				:id="props.media.id"
			/>
		</div>

		<div v-else>No corresponding media.</div>
	</div>
</template>

<style scoped lang="scss">
.media {
	position: relative;
	width: 100%;
	height: 100%;
}

// Media image
.image {
	position: relative;
	width: 100%;
	height: 100%;

	&__src {
		width: 100%;
	}

	&__copyright,
	&__preview {
		min-height: 30px;
		position: absolute;
		bottom: 0;
		background-color: var(--color-main);
		color: var(--color-white);
	}

	&__copyright {
		display: none;
		align-items: center;
		left: 0;
		padding: 5px 8px;
		max-width: calc(100% - 40px);
	}

	&__preview {
		cursor: pointer;
		width: 30px;
		right: 0;

		svg {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	&:hover {
		.image__copyright {
			display: flex;
		}
	}
}

.video {
	&__src {
		width: 100%;
	}
}
</style>
