import { tracked } from "@glimmer/tracking";
import Component from "@ember/component";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";

export default Component.extend({
  router: service(),
  shouldHide: tracked({ value: false }),

  didUpdate() {
    this._super(...arguments);
    if (this.siteSettings.hide_new_topic_button_on_default_page) {
      const shouldHideButton =
        this.router.currentRouteName === `discovery.${defaultHomepage()}`;

      if (shouldHideButton !== this.shouldHide) {
        this.shouldHide = shouldHideButton;
      }
    }
  },
});
