// 过大的类
'use strict';
const utils = require('./utils');
const errs = require('errs');
const xml2js = require('xml2js');
const _ = require('underscore');
const js2xmlparser = require('js2xmlparser');
const parser = xml2js.Parser({ explicitArray: false, trim: true, tagNameProcessors: [stripPrefix], mergeAttrs: true, explicitRoot: false });
const extend = require('extend');

const DUPLICATE_REQUEST_MESSAGE = 'Duplicate request';

class das {
	constructor(options) {
		options = options || {};

		this.bus = (options.bus) ? options.bus : false;
		this.env = (options.env) ? options.env : false;
		this.payload = (options.payload) ? options.payload : false;
		this.requestID = (options.payload && options.payload.requestID) ? options.payload.requestID : false;
		this.timeout = undefined; // 3 seconds
		this.debug = options.debug || false;


		this.required = false;
		this.params = false;
		this.response = {};
		this.thisprocessingcount = 1;
		this.externalRequestID = null;
		this.requestStartTime = new Date();
		this.valuationBlock = {};

		this.sourceType = ' das-das';
		this.hostname = require('os').hostname();

		this.error = errs.create({
			title: this.sourceType + '-error',
			parameters: {},
			code: undefined,
			stacktrace: []
		});

		return this;

	}

	/**
	 * [thisDebug description]
	 * @param  {[type]} method  [description]
	 * @param  {[type]} title   [description]
	 * @param  {[type]} payload [description]
	 * @return {[type]}         [description]
	 */
	thisDebug(method, title, payload) {
		const itSelf = this;
		if (itSelf.debug) {
			payload.map(function(item) {
				console[method](title, item);
			});
		}
	}

	/**
	 * [timingData description]
	 * @param  {[type]} process  [description]
	 * @return {[type]}         [description]
	 */
	timingData(process) {
		const itSelf = this;
		const endTime = new Date();
		const dataBlock = {

			process: process
		};
		return dataBlock;
	}

	/**
	 * errorLogger handles all error into same structure
	 * @param   {object} error                     [[Description]]
	 * @param   {object} type                     [[Description]]
	 * @returns {oject}  all error details
	 */
	errorLogger(error, type, method) {
		const itSelf = this;
		let response = true;
		error = error || {};
		type = type || 'ERROR';
		method = method || 'send';

		const errorDetails = {
			
		};

		if (!itSelf.env || itSelf.env && !itSelf.env.errorlogging) {
			itSelf.error.message = 'Unable to push to error logging queue. No queue provided.';
			itSelf.__pushToSplunk(_.omit(extend(errorDetails, itSelf.error), ['stack', 'parameters']));
			/* istanbul ignore if */
			if (itSelf.debug) console.error(itSelf.sourceType, 'error', itSelf.error);

			return;
		}

		/* istanbul ignore if */
		if (itSelf.debug) console.error(itSelf.sourceType, 'error', errorDetails);

		// push to splunk the error details
		itSelf.__pushToSplunk(extend(_.omit(errorDetails, ['stack', 'parameters']), _.pick(itSelf.payload, ['addressIdentifier', 'externalSystemID', 'externalSystemUserID', 'requestReference', 'valuationType', 'applicationID']), itSelf.error.parameters));

		// send to error logging service
		response = itSelf.publishToQueue(itSelf.env.errorlogging, errorDetails, method);

		return response;
	}

	/**
	 * [logrequest This should log request into the database]
	 * @return {[object]} [log request id]
	 */
	logrequest() {
		const itSelf = this;
		return new Promise(function(success, fail) {
			// check if we got the rabbit connection object
			if (!itSelf.bus) {
				itSelf.error.message = 'Unable to push to log request queue. No bus connection provided.';
				itSelf.error.paramters = itSelf.params;
				itSelf.errorLogger(itSelf.error);
				return fail(itSelf.error);
			}

			// check if queues are provided to push to queue
			if (!itSelf.env || itSelf.env && !itSelf.env.externalrequestlogging) {
				itSelf.error.message = 'Unable to push to log request queue. No queue provided.';
				itSelf.error.paramters = itSelf.params;
				itSelf.errorLogger(itSelf.error);
				return fail(itSelf.error);
			}

			// A simple send, not expecting any response back here
			const payload = {
				interfaceRequestID: itSelf.requestID,
				providerCode: 'das-valuation-order',
				messageTypeID: 1,
				requestType: 'ValuationOrder',
				requestStart: itSelf.requestStartTime,
				requestEnd: new Date(),
				requestURI: itSelf.params.uri,
				requestContent: JSON.stringify(itSelf.params) || null,
				responseContent: itSelf.response,
				responseDataType: 'XML',
				responseCode: (itSelf.statusCode) ? itSelf.statusCode.toString() : null,
				processingCount: 1,
				processingLastAttempt: new Date(),
				propertyID: itSelf.payload.propertyID,
				valuationID: null // we don't get anything back from the create val stub process
			};
			// DEBUG
			itSelf.thisDebug('log', 'logrequest...:', [payload]);
			// RPC call to Queue
			itSelf.bus.send(itSelf.env.externalrequestlogging, payload, {
				exchange: ' ',
				routing: 'direct'
			})
				.then(function(data) {
					// DEBUG
					itSelf.thisDebug('log', 'logrequest Success...:', [data]);
					// We need to set the logID to this object
					// itSelf.externalRequestID = data[0].value;

					// tracking for how long the request takes to fullfull
					itSelf.__pushToSplunk(itSelf.timingData('logrequest'), 'INFO');

					return success(true);
				})
				.catch(function(err) {
					// DEBUG
					itSelf.thisDebug('error', 'logrequest Error...:', [err]);
					itSelf.error = errs.merge(err, itSelf.error, { message: err.description });
					extend(itSelf.error.stacktrace, errs.create(err.description || err.message).stack.split('\n'));
					itSelf.errorLogger(itSelf.error);

					/* istanbul ignore if */
					if (itSelf.debug) console.error(itSelf.sourceType, 'error', itSelf.error, err);

					return fail(itSelf.error);
				});
		});
	}


