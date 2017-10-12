/** @format */

/**
 * External dependencies
 */
import { getAccountRecoveryResetOptions } from '../';

describe( 'getAccountRecoveryResetOptions()', () => {
	test( 'should return the items array under accountRecovery/reset substate tree.', () => {
		const resetOptionItems = [
			{
				email: 'primary@example.com',
				sms: '1234567',
			},
			{
				email: 'secondary@example.com',
				sms: '1234567',
			},
		];

		const state = {
			accountRecovery: {
				reset: {
					options: {
						items: resetOptionItems,
					},
				},
			},
		};

		expect( getAccountRecoveryResetOptions( state ) ).toEqual( resetOptionItems );
	} );
} );
