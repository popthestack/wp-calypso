const config = require( 'config' ),
	utils = require( './utils' );

function indent( value, indentation ) {
	const lines = JSON.stringify( value, null, '\t' );

	return lines.split( '\n' ).map( ( line, index ) => {
		return ( index > 0 ? indentation : '' ) + line;
	} ).join( '\n' );
}

function getSectionsModule( sections ) {
	let sectionLoaders = '';

	if ( config.isEnabled( 'code-splitting' ) ) {
		let sectionPreLoaders = '';

		sections.forEach( function( section ) {
			sectionPreLoaders += getSectionPreLoaderTemplate( section.name );

			section.paths.forEach( function( path ) {
				sectionLoaders += splitTemplate( path, section );
			} );
		} );

		return `
var config = require( 'config' ),
	page = require( 'page' ),
	React = require( 'react' ),
	activateNextLayoutFocus = require( 'state/ui/layout-focus/actions' ).activateNextLayoutFocus,
	LoadingError = require( 'layout/error' ),
	controller = require( 'controller' ),
	restoreLastSession = require( 'lib/restore-last-path' ).restoreLastSession,
	preloadHub = require( 'sections-preload' ).hub,
	debug = require( 'debug' )( 'calypso:bundler:loader' );

var _loadedSections = {};

function preload( sectionName ) {
	switch ( sectionName ) {
${ sectionPreLoaders }
	}
}

preloadHub.on( 'preload', preload );

module.exports = {
	get: function() {
		return ${ indent( sections, '\t\t' ) };
	},
	load: function() {
${ sectionLoaders }
	}
};
`;
	}

	const dependencies = [
		"var config = require( 'config' ),",
		"	page = require( 'page' ),",
		"	controller = require( 'controller' );",
		''
	].join( '\n' );

	sectionLoaders = getRequires( sections );

	return [
		dependencies,
		'module.exports = {',
		'	get: function() {',
		'		return ' + JSON.stringify( sections ) + ';',
		'	},',
		'	load: function() {',
		'		' + sectionLoaders,
		'	}',
		'};'
	].join( '\n' );
}

function getRequires( sections ) {
	let content = '';

	sections.forEach( function( section ) {
		content += requireTemplate( section );
	} );

	return content;
}

function splitTemplate( path, section ) {
	const pathRegex = getPathRegex( path ),
		sectionString = JSON.stringify( section ),
		sectionNameString = JSON.stringify( section.name ),
		moduleString = JSON.stringify( section.module ),
		envIdString = JSON.stringify( section.envId );

	const result = [
		'		page( ' + pathRegex + ', function( context, next ) {',
		'			var envId = ' + envIdString + ';',
		'			if ( envId && envId.indexOf( config( "env_id" ) ) === -1 ) {',
		'				return next();',
		'			}',
		'			if ( _loadedSections[ ' + moduleString + ' ] ) {',
		'				controller.setSection( ' + sectionString + ' )( context );',
		'				context.store.dispatch( activateNextLayoutFocus() );',
		'				return next();',
		'			}',
		'			if ( config.isEnabled( "restore-last-location" ) && restoreLastSession( context.path ) ) {',
		'				return;',
		'			}',
		'			context.store.dispatch( { type: "SECTION_SET", isLoading: true } );',
		'			require.ensure( [],',
		'				function( require ) {',
		'					context.store.dispatch( { type: "SECTION_SET", isLoading: false } );',
		'					controller.setSection( ' + sectionString + ' )( context );',
		'					if ( ! _loadedSections[ ' + moduleString + ' ] ) {',
		'						require( ' + moduleString + ' )( controller.clientRouter );',
		'						_loadedSections[ ' + moduleString + ' ] = true;',
		'					}',
		'					context.store.dispatch( activateNextLayoutFocus() );',
		'					next();',
		'				}, function onError( error ) {',
		'					if ( ! LoadingError.isRetry() ) {',
		'						console.warn( error );',
		'						LoadingError.retry( ' + sectionNameString + ' );',
		'					} else {',
		'						console.error( error );',
		'						context.store.dispatch( { type: "SECTION_SET", isLoading: false } );',
		'						LoadingError.show( ' + sectionNameString + ' );',
		'					}',
		'				}, ' + sectionNameString,
		'			);',
		'		} );',
		'',
		''
	];

	return result.join( '\n' );
}

function getPathRegex( pathString ) {
	if ( pathString === '/' ) {
		return JSON.stringify( pathString );
	}
	const regex = utils.pathToRegExp( pathString );
	return '/' + regex.toString().slice( 1, -1 ) + '/';
}

function requireTemplate( section ) {
	let pathRegex;

	const result = section.paths.reduce( function( acc, path ) {
		pathRegex = getPathRegex( path );

		return acc.concat( [
			'page( ' + pathRegex + ', function( context, next ) {',
			'	var envId = ' + JSON.stringify( section.envId ) + ';',
			'	if ( envId && envId.indexOf( config( "env_id" ) ) === -1 ) {',
			'		return next();',
			'	}',
			'	controller.setSection( ' + JSON.stringify( section ) + ' )( context );',
			'	require( ' + JSON.stringify( section.module ) + ' )( controller.clientRouter );',
			'	next();',
			'} );',
			''
		] );
	}, [] );

	return result.join( '\n' );
}

function getSectionPreLoaderTemplate( sectionName ) {
	const sectionNameString = JSON.stringify( section.name );

	const result = [
		'		case ' + sectionNameString + ':',
		'			debug( \'Pre-loading Javascript for ' + sectionNameString + ' section\' );',
    '',
		'			return require.ensure( [], function() {}, ' + sectionNameString + ' );',
	];

	return result.join( '\n' );
}

function sectionsWithCSSUrls( sections ) {
	return sections.map( section => Object.assign( {}, section, section.css && {
		cssUrls: utils.getCssUrls( section.css )
	} ) );
}

module.exports = function( content ) {
	const sections = require( this.resourcePath );

	if ( ! Array.isArray( sections ) ) {
		this.emitError( 'Chunks module is not an array' );
		return content;
	}

	this.addDependency( 'page' );

	return getSectionsModule( sectionsWithCSSUrls( sections ) );
};
