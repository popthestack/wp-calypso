/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { makeNavigation, siteSelection, sites } from 'my-sites/controller';
import statsController from './controller';
import config from 'config';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	if ( config.isEnabled( 'jetpack/activity-log' ) ) {
		page(
			'/stats/activity/:site_id',
			siteSelection,
			makeNavigation,
			statsController.activityLog,
			makeLayout,
			clientRender
		);
	}
	if ( config.isEnabled( 'manage/stats' ) ) {
		// Stat Overview Page
		page(
			'/stats',
			siteSelection,
			makeNavigation,
			statsController.overview,
			makeLayout,
			clientRender
		);
		page(
			'/stats/day',
			siteSelection,
			makeNavigation,
			statsController.overview,
			makeLayout,
			clientRender
		);
		page(
			'/stats/week',
			siteSelection,
			makeNavigation,
			statsController.overview,
			makeLayout,
			clientRender
		);
		page(
			'/stats/month',
			siteSelection,
			makeNavigation,
			statsController.overview,
			makeLayout,
			clientRender
		);
		page(
			'/stats/year',
			siteSelection,
			makeNavigation,
			statsController.overview,
			makeLayout,
			clientRender
		);

		// Stat Insights Page
		page(
			'/stats/insights/:site_id',
			siteSelection,
			makeNavigation,
			statsController.insights,
			makeLayout,
			clientRender
		);

		// Stat Site Pages
		page(
			'/stats/day/:site_id',
			siteSelection,
			makeNavigation,
			statsController.site,
			makeLayout,
			clientRender
		);
		page(
			'/stats/week/:site_id',
			siteSelection,
			makeNavigation,
			statsController.site,
			makeLayout,
			clientRender
		);
		page(
			'/stats/month/:site_id',
			siteSelection,
			makeNavigation,
			statsController.site,
			makeLayout,
			clientRender
		);
		page(
			'/stats/year/:site_id',
			siteSelection,
			makeNavigation,
			statsController.site,
			makeLayout,
			clientRender
		);

		// Stat Summary Pages
		page(
			'/stats/:module/:site_id',
			siteSelection,
			makeNavigation,
			statsController.summary,
			makeLayout,
			clientRender
		);
		page(
			'/stats/day/:module/:site_id',
			siteSelection,
			makeNavigation,
			statsController.summary,
			makeLayout,
			clientRender
		);
		page(
			'/stats/week/:module/:site_id',
			siteSelection,
			makeNavigation,
			statsController.summary,
			makeLayout,
			clientRender
		);
		page(
			'/stats/month/:module/:site_id',
			siteSelection,
			makeNavigation,
			statsController.summary,
			makeLayout,
			clientRender
		);
		page(
			'/stats/year/:module/:site_id',
			siteSelection,
			makeNavigation,
			statsController.summary,
			makeLayout,
			clientRender
		);

		// Stat Single Post Page
		page(
			'/stats/post/:post_id/:site_id',
			siteSelection,
			makeNavigation,
			statsController.post,
			makeLayout,
			clientRender
		);
		page(
			'/stats/page/:post_id/:site_id',
			siteSelection,
			makeNavigation,
			statsController.post,
			makeLayout,
			clientRender
		);

		// Stat Follows Page
		page(
			'/stats/follows/comment/:site_id',
			siteSelection,
			makeNavigation,
			statsController.follows,
			makeLayout,
			clientRender
		);
		page(
			'/stats/follows/comment/:page_num/:site_id',
			siteSelection,
			makeNavigation,
			statsController.follows,
			makeLayout,
			clientRender
		);

		// Reset first view
		if ( config.isEnabled( 'ui/first-view/reset-route' ) ) {
			page( '/stats/reset-first-view', statsController.resetFirstView, makeLayout, clientRender );
		}

		// Anything else should require site-selection
		page(
			'/stats/(.*)',
			siteSelection,
			makeNavigation,
			statsController.redirectToDefaultSitePage,
			sites,
			makeLayout,
			clientRender
		);
	}
}
