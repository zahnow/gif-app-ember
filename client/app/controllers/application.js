import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @service session;
  @service router;

  @action
  async invalidateSession() {
    try {
      await this.session.invalidate();
      this.router.transitionTo('home');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
