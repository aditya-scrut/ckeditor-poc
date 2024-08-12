import { Plugin } from "ckeditor5";

export class CommentsIntegration extends Plugin {
  // eslint-disable-next-line no-restricted-syntax
  static get requires() {
    return ["CommentsRepository"];
  }

  init() {
    const usersPlugin = this.editor.plugins.get("Users");
    const appData = this.editor.config.get("appData");

    const commentsRepositoryPlugin =
      this.editor.plugins.get("CommentsRepository");

    // Load the users data.
    appData.users.forEach(user => {
      usersPlugin.addUser({
        id: user.id,
        name: user.display,
        email: user.email,
      });
    });

    // Set the current user.
    usersPlugin.defineMe(appData.userId);

    // Load the comment threads data.
    appData.commentThreads.forEach(commentThread => {
      commentsRepositoryPlugin.addCommentThread(commentThread);
    });
  }
}
