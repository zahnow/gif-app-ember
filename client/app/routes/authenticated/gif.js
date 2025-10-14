import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class GifRoute extends Route {
  @service session;

  async model(params) {
    try {
      let gifResponse = await fetch(
        `http://localhost:3001/api/gifs/${params.gif_id}`,
        {
          credentials: 'include',
        },
      );

      if (!gifResponse.ok) {
        throw new Error(`HTTP error. status: ${gifResponse.status}`);
      }

      let commentResponse = await fetch(
        `http://localhost:3001/api/comments/${params.gif_id}`,
        {
          credentials: 'include',
        },
      );

      if (!commentResponse.ok) {
        throw new Error(`HTTP error. status: ${commentResponse.status}`);
      }

      let ratingResponse = await fetch(
        `http://localhost:3001/api/ratings/${params.gif_id}`,
        {
          credentials: 'include',
        },
      );

      if (!ratingResponse.ok) {
        throw new Error(`HTTP error. status: ${ratingResponse.status}`);
      }

      let gif = await gifResponse.json();
      let comments = await commentResponse.json();
      let rating = await ratingResponse.json();
      return {
        gif_id: params.gif_id,
        gif,
        comments,
        rating: rating.rating || 0,
      };
    } catch (error) {
      console.error('Error fetching gif:', error);
      throw error;
    }
  }
}
