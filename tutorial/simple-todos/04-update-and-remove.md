---
title: '4: Update and Remove'
---

Up until now you have only inserted documents into our collection. Let's take a look at how you can update and remove them by interacting with the user interface.

## 4.1: Add Checkbox

First, you need to add a `checkbox` element to your `Task` component.

> You are also invited to experiment and see how the app behaves for learning purposes.

Now, we need to add the v-model directive to the checkbox. This will allow us to bind the value of the checkbox to the `checked` field of the task document.

`imports/ui/components/Task.vue`
```javascript
<template>
  <div class="flex items-center rounded px-4 py-2 mb-2">
    <li>
      <input v-model="taskRef.checked" type="checkbox" readonly :checked="taskRef.checked" />
    </li>
    <span class="text-gray-600 pl-2" :class="{ 'text-gray-400 italic line-through': taskRef.checked }">
      {{ task.text }}
    </span>
  </div>
</template>
 ..
```

## 4.2: Toggle Checkbox

Before change the UI, we need to implement the method to update the task document. So, update the `tasksMethods.js` file with the following code:

```javascript
import { Meteor } from 'meteor/meteor';

import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        TasksCollection.insert({
            text,
            createdAt: new Date,
            userId: this.userId,
        })
    },

    'tasks.remove'(taskId) {
        check(taskId, String);

        TasksCollection.remove(taskId);
    },

    'tasks.setIsChecked'(taskId, checked) {
        check(taskId, String);
        check(checked, Boolean);

        TasksCollection.update(taskId, {
            $set: {
                checked
            }
        });
    }
});
```

Now you can update your task document toggling its `checked` field.

You need to add a `watch` to the `checked` field of the task document. This will allow us to update the task document when the checkbox is toggled.

We also have a prop called `task` that is passed to the component. This prop is an object that represents the task document. We can use this prop to initialize a `ref` that will be used to watch the `checked` field.

`imports/ui/components/Task.vue`
```javascript
<script setup>
import { Meteor } from 'meteor/meteor';
import { ref, watch } from 'vue';

const props = defineProps({
  task: Object
});

const taskRef = ref(props.task);

watch(
  () => !!taskRef.value.checked,
  (newCheckedValue) => {
    Meteor.call('tasks.setIsChecked', taskRef.value._id, newCheckedValue);
  },
  { immediate: true }
);
</script>
```

The `update` function on a collection takes two arguments. The first is a selector that identifies a subset of the collection, and the second is an update parameter that specifies what should be done to the matched objects.

In this case, the selector is just the `_id` of the relevant task. The update parameter uses `$set`, on our method, to toggle the `checked` field, which will represent whether the task has been completed.

Your app should look like this:

<img class="step-images" src="/simple-todos/assets/new-screenshots/step04/checked-tasks.png"/>

## 4.3: Remove tasks

You can remove tasks with just a few lines of code.

First add a button after text in your `Task` component and receive a callback function.

`imports/ui/components/Task.vue`
```javascript
...
{{ task.text }}
</span>

<button 
class="ml-auto bg-red-500 hover:bg-red-600 text-white font-bold py-0.5 px-2 rounded"
@click="deleteTask"> x 
</button>

...
```

Now add the removal logic into methods:

`imports/ui/components/Task.vue`
```javascript
...

const deleteTask = () => {
  Meteor.call('tasks.remove', taskRef.value._id);
}

...
```

Your app should look like this:

<img class="step-images" src="/simple-todos/assets/new-screenshots/step04/remove-button.png"/>

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/vue3-tutorial/tree/master/src/simple-todos/step04) 

In the next step we are going to improve the look of your app using Tailwind CSS!
