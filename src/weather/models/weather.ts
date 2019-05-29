import { DataPoint, Forecast } from 'darkskyapi-ts'

import { getDisplayIcon } from './icons'
import { Preciptation } from './precipitation'
import { Wind, WindModel } from './wind'

export interface Weather {
  maxTemp: number
  minTemp: number
  sunrise: number
  sunset: number
  wind: Wind
  precipitation: Preciptation
  current: WeatherBlock
  hourly: WeatherBlock[]
}

export interface WeatherBlock {
  forecastedTime: number
  temperature: number
  apparentTemperature: number
  cloudPercent: number
  humidity: number
  uvIndex: number
  wind: Wind
  precipitation: Preciptation
  weatherType: string
}

export function createWeatherModel(forecast: Forecast): Weather {
  if (!forecast.currently || !forecast.hourly || !forecast.daily) {
    throw Error('Forecast response is missing some required params!')
  }

  const today = forecast.daily.data[0]
  const current = createWeatherBlock(forecast.currently)
  const hourly = forecast.hourly.data.map(hour => createWeatherBlock(hour))

  return {
    current,
    hourly,
    maxTemp: today.temperatureMax,
    minTemp: today.temperatureMin,
    sunrise: today.sunriseTime,
    sunset: today.sunsetTime,
    wind: createWind(today),
    precipitation: createPrecipitation(today),
  }
}

function createWeatherBlock(datapoint: DataPoint): WeatherBlock {
  return {
    forecastedTime: datapoint.time,
    temperature: datapoint.temperature!,
    apparentTemperature: datapoint.apparentTemperature!,
    cloudPercent: datapoint.cloudCover!,
    humidity: datapoint.humidity!,
    uvIndex: datapoint.uvIndex!,
    wind: createWind(datapoint),
    precipitation: createPrecipitation(datapoint),
    weatherType: getDisplayIcon(datapoint.icon!),
  }
}

function createWind({ windBearing, windGust, windSpeed }: DataPoint): Wind {
  return new WindModel(windBearing!, windGust!, windSpeed!)
}

function createPrecipitation(datapoint: DataPoint): Preciptation {
  return {
    probability: datapoint.precipProbability!,
    type: datapoint.precipType!,
    intensity: datapoint.precipIntensity!,
  }
}
