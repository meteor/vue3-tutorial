/* global hexo */

hexo.extend.filter.register('after_render:html', function (str) {
  const warningMessage = `
    <div style="text-align: center; padding: 10px; width: 100%; color: lightcoral">
      ⚠️ This is a legacy version of the Vue 3 tutorial. Please visit <a href="https://docs.meteor.com/tutorials/vue/meteorjs3-vue3-vue-meteor-tracker.html" style="color: coral">docs.meteor.com/tutorials/vue/meteorjs3-vue3-vue-meteor-tracker</a> for the current version.
    </div>
  `;

  return str.replace(/<div class="content">/, `<div class="content" data-injected>${warningMessage}`);
});