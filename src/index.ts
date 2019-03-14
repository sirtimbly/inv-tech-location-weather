import * as fs from 'fs'
import {LocationDataFile, validate, EncodedLocation, LocationCache} from './data'

import * as rawData from './locations.json'
import {AccuweatherClient} from './accuweather'

const apiKey = 'lIABwAVufonP4Vjjv2qWZ8R3tlf98Jso'

// TODO: load chache from disk
const cache: LocationCache = {}
const client = new AccuweatherClient(apiKey)
const locationData: LocationDataFile = validate(rawData);

(async () => {
	const locationsWithCodes: EncodedLocation[] = await locationData.locations.map(async location => {
		if (!location.zip || location.zip.length <= 0 || !location.name || location.name.length <= 0) {
			return undefined
		}

		// Check all zips against cache for location codes we've already fetched
		// make all requests for remaining location codes
		const resolvedCode = cache[location.zip] || await client.getLocationCode(location.zip)
		return {
			name: location.name,
			zip: location.zip,
			locationCode: resolvedCode
		}
	})
	const newCache: LocationCache = locationsWithCodes.reduce((prev, curr) => ({
		...prev,
		[curr.zip]: curr.locationCode
	}))
	fs.writeFileSync('./locationCode.cache.json', JSON.stringify(newCache))

	// https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/postalcodes/search

	// cache location code responses to disk

	// make all requests for weather current conditions and local time
	// https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D
})()
