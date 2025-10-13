import Route from '@ember/routing/route';

export default class SearchRoute extends Route {
  queryParams = {
    q: {
      refreshModel: true,
    },
  };

  async model(params) {
    const searchTerm = params.q || 'test';
    let response = await fetch(
      'http://localhost:3001/api/gifs/search?q=' +
        encodeURIComponent(searchTerm),
      {
        credentials: 'include',
      },
    );
    let json = await response.json();
    let gifs = json.data || [];

    return {
      gifs,
    };
  }
}
