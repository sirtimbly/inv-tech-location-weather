import * as fs from 'fs'
import {format} from 'date-fns'
import * as emojiWeather from 'emojiweather'
import {LocationDataFile, validate, EncodedLocation, LocationCache, Result} from './data'
import {AccuweatherClient} from './accuweather'

(async () => {
	const apiKey = 'lIABwAVufonP4Vjjv2qWZ8R3tlf98Jso'
	let rawData = {}

	try {
		rawData = require(`${process.cwd()}/locations.json`)
	} catch (error) {
		console.error('Error: locations.json file not found in current directory.', error)
		return
	}

	let cacheData = {}
	try {
		cacheData = require(`${process.cwd()}/locationCodes.cache.json`)
	} catch (error) {} // eslint-disable-line @typescript-eslint/no-unused-vars

	const cache: LocationCache = cacheData
	const client = new AccuweatherClient(apiKey)
	const locationData: LocationDataFile = validate(rawData)

	const locationsWithCodes: EncodedLocation[] = []
	await Promise
		.all(locationData.locations.map(async (location): Promise<EncodedLocation> => {
			if (!location.zip || location.zip.length <= 0 || !location.name || location.name.length <= 0) {
				return undefined
			}

			// Check all zips against cache for location codes we've already fetched
			// https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/postalcodes/search

			if (cache[location.zip]) {
				return {
					name: location.name,
					zip: location.zip,
					locationCode: cache[location.zip]
				}
			}

			return client.getLocationCode(location.zip).then(code => ({
				name: location.name,
				zip: location.zip,
				locationCode: code
			}))
		}))
		.then((locations: EncodedLocation[]) => {
			locationsWithCodes.push(...locations)
			const newCache = locations.reduce<LocationCache>((prev, curr) => ({
				...prev,
				[curr.zip]: curr.locationCode
			}), {})
			fs.writeFileSync('./locationCodes.cache.json', JSON.stringify(newCache))
		})
		.catch(error => console.error('Problem getting location codes', error))

	const weatherConditions: Result[] = []
	await Promise
		.all(locationsWithCodes.map(client.getConditions))
		.then(conditions => weatherConditions.push(...conditions))
		.catch(error => console.error('Problem getting weather conditions', error))

	const results = `Location, DateTime, Temp, Conditions
${weatherConditions.map(w => `${w.name}, ${format(w.rawTime, 'MM/DD/YYYY h:m A')}, ${w.tempF}°F, ${emojiWeather(w.currentConditions)}  ${w.currentConditions}`).join('\n')}`
	console.log(results)
})()
