import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GifController extends Controller {
  @service router;
  @service session;

  @tracked userRating = this.model?.rating || 0;

  get currentUserId() {
    return this.session.data.authenticated.user.id;
  }

  @action
  updateRating(event) {
    this.userRating = event.target.value;
  }

  @action
  async submitRating() {
    const gifId = this.model.gif.id;
    try {
      const response = await fetch(
        `http://localhost:3001/api/ratings/${gifId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rating: Number(this.userRating) }),
          credentials: 'include',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      this.router.refresh();
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    }
  }

  @action
  async deleteRating() {
    const gifId = this.model.gif.id;
    try {
      const response = await fetch(
        `http://localhost:3001/api/ratings/${gifId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete rating');
      }
      this.userRating = 0; // Reset the userRating
      this.router.refresh();
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating. Please try again.');
    }
  }

  @action
  async deleteComment(comment) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/comments/${comment.comment.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      this.router.refresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  @action
  async saveComment(commentId, newCommentText) {
    try {
      const response = await fetch(
        `http://localhost:3001/api/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ comment: newCommentText }),
          credentials: 'include',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      this.router.refresh();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  }
}
