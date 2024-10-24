import { getOwner } from "@ember/owner";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import Composer from "discourse/models/composer";
import DropdownSelectBoxComponent from "select-kit/components/dropdown-select-box";

export default DropdownSelectBoxComponent.extend({
  classNames: ["new-topic-dropdown"],
  siteSettings: service(),
  historyStore: service(),
  dropdownButtons: service(),
  router: service(),

  selectKitOptions: {
    icon: "plus",
    showFullTitle: true,
    autoFilterable: false,
    filterable: false,
    showCaret: true,
    none: "topic.create",
  },

  get content() {
    return this.dropdownButtons.buttons;
  },

  get showButton() {
    if (this.siteSettings.hide_new_topic_button_on_default_page) {
      const currentRoute = this.router.currentRoute;
      return currentRoute.name === `discovery.${defaultHomepage()}`
        ? false
        : true;
    }
    return true;
  },

  actions: {
    onChange(selectedAction) {
      const composerController = getOwner(this).lookup("controller:composer");
      let selectedButton = this.historyStore.get("newTopicButtonOptions");

      if (!selectedButton || selectedAction !== selectedButton.id) {
        const buttons = JSON.parse(this.siteSettings.button_types);
        selectedButton = buttons.find((button) => button.id === selectedAction);
        this.historyStore.set("newTopicButtonOptions", selectedButton);
      }

      const selectedButtonCategoryId =
        selectedButton.categoryId > 0 ? selectedButton.categoryId : null;

      const tags = selectedButton.tags.split(/(?:,|\s)\s*/).filter(Boolean); // remove [''] from tags;
      const options = {
        action: Composer.CREATE_TOPIC,
        draftKey: Composer.NEW_TOPIC_KEY,
        categoryId: selectedButtonCategoryId ?? this.category?.id ?? null,
        tags,
      };

      composerController.open(options);
    },
  },
});
