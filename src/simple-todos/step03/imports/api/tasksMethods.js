import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    TasksCollection.insert({
      text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },
});
