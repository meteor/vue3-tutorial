<script setup>
import { Meteor } from 'meteor/meteor';
import { ref, watch } from 'vue';

const props = defineProps({
  task: Object,
});

const taskRef = ref(props.task);

const deleteTask = () => {
  Meteor.call('tasks.remove', taskRef.value._id);
};

watch(
  () => !!taskRef.value.checked,
  (newCheckedValue) => {
    Meteor.call('tasks.setIsChecked', taskRef.value._id, newCheckedValue);
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex items-center rounded px-4 py-2 mb-2">
    <li>
      <input
        v-model="taskRef.checked"
        type="checkbox"
        readonly
        :checked="taskRef.checked"
      />
    </li>
    <span
      class="text-gray-600 pl-2"
      :class="{ 'text-gray-400 italic line-through': taskRef.checked }"
    >
      {{ task.text }}
    </span>
    <button
      class="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-0.5 px-2 rounded"
      @click="deleteTask"
    >
      x
    </button>
  </div>
</template>
