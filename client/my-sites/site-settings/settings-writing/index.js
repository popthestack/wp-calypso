/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import config from 'config';
import controller from './controller';
import settingsController from 'my-sites/site-settings/settings-controller';
import { makeNavigation, siteSelection } from 'my-sites/controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/settings/writing/:site_id',
		siteSelection,
		makeNavigation,
		settingsController.siteSettings,
		controller.writing,
		makeLayout,
		clientRender
	);

	if ( config.isEnabled( 'manage/site-settings/categories' ) ) {
		page(
			'/settings/taxonomies/:taxonomy/:site_id',
			siteSelection,
			makeNavigation,
			settingsController.setScroll,
			controller.taxonomies,
			makeLayout,
			clientRender
		);
	}
}
