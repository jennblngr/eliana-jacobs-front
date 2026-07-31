<script setup lang="ts">
import { useMainStore } from "@/store";
import { useRouter } from "vue-router";

import { formatDate } from "@/utils/formatDate";
import { slugifyString } from "@/utils/slugify";

import { Size } from "@/common/enums";
import type { Article } from "@/common/types";

// #region Props
interface Props {
	article: Article;
	size: Size;
}

const props = defineProps<Props>();
// #endregion

// #region Composables
const mainStore = useMainStore();
const router = useRouter();
// #endregion

// #region Functions
function goToTheArticlePage(articleTitle: string): void {
	const slugifiedTitle = slugifyString(articleTitle);

	mainStore.setArticle(slugifiedTitle);

	router.push(`/news/${slugifiedTitle}`);
}
// #endregion
</script>

<template>
	<!-- Small size -->
	<div
		v-if="props.size === 'small'"
		class="article-card--small"
	>
		<div
			class="link--image"
			@click="goToTheArticlePage(props.article.attributes.title)"
		>
			<img
				class="image"
				:src="props.article.attributes.image.src.data.attributes.url"
				alt=""
			/>
		</div>
		<div class="content">
			<h4
				class="title title--clamped"
				@click="goToTheArticlePage(props.article.attributes.title)"
			>
				<span>
					{{ props.article.attributes.title }}
				</span>
			</h4>
			<div class="date">
				{{ formatDate(props.article.attributes.date.date) }}
			</div>
		</div>
	</div>

	<!-- Medium size -->
	<div
		v-if="props.size === 'medium'"
		class="article-card--medium"
	>
		<div
			class="link--image"
			@click="goToTheArticlePage(props.article.attributes.title)"
		>
			<img
				class="image"
				:src="props.article.attributes.image.src.data.attributes.url"
				alt=""
			/>
		</div>
		<div class="content">
			<h4
				class="title"
				@click="goToTheArticlePage(props.article.attributes.title)"
			>
				<span>
					{{ props.article.attributes.title }}
				</span>
			</h4>
			<div class="date">
				{{ formatDate(props.article.attributes.date.date) }}
			</div>
		</div>
	</div>

	<!-- Large size -->
	<div
		v-if="props.size === 'large'"
		class="article-card--large"
	>
		<div
			class="link--image"
			@click="goToTheArticlePage(props.article.attributes.title)"
		>
			<img
				class="image"
				:src="props.article.attributes.image.src.data.attributes.url"
				:alt="props.article.attributes.image.src.data.attributes.alternativeText ?? undefined"
			/>
		</div>
		<div class="content">
			<h3
				class="title"
				@click="goToTheArticlePage(props.article.attributes.title)"
			>
				<span>
					{{ props.article.attributes.title }}
				</span>
			</h3>
			<div class="date">
				{{ formatDate(props.article.attributes.date.date) }}
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.link--image {
	cursor: pointer;
	overflow: hidden;
}

.image {
	object-fit: cover;
	transition: scale 0.2s ease-in-out;

	&:hover {
		scale: 1.05;
	}
}

.title span {
	font-family: var(--font-secondary);
	cursor: pointer;
	transition: color 0.2s ease-in-out;

	&:hover {
		color: rgba(255, 255, 255, 0.8);
	}
}

.title--clamped {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

// Article card (small)
.article-card--small {
	display: grid;
	grid-template-columns: repeat(2, 50%);
	grid-template-rows: 1fr;
	overflow: hidden;

	.link--image {
		grid-area: 1 / 1 / 2 / 2;
		height: 100%;
	}

	.image {
		width: 100%;
		height: 100%;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		margin-left: 10px;
	}
}

// Article card (medium)
.article-card--medium {
	margin-bottom: var(--margin-x-elements);
	overflow: hidden;

	.image {
		width: 100%;
		height: 145px;
		max-height: 245px;
	}

	.title {
		margin: 10px 0 5px 0;
	}
}

// Article card (large)
.article-card--large {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 1fr max-content;
	grid-area: 1 / 1 / 4 / 2;
	height: 450px;
	border: 1px solid var(--color-white);
	overflow: hidden;

	.link--image {
		grid-area: 1 / 1 / 3 / 2;
		height: 100%;
	}

	.image {
		height: 100%;
		width: 100%;
	}

	.content {
		margin-top: 5px;
	}
}
</style>
