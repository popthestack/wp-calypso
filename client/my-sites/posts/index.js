/** @format */

/**
 * External dependencies
 */

import page from 'page';

/**
 * Internal Dependencies
 */
import { makeNavigation, siteSelection } from 'my-sites/controller';
import postsController from './controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page(
		'/posts/:author?/:status?/:domain?',
		siteSelection,
		makeNavigation,
		postsController.posts,
		makeLayout,
		clientRender
	);
}
