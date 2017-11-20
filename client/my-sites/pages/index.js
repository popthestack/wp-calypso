/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { makeNavigation, siteSelection } from 'my-sites/controller';
import pagesController from './controller';
import config from 'config';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	if ( config.isEnabled( 'manage/pages' ) ) {
		page(
			'/pages/:status?/:domain?',
			siteSelection,
			makeNavigation,
			pagesController.pages,
			makeLayout,
			clientRender
		);
	}
}
