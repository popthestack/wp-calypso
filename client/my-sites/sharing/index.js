/** @format */

/**
 * External dependencies
 */

import page from 'page';

/**
 * Internal dependencies
 */
import { jetpackModuleActive, makeNavigation, sites, siteSelection } from 'my-sites/controller';
import { buttons, connections, layout } from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page( /^\/sharing(\/buttons)?$/, siteSelection, sites, makeLayout, clientRender );
	page(
		'/sharing/:domain',
		siteSelection,
		makeNavigation,
		jetpackModuleActive( 'publicize', false ),
		connections,
		layout,
		makeLayout,
		clientRender
	);
	page(
		'/sharing/buttons/:domain',
		siteSelection,
		makeNavigation,
		jetpackModuleActive( 'sharedaddy' ),
		buttons,
		layout,
		makeLayout,
		clientRender
	);
}
