import EmberRouter from '@ember/routing/router';
import config from 'client/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('register');
  this.route('authenticated', { path: '' }, function () {
    this.route('home');
    this.route('gif', { path: '/gif/:gif_id' });
    this.route('search');
  });
});
