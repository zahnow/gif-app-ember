import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GifController extends Controller {
  @service router;
  @service session;

  @tracked newComment = '';
  @tracked userRating = this.model.rating || 0;

  get commentAuthor() {
    return this.session.data.authenticated.id;
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
  updateComment(event) {
    return;
  }

  @action
  async submitComment() {
    if (this.newComment.trim() === '') {
      return; // Prevent empty comments
    }

    const gifId = this.model.gif.id; // Get the GIF ID from the model
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
        throw new Error('Failed to submit comment');
      }

      this.newComment = '';
      this.router.refresh();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  }
}