	/**
	 * [__getproviderdetail description]
	 * @return {[type]} [description]
	 *
	 * SAMPLE PROVIDER DETAILS
	 * {
	 *	providerID: 168,
	 *	providerTypeName: 'Physical Valuation',
	 *	providerCode: 'das-valuation-order',
	 *	providerName: 'CoreLogic das',
	 *	accountID: null,
	 *	accountPassword: null,
	 *	autoLogin: 'hometrackws',
	 *	autoPassword: '123456',
	 *	requestTimeout: 60,
	 *	baseURL: 'http://das-uat.rpdata.com/anz/services/das/' }
	 */
	__getproviderdetail() {
		const itSelf = this;
		return new Promise(function(success, fail) {
			// Check if the Bus is set else generate the error
			if (!itSelf.bus) {
				itSelf.error.message = 'Unable to push error to getproviderdetail queue. No bus connection provided.';
				itSelf.error.code = 10109;
				itSelf.error.parameters = { providerCode: 'das-valuation-order' };
				itSelf.errorLogger(itSelf.error);
				return fail(itSelf.error);
			}
			// check if queues are provided to push to queue
			if (!itSelf.env || itSelf.env && !itSelf.env.getproviderdetail) {
				itSelf.error.message = 'Unable to push error to getproviderdetail queue. No queue provided.';
				itSelf.error.code = 10109;
				itSelf.error.parameters = { providerCode: 'das-valuation-order' };
				itSelf.errorLogger(itSelf.error);
				return fail(itSelf.error);
			}
			// RPC call to get provider details
			itSelf.bus.rpc(itSelf.env.getproviderdetail, { providerCode: 'das-valuation-order' }, {
				exchange: ' ',
				routing: 'direct'
			})
				.then(function(data) {
					itSelf.payload = _.extend(itSelf.payload, data);
					// DEBUG
					itSelf.thisDebug('log', '__getproviderdetail Success...:', [data]);
					if (data.requestTimeout) {
						itSelf.timeout = 1000 * data.requestTimeout;
					}

					// tracking for how long the request takes to fullfull
					itSelf.__pushToSplunk(itSelf.timingData('__getproviderdetail'), 'INFO');

					return success(true);
				})
				.catch(function(err) {
					// DEBUG
					itSelf.thisDebug('error', '__getproviderdetail Error...:', [err]);
					itSelf.error = errs.merge(err, itSelf.error, { message: err.description });
					extend(itSelf.error.stacktrace, errs.create(err.description || err.message).stack.split('\n'));
					itSelf.errorLogger(itSelf.error);
					return fail(itSelf.error);
				});
		});
	}

	/**
	 * [mapStreetType:  temprory function to map street type abbreviations. This help in removing inconsistencies
	 *					whem street type in diff with each request & not as per das requirements ]
	 * @param  {[String]}   needle [street type abbreviation]
	 * @return {[String]}          [Street Type complete name in uppercase]
	 */
	__mapStreetType(needle) {
		try {
			const ABCList = []

			if (ABCList.indexOf(needle) !== -1) {
				return needle;
			}

			const mapping = []
				

			const result = mapping.filter(function(item) {
				if (item[0].toUpperCase() === needle.toUpperCase()) {
					return item;
				}
			});

			return (result.length > 0) ? result[0][1] : 'Other';
		}
		catch (e) {
			return 'Other';
		}
	}

