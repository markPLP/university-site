// // wp add to browswer global scope
// // inside the object has blocks etc
// // inside object there is registerBlockType()

// // 1st argument is the name or variable of the block
// // 2nd argument is a config object that has a bunch of properties
// wp.blocks.registerBlockType('ourplugin/are-you-paying-attention', {
//   // properties here is precise or exact property names that wordpress know to look for
//   title: 'Are you paying attention?',
//   icon: 'admin-comments',
//   category: 'layout',
//   // edit function control what you see in the admin post editor screen
//   edit: function () {
//     //createElement wordpress method
//     return wp.element.createElement('h3', null, 'hello this is from AES');
//   },
//   // save function control what actual public will see in your content / frontend
//   save: function () {
//     return wp.element.createElement('h1', null, 'this is the front end');
//   },
// });
