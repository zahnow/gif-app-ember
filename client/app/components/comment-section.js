import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CommentSectionComponent extends Component {
  @service router;
  @service session;

  @tracked newComment = '';

  @action
  updateComment(event) {
    this.newComment = event.target.value;
  }

  @action
  async submitComment() {
    if (this.newComment.trim() === '') {
      return; // Prevent empty comments
    }

    const gifId = this.args.gifId;
    const comment = this.newComment;

    try {
      const response = await fetch('http://localhost:3001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gifId, comment }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      this.newComment = '';
      this.router.refresh();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  }
}
