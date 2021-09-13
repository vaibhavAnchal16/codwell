import Tests from "./collection";

Meteor.methods({
  addTest(obj) {
    check(obj, Object);
    return Tests.insert(obj);
  },
  updateTest(obj) {
    check(obj, Object);
    const { _id } = obj;
    delete obj._id;
    return Tests.update(_id, { $set: { ...obj } });
  },
});

// Meteor.methods({
// 'todos.updateText'({ todoId, newText }) {
//   new SimpleSchema({
//     todoId: { type: String },
//     newText: { type: String }
//   }).validate({ todoId, newText });

//   const todo = Todos.findOne(todoId);

//   if (!todo.editableBy(this.userId)) {
//     throw new Meteor.Error('todos.updateText.unauthorized',
//       'Cannot edit todos in a private list that is not yours');
//   }

//   Todos.update(todoId, {
//     $set: { text: newText }
//   });
// }
// });
