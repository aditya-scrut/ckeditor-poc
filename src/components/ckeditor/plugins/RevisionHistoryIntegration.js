/* eslint-disable no-restricted-syntax */
import { Plugin } from "ckeditor5";

export class RevisionHistoryIntegration extends Plugin {
  static get pluginName() {
    return "RevisionHistoryIntegration";
  }

  static get requires() {
    return ["RevisionHistory"];
  }

  init() {
    const revisionHistory = this.editor.plugins.get("RevisionHistory");
    const appData = this.editor.config.get("appData");
    appData.revisions.forEach(revisionData => {
      revisionHistory.addRevisionData(revisionData);
    });
  }
}
