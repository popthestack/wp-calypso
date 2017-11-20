/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from './controller';
import settingsController from 'my-sites/site-settings/settings-controller';
import { makeNavigation, siteSelection } from 'my-sites/controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/settings/security/:site_id',
		siteSelection,
		makeNavigation,
		settingsController.setScroll,
		settingsController.siteSettings,
		controller.security,
		makeLayout,
		clientRender
	);
}