	/**
	 * [__validateRequiredFields this validate the input params if it has the required fields or not]
	 * @return {[string]} [missing fields]
	 */
	__validateRequiredFields() {
		const itSelf = this;
		// Check for request essentials
		itSelf.required = [
			'baseURL', 'autoLogin', 'autoPassword', 'residentialType', 'requestID'
		].filter(function(item) {
			return !itSelf.payload[item];
		}).join(' , ');

		if (!itSelf.required) {
			// VALIDATION : Lets check all the required parameters are supplied
			itSelf.required = [
				'buildingNo', 'suburb', 'postcode', 'state', 'streetName'
			].filter(function(item) {
				return !itSelf.payload[item];
			}).join(' , ');

			// das do not accept shot codes for street type so we need to check these street types
			// and convert them into full street types
			// NOTE: FIX ME: Tried adding Hometrack street type mapping  but the list has many flaws in it. Spoke to Mark, need to redasit this issue
			itSelf.payload.streetType = (itSelf.__mapStreetType(itSelf.payload.streetType)) ? itSelf.__mapStreetType(itSelf.payload.streetType) : itSelf.payload.streetType;
		}

		// DEBUG
		if (itSelf.required) {
			itSelf.thisDebug('error', '__validateRequiredFields Error...:', [itSelf.required]);
		}
	}

	__checkCacheForShellOrder() {
		const itSelf = this;
		return new Promise(function(success, fail) {
			const params = {};

			// check if queues are provided to push to queue
			if (!itSelf.env || itSelf.env && !itSelf.env.checkCacheForShellOrder) {
				itSelf.error.message = 'Unable to push to check cache for shell order queue. No queue provided.';
				itSelf.error.parameters = itSelf.response;
				itSelf.error.code = itSelf.__generateErrorCode(itSelf.error.message);
				return fail(itSelf.error);
			}

			params.propertyId = (itSelf.payload && itSelf.payload.propertyID) ? itSelf.payload.propertyID : null;
			params.valuationType = (itSelf.payload && itSelf.__mapValuationType(itSelf.payload.valuationType)) ? itSelf.__mapValuationType(itSelf.payload.valuationType) : null;
			params.requestId = (itSelf.requestID) ? itSelf.requestID : null;
			params.externalSystemId = (itSelf.payload && itSelf.payload.externalSystemID) ? itSelf.payload.externalSystemID : null;

			// if debug is true print it
			itSelf.thisDebug('info', '__checkCacheForShellOrder...:', [params]);

			// Send one way message to the log request queue
			itSelf.bus.rpc(itSelf.env.checkCacheForShellOrder, params, {
				exchange: ' ',
				routing: 'direct'
			})
				.then(function(data) {
					// if debug is true print it
					itSelf.thisDebug('log', '__checkCacheForShellOrder Success...:', [data]);

					const cacheExists = data[0] && data[0].value;
					if (cacheExists === true) {
						throw new Error(DUPLICATE_REQUEST_MESSAGE);
					} else if (cacheExists === false) {
						return success(true);

					} else {
						throw new Error(`cacheExists=${cacheExists} is not a valid value`);
					}
				})
				.catch(function(err) {
					// if debug is true print it
					itSelf.thisDebug('error', '__checkCacheForShellOrder error...:', [err]);
					itSelf.error = errs.merge(err, itSelf.error, { message: err.description });
					extend(itSelf.error.stacktrace, errs.create(err.description || err.message).stack.split('\n'));
					itSelf.errorLogger(itSelf.error);
					return fail(itSelf.error);
				});
		});
	}

	/**
	 * [checkavailability This will check if the api service is working]
	 * @return {[string]} [xml response with either error or available]
	 */
	checkavailability() {
		const itSelf = this;
		return new Promise(function(success, fail) {
			if (!itSelf.payload) {
				itSelf.error.message = 'Unable to fetch result. No payload supplied';
				itSelf.error.parameters = itSelf.payload;
				itSelf.errorLogger(itSelf.error);
				return fail(itSelf.error);
			}

			itSelf.params = {
				method: 'POST',
				headers: { 'content-type': 'text/xml' },
				// Payload to contruct xml
				body: utils.xml.getavailability(itSelf.payload),
				timeout: itSelf.timeout,
			};
			// Make request now
			itSelf.__requestWrapper()
				.then(function(response) {
					return itSelf.__parseAvailabilityResponse(response);
				})
				.then(function(data) {
					return success(data);
				})
				.catch(function(err) {
					itSelf.error = errs.merge(err, itSelf.error, { message: err.description });
					extend(itSelf.error.stacktrace, errs.create(err.description || err.message).stack.split('\n'));
					itSelf.error.message = 'Provider system is unavailable';
					itSelf.error.code = itSelf.__generateErrorCode(itSelf.error.message);
					itSelf.errorLogger(itSelf.error);
					/* istanbul ignore if */
					if (itSelf.debug) console.error(itSelf.sourceType, 'error', itSelf.error, err);

					return fail(itSelf.error);
				});
		});
	}

