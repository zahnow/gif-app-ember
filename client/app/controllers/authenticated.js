import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AuthenticatedController extends Controller {
  @service router;

  @tracked searchTerm = '';

  @action
  updateSearchTerm(event) {
    this.searchTerm = event.target.value;
  }

  @action
  performSearch() {
    this.router.transitionTo('authenticated.search', {
      queryParams: { q: this.searchTerm },
    });
  }
}
