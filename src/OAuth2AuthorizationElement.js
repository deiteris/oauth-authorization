/* eslint-disable class-methods-use-this */
import { AuthorizationEventTypes } from '@advanced-rest-client/arc-events';
import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin';
import { OAuth2Authorization } from './OAuth2Authorization.js';

/** @typedef {import('@advanced-rest-client/arc-types').Authorization.TokenInfo} TokenInfo */
/** @typedef {import('@advanced-rest-client/arc-types').Authorization.OAuth2Authorization} OAuth2Settings */
/** @typedef {import('@advanced-rest-client/arc-events').OAuth2AuthorizeEvent} OAuth2AuthorizeEvent */

export const authorizeHandler = Symbol('authorizeHandler');

/**
 * An element that utilizes the `OAuth2Authorization` class in a web component.
 * It handles DOM events to perform the authorization.
 */ 
export class OAuth2AuthorizationElement extends EventsTargetMixin(HTMLElement) {
  constructor() {
    super();
    this[authorizeHandler] = this[authorizeHandler].bind(this);
  }

  _attachListeners(node) {
    node.addEventListener(AuthorizationEventTypes.OAuth2.authorize, this[authorizeHandler]);
    this.setAttribute('aria-hidden', 'true');
  }

  _detachListeners(node) {
    node.removeEventListener(AuthorizationEventTypes.OAuth2.authorize, this[authorizeHandler]);
  }

  /**
   * @param {OAuth2AuthorizeEvent} e
   */
  [authorizeHandler](e) {
    const apic = document.querySelector('api-console,api-console-app');
    const config = { ...e.detail };
    if (apic.proxy) {
      config.accessTokenUri = apic.proxy + (apic.proxyEncodeUrl ? encodeURIComponent(config.accessTokenUri) : config.accessTokenUri);
    }
    e.detail.result = this.authorize(config);
  }

  /**
   * Authorize the user using provided settings.
   * This is left for compatibility. Use the `OAuth2Authorization` instead.
   *
   * @param {OAuth2Settings} settings The authorization configuration.
   * @returns {Promise<TokenInfo>}
   */
  async authorize(settings) {
    const auth = new OAuth2Authorization(settings);
    auth.checkConfig();
    return auth.authorize();
  }
}
