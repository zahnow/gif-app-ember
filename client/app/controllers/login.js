import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service session;
  @service router;

  @tracked username = '';
  @tracked password = '';
  @tracked isLoading = false;
  @tracked errorMessage = '';

  @action
  async handleLogin(event) {
    event.preventDefault();

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.session.authenticate(
        'authenticator:better-auth',
        this.username,
        this.password,
      );

      // Redirect to intended route or home
      this.router.transitionTo('authenticated.home');
    } catch (error) {
      this.errorMessage = error.message || 'Login failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  updateUsername(event) {
    this.username = event.target.value;
    this.errorMessage = ''; // Clear error when user starts typing
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
    this.errorMessage = ''; // Clear error when user starts typing
  }
}