	__parseAvailabilityResponse(response) {
		const itSelf = this;
		return new Promise(function(success, fail) {
			// parsing the xml packet now
			parser.parseString(response.body, function(err, result) {
				if (err) {
					itSelf.error.message = 'Unable to parse availability response';
					itSelf.error.parameters = response.body;
					itSelf.error.statusCode = response.statusCode;
					itSelf.errorLogger(itSelf.error);
					return fail(itSelf.error);
				}

				if (!result) {
					itSelf.error.message = 'das getAvailability API generated error';
					itSelf.error.parameters = response.body;
					itSelf.error.statusCode = response.statusCode;
					itSelf.errorLogger(itSelf.error);
					return fail(itSelf.error);
				}

				var parseResponse = (result.Body && result.Body.availabilityResponse) ? result.Body.availabilityResponse : false;

				// @return status code: AVAILABLE and description: The service is available
				if (parseResponse.status['das:code'] === 'AVAILABLE') {
					return success(parseResponse.status['das:code']);
				} else {
					itSelf.error.message = parseResponse.description;
					itSelf.error.parameters = response.body;
					itSelf.error.code = parseResponse.status['das:code'];
					itSelf.errorLogger(itSelf.error);
					return fail(itSelf.error);
				}

			});
		});
	}

	/**
	 * [createErrorResponseXML this will create failed order creation response]
	 * @return {[string]} [xml error response]
	 */
	// createErrorResponseXML(response) {
	//	let itSelf = this,
	//		errorResponse,
	//		shellOrderXml;
	//	return new Promise(function(success, fail) {
	//		errorResponse = {
	//			'requestTransaction': {
	//				systemID: itSelf.payload.systemID,
	//				systemUserID: itSelf.payload.externalSystemUserID,
	//				systemReference: itSelf.payload.externalSystemReference,
	//				requestReference: itSelf.payload.requestReference,
	//				requestID: itSelf.payload.requestID,
	//				requestTimestamp: itSelf.payload.requestTimestamp,
	//				returnTimestamp: new Date().toISOString()
	//			},
	//			'error message': {
	//				'@': {
	//					message: 'Failed to create das Order'
	//				},
	//				'#': '10403'
	//			}
	//		};
	//		// converting my json object into final XML as we want
	//		itSelf.response = (response.toString());
	//		itSelf.shellOrderXml = js2xmlparser('valuationOrderResponse', errorResponse, { declaration: { include: false } });
	//		return success(true);
	//	});
	// }

	__parseErrorResponse(response) {
		const itSelf = this;
		return new Promise(function(success, fail) {
			parser.parseString(response, function(err, result) {
				if (err) {
					itSelf.error.message = 'Unable to parse error response';
					return fail(err);
				}

				if (result && result.Body && result.Body.Fault) {
					// console.log('__parseErrorResponse result.Body.Fault', result.Body.Fault);
					return success(result.Body.Fault);
				}
			});
		});
	}


	/**
	 * [createshellorder This will create shell order request for das]
	 * @return {[bool]} [return true when the object is successfully created ]
	 */
	createshellorder() {
		const itSelf = this;
		return new Promise(function(success, fail) {
			// Check if payload object is passed
			if (!itSelf.payload) {
				itSelf.error.message = 'Unable to fetch result. No payload supplied';
				itSelf.error.parameters = itSelf.payload;
				itSelf.error.code = itSelf.__generateErrorCode(itSelf.error.message);
				return fail(itSelf.error);
			}

			itSelf.__validateRequiredFields();

			if (itSelf.required) {
				itSelf.error.message = 'Unable to fetch result. Required fields are not supplied';
				itSelf.error.parameters = { required: itSelf.required };
				itSelf.error.code = itSelf.__generateErrorCode(itSelf.error.message);
				return fail(itSelf.error);
			}

			const shellOrderPayload = utils.xml.createshellorder(itSelf.payload);
			// Contructing request Params
			itSelf.params = {
				method: 'POST',
				uri: itSelf.payload.baseURL ? itSelf.payload.baseURL + 'createValuation' : false,
				headers: { 'content-type': 'text/xml' },
				// Lets get request XML sorted now
				body: shellOrderPayload,
				proxy: (itSelf.env.proxy && itSelf.env.proxy.required) ? itSelf.env.proxy.endpoint : undefined,
				timeout: itSelf.timeout,
				resolveWithFullResponse: true
			};
			// Don't wait for response go ahead and compelte the process
			return success(true);
		});
	}

}
module.exports = {
	das: das
};
