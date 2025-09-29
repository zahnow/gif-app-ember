import Route from '@ember/routing/route';

export default class GifRoute extends Route {
  async model(params) {
    let response = await fetch(
      `http://localhost:3001/api/gifs/${params.gif_id}`,
    );
    let json = await response.json();

    return {
      gif_id: params.gif_id,
      gif: json.data,
    };
  }
}
