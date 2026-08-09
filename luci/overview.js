'use strict';
'require baseclass';
'require dom';
'require rpc';
'require uqr';
'require wrqr.shared as common';

var callWirelessConfig = rpc.declare({
	object: 'uci',
	method: 'get',
	params: [ 'config' ],
	expect: { values: {} }
});

var callWirelessStatus = rpc.declare({
	object: 'luci-rpc',
	method: 'getWirelessDevices',
	expect: {}
});

var root = null;
var grid = null;
var lastFingerprint = null;

function styles() {
	return E('style', {}, [
		'.wrqr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5rem;align-items:start}',
		'.wrqr-card{display:flex;flex-direction:column;align-items:center;min-width:0;padding:1rem;text-align:center}',
		'.wrqr-ssid{max-width:100%;margin:0 0 .25rem;overflow-wrap:anywhere;font-size:1.15rem}',
		'.wrqr-bands{min-height:1.4em;margin-bottom:.8rem;color:var(--text-color-medium,#666);font-size:.85rem}',
		'.wrqr-code{width:min(100%,220px);padding:12px;background:#fff;box-sizing:border-box}',
		'.wrqr-code svg{display:block;width:100%;height:auto}',
		'.wrqr-empty{margin:.5rem 0;color:var(--text-color-medium,#666)}',
		'@media(max-width:700px){.wrqr-grid{grid-template-columns:minmax(0,1fr);gap:2rem}.wrqr-card{padding:.75rem .25rem}}'
	]);
}

function card(network) {
	var svg = uqr.renderSVG(network.payload, {
		pixelSize: 4,
		whiteColor: 'white',
		blackColor: 'black',
		ecc: 'M',
		border: 4
	});

	return E('div', { 'class': 'wrqr-card' }, [
		E('strong', { 'class': 'wrqr-ssid' }, [ network.ssid ]),
		E('div', { 'class': 'wrqr-bands' }, [ network.bands.join(' · ') ]),
		E('div', { 'class': 'wrqr-code' }, [ E(svg) ])
	]);
}

function sync(networks) {
	var nextFingerprint = common.fingerprint(networks);
	if (nextFingerprint === lastFingerprint)
		return;

	lastFingerprint = nextFingerprint;
	dom.content(grid, networks.length ? networks.map(card) : [
		E('p', { 'class': 'wrqr-empty' }, [ 'No active Wi-Fi access points.' ])
	]);
}

return baseclass.extend({
	title: 'Wi-Fi QR',

	load: function() {
		return Promise.all([
			L.resolveDefault(callWirelessConfig('wireless'), { values: {} }),
			L.resolveDefault(callWirelessStatus(), {})
		]);
	},

	render: function(data) {
		if (!root) {
			grid = E('div', { 'class': 'wrqr-grid' });
			root = E('div', { 'class': 'wrqr-root' }, [ styles(), grid ]);
		}

		try {
			sync(common.collect(data && data[0], data && data[1]));
		}
		catch (error) {
			lastFingerprint = null;
			dom.content(grid, E('p', { 'class': 'wrqr-empty' }, [
				'Wi-Fi QR unavailable: ' + (error && error.message ? error.message : error)
			]));
		}
		return root;
	}
});
