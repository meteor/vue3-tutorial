---
title: "2: Collections"
---

Meteor already sets up MongoDB for you. In order to use our database we need to create a _collection_, which is where we will store our _documents_, in our case our `tasks`.

> You can read more about collections [here](http://guide.meteor.com/collections.html).

In this step we will implement all the necessary code to have a basic collection for our tasks up and running.

## 2.1: Create Tasks Collection

We can create a new collection to store our tasks by creating a new folder called `db` inside `imports`. Then, create a file called `TasksCollection.js` which instantiates a new Mongo collection and exports it.

`imports/db/TasksCollection.js`
```js
import { Mongo } from 'meteor/mongo';
 
export const TasksCollection = new Mongo.Collection('tasks');
```

Notice that we stored the file in the `imports/db` directory, which is a place to store DB-related code, like publications and methods. You can name this folder as you want, this is just choice.

You can delete the `links.js` file in the `imports/api` folder as we are not going to use this collection.

> You can read more about app structure and imports/exports [here](http://guide.meteor.com/structure.html).

## 2.2: Initialize Tasks Collection

For our collection to work you need to import it in the server so it sets some plumbing up. 

You can either use `import "./imports/db/TasksCollection"` or `import { TasksCollection } from "./imports/db/TasksCollection"` if you are going to use on the same file, but make sure it is imported.

Now it is easy to check if there is data or not in our collection, otherwise we can insert some sample data easily as well.

You don't need to keep the old content of `server/main.js`.

`server/main.js`
```js
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../imports/db/TasksCollection';

const insertTask = taskText => TasksCollection.insert({ text: taskText });
 
Meteor.startup(() => {
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(insertTask)
  }
});
```

So you are importing the `TasksCollection` and adding a few tasks on it iterating over an array of strings and for each string calling a function to insert this string as our `text` field in our `task` document.

## 2.3: Render Tasks Collection

Now comes the fun part, you will render the tasks using a Vue "data container" to feed Meteor's reactive data into Vue's component hierarchy. We will use the [vue-meteor-tracker](https://www.npmjs.com/package/vue-meteor-tracker) package for this. 

> Meteor works with Meteor packages and NPM packages, usually Meteor packages are using Meteor internals or other Meteor packages.

This package is already included in the Vue skeleton (`meteor create --vue yourproject`), so you don't need to add it.

Now you are ready to import code from this package.

> When importing code from a Meteor package the only difference from NPM modules is that you need to prepend `meteor/` in the from part of your import.

First we need to implement a subscription at the `App` component to get the tasks updated from the server. It can be done simply by using the `subscribe` and `autorun` function from `vue-meteor-tracker`.

`imports/ui/App.vue`
```javascript
<script setup>
import Task from './components/Task.vue'
import { subscribe, autorun } from 'vue-meteor-tracker'
import { TasksCollection } from '../db/TasksCollection'

subscribe('tasks')
const tasks = autorun(() => TasksCollection.find({}).fetch()).result
</script>

<template>
  <div class="container">
    <header>
      <h1 class="text-4xl font-bold text-gray-800 my-4">Todo List</h1>
    </header>
    <ul class="list-disc list-inside p-4">
      <Task v-for="task of tasks" :key="task._id" :task="task" />
    </ul>
  </div>
</template>
```

But to see this data in the client, you need to publish it in the server. To do it, create a file called `tasksPublications.js` and add the following code:

`imports/api/tasksPublications.js`
```javascript
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});
```

Also, do not forget to import it on the server:

`server/main.js`
```javascript
import '../imports/api/tasksPublications';
```

If you want to learn more about how publications works, you can read the [Meteor Guide](https://docs.meteor.com/api/pubsub.html).

Now, your app should look like this:

<img class="step-images" src="/simple-todos/assets/step02-task-list.png"/>

You can change your data on MongoDB in the server and your app will react and re-render for you.

You can connect to your MongoDB running `meteor mongo` in the terminal from your app folder or using a Mongo UI client, like [NoSQLBooster](https://nosqlbooster.com/downloads). Your embedded MongoDB is running in the port `3001`.

See how to connect:

<img class="step-images" src="/simple-todos/assets/new-screenshots/step02/nosql-new-connection.png"/>

See your database:

<img class="step-images" src="/simple-todos/assets/new-screenshots/step02/nosql-connection-editor.png"/>

You can double-click your collection to see the documents stored on it:

<img class="step-images" src="/simple-todos/assets/new-screenshots/step02/nosql-tasks-query.png"/>

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/vue3-tutorial/tree/master/src/simple-todos/step02) 

In the next step we are going to create tasks using a form.

