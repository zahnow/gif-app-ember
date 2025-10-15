import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CommentItemComponent extends Component {
  @tracked isEditing = false;
  @tracked editedComment = '';

  get isAuthor() {
    return this.args.currentUserId === this.args.comment.comment.userId;
  }

  @action
  updateEditedComment(event) {
    this.editedComment = event.target.value;
  }

  @action
  startEdit() {
    this.isEditing = true;
    this.editedComment = this.args.comment.comment.comment;
  }

  @action
  cancelEdit() {
    this.isEditing = false;
  }

  @action
  saveEdit() {
    this.args.onSave(this.args.comment.comment.id, this.editedComment);
    this.isEditing = false;
  }

  @action
  deleteComment() {
    this.args.onDelete(this.args.comment);
  }
}
