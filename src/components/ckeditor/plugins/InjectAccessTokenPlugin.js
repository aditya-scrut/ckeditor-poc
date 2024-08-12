/* eslint-disable no-restricted-syntax */
import { Plugin } from "ckeditor5";
export class InjectAccessTokenPlugin extends Plugin {
  static get pluginName() {
    return "InjectAccessTokenPlugin";
  }

  async fetchWithToken(url) {
    const editor = this.editor;
    const pluginConfig = editor.config.get("customDownload");

    const headers = {
      Authorization: `${pluginConfig.tokens["Authorization"]}`,
      "auth-id-token": `${pluginConfig.tokens["auth-id-token"]}`,
      "auth-access-token": `${pluginConfig.tokens["auth-access-token"]}`,
      refreshToken: `${pluginConfig.tokens["refreshToken"]}`,
    };

    const response = await fetch(url, { method: "GET", headers });
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  init() {
    const editor = this.editor;
    const pluginConfig = editor.config.get("customDownload");
    const regex = new RegExp(`${pluginConfig.url}.+`);
    editor.conversion.for("editingDowncast").add(dispatcher => {
      dispatcher.on("attribute:src", (event, data, conversionApi) => {
        if (
          !["attribute:src:imageInline", "attribute:src:imageBlock"].includes(
            event.name
          )
        ) {
          return;
        }

        if (!data.attributeKey) {
          return;
        }

        if (data.attributeKey !== "src") {
          return;
        }

        conversionApi.consumable.consume(data.item, event.name);

        const viewWriter = conversionApi.writer;
        const viewElement = conversionApi.mapper.toViewElement(data.item);

        if (!viewElement) {
          console.warn("[inject] toViewElement failed", data.item);
          return;
        }

        let img = viewElement;
        if (viewElement.name !== "img") {
          const tmp = viewElement.getChild(0);
          if (!tmp || !tmp.is("element") || tmp.name !== "img") {
            console.warn("[inject] figure/span has no img", viewElement, tmp);
            return;
          }
          img = tmp;
        }

        if (
          data.attributeNewValue &&
          typeof data.attributeNewValue === "string"
        ) {
          let src;
          if (regex.exec(data.attributeNewValue)) {
            viewWriter.setAttribute(
              data.attributeKey || "",
              "https://i.stack.imgur.com/h6viz.gif",
              img
            );

            this.fetchWithToken(data.attributeNewValue)
              .then(output => {
                editor.editing.view.change(() => {
                  viewWriter.setAttribute("src", output, img);
                });
              })
              .catch(e => {
                console.error("[inject] ", e);
              });
          } else {
            src = data.attributeNewValue;
            viewWriter.setAttribute("src", src, img);
          }
        } else {
          viewWriter.removeAttribute(data.attributeKey, img);
        }
      });
    });
  }
}
