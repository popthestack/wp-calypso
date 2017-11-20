/** @format */
/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import { makeNavigation, siteSelection, sites } from 'my-sites/controller';
import plansController from './controller';
import currentPlanController from './current-plan/controller';
import { makeLayout, render as clientRender } from 'controller';

export default function() {
	page( '/plans', siteSelection, sites, makeLayout, clientRender );
	page(
		'/plans/compare',
		siteSelection,
		makeNavigation,
		plansController.redirectToPlans,
		makeLayout,
		clientRender
	);
	page(
		'/plans/compare/:domain',
		siteSelection,
		makeNavigation,
		plansController.redirectToPlans,
		makeLayout,
		clientRender
	);
	page(
		'/plans/features',
		siteSelection,
		makeNavigation,
		plansController.redirectToPlans,
		makeLayout,
		clientRender
	);
	page(
		'/plans/features/:domain',
		siteSelection,
		makeNavigation,
		plansController.redirectToPlans,
		makeLayout,
		clientRender
	);
	page( '/plans/features/:feature/:domain', plansController.features, makeLayout, clientRender );
	page(
		'/plans/my-plan',
		siteSelection,
		sites,
		makeNavigation,
		currentPlanController.currentPlan,
		makeLayout,
		clientRender
	);
	page(
		'/plans/my-plan/:site',
		siteSelection,
		makeNavigation,
		currentPlanController.currentPlan,
		makeLayout,
		clientRender
	);
	page(
		'/plans/select/:plan/:domain',
		siteSelection,
		plansController.redirectToCheckout,
		makeLayout,
		clientRender
	);

	// This route renders the plans page for both WPcom and Jetpack sites.
	page(
		'/plans/:intervalType?/:site',
		siteSelection,
		makeNavigation,
		plansController.plans,
		makeLayout,
		clientRender
	);
}
