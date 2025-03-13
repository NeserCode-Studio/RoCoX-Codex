<script lang="ts" setup>
import GoBack from '../components/native/GoBack.vue';
// import { CubeTransparentIcon } from "@heroicons/vue/20/solid"

import { Ref, computed, ref, watch } from 'vue';
import { computedAsync, useStorage } from '@vueuse/core';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import { WindowCreator } from '../composables/useWindow';

const $route = useRoute();
const { getSkill, damageTypeStaticMap, featureStaticURL, iconStaticURL } =
  useApi();

const routeHash = $route.params.hash as string;
const skillData = computedAsync(async () => {
  return await getSkill({ hash: routeHash });
});

function getPropertyIconSrc(propertyIndex: string) {
  return `${featureStaticURL}${propertyIndex}.png`;
}
function getAngelIconSrc(iconSrc: string) {
  return `${iconStaticURL}${iconSrc}`;
}

const skillFix = computed(() => {
  const answer = skillData.value.data.analysis;
  if (answer !== undefined) return `${answer.analysis}`;
  else return '暂无解析';
});

const isLoadingData = ref(true);
watch(skillData, (_val) => {
  isLoadingData.value = false;
  // console.log(_val)
});

const $router = useRouter();
const alwaysTargetNewWindow = useStorage('rocox-new-window-target', false);
const angelPageTitle = useStorage('rocox-angel-page-title', '');
const AngelWindow: Ref<WindowCreator | null> = ref(null);

function setupWindowParams(id: string, name: string, hash: string) {
  angelPageTitle.value = `#${id} ${name}`;
  AngelWindow.value = new WindowCreator(id, {
    url: `/#/angel/${hash}`,
    title: angelPageTitle.value,
  });

  goAngelView(hash);
}
function goAngelView(hash: string) {
  if (!hash) return false;
  if (alwaysTargetNewWindow.value) AngelWindow.value!.setup();
  else
    $router.push({
      name: 'Angel',
      params: { hash },
    });
}
</script>

<template>
  <div v-if="!isLoadingData">
    <span class="names">
      <GoBack class="go-back" />
      <img
        class="icon property"
        draggable="false"
        :src="getPropertyIconSrc(skillData.data.property!)"
        alt="property icon"
      />
      <img
        v-if="skillData.data.power !== '--'"
        class="icon damage"
        draggable="false"
        :src="damageTypeStaticMap.get(skillData.data.damageType!)"
        :alt="skillData.data.damageType === '1' ? '物理伤害' : '魔法伤害'"
        :title="skillData.data.damageType === '1' ? '物理伤害' : '魔法伤害'"
      />
      <span class="name">{{ skillData.data.name }}</span>
    </span>
    <div class="details custom-scrollbar">
      <span class="ppMax detail-item" title="pp总量"
        >PP · {{ skillData.data.ppMax }}</span
      >
      <span class="power detail-item" title="威力值"
        >威力 · {{ skillData.data.power }}</span
      >
      <span class="speed detail-item" title="速度值"
        >速度 · {{ skillData.data.speed }}</span
      >
      <span class="description detail-item">
        {{ `描述 · ${skillData.data.description}` }}
      </span>
      <span class="analysis detail-item">
        <span class="info" v-if="skillData.data.analysis">
          <span class="prefix">解析</span>
          <span class="author">{{ skillData.data.analysis.author }}</span>
          <span class="time">{{ skillData.data.analysis.time }}</span>
          <span class="hit">{{
            skillData.data.analysis.hit === '空'
              ? ''
              : skillData.data.analysis.hit
          }}</span>
          <span class="weathers" v-if="skillData.data.analysis.weather?.length"
            >召唤{{ skillData.data.analysis.weather?.join('、') }}天气</span
          >
          <span class="tags" v-if="skillData.data.analysis.tag?.length">{{
            skillData.data.analysis.tag?.join('、')
          }}</span>
          <span class="debuffs" v-if="skillData.data.analysis.debuff?.length"
            >施加{{ skillData.data.analysis.debuff?.join('、') }}</span
          >
        </span>
        <span class="text">{{ skillFix }}</span>
      </span>
      <span class="detail-item angels">
        <span class="prefix"
          >拥有此技能的精灵 · {{ skillData.AngelLength }}</span
        >
        <span
          v-for="angel in skillData.angel"
          :key="angel.hash"
          class="angel"
          @click="setupWindowParams(angel.id, angel.name, angel.hash)"
        >
          <span class="id">#{{ angel.id }}</span> ·
          <span class="name">{{ angel.name }}</span>
          <img
            class="icon"
            :src="getAngelIconSrc(angel.iconSrc)"
            alt="angel icon"
            draggable="false"
          />
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.names {
  @apply relative inline-flex w-2/3 py-2 items-center justify-center mt-4
	border-2 border-slate-400 bg-green-200 dark:border-slate-300 dark:bg-green-600
	truncate transition-all rounded-full font-black select-none;
}
.names .property {
  @apply inline-flex mx-2 items-center;
}
.icon.property {
  @apply w-6 h-6 inline-block mx-1;
}
.icon.damage {
  @apply absolute left-6 w-6 h-6
	rounded overflow-hidden;
}
.go-back {
  @apply left-8;
}

.details {
  @apply w-96 h-full max-h-[34rem] flex items-center justify-start flex-wrap mt-8
	select-none overflow-auto transition-all ease-in-out;

  @apply sm:w-2/3 sm:max-h-[50rem];
}
.detail-item {
  @apply inline-flex items-center mb-1 mr-1 px-2 py-0.5
	border-2 rounded whitespace-pre-line
	border-slate-300 dark:border-slate-500
	transition-all;
}

.analysis,
.description {
  @apply inline-flex flex-col items-start w-full text-sm font-bold;

  @apply sm:text-base;
}
.analysis .info {
  @apply inline-flex w-full items-center flex-wrap gap-1
	text-xs font-black;

  @apply sm:text-sm;
}
.info span {
  @apply opacity-60;
}
.info .prefix {
  @apply text-sm font-bold opacity-100;

  @apply sm:text-base;
}

.angels {
  @apply w-fit flex-wrap;
}
.angels .prefix {
  @apply inline-block w-full mb-0.5;
}
.angel {
  @apply relative inline-block mb-1 mr-1 px-1 py-0.5 pr-7
	border-2 rounded
	border-green-600 dark:border-green-300 bg-slate-200 dark:bg-slate-600
	hover:bg-slate-200 dark:hover:bg-slate-500
	active:bg-slate-300 dark:active:bg-slate-400
	cursor-pointer text-sm font-bold transition-all;
}
.angel .icon {
  @apply absolute right-0 top-0 inline-block w-6 h-6;
}

.detail-item.ppMax {
  @apply text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 font-bold;
}
.detail-item.power {
  @apply text-red-700 dark:text-red-400 border-red-700 dark:border-red-400 font-bold;
}
.detail-item.speed {
  @apply text-sky-700 dark:text-sky-400 border-sky-700 dark:border-sky-400 font-bold;
}
</style>
