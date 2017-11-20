/** @format */

/**
 * External dependencies
 */
import { assert, expect } from 'chai';
import { spy } from 'sinon';

/**
 * Internal dependencies
 */
import { failureMeta, queueRequest, successMeta } from '../';
import { extendAction } from 'state/utils';
import useNock, { nock } from 'test/helpers/use-nock';

const processInbound = action => action;
const processOutbound = ( action, store, data, error ) => ( {
	failures: [ action.onFailure ],
	nextData: data,
	nextError: error,
	successes: [ action.onSuccess ],
} );

const http = queueRequest( processInbound, processOutbound );

const succeeder = { type: 'SUCCESS' };
const failer = { type: 'FAIL' };

const getMe = {
	method: 'GET',
	path: '/me',
	apiVersion: 'v1.1',
	onFailure: failer,
	onSuccess: succeeder,
};

/*
 * Helper that waits until a given `nockScope` is "done", i.e., until the request was
 * asychronously processed. Then call the supplied `cb` callback.
 */
function afterNockDone( nockScope, cb, retryCount = 10 ) {
	setTimeout( () => {
		if ( nockScope.isDone() ) {
			cb();
		} else if ( retryCount > 0 ) {
			afterNockDone( nockScope, cb, retryCount - 1 );
		} else {
			assert.fail( 'Timed out while waiting for a nock mock to be done' );
		}
	}, 10 );
}

describe( '#queueRequest', () => {
	let dispatch;

	useNock();

	beforeEach( () => {
		dispatch = spy();
	} );

	test( 'should call `onSuccess` when a response returns with data', done => {
		const data = { value: 1 };
		nock( 'https://public-api.wordpress.com:443' )
			.get( '/rest/v1.1/me' )
			.reply( 200, data );

		http( { dispatch }, getMe );

		afterNockDone( nock, () => {
			expect( dispatch ).to.have.been.calledOnce;
			expect( dispatch ).to.have.been.calledWith( extendAction( succeeder, successMeta( data ) ) );
			done();
		} );
	} );

	test( 'should call `onFailure` when a response returns with an error', done => {
		const error = { error: 'bad' };
		nock( 'https://public-api.wordpress.com:443' )
			.get( '/rest/v1.1/me' )
			.replyWithError( error );

		http( { dispatch }, getMe );

		afterNockDone( nock, () => {
			expect( dispatch ).to.have.been.calledOnce;
			expect( dispatch ).to.have.been.calledWith( extendAction( failer, failureMeta( error ) ) );
			done();
		} );
	} );
} );
