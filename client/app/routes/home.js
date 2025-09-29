import Route from '@ember/routing/route';

export default class HomeRoute extends Route {
  async model() {
    let response = await fetch('http://localhost:3001/api/gifs');
    let json = await response.json();
    let gifs = json.data || [];

    return {
      gifs,
    };
  }
}
