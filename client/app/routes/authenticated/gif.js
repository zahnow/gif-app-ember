import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class GifRoute extends Route {
  @service session;

  async model(params) {
    try {
      let response = await fetch(
        `http://localhost:3001/api/gifs/${params.gif_id}`,
        {
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let json = await response.json();
      return {
        gif_id: params.gif_id,
        gif: json,
      };
    } catch (error) {
      console.error('Error fetching gif:', error);
      throw error;
    }
  }
}
